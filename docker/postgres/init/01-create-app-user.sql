-- Create application user with a strong password
CREATE ROLE grizzl_user LOGIN PASSWORD 'super-secure-password';

-- Allow grizzl_user to connect to your default DB
GRANT CONNECT ON DATABASE grizzl TO grizzl_user;

\c grizzl

-- Give grizzl_user permissions for runtime usage
GRANT USAGE ON SCHEMA public TO grizzl_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO grizzl_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO grizzl_user;

-- Make sure future tables/sequences also grant rights automatically
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO grizzl_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO grizzl_user;
