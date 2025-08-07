-- Enhanced seed script with more realistic data
-- Clear existing data first
DELETE FROM chat_messages;
DELETE FROM matches;
DELETE FROM likes;
DELETE FROM photos;
DELETE FROM users;

-- Insert sample male users with more variety
INSERT INTO users (id, telegram_id, first_name, full_name, age, gender, bio, latitude, longitude, created_at, updated_at) VALUES
('user_male_1', '1001', 'Alex', 'Alex Johnson', 25, 'MALE', 'Adventure seeker 🏔️ Love hiking, photography, and discovering hidden gems. Always up for spontaneous road trips and deep conversations under the stars. Looking for someone who shares my passion for exploring the world!', 40.7128, -74.0060, NOW(), NOW()),
('user_male_2', '1002', 'Mike', 'Mike Chen', 28, 'MALE', 'Software engineer by day, chef by night 👨‍💻🍳 I create apps and amazing dishes with equal passion. Love trying new cuisines and cooking for friends. Seeking someone who appreciates good food and great company!', 40.7589, -73.9851, NOW(), NOW()),
('user_male_3', '1003', 'David', 'David Smith', 30, 'MALE', 'Fitness enthusiast and dog dad 🐕💪 My golden retriever Max is my workout buddy and best friend. Believe in staying active and living life to the fullest. Looking for someone who loves animals and healthy living!', 40.7505, -73.9934, NOW(), NOW()),
('user_male_4', '1004', 'James', 'James Wilson', 26, 'MALE', 'Musician and coffee connoisseur ☕🎸 I play guitar in a local band and know every coffee shop in the city. Music is my soul, coffee is my fuel. Want to share both with someone special!', 40.7282, -73.7949, NOW(), NOW()),
('user_male_5', '1005', 'Ryan', 'Ryan Brown', 29, 'MALE', 'Travel blogger who has visited 35 countries 🌍✈️ Currently writing a book about my adventures. Always planning the next trip and love sharing stories. Seeking a travel companion for life!', 40.6892, -74.0445, NOW(), NOW()),
('user_male_6', '1006', 'Chris', 'Chris Taylor', 27, 'MALE', 'Artist and weekend warrior 🎨🏄‍♂️ I paint during the week and surf on weekends. Believe in living creatively and chasing waves. Looking for someone who appreciates art and adventure!', 40.7831, -73.9712, NOW(), NOW()),
('user_male_7', '1007', 'Tom', 'Tom Anderson', 31, 'MALE', 'Startup founder and book lover 📚💡 Building the next big thing while reading everything I can get my hands on. Love intellectual conversations and quiet evenings. Seeking a brilliant mind and kind heart!', 40.7614, -73.9776, NOW(), NOW()),
('user_male_8', '1008', 'Sam', 'Sam Martinez', 24, 'MALE', 'Medical student and volunteer 👨‍⚕️❤️ Studying to become a doctor while volunteering at local shelters. Passionate about helping others and making a difference. Looking for someone who shares my values!', 40.7549, -73.9840, NOW(), NOW());

