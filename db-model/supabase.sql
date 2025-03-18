-- PickArt Platform Database Schema
-- This file contains all tables, functions and triggers for the PickArt MVP

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ===========================================
-- ENUM TYPES
-- ===========================================

-- User roles
CREATE TYPE user_role AS ENUM ('admin', 'artist', 'host');

-- Artist/Host specific roles
CREATE TYPE artist_type AS ENUM ('artist', 'agent');
CREATE TYPE host_type AS ENUM ('host', 'owner');

-- Fixture methods for artwork
CREATE TYPE fixture_method AS ENUM (
  'wall_mount',
  'pedestal',
  'ceiling_hang',
  'easel',
  'shelf',
  'floor_stand',
  'other'
);

-- Artwork statuses - keeping 'sold' as requested
CREATE TYPE artwork_status AS ENUM (
  'draft',
  'pending_approval',
  'ready_for_allocation',
  'allocated',
  'delivered',
  'live',
  'sold'
);

-- Spot statuses
CREATE TYPE spot_status AS ENUM (
  'draft',
  'pending_approval',
  'ready_for_allocation',
  'allocated',
  'live'
);

-- Delivery options
CREATE TYPE delivery_option AS ENUM (
  'pickup',
  'delivery'
);

-- ===========================================
-- TABLES
-- ===========================================

