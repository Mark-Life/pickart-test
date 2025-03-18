-- First, let's create some users with different roles
INSERT INTO users (id, first_name, last_name, email, phone, address, country_code, role) VALUES
('11111111-1111-1111-1111-111111111111', 'John', 'Admin', 'admin@pickart.com', '+41789991111', 'Admin Street 1, Zurich', 'CH', 'admin'),
('22222222-2222-2222-2222-222222222222', 'Marie', 'Artist', 'marie@artist.com', '+41789992222', 'Art Street 1, Basel', 'CH', 'artist'),
('33333333-3333-3333-3333-333333333333', 'Pablo', 'Creative', 'pablo@artist.com', '+41789993333', 'Paint Street 2, Geneva', 'CH', 'artist'),
('44444444-4444-4444-4444-444444444444', 'Sarah', 'Gallery', 'sarah@host.com', '+41789994444', 'Gallery Road 1, Bern', 'CH', 'host'),
('55555555-5555-5555-5555-555555555555', 'Michael', 'Venue', 'michael@host.com', '+41789995555', 'Venue Street 1, Lausanne', 'CH', 'host'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Art', 'Agency', 'agency@art.com', '+41789990000', 'Agency Street 1, Zurich', 'CH', 'artist');

-- Create bank accounts
INSERT INTO bank_accounts (id, account_name, account_address, account_number, country_code) VALUES
('aaaa1111-1111-1111-1111-111111111111', 'Marie Artist Account', 'Art Street 1, Basel', 'CH93 0076 2011 6238 5295 7', 'CH'),
('aaaa2222-2222-2222-2222-222222222222', 'Pablo Creative Account', 'Paint Street 2, Geneva', 'CH93 0076 2011 6238 5295 8', 'CH'),
('aaaa3333-3333-3333-3333-333333333333', 'Sarah Gallery Account', 'Gallery Road 1, Bern', 'CH93 0076 2011 6238 5295 9', 'CH'),
('aaaa9999-9999-9999-9999-999999999999', 'Art Agency Account', 'Agency Street 1, Zurich', 'CH93 0076 2011 6238 5295 0', 'CH');

-- Create artists (some with user accounts, some without)
INSERT INTO artists (id, user_id, artist_type, display_name, bank_account_id, contract_signed) VALUES
('bbbb1111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'artist', 'Marie Modern', 'aaaa1111-1111-1111-1111-111111111111', true),
('bbbb2222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'artist', 'Pablo Abstract', 'aaaa2222-2222-2222-2222-222222222222', true),
('bbbb3333-3333-3333-3333-333333333333', null, 'artist', 'John Classic', null, true),
('bbbb4444-4444-4444-4444-444444444444', null, 'artist', 'Anna Modern', null, true),
('bbbb9999-9999-9999-9999-999999999999', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'agent', 'Swiss Art Agency', 'aaaa9999-9999-9999-9999-999999999999', true);

-- Create hosts (some with user accounts, some without)
INSERT INTO hosts (id, user_id, host_type, business_name, bank_account_id, contract_signed) VALUES
('cccc1111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'owner', 'Sarah''s Modern Gallery', 'aaaa3333-3333-3333-3333-333333333333', true),
('cccc2222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555', 'owner', 'Michael''s Venue Space', null, true),
('cccc3333-3333-3333-3333-333333333333', null, 'owner', 'Mountain Resort Gallery', null, true);

-- Create properties
INSERT INTO properties (id, property_name, street_address, city, state, postcode, country_code, property_type, size_sqm, total_floors, total_rooms, owner_id, contact_phone) VALUES
('pppp1111-1111-1111-1111-111111111111', 'Modern Art Gallery', 'Gallery Road 1', 'Bern', 'BE', '3000', 'CH', 'gallery', 250.00, 2, 6, 'cccc1111-1111-1111-1111-111111111111', '+41789994444'),
('pppp2222-2222-2222-2222-222222222222', 'City Restaurant', 'Venue Street 1', 'Lausanne', 'VD', '1000', 'CH', 'restaurant', 180.00, 1, 3, 'cccc2222-2222-2222-2222-222222222222', '+41789995555'),
('pppp3333-3333-3333-3333-333333333333', 'Mountain Gallery', 'Resort Road 1', 'Zermatt', 'VS', '3920', 'CH', 'gallery', 300.00, 1, 4, 'cccc3333-3333-3333-3333-333333333333', '+41789997777');

-- Create spots
INSERT INTO spots (id, property_id, floor_number, room_name, position_description, preferred_style, color_scheme, fixture_method, max_weight_kg, max_width_cm, max_height_cm, max_depth_cm, status) VALUES
('ssss1111-1111-1111-1111-111111111111', 'pppp1111-1111-1111-1111-111111111111', 1, 'Main Hall', 'North Wall', 'Modern', 'Neutral', 'wall_mount', 20.00, 150.00, 200.00, 10.00, 'ready_for_allocation'),
('ssss2222-2222-2222-2222-222222222222', 'pppp1111-1111-1111-1111-111111111111', 1, 'East Wing', 'Feature Wall', 'Contemporary', 'White', 'wall_mount', 15.00, 100.00, 150.00, 5.00, 'ready_for_allocation'),
('ssss3333-3333-3333-3333-333333333333', 'pppp2222-2222-2222-2222-222222222222', 1, 'Dining Area', 'Main Wall', 'Abstract', 'Warm', 'wall_mount', 10.00, 120.00, 180.00, 5.00, 'ready_for_allocation');

-- Create artworks (including some managed by the art agency)
INSERT INTO artworks (id, artist_id, title, year, place, description, style, medium, is_unique, width_cm, height_cm, depth_cm, weight_kg, price, status) VALUES
('aaaa1111-1111-1111-1111-111111111111', 'bbbb1111-1111-1111-1111-111111111111', 'Urban Dreams', 2024, 'Basel', 'Contemporary urban landscape', 'Modern', 'Oil on Canvas', true, 100.00, 150.00, 4.00, 5.00, 3500.00, 'ready_for_allocation'),
('aaaa2222-2222-2222-2222-222222222222', 'bbbb2222-2222-2222-2222-222222222222', 'Mountain Silence', 2024, 'Alps', 'Swiss mountain landscape', 'Contemporary', 'Acrylic on Canvas', true, 120.00, 180.00, 4.00, 6.00, 4200.00, 'ready_for_allocation'),
('aaaa3333-3333-3333-3333-333333333333', 'bbbb3333-3333-3333-3333-333333333333', 'Classic Beauty', 2024, 'Rome', 'Classical style painting', 'Classical', 'Oil on Canvas', true, 90.00, 120.00, 3.00, 4.00, 5500.00, 'ready_for_allocation'),
('aaaa4444-4444-4444-4444-444444444444', 'bbbb4444-4444-4444-4444-444444444444', 'Modern Times', 2024, 'Paris', 'Contemporary art piece', 'Modern', 'Mixed Media', true, 100.00, 150.00, 5.00, 6.00, 4800.00, 'ready_for_allocation');

-- Create property admins
INSERT INTO property_admins (property_id, user_id) VALUES
('pppp1111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444'),
('pppp2222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555');

-- Create some allocations
INSERT INTO artwork_spot_allocations (artwork_id, spot_id, allocated_by, allocated_at, delivered_at, live_at) VALUES
('aaaa1111-1111-1111-1111-111111111111', 'ssss1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '30 days', NOW() - INTERVAL '29 days', NOW() - INTERVAL '28 days'),
('aaaa3333-3333-3333-3333-333333333333', 'ssss2222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '20 days', NOW() - INTERVAL '19 days', NOW() - INTERVAL '18 days');

-- Update the status of allocated artworks and spots
UPDATE artworks 
SET status = 'live', current_spot_id = 'ssss1111-1111-1111-1111-111111111111'
WHERE id = 'aaaa1111-1111-1111-1111-111111111111';

UPDATE spots
SET status = 'live', current_artwork_id = 'aaaa1111-1111-1111-1111-111111111111'
WHERE id = 'ssss1111-1111-1111-1111-111111111111';

UPDATE artworks 
SET status = 'live', current_spot_id = 'ssss2222-2222-2222-2222-222222222222'
WHERE id = 'aaaa3333-3333-3333-3333-333333333333';

UPDATE spots
SET status = 'live', current_artwork_id = 'aaaa3333-3333-3333-3333-333333333333'
WHERE id = 'ssss2222-2222-2222-2222-222222222222';