-- ======= INITIAL STATE FOR THE POSTGRES DATABASE =========

-- But previously, create db and db user:

-- CREATE USER smarthome_admin WITH PASSWORD '123A';
-- CREATE DATABASE smart_home OWNER smarthome_admin;
-- GRANT CONNECT ON DATABASE smart_home TO smarthome_admin;
-- GRANT CREATE, TEMPORARY ON DATABASE smart_home TO smarthome_admin;

-- Connect to database here

-- GRANT USAGE, CREATE ON SCHEMA public TO smarthome_admin;
-- ALTER DEFAULT PRIVILEGES IN SCHEMA public
-- GRANT ALL ON TABLES TO smarthome_admin;
-- ALTER DEFAULT PRIVILEGES IN SCHEMA public
-- GRANT ALL ON SEQUENCES TO smarthome_admin;
-- =====================================================
-- TABLES
-- =====================================================
-- Deleted in order
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS devices CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS user_houses CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS houses CASCADE;

-- 1. HOUSES
CREATE TABLE houses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2. ROLES
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,   -- 'owner', 'family' or 'guest'
    description TEXT
);
-- 3. USERS

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    username VARCHAR(50) UNIQUE,        -- login 1
    email VARCHAR(100) UNIQUE,          -- login 2
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 4. USER_HOUSES (por muchos a muchos)
CREATE TABLE user_houses (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    house_id INT NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
    role_id INT REFERENCES roles(id),
    UNIQUE (user_id, house_id)
);

-- 5. ROOMS
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    house_id INT NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- 6. DEVICES (sensores, servos, etc.)
CREATE TABLE devices (
    id SERIAL PRIMARY KEY,
    room_id INT REFERENCES rooms(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50),                             -- ej. sensor, servo, led, etc.
    state_topic VARCHAR(150),                     -- MQTT topic (lectura)
    command_topic VARCHAR(150),                   -- MQTT topic (comandos)
    status JSONB,                                 -- último payload
    last_update TIMESTAMP DEFAULT NOW()
);

-- 7. EVENTS (este es para la IA)
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    device_id INT REFERENCES devices(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    event_type VARCHAR(100),                      -- ej: 'door_open', 'light_on'
    payload JSONB,                                -- datos extra
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_devices_room_id ON devices(room_id);
CREATE INDEX idx_events_device_id ON events(device_id);
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_user_houses_user_id ON user_houses(user_id);

-- =====================================================
-- INSERT INITIAL DATA
-- =====================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ROLES
INSERT INTO roles (name, description)
VALUES 
('owner', 'Puede configurar la casa, ver y controlar dispositivos'),
('family', 'Puede ver y controlar dispositivos'),
('guest', 'Solo puede ver el estado de la casa');

-- THE ONE HOUSE
INSERT INTO houses (name, location)
VALUES ('Casita', 'Av. Del Futuro');

-- THE FIRST USER (OWNER ROLE)

INSERT INTO users (name, username, email, password_hash)
VALUES (
    'Admin Adminson',               
    'mmc',                         -- username
    'mmc@home.com',                -- email
    crypt('123A', gen_salt('bf'))  -- hash
);

-- FIRST USER-HOUSE RELATIONSHIP
INSERT INTO user_houses (user_id, house_id, role_id)
VALUES (
    1,  -- first user's id
    1,  -- first house's id
    1   -- owner role's id in table roles
);
select * from houses;