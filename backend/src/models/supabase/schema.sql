create extension if not exists "uuid-ossp";

create type user_role as enum ('employee', 'admin');
create type leave_status as enum ('pending', 'approved', 'rejected', 'cancelled');

create table profiles (
    id uuid primary key references auth.users (id) on delete cascade,
    email text not null unique,
    full_name text not null,
    department text,
    role user_role not null default 'employee',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table leave_requests (
    id uuid primary key default uuid_generate_v4(),
    employee_id uuid not null references profiles (id) on delete cascade,
    start_date date not null,
    end_date date not null,
    reason text not null,
    status leave_status not null default 'pending',
    reviewed_by uuid references profiles (id),
    reviewed_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint leave_requests_date_order check (end_date > start_date)
);

create index idx_leave_requests_employee on leave_requests (employee_id);
create index idx_leave_requests_status on leave_requests (status);

alter table profiles enable row level security;
alter table leave_requests enable row level security;

create policy "Employees can view own profile"
    on profiles for select
    using (auth.uid() = id);

create policy "Employees can view own leave requests"
    on leave_requests for select
    using (auth.uid() = employee_id);


