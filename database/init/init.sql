-- ======= INITIAL STATE FOR THE POSTGRES DATABASE =========

-- 1. But previously, create db and db user - execute line by line in order:

-- CREATE USER smarthome_admin WITH PASSWORD '123A';
-- CREATE DATABASE smart_home OWNER smarthome_admin;
-- GRANT CONNECT ON DATABASE smart_home TO smarthome_admin;
-- GRANT CREATE, TEMPORARY ON DATABASE smart_home TO smarthome_admin;

-- 2. Then, connect to database smart_home and execute the following: 
--   It's not necesary to execute line by line, it can be done in one go

-- GRANT USAGE, CREATE ON SCHEMA public TO smarthome_admin;
-- ALTER DEFAULT PRIVILEGES IN SCHEMA public
-- GRANT ALL ON TABLES TO smarthome_admin;
-- ALTER DEFAULT PRIVILEGES IN SCHEMA public
-- GRANT ALL ON SEQUENCES TO smarthome_admin;

-- 3. Done. Database and smarthome_admin created and priviliges granted. Now you can freely excute this script, assuming you're connected to the smart_home database.

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
-- TRIGGERS
-- =====================================================
CREATE EXTENSION IF NOT EXISTS unaccent;

-- CREATE GLOBAL ROOM WHEN ADDING A NEW HOUSE : EVERY HOUSE HAS A ROOM GLOBAL
	-- Function
CREATE OR REPLACE FUNCTION create_global_room()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO rooms (house_id, name, description)
    VALUES (NEW.id, 'global', 'Cuarto lógico para dispositivos globales');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
	-- Trigger
CREATE TRIGGER trigger_create_global_room
AFTER INSERT ON houses
FOR EACH ROW
EXECUTE FUNCTION create_global_room();

-- =====================================================

-- CREATE BOTH TOPICS AUTOMATICALLY WHEN INSERTING A NEW DEVICE : PUBLISH AND SUSCRIBE
-- Function
CREATE OR REPLACE FUNCTION set_device_topics()
RETURNS TRIGGER AS $$
DECLARE
    house_id INT;
    room_name TEXT;
    device_name TEXT;
BEGIN
    SELECT r.house_id, r.name INTO house_id, room_name
    FROM rooms r WHERE r.id = NEW.room_id;

    -- Normalizamos nombres: minúsculas, sin tildes ni caracteres raros
    room_name := lower(unaccent(room_name));  -- Quita acentos: baño → bano
    device_name := lower(unaccent(NEW.name));

    -- Reemplaza espacios por guiones bajos
    room_name := replace(room_name, ' ', '_');
    device_name := replace(device_name, ' ', '_');

    -- Elimina caracteres no válidos para MQTT topics (solo deja [a-z0-9_])
    room_name := regexp_replace(room_name, '[^a-z0-9_]', '_', 'g');
    device_name := regexp_replace(device_name, '[^a-z0-9_]', '_', 'g');

    IF room_name = 'global' THEN
        NEW.command_topic := format('houses/%s/%s/set', house_id, device_name);
        NEW.state_topic := format('houses/%s/%s/state', house_id, device_name);
    ELSE
        NEW.command_topic := format('houses/%s/%s/%s/set', house_id, room_name, device_name);
        NEW.state_topic := format('houses/%s/%s/%s/state', house_id, room_name, device_name);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
CREATE TRIGGER trg_set_device_topics
BEFORE INSERT ON devices
FOR EACH ROW
EXECUTE FUNCTION set_device_topics();

-- =====================================================
-- INSERT INITIAL DATA
-- =====================================================
ALTER TABLE devices
ADD CONSTRAINT unique_device_name_per_room UNIQUE (room_id, name);

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
    'Admin Cognito',               
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
-- THE SECOND USER: FAMILY ROLE
INSERT INTO users (name, username, email, password_hash)
VALUES (
    'Lily Cognito',               
    'lily',                       -- username
    'lily@home.com',              -- email
    crypt('123', gen_salt('bf'))  -- hash
);
INSERT INTO user_houses (user_id, house_id, role_id)
VALUES (
    2,  -- lily's id
    1,  -- first house's id
    2   -- family role's id in table roles
);

-- ROOMS
INSERT INTO rooms (house_id, name, description)
VALUES
    (1, 'Sala', 'Sala principal de la casa'),
    (1, 'Dormitorio', 'Habitación principal'),
	(1, 'Baño', 'Baño de la casa'),
    (1, 'Garaje', 'Garaje de la casa');

-- DEVICE FOR FIRST TESTING: 1 LED IN 'Dormitorio' ROOM
INSERT INTO devices (room_id, name, type)
VALUES
    (3, 'Luz', 'led');

-- SIMPLE QUERY FOR TESTING
select * from users;