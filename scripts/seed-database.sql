-- Seed script for development data
-- This creates sample users and matches for testing

-- Insert sample male users
INSERT INTO users (id, telegram_id, first_name, full_name, age, gender, bio, created_at, updated_at) VALUES
('user_male_1', '1001', 'Alex', 'Alex Johnson', 25, 'MALE', 'Love hiking and photography. Looking for someone to explore the world with!', NOW(), NOW()),
('user_male_2', '1002', 'Mike', 'Mike Chen', 28, 'MALE', 'Software engineer by day, chef by night. Lets cook something amazing together!', NOW(), NOW()),
('user_male_3', '1003', 'David', 'David Smith', 30, 'MALE', 'Fitness enthusiast and dog lover. My golden retriever Max is my best friend!', NOW(), NOW()),
('user_male_4', '1004', 'James', 'James Wilson', 26, 'MALE', 'Musician and coffee addict. I play guitar and love discovering new cafes.', NOW(), NOW()),
('user_male_5', '1005', 'Ryan', 'Ryan Brown', 29, 'MALE', 'Travel blogger who has visited 30 countries. Whats your dream destination?', NOW(), NOW());

-- Insert sample female users
INSERT INTO users (id, telegram_id, first_name, full_name, age, gender, bio, created_at, updated_at) VALUES
('user_female_1', '2001', 'Emma', 'Emma Davis', 24, 'FEMALE', 'Art student and yoga instructor. I find beauty in simple moments and mindful living.', NOW(), NOW()),
('user_female_2', '2002', 'Sarah', 'Sarah Miller', 27, 'FEMALE', 'Marketing professional who loves weekend adventures. Hiking, beaches, or city exploring!', NOW(), NOW()),
('user_female_3', '2003', 'Lisa', 'Lisa Garcia', 25, 'FEMALE', 'Veterinarian with a passion for animal rescue. My cats Luna and Milo rule my heart.', NOW(), NOW()),
('user_female_4', '2004', 'Anna', 'Anna Taylor', 26, 'FEMALE', 'Bookworm and wine enthusiast. Currently reading sci-fi novels and learning French.', NOW(), NOW()),
('user_female_5', '2005', 'Jessica', 'Jessica Anderson', 28, 'FEMALE', 'Photographer capturing lifes beautiful moments. Sunsets, street art, and genuine smiles.', NOW(), NOW());

-- Insert sample photos for users
INSERT INTO photos (id, user_id, public_id, secure_url, is_main, created_at) VALUES
-- Male user photos
('photo_male_1_1', 'user_male_1', 'sample_male_1_main', '/placeholder.svg?height=400&width=300', true, NOW()),
('photo_male_1_2', 'user_male_1', 'sample_male_1_2', '/placeholder.svg?height=400&width=300', false, NOW()),
('photo_male_2_1', 'user_male_2', 'sample_male_2_main', '/placeholder.svg?height=400&width=300', true, NOW()),
('photo_male_2_2', 'user_male_2', 'sample_male_2_2', '/placeholder.svg?height=400&width=300', false, NOW()),
('photo_male_3_1', 'user_male_3', 'sample_male_3_main', '/placeholder.svg?height=400&width=300', true, NOW()),
('photo_male_4_1', 'user_male_4', 'sample_male_4_main', '/placeholder.svg?height=400&width=300', true, NOW()),
('photo_male_5_1', 'user_male_5', 'sample_male_5_main', '/placeholder.svg?height=400&width=300', true, NOW()),

-- Female user photos
('photo_female_1_1', 'user_female_1', 'sample_female_1_main', '/placeholder.svg?height=400&width=300', true, NOW()),
('photo_female_1_2', 'user_female_1', 'sample_female_1_2', '/placeholder.svg?height=400&width=300', false, NOW()),
('photo_female_2_1', 'user_female_2', 'sample_female_2_main', '/placeholder.svg?height=400&width=300', true, NOW()),
('photo_female_2_2', 'user_female_2', 'sample_female_2_2', '/placeholder.svg?height=400&width=300', false, NOW()),
('photo_female_3_1', 'user_female_3', 'sample_female_3_main', '/placeholder.svg?height=400&width=300', true, NOW()),
('photo_female_4_1', 'user_female_4', 'sample_female_4_main', '/placeholder.svg?height=400&width=300', true, NOW()),
('photo_female_5_1', 'user_female_5', 'sample_female_5_main', '/placeholder.svg?height=400&width=300', true, NOW());

-- Create some sample likes and matches
INSERT INTO likes (id, sender_id, receiver_id, created_at) VALUES
('like_1', 'user_male_1', 'user_female_1', NOW()),
('like_2', 'user_female_1', 'user_male_1', NOW()),
('like_3', 'user_male_2', 'user_female_2', NOW()),
('like_4', 'user_female_2', 'user_male_2', NOW()),
('like_5', 'user_male_3', 'user_female_3', NOW());

-- Create matches for mutual likes
INSERT INTO matches (id, sender_id, receiver_id, created_at) VALUES
('match_1', 'user_male_1', 'user_female_1', NOW()),
('match_2', 'user_male_2', 'user_female_2', NOW());

-- Insert sample chat messages
INSERT INTO chat_messages (id, match_id, sender_id, receiver_id, content, created_at) VALUES
('msg_1', 'match_1', 'user_male_1', 'user_female_1', 'Hey Emma! I saw you love yoga, I just started practicing too!', NOW() - INTERVAL '2 hours'),
('msg_2', 'match_1', 'user_female_1', 'user_male_1', 'Hi Alex! Thats awesome! How are you finding it so far?', NOW() - INTERVAL '1 hour 30 minutes'),
('msg_3', 'match_1', 'user_male_1', 'user_female_1', 'Its challenging but really relaxing. Would love to hear your tips!', NOW() - INTERVAL '1 hour'),
('msg_4', 'match_2', 'user_male_2', 'user_female_2', 'Hi Sarah! I noticed you love adventures. Whats your favorite hiking spot?', NOW() - INTERVAL '3 hours'),
('msg_5', 'match_2', 'user_female_2', 'user_male_2', 'Hey Mike! I love the trails around Mount Wilson. Great views and not too crowded!', NOW() - INTERVAL '2 hours 30 minutes');
