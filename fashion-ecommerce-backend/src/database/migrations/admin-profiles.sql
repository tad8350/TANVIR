-- Create admin_profiles table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_profiles') THEN
        CREATE TABLE admin_profiles (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            role VARCHAR(50) DEFAULT 'admin',
            is_active BOOLEAN DEFAULT true,
            last_login TIMESTAMP,
            avatar_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Create a default admin user (password: Admin@123#)
        INSERT INTO admin_profiles (email, password, name, role)
        VALUES (
            'admin@tad.com',
            '$2b$10$6jxDm4bRhwQzEWfyF5dH7.Mj3z9LZz1Lg6w.rZ4QyD4ZR6h2HyX2.',  -- Password: Admin@123#
            'TAD Admin',
            'admin'
        );
    END IF;
END $$;
