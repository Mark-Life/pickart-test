-- First, let's create some users with different roles
INSERT INTO users (id, first_name, last_name, email, phone, address, country_code, role) VALUES
('11111111-1111-1111-1111-111111111111', 'John', 'Admin', 'admin@pickart.com', '+41789991111', 'Admin Street 1, Zurich', 'CH', 'admin'),
('22222222-2222-2222-2222-222222222222', 'Marie', 'Artist', 'marie@artist.com', '+41789992222', 'Art Street 1, Basel', 'CH', 'artist'),
('33333333-3333-3333-3333-333333333333', 'Pablo', 'Creative', 'pablo@artist.com', '+41789993333', 'Paint Street 2, Geneva', 'CH', 'artist'),
('44444444-4444-4444-4444-444444444444', 'Sarah', 'Gallery', 'sarah@host.com', '+41789994444', 'Gallery Road 1, Bern', 'CH', 'host'),
('55555555-5555-5555-5555-555555555555', 'Michael', 'Venue', 'michael@host.com', '+41789995555', 'Venue Street 1, Lausanne', 'CH', 'host');

-- Create bank accounts
INSERT INTO bank_accounts (id, account_name, account_address, account_number, country_code) VALUES
('aaaa1111-1111-1111-1111-111111111111', 'Marie Artist Account', 'Art Street 1, Basel', 'CH93 0076 2011 6238 5295 7', 'CH'),
('aaaa2222-2222-2222-2222-222222222222', 'Pablo Creative Account', 'Paint Street 2, Geneva', 'CH93 0076 2011 6238 5295 8', 'CH'),
('aaaa3333-3333-3333-3333-333333333333', 'Sarah Gallery Account', 'Gallery Road 1, Bern', 'CH93 0076 2011 6238 5295 9', 'CH');

-- Create artists
INSERT INTO artists (id, artist_type, display_name, bank_account_id, contract_signed) VALUES
('22222222-2222-2222-2222-222222222222', 'artist', 'Marie Modern', 'aaaa1111-1111-1111-1111-111111111111', true),
('33333333-3333-3333-3333-333333333333', 'artist', 'Pablo Abstract', 'aaaa2222-2222-2222-2222-222222222222', true);

-- Create hosts
INSERT INTO hosts (id, host_type, business_name, bank_account_id, contract_signed) VALUES
('44444444-4444-4444-4444-444444444444', 'owner', 'Sarah''s Modern Gallery', 'aaaa3333-3333-3333-3333-333333333333', true),
('55555555-5555-5555-5555-555555555555', 'owner', 'Michael''s Venue Space', null, true);

-- Create properties
INSERT INTO properties (id, property_name, street_address, city, state, postcode, country_code, property_type, size_sqm, total_floors, total_rooms, owner_id, contact_phone) VALUES
('bbbb1111-1111-1111-1111-111111111111', 'Modern Art Gallery', 'Gallery Road 1', 'Bern', 'BE', '3000', 'CH', 'gallery', 250.00, 2, 6, '44444444-4444-4444-4444-444444444444', '+41789994444'),
('bbbb2222-2222-2222-2222-222222222222', 'City Restaurant', 'Venue Street 1', 'Lausanne', 'VD', '1000', 'CH', 'restaurant', 180.00, 1, 3, '55555555-5555-5555-5555-555555555555', '+41789995555');

-- Create spots
INSERT INTO spots (id, property_id, floor_number, room_name, position_description, preferred_style, color_scheme, fixture_method, max_weight_kg, max_width_cm, max_height_cm, max_depth_cm, status) VALUES
('cccc1111-1111-1111-1111-111111111111', 'bbbb1111-1111-1111-1111-111111111111', 1, 'Main Hall', 'North Wall', 'Modern', 'Neutral', 'wall_mount', 20.00, 150.00, 200.00, 10.00, 'ready_for_allocation'),
('cccc2222-2222-2222-2222-222222222222', 'bbbb1111-1111-1111-1111-111111111111', 1, 'East Wing', 'Feature Wall', 'Contemporary', 'White', 'wall_mount', 15.00, 100.00, 150.00, 5.00, 'ready_for_allocation'),
('cccc3333-3333-3333-3333-333333333333', 'bbbb2222-2222-2222-2222-222222222222', 1, 'Dining Area', 'Main Wall', 'Abstract', 'Warm', 'wall_mount', 10.00, 120.00, 180.00, 5.00, 'ready_for_allocation');

