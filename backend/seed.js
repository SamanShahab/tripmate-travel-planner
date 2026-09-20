const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Destination = require('./models/Destination');

const destinations = [
  {
    name: 'Hunza Valley',
    country: 'Pakistan',
    description: 'A breathtaking mountain valley in the Karakoram range, known for its stunning landscapes, ancient forts, and warm hospitality.',
    image: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=1200',
    images: ['https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800'],
    category: 'Mountains',
    bestTimeToVisit: 'April to October',
    estimatedDailyBudget: 50,
    currency: 'USD',
    featured: true,
    rating: 4.9,
    places: [
      { name: 'Baltit Fort', description: 'Ancient fort with panoramic views', type: 'sightseeing' },
      { name: 'Attabad Lake', description: 'Stunning turquoise lake', type: 'nature' },
      { name: 'Karimabad Bazaar', description: 'Local market with handicrafts', type: 'culture' },
    ],
    travelTips: ['Carry warm clothes even in summer', 'Book accommodation in advance', 'Try local apricots and dry fruits'],
  },
  {
    name: 'Skardu',
    country: 'Pakistan',
    description: 'Gateway to the world\'s highest peaks, Skardu offers dramatic landscapes, ancient ruins, and access to K2 base camp.',
    image: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=1200',
    images: ['https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800'],
    category: 'Adventure',
    bestTimeToVisit: 'May to September',
    estimatedDailyBudget: 60,
    currency: 'USD',
    featured: true,
    rating: 4.8,
    places: [
      { name: 'Shangrila Resort', description: 'Beautiful lake resort', type: 'nature' },
      { name: 'Deosai Plains', description: 'World\'s second highest plateau', type: 'adventure' },
      { name: 'Skardu Fort', description: 'Historic Mughal-era fort', type: 'sightseeing' },
    ],
    travelTips: ['Acclimatize before trekking', 'Hire local guides', 'Carry cash as ATMs are limited'],
  },
  {
    name: 'Istanbul',
    country: 'Turkey',
    description: 'Where East meets West — a city of minarets, bazaars, Byzantine history, and incredible food straddling two continents.',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200',
    images: ['https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800'],
    category: 'Culture',
    bestTimeToVisit: 'April to May, September to November',
    estimatedDailyBudget: 80,
    currency: 'USD',
    featured: true,
    rating: 4.7,
    places: [
      { name: 'Hagia Sophia', description: 'Iconic Byzantine cathedral-mosque', type: 'sightseeing' },
      { name: 'Grand Bazaar', description: 'One of the world\'s oldest covered markets', type: 'culture' },
      { name: 'Bosphorus Cruise', description: 'Scenic boat tour between continents', type: 'activity' },
    ],
    travelTips: ['Get an Istanbulkart for transport', 'Visit mosques outside prayer times', 'Try simit and Turkish tea'],
  },
  {
    name: 'Dubai',
    country: 'UAE',
    description: 'A city of superlatives — tallest buildings, largest malls, and a seamless blend of ultramodern architecture and desert heritage.',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200',
    images: ['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800'],
    category: 'Adventure',
    bestTimeToVisit: 'November to March',
    estimatedDailyBudget: 150,
    currency: 'USD',
    featured: true,
    rating: 4.6,
    places: [
      { name: 'Burj Khalifa', description: 'World\'s tallest building', type: 'sightseeing' },
      { name: 'Dubai Mall', description: 'Massive shopping and entertainment complex', type: 'activity' },
      { name: 'Desert Safari', description: 'Dune bashing and Bedouin camp experience', type: 'adventure' },
    ],
    travelTips: ['Book Burj Khalifa tickets in advance', 'Dress modestly in public areas', 'Use the Metro to avoid traffic'],
  },
  {
    name: 'Bali',
    country: 'Indonesia',
    description: 'Island of the Gods — lush rice terraces, ancient temples, world-class surf, and a deeply spiritual culture.',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200',
    images: ['https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800'],
    category: 'Beaches',
    bestTimeToVisit: 'April to October',
    estimatedDailyBudget: 70,
    currency: 'USD',
    featured: true,
    rating: 4.8,
    places: [
      { name: 'Ubud Rice Terraces', description: 'Iconic stepped rice paddies', type: 'nature' },
      { name: 'Tanah Lot Temple', description: 'Sea temple on a rocky outcrop', type: 'culture' },
      { name: 'Seminyak Beach', description: 'Trendy beach with great sunsets', type: 'nature' },
    ],
    travelTips: ['Rent a scooter to explore', 'Respect temple dress codes', 'Bargain at local markets'],
  },
  {
    name: 'Lahore',
    country: 'Pakistan',
    description: 'The cultural heart of Pakistan — Mughal architecture, vibrant food streets, and a city that never sleeps.',
    image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=1200',
    images: ['https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800'],
    category: 'Culture',
    bestTimeToVisit: 'October to March',
    estimatedDailyBudget: 30,
    currency: 'USD',
    featured: false,
    rating: 4.5,
    places: [
      { name: 'Badshahi Mosque', description: 'Magnificent Mughal-era mosque', type: 'sightseeing' },
      { name: 'Lahore Fort', description: 'UNESCO World Heritage Site', type: 'sightseeing' },
      { name: 'Food Street', description: 'Famous street food experience', type: 'food' },
    ],
    travelTips: ['Visit Walled City on foot', 'Try nihari and halwa puri for breakfast', 'Evenings at Anarkali Bazaar'],
  },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Destination.deleteMany({});
  await Destination.insertMany(destinations);
  console.log('Destinations seeded successfully!');
  process.exit();
};

seed().catch(console.error);
