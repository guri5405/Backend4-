import { supabaseAdminClient } from '@config/connection/supabaseClient';
import { PROFILES_TABLE, ProfileInterface, ProfileUpdatePayload } from '@models/profile';

class ProfileRepository {
    async create(profile: Pick<ProfileInterface, 'id' | 'email' | 'full_name' | 'department' | 'role'>) {
        const { data, error } = await supabaseAdminClient
            .from(PROFILES_TABLE)
            .insert(profile)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data as ProfileInterface;
    }

    async findById(id: string) {
        const { data, error } = await supabaseAdminClient
            .from(PROFILES_TABLE)
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error) throw new Error(error.message);
        return data as ProfileInterface | null;
    }

    async update(id: string, payload: ProfileUpdatePayload) {
        const { data, error } = await supabaseAdminClient
            .from(PROFILES_TABLE)
            .update({ ...payload, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data as ProfileInterface;
    }
}

export default new ProfileRepository();