-- Create artworks
INSERT INTO artworks (id, artist_id, title, year, place, description, style, medium, is_unique, width_cm, height_cm, depth_cm, weight_kg, price, status) VALUES
('dddd1111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Urban Dreams', 2024, 'Basel', 'Contemporary urban landscape', 'Modern', 'Oil on Canvas', true, 100.00, 150.00, 4.00, 5.00, 3500.00, 'ready_for_allocation'),
('dddd2222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Mountain Silence', 2024, 'Alps', 'Swiss mountain landscape', 'Contemporary', 'Acrylic on Canvas', true, 120.00, 180.00, 4.00, 6.00, 4200.00, 'ready_for_allocation'),
('dddd3333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'Abstract Thoughts', 2024, 'Geneva', 'Abstract composition in blue', 'Abstract', 'Mixed Media', true, 80.00, 120.00, 3.00, 4.00, 2800.00, 'ready_for_allocation');

-- Create property admins
INSERT INTO property_admins (property_id, user_id) VALUES
('bbbb1111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444'),
('bbbb2222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555');

-- Create some allocations
INSERT INTO artwork_spot_allocations (artwork_id, spot_id, allocated_by, allocated_at, delivered_at, live_at) VALUES
('dddd1111-1111-1111-1111-111111111111', 'cccc1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '30 days', NOW() - INTERVAL '29 days', NOW() - INTERVAL '28 days');

-- Update the status of the allocated artwork and spot
UPDATE artworks 
SET status = 'live', current_spot_id = 'cccc1111-1111-1111-1111-111111111111'
WHERE id = 'dddd1111-1111-1111-1111-111111111111';

UPDATE spots
SET status = 'live', current_artwork_id = 'dddd1111-1111-1111-1111-111111111111'
WHERE id = 'cccc1111-1111-1111-1111-111111111111';

-- Add more users
INSERT INTO users (id, first_name, last_name, email, phone, address, country_code, role) VALUES
('66666666-6666-6666-6666-666666666666', 'Emma', 'Artist', 'emma@artist.com', '+41789996666', 'Art Avenue 3, Zurich', 'CH', 'artist'),
('77777777-7777-7777-7777-777777777777', 'David', 'Sculptor', 'david@artist.com', '+41789997777', 'Sculpture Lane 1, Lucerne', 'CH', 'artist'),
('88888888-8888-8888-8888-888888888888', 'Lisa', 'Hotel', 'lisa@host.com', '+41789998888', 'Hotel Street 1, St. Moritz', 'CH', 'host'),
('99999999-9999-9999-9999-999999999999', 'Thomas', 'Cafe', 'thomas@host.com', '+41789999999', 'Cafe Road 1, Montreux', 'CH', 'host');

-- Add more bank accounts
INSERT INTO bank_accounts (id, account_name, account_address, account_number, country_code) VALUES
('aaaa4444-4444-4444-4444-444444444444', 'Emma Artist Account', 'Art Avenue 3, Zurich', 'CH93 0076 2011 6238 5295 1', 'CH'),
('aaaa5555-5555-5555-5555-555555555555', 'David Sculptor Account', 'Sculpture Lane 1, Lucerne', 'CH93 0076 2011 6238 5295 2', 'CH'),
('aaaa6666-6666-6666-6666-666666666666', 'Mountain View Hotel Account', 'Hotel Street 1, St. Moritz', 'CH93 0076 2011 6238 5295 3', 'CH');

-- Add more artists
INSERT INTO artists (id, artist_type, display_name, bank_account_id, contract_signed) VALUES
('66666666-6666-6666-6666-666666666666', 'artist', 'Emma Digital', 'aaaa4444-4444-4444-4444-444444444444', true),
('77777777-7777-7777-7777-777777777777', 'artist', 'David Stone', 'aaaa5555-5555-5555-5555-555555555555', true);

-- Add more hosts
INSERT INTO hosts (id, host_type, business_name, bank_account_id, contract_signed) VALUES
('88888888-8888-8888-8888-888888888888', 'owner', 'Mountain View Hotel', 'aaaa6666-6666-6666-6666-666666666666', true),
('99999999-9999-9999-9999-999999999999', 'owner', 'Lakeside Cafe', null, true);

-- Add more properties
INSERT INTO properties (id, property_name, street_address, city, state, postcode, country_code, property_type, size_sqm, total_floors, total_rooms, owner_id, contact_phone) VALUES
('bbbb3333-3333-3333-3333-333333333333', 'Mountain View Hotel', 'Hotel Street 1', 'St. Moritz', 'GR', '7500', 'CH', 'hotel_lobby', 400.00, 5, 50, '88888888-8888-8888-8888-888888888888', '+41789998888'),
('bbbb4444-4444-4444-4444-444444444444', 'Lakeside Cafe', 'Cafe Road 1', 'Montreux', 'VD', '1820', 'CH', 'cafe', 120.00, 1, 2, '99999999-9999-9999-9999-999999999999', '+41789999999');

-- Add more spots
INSERT INTO spots (id, property_id, floor_number, room_name, position_description, preferred_style, color_scheme, fixture_method, max_weight_kg, max_width_cm, max_height_cm, max_depth_cm, status) VALUES
('cccc4444-4444-4444-4444-444444444444', 'bbbb3333-3333-3333-3333-333333333333', 1, 'Hotel Lobby', 'Reception Area', 'Contemporary', 'Gold and White', 'wall_mount', 25.00, 200.00, 250.00, 10.00, 'ready_for_allocation'),
('cccc5555-5555-5555-5555-555555555555', 'bbbb3333-3333-3333-3333-333333333333', 2, 'Conference Room', 'Main Wall', 'Modern', 'Earth Tones', 'wall_mount', 15.00, 180.00, 120.00, 5.00, 'ready_for_allocation'),
('cccc6666-6666-6666-6666-666666666666', 'bbbb4444-4444-4444-4444-444444444444', 1, 'Main Cafe Area', 'Feature Wall', 'Pop Art', 'Vibrant', 'wall_mount', 8.00, 100.00, 150.00, 5.00, 'ready_for_allocation'),
('cccc7777-7777-7777-7777-777777777777', 'bbbb3333-3333-3333-3333-333333333333', 1, 'Lobby Corner', 'Near Elevator', 'Sculpture', 'Natural', 'pedestal', 100.00, 100.00, 200.00, 100.00, 'ready_for_allocation');

-- Add more artworks
INSERT INTO artworks (id, artist_id, title, year, place, description, style, medium, is_unique, edition_number, edition_total, width_cm, height_cm, depth_cm, weight_kg, price, status) VALUES
('dddd4444-4444-4444-4444-444444444444', '66666666-6666-6666-6666-666666666666', 'Digital Dreams', 2024, 'Zurich', 'Digital art printed on metal', 'Digital', 'Digital Print on Metal', false, 1, 5, 150.00, 100.00, 2.00, 8.00, 2800.00, 'ready_for_allocation'),
('dddd5555-5555-5555-5555-555555555555', '66666666-6666-6666-6666-666666666666', 'Cyber Nature', 2024, 'Zurich', 'Nature meets technology', 'Digital', 'Digital Print on Canvas', false, 2, 5, 120.00, 80.00, 3.00, 4.00, 2200.00, 'ready_for_allocation'),
('dddd6666-6666-6666-6666-666666666666', '77777777-7777-7777-7777-777777777777', 'Mountain Spirit', 2024, 'Lucerne', 'Marble sculpture of mountain', 'Contemporary', 'Marble Sculpture', true, null, null, 80.00, 150.00, 80.00, 95.00, 12000.00, 'ready_for_allocation'),
('dddd7777-7777-7777-7777-777777777777', '77777777-7777-7777-7777-777777777777', 'Bronze Dance', 2024, 'Lucerne', 'Abstract bronze figure', 'Abstract', 'Bronze Sculpture', true, null, null, 60.00, 180.00, 60.00, 45.00, 8500.00, 'ready_for_allocation');

-- Add more property admins
INSERT INTO property_admins (property_id, user_id) VALUES
('bbbb3333-3333-3333-3333-333333333333', '88888888-8888-8888-8888-888888888888'),
('bbbb4444-4444-4444-4444-444444444444', '99999999-9999-9999-9999-999999999999');

-- Create more allocations
INSERT INTO artwork_spot_allocations (artwork_id, spot_id, allocated_by, allocated_at, delivered_at, live_at) VALUES
('dddd6666-6666-6666-6666-666666666666', 'cccc7777-7777-7777-7777-777777777777', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '20 days', NOW() - INTERVAL '19 days', NOW() - INTERVAL '18 days'),
('dddd4444-4444-4444-4444-444444444444', 'cccc4444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '15 days', NOW() - INTERVAL '14 days', NOW() - INTERVAL '13 days');

-- Update the status of the newly allocated artworks and spots
UPDATE artworks 
SET status = 'live', current_spot_id = 'cccc7777-7777-7777-7777-777777777777'
WHERE id = 'dddd6666-6666-6666-6666-666666666666';

UPDATE spots
SET status = 'live', current_artwork_id = 'dddd6666-6666-6666-6666-666666666666'
WHERE id = 'cccc7777-7777-7777-7777-777777777777';

UPDATE artworks 
SET status = 'live', current_spot_id = 'cccc4444-4444-4444-4444-444444444444'
WHERE id = 'dddd4444-4444-4444-4444-444444444444';

UPDATE spots
SET status = 'live', current_artwork_id = 'dddd4444-4444-4444-4444-444444444444'
WHERE id = 'cccc4444-4444-4444-4444-444444444444';