import dotenv from 'dotenv';

dotenv.config();

const appConfig = {
    port: Number(process.env.PORT) || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    webUrl: process.env.WEB_URL || '*',
    supabaseUrl: process.env.SUPABASE_URL as string,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY as string,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY as string,
    defaultLogger: {
        maxLoggerFileSize: 10485760
    }
};

export default appConfig;