-- Insert sample female users with more variety
INSERT INTO users (id, telegram_id, first_name, full_name, age, gender, bio, latitude, longitude, created_at, updated_at) VALUES
('user_female_1', '2001', 'Emma', 'Emma Davis', 24, 'FEMALE', 'Yoga instructor and mindfulness coach 🧘‍♀️✨ I find beauty in simple moments and believe in the power of mindful living. Love sunrise yoga sessions and deep conversations. Seeking someone who values inner peace and growth!', 40.7282, -73.9942, NOW(), NOW()),
('user_female_2', '2002', 'Sarah', 'Sarah Miller', 27, 'FEMALE', 'Marketing professional with wanderlust 📱🌎 I create campaigns by day and plan adventures by night. Love hiking, beaches, and exploring new cities. Looking for a partner in both work and wanderlust!', 40.7505, -73.9934, NOW(), NOW()),
('user_female_3', '2003', 'Lisa', 'Lisa Garcia', 25, 'FEMALE', 'Veterinarian and animal rescue advocate 🐱🐶 My cats Luna and Milo rule my heart, but there is room for one more special someone. Passionate about animal welfare and cozy movie nights. Seeking a fellow animal lover!', 40.7831, -73.9712, NOW(), NOW()),
('user_female_4', '2004', 'Anna', 'Anna Taylor', 26, 'FEMALE', 'Bookworm and wine enthusiast 📖🍷 Currently reading sci-fi novels while learning French. Love literary discussions and wine tastings. Seeking someone who appreciates good books and even better conversations!', 40.7589, -73.9851, NOW(), NOW()),
('user_female_5', '2005', 'Jessica', 'Jessica Anderson', 28, 'FEMALE', 'Photographer capturing life is beautiful moments 📸🌅 Specializing in sunsets, street art, and genuine smiles. Always chasing the perfect light and authentic emotions. Looking for someone who sees beauty everywhere!', 40.7614, -73.9776, NOW(), NOW()),
('user_female_6', '2006', 'Maya', 'Maya Patel', 23, 'FEMALE', 'Dance teacher and fitness enthusiast 💃🏋️‍♀️ I teach salsa and love staying active. Believe life is meant to be danced through. Looking for someone who can keep up with my energy and maybe learn a few moves!', 40.7549, -73.9840, NOW(), NOW()),
('user_female_7', '2007', 'Sophie', 'Sophie Williams', 29, 'FEMALE', 'Chef and food blogger 👩‍🍳📝 I create culinary magic and share it with the world. Love farmers markets and trying new recipes. Seeking someone who appreciates good food and great company in the kitchen!', 40.6892, -74.0445, NOW(), NOW()),
('user_female_8', '2008', 'Rachel', 'Rachel Johnson', 26, 'FEMALE', 'Environmental scientist and nature lover 🌱🔬 Working to save our planet one research project at a time. Love camping, hiking, and stargazing. Looking for someone who cares about our beautiful Earth!', 40.7128, -74.0060, NOW(), NOW());

-- Insert sample photos for users with more realistic placeholder images
INSERT INTO photos (id, user_id, public_id, secure_url, is_main, created_at) VALUES
-- Male user photos
('photo_male_1_1', 'user_male_1', 'sample_male_1_main', '/placeholder.svg?height=600&width=400', true, NOW()),
('photo_male_1_2', 'user_male_1', 'sample_male_1_2', '/placeholder.svg?height=600&width=400', false, NOW()),
('photo_male_1_3', 'user_male_1', 'sample_male_1_3', '/placeholder.svg?height=600&width=400', false, NOW()),

('photo_male_2_1', 'user_male_2', 'sample_male_2_main', '/placeholder.svg?height=600&width=400', true, NOW()),
('photo_male_2_2', 'user_male_2', 'sample_male_2_2', '/placeholder.svg?height=600&width=400', false, NOW()),

('photo_male_3_1', 'user_male_3', 'sample_male_3_main', '/placeholder.svg?height=600&width=400', true, NOW()),
('photo_male_3_2', 'user_male_3', 'sample_male_3_2', '/placeholder.svg?height=600&width=400', false, NOW()),

('photo_male_4_1', 'user_male_4', 'sample_male_4_main', '/placeholder.svg?height=600&width=400', true, NOW()),
('photo_male_4_2', 'user_male_4', 'sample_male_4_2', '/placeholder.svg?height=600&width=400', false, NOW()),

('photo_male_5_1', 'user_male_5', 'sample_male_5_main', '/placeholder.svg?height=600&width=400', true, NOW()),
('photo_male_5_2', 'user_male_5', 'sample_male_5_2', '/placeholder.svg?height=600&width=400', false, NOW()),

('photo_male_6_1', 'user_male_6', 'sample_male_6_main', '/placeholder.svg?height=600&width=400', true, NOW()),
('photo_male_7_1', 'user_male_7', 'sample_male_7_main', '/placeholder.svg?height=600&width=400', true, NOW()),
('photo_male_8_1', 'user_male_8', 'sample_male_8_main', '/placeholder.svg?height=600&width=400', true, NOW()),