-- Countries table
CREATE TABLE countries (
  code CHAR(2) PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert common countries
INSERT INTO countries (code, name) VALUES
('CH', 'Switzerland'),
('DE', 'Germany'),
('FR', 'France'),
('IT', 'Italy'),
('AT', 'Austria'),
('US', 'United States'),
('GB', 'United Kingdom'),
('ES', 'Spain');

-- Property types table
CREATE TABLE property_types (
  name TEXT PRIMARY KEY,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert property types
INSERT INTO property_types (name) VALUES
('multi_room_apartment'),
('one_room_apartment'),
('house'),
('gallery'),
('mall'),
('hotel_lobby'),
('hotel_rooms'),
('hostel'),
('hut'),
('mini_home'),
('tent'),
('restaurant'),
('cafe'),
('bar'),
('school');

-- Bank accounts table
CREATE TABLE bank_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_name TEXT NOT NULL,
  account_address TEXT NOT NULL,
  account_number TEXT NOT NULL,
  country_code CHAR(2) REFERENCES countries(code),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  country_code CHAR(2) REFERENCES countries(code),
  role user_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Artists table
CREATE TABLE artists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  artist_type artist_type NOT NULL,
  display_name TEXT NOT NULL,
  bank_account_id UUID REFERENCES bank_accounts(id),
  contract_signed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Hosts table
CREATE TABLE hosts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  host_type host_type NOT NULL,
  business_name TEXT,
  bank_account_id UUID REFERENCES bank_accounts(id),
  contract_signed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Properties table
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id TEXT UNIQUE NOT NULL, -- APCH-XXX-XX random 5 digit alphanumeric
  property_name TEXT NOT NULL,
  street_address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postcode TEXT NOT NULL,
  country_code CHAR(2) NOT NULL REFERENCES countries(code),
  property_type TEXT NOT NULL REFERENCES property_types(name),
  size_sqm NUMERIC(10,2),
  total_floors INTEGER,
  total_rooms INTEGER,
  owner_id UUID REFERENCES hosts(id),
  contact_phone TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Property Photos table
CREATE TABLE property_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  folder_path TEXT NOT NULL DEFAULT 'properties',
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Spots table
CREATE TABLE spots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  spot_id TEXT UNIQUE NOT NULL, -- ASCH-XXX-XX random 5 digit alphanumeric
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  floor_number INTEGER,
  room_name TEXT,
  position_description TEXT,
  preferred_style TEXT,
  color_scheme TEXT,
  fixture_method fixture_method NOT NULL,
  max_weight_kg NUMERIC(10,2) NOT NULL,
  max_width_cm NUMERIC(10,2) NOT NULL,
  max_height_cm NUMERIC(10,2) NOT NULL,
  max_depth_cm NUMERIC(10,2),
  preferred_price_range_min NUMERIC(10,2),
  preferred_price_range_max NUMERIC(10,2),
  status spot_status NOT NULL DEFAULT 'draft',
  current_artwork_id UUID,
  qr_code_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Spot Photos table
CREATE TABLE spot_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  spot_id UUID NOT NULL REFERENCES spots(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  folder_path TEXT NOT NULL DEFAULT 'spots',
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Artworks table
CREATE TABLE artworks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artwork_id TEXT UNIQUE NOT NULL, -- AWCH-XXX-XX random 5 digit alphanumeric
  artist_id UUID NOT NULL REFERENCES artists(id),
  title TEXT NOT NULL,
  year INTEGER NOT NULL,
  place TEXT,
  description TEXT,
  style TEXT,
  medium TEXT NOT NULL,
  is_unique BOOLEAN NOT NULL,
  edition_number INTEGER,
  edition_total INTEGER,
  width_cm NUMERIC(10,2) NOT NULL,
  height_cm NUMERIC(10,2) NOT NULL,
  depth_cm NUMERIC(10,2),
  weight_kg NUMERIC(10,2) NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  status artwork_status NOT NULL DEFAULT 'draft',
  current_spot_id UUID,
  qr_code_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT fk_spot FOREIGN KEY (current_spot_id) REFERENCES spots(id),
  CONSTRAINT edition_check CHECK (
    (is_unique = TRUE AND edition_number IS NULL AND edition_total IS NULL) OR
    (is_unique = FALSE AND edition_number IS NOT NULL AND edition_total IS NOT NULL)
  )
);

-- Artwork Photos table
CREATE TABLE artwork_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artwork_id UUID NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  folder_path TEXT NOT NULL DEFAULT 'artworks',
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Artwork-Spot Allocations table (historical record)
CREATE TABLE artwork_spot_allocations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artwork_id UUID NOT NULL REFERENCES artworks(id),
  spot_id UUID NOT NULL REFERENCES spots(id),
  allocated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  allocated_by UUID NOT NULL REFERENCES users(id),
  delivered_at TIMESTAMPTZ,
  live_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  end_reason TEXT
);

-- User registration approvals
CREATE TABLE registration_approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  approved_by UUID REFERENCES users(id),
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Property admin users (many-to-many)
CREATE TABLE property_admins (
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES hosts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (property_id, user_id)
);

-- ===========================================
-- FUNCTIONS
-- ===========================================

-- Function to generate random alphanumeric ID
CREATE OR REPLACE FUNCTION generate_random_id(prefix TEXT, country_code TEXT)
RETURNS TEXT AS $$
DECLARE
  random_part TEXT;
BEGIN
  -- Generate 5 random alphanumeric characters
  random_part := array_to_string(ARRAY(
    SELECT substr('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', ceil(random() * 36)::integer, 1)
    FROM generate_series(1, 5)
  ), '');

  RETURN prefix || country_code || '-' || random_part;
END;
$$ LANGUAGE plpgsql;

-- Function to generate artwork ID
CREATE OR REPLACE FUNCTION generate_artwork_id(country_code CHAR(2) DEFAULT 'CH')
RETURNS TEXT AS $$
BEGIN
  RETURN generate_random_id('AW', country_code);
END;
$$ LANGUAGE plpgsql;

-- Function to generate property ID
CREATE OR REPLACE FUNCTION generate_property_id(country_code CHAR(2) DEFAULT 'CH')
RETURNS TEXT AS $$
BEGIN
  RETURN generate_random_id('AP', country_code);
END;
$$ LANGUAGE plpgsql;

-- Function to generate spot ID
CREATE OR REPLACE FUNCTION generate_spot_id(country_code CHAR(2) DEFAULT 'CH')
RETURNS TEXT AS $$
BEGIN
  RETURN generate_random_id('AS', country_code);
END;
$$ LANGUAGE plpgsql;

-- Function to get property's country code
CREATE OR REPLACE FUNCTION get_property_country_code(p_property_id UUID)
RETURNS CHAR(2) AS $$
DECLARE
  v_country_code CHAR(2);
BEGIN
  SELECT country_code INTO v_country_code
  FROM properties
  WHERE id = p_property_id;
  
  RETURN COALESCE(v_country_code, 'CH');  -- Default to CH if not found
END;
$$ LANGUAGE plpgsql;

-- Function to allocate artwork to spot
CREATE OR REPLACE FUNCTION allocate_artwork_to_spot(
  p_artwork_id UUID,
  p_spot_id UUID,
  p_allocated_by UUID
)
RETURNS VOID AS $$
BEGIN
  -- Update artwork status and spot
  UPDATE artworks 
  SET 
    status = 'allocated',
    current_spot_id = p_spot_id,
    updated_at = NOW()
  WHERE id = p_artwork_id;
  
  -- Update spot status and artwork
  UPDATE spots
  SET 
    status = 'allocated',
    current_artwork_id = p_artwork_id,
    updated_at = NOW()
  WHERE id = p_spot_id;
  
  -- Record allocation
  INSERT INTO artwork_spot_allocations (
    artwork_id,
    spot_id,
    allocated_by,
    allocated_at
  )
  VALUES (
    p_artwork_id,
    p_spot_id,
    p_allocated_by,
    NOW()
  );
END;
$$ LANGUAGE plpgsql;

-- Function to mark artwork as delivered to spot
CREATE OR REPLACE FUNCTION artwork_delivered_to_spot(
  p_artwork_id UUID,
  p_spot_id UUID
)
RETURNS VOID AS $$
DECLARE
  v_allocation_id UUID;
BEGIN
  -- Find the active allocation
  SELECT id INTO v_allocation_id
  FROM artwork_spot_allocations
  WHERE artwork_id = p_artwork_id 
    AND spot_id = p_spot_id
    AND ended_at IS NULL;
  
  IF v_allocation_id IS NULL THEN
    RAISE EXCEPTION 'No active allocation found for this artwork and spot';
  END IF;
  
  -- Update artwork status
  UPDATE artworks 
  SET 
    status = 'delivered',
    updated_at = NOW()
  WHERE id = p_artwork_id;
  
  -- Update allocation record
  UPDATE artwork_spot_allocations
  SET delivered_at = NOW()
  WHERE id = v_allocation_id;
END;
$$ LANGUAGE plpgsql;

-- Function to mark artwork as live on spot
CREATE OR REPLACE FUNCTION artwork_live_on_spot(
  p_artwork_id UUID,
  p_spot_id UUID
)
RETURNS VOID AS $$
DECLARE
  v_allocation_id UUID;
BEGIN
  -- Find the active allocation
  SELECT id INTO v_allocation_id
  FROM artwork_spot_allocations
  WHERE artwork_id = p_artwork_id 
    AND spot_id = p_spot_id
    AND ended_at IS NULL;
  
  IF v_allocation_id IS NULL THEN
    RAISE EXCEPTION 'No active allocation found for this artwork and spot';
  END IF;
  
  -- Update artwork status
  UPDATE artworks 
  SET 
    status = 'live',
    updated_at = NOW()
  WHERE id = p_artwork_id;
  
  -- Update spot status
  UPDATE spots
  SET 
    status = 'live',
    updated_at = NOW()
  WHERE id = p_spot_id;
  
  -- Update allocation record
  UPDATE artwork_spot_allocations
  SET live_at = NOW()
  WHERE id = v_allocation_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get full URL for a storage path
CREATE OR REPLACE FUNCTION get_storage_url(folder_path TEXT, storage_path TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN FORMAT('https://%s.supabase.co/storage/v1/object/public/%s/%s/%s', 
                 current_setting('app.supabase_project_id'), 
                 'pickart', -- Single bucket name
                 folder_path,
                 storage_path);
END;
$$ LANGUAGE plpgsql;

-- ===========================================
-- TRIGGERS
-- ===========================================

-- Trigger to automatically generate artwork_id
CREATE OR REPLACE FUNCTION trigger_set_artwork_id()
RETURNS TRIGGER AS $$
DECLARE
  v_country_code CHAR(2);
BEGIN
  IF NEW.artwork_id IS NULL THEN
    -- Get artist's country code, default to CH if not found
    SELECT u.country_code INTO v_country_code
    FROM users u
    WHERE u.id = NEW.artist_id;
    
    NEW.artwork_id := generate_artwork_id(COALESCE(v_country_code, 'CH'));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_artwork_id
BEFORE INSERT ON artworks
FOR EACH ROW
EXECUTE FUNCTION trigger_set_artwork_id();

-- Trigger to automatically generate property_id
CREATE OR REPLACE FUNCTION trigger_set_property_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.property_id IS NULL THEN
    NEW.property_id := generate_property_id(NEW.country_code);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_property_id
BEFORE INSERT ON properties
FOR EACH ROW
EXECUTE FUNCTION trigger_set_property_id();

-- Trigger to automatically generate spot_id
CREATE OR REPLACE FUNCTION trigger_set_spot_id()
RETURNS TRIGGER AS $$
DECLARE
  v_country_code CHAR(2);
BEGIN
  IF NEW.spot_id IS NULL THEN
    SELECT get_property_country_code(NEW.property_id) INTO v_country_code;
    NEW.spot_id := generate_spot_id(v_country_code);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_spot_id
BEFORE INSERT ON spots
FOR EACH ROW
EXECUTE FUNCTION trigger_set_spot_id();

-- Trigger to update timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply timestamp triggers to all tables with updated_at
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON bank_accounts
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON artists
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON hosts
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON properties
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON spots
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON artworks
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON registration_approvals
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- ===========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ===========================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE hosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE spot_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE artwork_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE artwork_spot_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_admins ENABLE ROW LEVEL SECURITY;

-- Allow admin to do everything
CREATE POLICY admin_all ON users TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- User policies (each user can see and update their own data)
CREATE POLICY user_select_own ON users FOR SELECT 
  USING (id = auth.uid());
  
CREATE POLICY user_update_own ON users FOR UPDATE 
  USING (id = auth.uid());

-- Bank account policies
CREATE POLICY bank_account_select ON bank_accounts FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM artists a WHERE a.bank_account_id = bank_accounts.id AND a.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM hosts h WHERE h.bank_account_id = bank_accounts.id AND h.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Artists can only see and update their own artworks or artworks of artists they represent
CREATE POLICY artist_artwork_select ON artworks FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM artists a 
      WHERE a.id = artworks.artist_id 
      AND (
        a.user_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM artists a2 
          WHERE a2.user_id = auth.uid() 
          AND a2.artist_type = 'agent'
        )
      )
    ) OR 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY artist_artwork_insert ON artworks FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM artists a 
      WHERE a.id = artist_id 
      AND (
        a.user_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM artists a2 
          WHERE a2.user_id = auth.uid() 
          AND a2.artist_type = 'agent'
        )
      )
    ) OR 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY artist_artwork_update ON artworks FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM artists a 
      WHERE a.id = artist_id 
      AND (
        a.user_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM artists a2 
          WHERE a2.user_id = auth.uid() 
          AND a2.artist_type = 'agent'
        )
      )
    ) OR 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Host policies for properties
