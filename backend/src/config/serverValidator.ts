const requiredParams = [
    'PORT',
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
];

const missingParams: Array<string> = requiredParams.filter(param => !process.env[param]);

if (missingParams.length > 0) {
    console.error('Following params are missing in environment file:', missingParams.join(', '));
    process.exit(1);
}