-- Female user photos
('photo_female_1_1', 'user_female_1', 'sample_female_1_main', '/placeholder.svg?height=600&width=400', true, NOW()),
('photo_female_1_2', 'user_female_1', 'sample_female_1_2', '/placeholder.svg?height=600&width=400', false, NOW()),
('photo_female_1_3', 'user_female_1', 'sample_female_1_3', '/placeholder.svg?height=600&width=400', false, NOW()),

('photo_female_2_1', 'user_female_2', 'sample_female_2_main', '/placeholder.svg?height=600&width=400', true, NOW()),
('photo_female_2_2', 'user_female_2', 'sample_female_2_2', '/placeholder.svg?height=600&width=400', false, NOW()),

('photo_female_3_1', 'user_female_3', 'sample_female_3_main', '/placeholder.svg?height=600&width=400', true, NOW()),
('photo_female_3_2', 'user_female_3', 'sample_female_3_2', '/placeholder.svg?height=600&width=400', false, NOW()),

('photo_female_4_1', 'user_female_4', 'sample_female_4_main', '/placeholder.svg?height=600&width=400', true, NOW()),
('photo_female_4_2', 'user_female_4', 'sample_female_4_2', '/placeholder.svg?height=600&width=400', false, NOW()),

('photo_female_5_1', 'user_female_5', 'sample_female_5_main', '/placeholder.svg?height=600&width=400', true, NOW()),
('photo_female_5_2', 'user_female_5', 'sample_female_5_2', '/placeholder.svg?height=600&width=400', false, NOW()),

('photo_female_6_1', 'user_female_6', 'sample_female_6_main', '/placeholder.svg?height=600&width=400', true, NOW()),
('photo_female_7_1', 'user_female_7', 'sample_female_7_main', '/placeholder.svg?height=600&width=400', true, NOW()),
('photo_female_8_1', 'user_female_8', 'sample_female_8_main', '/placeholder.svg?height=600&width=400', true, NOW());

-- Create sample likes (more realistic patterns)
INSERT INTO likes (id, sender_id, receiver_id, created_at) VALUES
('like_1', 'user_male_1', 'user_female_1', NOW() - INTERVAL '2 days'),
('like_2', 'user_female_1', 'user_male_1', NOW() - INTERVAL '1 day'),
('like_3', 'user_male_2', 'user_female_2', NOW() - INTERVAL '3 days'),
('like_4', 'user_female_2', 'user_male_2', NOW() - INTERVAL '2 days'),
('like_5', 'user_male_3', 'user_female_3', NOW() - INTERVAL '1 day'),
('like_6', 'user_female_3', 'user_male_3', NOW() - INTERVAL '12 hours'),
('like_7', 'user_male_4', 'user_female_4', NOW() - INTERVAL '4 hours'),
('like_8', 'user_male_5', 'user_female_5', NOW() - INTERVAL '6 hours'),
('like_9', 'user_female_6', 'user_male_6', NOW() - INTERVAL '3 hours'),
('like_10', 'user_male_7', 'user_female_7', NOW() - INTERVAL '2 hours');

-- Create matches for mutual likes
INSERT INTO matches (id, sender_id, receiver_id, created_at) VALUES
('match_1', 'user_male_1', 'user_female_1', NOW() - INTERVAL '1 day'),
('match_2', 'user_male_2', 'user_female_2', NOW() - INTERVAL '2 days'),
('match_3', 'user_male_3', 'user_female_3', NOW() - INTERVAL '12 hours');

