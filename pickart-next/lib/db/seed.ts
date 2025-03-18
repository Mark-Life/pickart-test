import { db } from './index'
import { 
  countries,
  propertyTypes,
  bankAccounts,
  users,
  artists,
  hosts,
  properties,
  propertyPhotos,
  spots,
  spotPhotos,
  artworks,
  artworkPhotos,
  artworkSpotAllocations,
  registrationApprovals,
  propertyAdmins
} from './schema'
import { v4 as uuidv4 } from 'uuid'
import { sql } from 'drizzle-orm'

async function seed() {
  console.log('🌱 Starting seed...')

  // Clear existing data
  console.log('Clearing existing data...')
  await db.delete(artworkSpotAllocations)
  await db.delete(artworkPhotos)
  await db.delete(spotPhotos)
  await db.delete(propertyPhotos)
  await db.delete(artworks)
  await db.delete(spots)
  await db.delete(propertyAdmins)
  await db.delete(properties)
  await db.delete(artists)
  await db.delete(hosts)
  await db.delete(registrationApprovals)
  await db.delete(users)
  await db.delete(bankAccounts)
  await db.delete(propertyTypes)
  await db.delete(countries)

  // Seed countries
  console.log('Seeding countries...')
  await db.insert(countries).values([
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'FR', name: 'France' },
    { code: 'DE', name: 'Germany' },
    { code: 'IT', name: 'Italy' }
  ])

  // Seed property types
  console.log('Seeding property types...')
  await db.insert(propertyTypes).values([
    { name: 'hotel', description: 'Hotel properties' },
    { name: 'restaurant', description: 'Restaurant venues' },
    { name: 'gallery', description: 'Art galleries' },
    { name: 'office', description: 'Office spaces' }
  ])

  // Seed bank accounts
  console.log('Seeding bank accounts...')
  const [bankAccount1] = await db.insert(bankAccounts)
    .values([
      {
        accountName: 'John Smith Art',
        accountAddress: '123 Art St, New York',
        accountNumber: '1234567890',
        countryCode: 'US'
      },
      {
        accountName: 'Luxury Hotels Group',
        accountAddress: '456 Hotel Ave, London',
        accountNumber: '0987654321',
        countryCode: 'GB'
      }
    ])
    .returning()

  // Seed users
  console.log('Seeding users...')
  const [artistUser, hostUser, adminUser] = await db.insert(users)
    .values([
      {
        id: uuidv4(),
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@example.com',
        phone: '+1234567890',
        address: '123 Art St, New York',
        countryCode: 'US',
        role: 'artist'
      },
      {
        id: uuidv4(),
        firstName: 'Emma',
        lastName: 'Wilson',
        email: 'emma.wilson@example.com',
        phone: '+4407123456789',
        address: '456 Hotel Ave, London',
        countryCode: 'GB',
        role: 'host'
      },
      {
        id: uuidv4(),
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@pickart.com',
        phone: '+1987654321',
        address: '789 Admin Rd, New York',
        countryCode: 'US',
        role: 'admin'
      }
    ])
    .returning()

  // Seed artists
  console.log('Seeding artists...')
  const [artist] = await db.insert(artists)
    .values({
      id: artistUser.id,
      artistType: 'artist',
      displayName: 'John Smith',
      bankAccountId: bankAccount1.id,
      contractSigned: true
    })
    .returning()

  // Seed hosts
  console.log('Seeding hosts...')
  const [host] = await db.insert(hosts)
    .values({
      id: hostUser.id,
      hostType: 'owner',
      businessName: 'Luxury Hotels Group',
      bankAccountId: bankAccount1.id,
      contractSigned: true
    })
    .returning()

  // Seed properties
  console.log('Seeding properties...')
  const [property] = await db.insert(properties)
    .values({
      propertyId: 'LHG-LON-001',
      propertyName: 'Luxury Hotel London',
      streetAddress: '456 Hotel Ave',
      city: 'London',
      state: 'Greater London',
      postcode: 'SW1A 1AA',
      countryCode: 'GB',
      propertyType: 'hotel',
      sizeSqm: sql`5000.00`,
      totalFloors: 8,
      totalRooms: 150,
      ownerId: host.id,
      contactPhone: '+4407123456789'
    })
    .returning()

  // Seed property photos
  console.log('Seeding property photos...')
  await db.insert(propertyPhotos)
    .values({
      propertyId: property.id,
      storagePath: 'properties/LHG-LON-001/lobby.jpg',
      description: 'Hotel lobby'
    })

  // Seed spots
  console.log('Seeding spots...')
  const [spot] = await db.insert(spots)
    .values({
      spotId: 'LHG-LON-001-L1',
      propertyId: property.id,
      floorNumber: 1,
      roomName: 'Lobby',
      positionDescription: 'Main wall behind reception',
      preferredStyle: 'Contemporary',
      colorScheme: 'Neutral, Earth tones',
      fixtureMethod: 'wall_mount',
      maxWeightKg: sql`50.00`,
      maxWidthCm: sql`200.00`,
      maxHeightCm: sql`150.00`,
      maxDepthCm: sql`10.00`,
      preferredPriceRangeMin: sql`1000.00`,
      preferredPriceRangeMax: sql`5000.00`,
      status: 'live'
    })
    .returning()

  // Seed spot photos
  console.log('Seeding spot photos...')
  await db.insert(spotPhotos)
    .values({
      spotId: spot.id,
      storagePath: 'spots/LHG-LON-001-L1/wall.jpg',
      description: 'Lobby wall spot'
    })

  // Seed artworks
  console.log('Seeding artworks...')
  const [artwork] = await db.insert(artworks)
    .values({
      artworkId: 'JS-2024-001',
      artistId: artist.id,
      title: 'Urban Harmony',
      year: 2024,
      place: 'New York',
      description: 'A contemporary interpretation of urban architecture',
      style: 'Contemporary',
      medium: 'Oil on canvas',
      isUnique: true,
      widthCm: sql`150.00`,
      heightCm: sql`100.00`,
      depthCm: sql`5.00`,
      weightKg: sql`10.00`,
      price: sql`3500.00`,
      status: 'live',
      currentSpotId: spot.id
    })
    .returning()

  // Seed artwork photos
  console.log('Seeding artwork photos...')
  await db.insert(artworkPhotos)
    .values({
      artworkId: artwork.id,
      storagePath: 'artworks/JS-2024-001/main.jpg',
      isPrimary: true
    })

  // Seed artwork spot allocations
  console.log('Seeding artwork spot allocations...')
  await db.insert(artworkSpotAllocations)
    .values({
      artworkId: artwork.id,
      spotId: spot.id,
      allocatedBy: adminUser.id,
      allocatedAt: new Date(),
      deliveredAt: new Date(),
      liveAt: new Date()
    })

  // Seed registration approvals
  console.log('Seeding registration approvals...')
  await db.insert(registrationApprovals)
    .values([
      {
        userId: artistUser.id,
        approvedBy: adminUser.id,
        status: 'approved',
        notes: 'Professional artist with great portfolio'
      },
      {
        userId: hostUser.id,
        approvedBy: adminUser.id,
        status: 'approved',
        notes: 'Established hotel group'
      }
    ])

  // Seed property admins
  console.log('Seeding property admins...')
  await db.insert(propertyAdmins)
    .values({
      propertyId: property.id,
      userId: host.id
    })

  console.log('✅ Seed completed successfully!')
}

// Run the seed function
seed().catch((error) => {
  console.error('Error seeding database:', error)
  process.exit(1)
}) 