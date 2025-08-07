import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // Only allow seeding in development
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Seeding only allowed in development' }, { status: 403 })
    }

    // Clear existing data
    await prisma.chatMessage.deleteMany()
    await prisma.match.deleteMany()
    await prisma.like.deleteMany()
    await prisma.photo.deleteMany()
    await prisma.user.deleteMany()

    // Create male users
    const maleUsers = await Promise.all([
      prisma.user.create({
        data: {
          id: 'user_male_1',
          telegramId: '1001',
          firstName: 'Alex',
          fullName: 'Alex Johnson',
          age: 25,
          gender: 'MALE',
          bio: 'Adventure seeker 🏔️ Love hiking, photography, and discovering hidden gems. Always up for spontaneous road trips and deep conversations under the stars. Looking for someone who shares my passion for exploring the world!',
          latitude: 40.7128,
          longitude: -74.0060,
        }
      }),
      prisma.user.create({
        data: {
          id: 'user_male_2',
          telegramId: '1002',
          firstName: 'Mike',
          fullName: 'Mike Chen',
          age: 28,
          gender: 'MALE',
          bio: 'Software engineer by day, chef by night 👨‍💻🍳 I create apps and amazing dishes with equal passion. Love trying new cuisines and cooking for friends. Seeking someone who appreciates good food and great company!',
          latitude: 40.7589,
          longitude: -73.9851,
        }
      }),
      prisma.user.create({
        data: {
          id: 'user_male_3',
          telegramId: '1003',
          firstName: 'David',
          fullName: 'David Smith',
          age: 30,
          gender: 'MALE',
          bio: 'Fitness enthusiast and dog dad 🐕💪 My golden retriever Max is my workout buddy and best friend. Believe in staying active and living life to the fullest. Looking for someone who loves animals and healthy living!',
          latitude: 40.7505,
          longitude: -73.9934,
        }
      }),
    ])

    // Create female users
    const femaleUsers = await Promise.all([
      prisma.user.create({
        data: {
          id: 'user_female_1',
          telegramId: '2001',
          firstName: 'Emma',
          fullName: 'Emma Davis',
          age: 24,
          gender: 'FEMALE',
          bio: 'Yoga instructor and mindfulness coach 🧘‍♀️✨ I find beauty in simple moments and believe in the power of mindful living. Love sunrise yoga sessions and deep conversations. Seeking someone who values inner peace and growth!',
          latitude: 40.7282,
          longitude: -73.9942,
        }
      }),
      prisma.user.create({
        data: {
          id: 'user_female_2',
          telegramId: '2002',
          firstName: 'Sarah',
          fullName: 'Sarah Miller',
          age: 27,
          gender: 'FEMALE',
          bio: 'Marketing professional with wanderlust 📱🌎 I create campaigns by day and plan adventures by night. Love hiking, beaches, and exploring new cities. Looking for a partner in both work and wanderlust!',
          latitude: 40.7505,
          longitude: -73.9934,
        }
      }),
      prisma.user.create({
        data: {
          id: 'user_female_3',
          telegramId: '2003',
          firstName: 'Lisa',
          fullName: 'Lisa Garcia',
          age: 25,
          gender: 'FEMALE',
          bio: 'Veterinarian and animal rescue advocate 🐱🐶 My cats Luna and Milo rule my heart, but there is room for one more special someone. Passionate about animal welfare and cozy movie nights. Seeking a fellow animal lover!',
          latitude: 40.7831,
          longitude: -73.9712,
        }
      }),
    ])

    // Create photos for users
    await Promise.all([
      // Male user photos
      prisma.photo.create({
        data: {
          userId: 'user_male_1',
          publicId: 'sample_male_1_main',
          secureUrl: '/placeholder-ur8cf.png',
          isMain: true,
        }
      }),
      prisma.photo.create({
        data: {
          userId: 'user_male_1',
          publicId: 'sample_male_1_2',
          secureUrl: '/man-with-camera-photography.png',
          isMain: false,
        }
      }),
      prisma.photo.create({
        data: {
          userId: 'user_male_2',
          publicId: 'sample_male_2_main',
          secureUrl: '/asian-man-cooking-kitchen.png',
          isMain: true,
        }
      }),
      prisma.photo.create({
        data: {
          userId: 'user_male_3',
          publicId: 'sample_male_3_main',
          secureUrl: '/placeholder-16wkg.png',
          isMain: true,
        }
      }),
      // Female user photos
      prisma.photo.create({
        data: {
          userId: 'user_female_1',
          publicId: 'sample_female_1_main',
          secureUrl: '/woman-yoga-sunset.png',
          isMain: true,
        }
      }),
      prisma.photo.create({
        data: {
          userId: 'user_female_1',
          publicId: 'sample_female_1_2',
          secureUrl: '/peaceful-meditation.png',
          isMain: false,
        }
      }),
      prisma.photo.create({
        data: {
          userId: 'user_female_2',
          publicId: 'sample_female_2_main',
          secureUrl: '/professional-woman-marketing.png',
          isMain: true,
        }
      }),
      prisma.photo.create({
        data: {
          userId: 'user_female_3',
          publicId: 'sample_female_3_main',
          secureUrl: '/veterinarian-woman-cats.png',
          isMain: true,
        }
      }),
    ])

    // Create likes
    await Promise.all([
      prisma.like.create({
        data: {
          senderId: 'user_male_1',
          receiverId: 'user_female_1',
        }
      }),
      prisma.like.create({
        data: {
          senderId: 'user_female_1',
          receiverId: 'user_male_1',
        }
      }),
      prisma.like.create({
        data: {
          senderId: 'user_male_2',
          receiverId: 'user_female_2',
        }
      }),
      prisma.like.create({
        data: {
          senderId: 'user_female_2',
          receiverId: 'user_male_2',
        }
      }),
    ])

    // Create matches
    const matches = await Promise.all([
      prisma.match.create({
        data: {
          id: 'match_1',
          senderId: 'user_male_1',
          receiverId: 'user_female_1',
        }
      }),
      prisma.match.create({
        data: {
          id: 'match_2',
          senderId: 'user_male_2',
          receiverId: 'user_female_2',
        }
      }),
    ])

    // Create chat messages
    await Promise.all([
      prisma.chatMessage.create({
        data: {
          matchId: 'match_1',
          senderId: 'user_male_1',
          receiverId: 'user_female_1',
          content: 'Hey Emma! I saw you love yoga, I just started practicing too! 🧘‍♂️',
        }
      }),
      prisma.chatMessage.create({
        data: {
          matchId: 'match_1',
          senderId: 'user_female_1',
          receiverId: 'user_male_1',
          content: 'Hi Alex! That\'s awesome! How are you finding it so far? It can be challenging at first but so rewarding! ✨',
        }
      }),
      prisma.chatMessage.create({
        data: {
          matchId: 'match_2',
          senderId: 'user_male_2',
          receiverId: 'user_female_2',
          content: 'Hi Sarah! I noticed you love adventures. What\'s your favorite hiking spot? 🥾',
        }
      }),
    ])

    return NextResponse.json({ 
      message: 'Database seeded successfully!',
      users: maleUsers.length + femaleUsers.length,
      matches: matches.length
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 })
  }
}