CREATE POLICY host_property_select ON properties FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM hosts h 
      WHERE h.id = properties.owner_id 
      AND h.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM property_admins 
      WHERE property_id = properties.id AND user_id = auth.uid()
    ) OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Host policies for spots
CREATE POLICY host_spot_select ON spots FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM properties p
      JOIN hosts h ON h.id = p.owner_id
      WHERE p.id = spots.property_id 
      AND (
        h.user_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM property_admins 
          WHERE property_id = p.id AND user_id = auth.uid()
        )
      )
    ) OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- ===========================================
-- VIEWS
-- ===========================================

-- View for artwork details with artist info
CREATE OR REPLACE VIEW artwork_details AS
SELECT 
  a.id,
  a.artwork_id,
  a.artist_id,
  a.title,
  a.year,
  a.place,
  a.description,
  a.style,
  a.medium,
  a.is_unique,
  a.edition_number,
  a.edition_total,
  a.width_cm,
  a.height_cm,
  a.depth_cm,
  a.weight_kg,
  a.price,
  a.status,
  a.current_spot_id,
  a.qr_code_url,
  a.created_at,
  a.updated_at,
  u.first_name AS artist_first_name,
  u.last_name AS artist_last_name,
  ar.display_name AS artist_display_name,
  (
    SELECT get_storage_url(folder_path, storage_path)
    FROM artwork_photos 
    WHERE artwork_id = a.id AND is_primary = TRUE 
    LIMIT 1
  ) AS primary_photo_url,
  s.spot_id AS spot_identifier,
  p.property_name AS current_property_name,
  p.city AS current_property_city