-- Insert sample chat messages with more realistic conversations
INSERT INTO chat_messages (id, match_id, sender_id, receiver_id, content, created_at) VALUES
-- Conversation between Alex and Emma
('msg_1', 'match_1', 'user_male_1', 'user_female_1', 'Hey Emma! I saw you love yoga, I just started practicing too! 🧘‍♂️', NOW() - INTERVAL '20 hours'),
('msg_2', 'match_1', 'user_female_1', 'user_male_1', 'Hi Alex! That is awesome! How are you finding it so far? It can be challenging at first but so rewarding! ✨', NOW() - INTERVAL '19 hours'),
('msg_3', 'match_1', 'user_male_1', 'user_female_1', 'It is definitely challenging but really relaxing. I love how it clears my mind after a long day of hiking. Would love to hear your tips!', NOW() - INTERVAL '18 hours'),
('msg_4', 'match_1', 'user_female_1', 'user_male_1', 'Oh you hike too? That is perfect! Yoga and hiking complement each other so well. I actually do sunrise yoga sessions on mountain tops sometimes 🏔️', NOW() - INTERVAL '17 hours'),
('msg_5', 'match_1', 'user_male_1', 'user_female_1', 'That sounds absolutely amazing! I would love to try that sometime. Do you have a favorite hiking spot for sunrise yoga?', NOW() - INTERVAL '16 hours'),
('msg_6', 'match_1', 'user_female_1', 'user_male_1', 'There is this beautiful spot upstate, about 2 hours drive. The view is incredible! Maybe we could plan a trip sometime? 😊', NOW() - INTERVAL '15 hours'),
('msg_7', 'match_1', 'user_male_1', 'user_female_1', 'I would absolutely love that! That sounds like the perfect adventure. When are you usually free for weekend trips?', NOW() - INTERVAL '14 hours'),

-- Conversation between Mike and Sarah
('msg_8', 'match_2', 'user_male_2', 'user_female_2', 'Hi Sarah! I noticed you love adventures and I am always planning my next trip. What is your favorite hiking spot? 🥾', NOW() - INTERVAL '45 hours'),
('msg_9', 'match_2', 'user_female_2', 'user_male_2', 'Hey Mike! I love the trails around Bear Mountain. Great views and not too crowded on weekdays. Are you into cooking too? I saw you mentioned being a chef! 👨‍🍳', NOW() - INTERVAL '44 hours'),
('msg_10', 'match_2', 'user_male_2', 'user_female_2', 'Bear Mountain is fantastic! And yes, I love cooking! I actually specialize in fusion cuisine - mixing traditional techniques with modern flavors. Do you enjoy cooking?', NOW() - INTERVAL '43 hours'),
('msg_11', 'match_2', 'user_female_2', 'user_male_2', 'I love trying new recipes but I am definitely more of an enthusiastic eater than a skilled cook 😅 Would love to learn from a pro though!', NOW() - INTERVAL '42 hours'),
('msg_12', 'match_2', 'user_male_2', 'user_female_2', 'I would love to cook for you sometime! How about we plan a hiking trip and I can pack us an amazing picnic lunch?', NOW() - INTERVAL '41 hours'),

-- Conversation between David and Lisa
('msg_13', 'match_3', 'user_male_3', 'user_female_3', 'Hi Lisa! Fellow animal lover here! Max (my golden retriever) would love to meet Luna and Milo. How long have you been a vet? 🐕', NOW() - INTERVAL '10 hours'),
('msg_14', 'match_3', 'user_female_3', 'user_male_3', 'Hi David! Max sounds adorable! I have been practicing for 3 years now and I absolutely love it. Golden retrievers are such sweethearts! Does Max like other animals? 🐱', NOW() - INTERVAL '9 hours'),
('msg_15', 'match_3', 'user_male_3', 'user_female_3', 'Max is super friendly with everyone! He actually has a cat best friend at the dog park. I think he would get along great with Luna and Milo. Maybe we could arrange a playdate?', NOW() - INTERVAL '8 hours'),
('msg_16', 'match_3', 'user_female_3', 'user_male_3', 'That would be wonderful! Luna is pretty social but Milo is a bit shy. There is a great dog park near me with a separate area for cats too. Perfect for introductions! 😸', NOW() - INTERVAL '7 hours'),
('msg_17', 'match_3', 'user_male_3', 'user_female_3', 'Perfect! How about this weekend? We could grab coffee after and you can tell me more about your rescue work. I have been thinking about volunteering too.', NOW() - INTERVAL '6 hours');