FROM 
  artworks a
LEFT JOIN 
  artists ar ON a.artist_id = ar.id
LEFT JOIN 
  users u ON ar.id = u.id
LEFT JOIN 
  spots s ON a.current_spot_id = s.id
LEFT JOIN 
  properties p ON s.property_id = p.id;

-- View for spot details with property info
CREATE OR REPLACE VIEW spot_details AS
SELECT 
  s.id,
  s.spot_id,
  s.property_id,
  s.floor_number,
  s.room_name,
  s.position_description,
  s.preferred_style,
  s.color_scheme,
  s.fixture_method,
  s.max_weight_kg,
  s.max_width_cm,
  s.max_height_cm,
  s.max_depth_cm,
  s.preferred_price_range_min,
  s.preferred_price_range_max,
  s.status,
  s.current_artwork_id,
  s.qr_code_url,
  s.created_at,
  s.updated_at,
  p.property_name,
  p.property_type,
  p.street_address,
  p.city,
  p.state,
  c.name AS country,
  a.artwork_id AS artwork_identifier,
  a.title AS current_artwork_title,
  ar.display_name AS current_artwork_artist
FROM 
  spots s
LEFT JOIN 
  properties p ON s.property_id = p.id
LEFT JOIN
  countries c ON p.country_code = c.code
LEFT JOIN 
  artworks a ON s.current_artwork_id = a.id
LEFT JOIN 
  artists ar ON a.artist_id = ar.id;