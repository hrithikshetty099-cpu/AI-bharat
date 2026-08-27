import { indianPlaces as legacyPlaces } from './indianPlaces.js'

const destinationImages = {
  'Mysore Palace': 'https://commons.wikimedia.org/wiki/Special:FilePath/Mysore%20Palace%20at%20night.jpg',
  Hampi: 'https://commons.wikimedia.org/wiki/Special:FilePath/Virupaksha%20Temple%2C%20Hampi.jpg',
  'Gokarna Beaches': 'https://commons.wikimedia.org/wiki/Special:FilePath/Om%20Beach%2C%20Gokarna.jpg',
  'Panambur Beach': 'https://commons.wikimedia.org/wiki/Special:FilePath/Panambur%20Beach.jpg',
  'Shore Temple': 'https://commons.wikimedia.org/wiki/Special:FilePath/Shore%20Temple%20-%20Mamallapuram%20-%20Tamil%20Nadu%20-%20India.jpg',
  'Gateway of India': 'https://commons.wikimedia.org/wiki/Special:FilePath/Gateway%20of%20India%20in%20Mumbai%2003-2016%20img3.jpg',
  'Meenakshi Amman Temple': 'https://commons.wikimedia.org/wiki/Special:FilePath/Meenakshi%20Amman%20Temple%2C%20Madurai.jpg',
  'Fort Kochi': 'https://commons.wikimedia.org/wiki/Special:FilePath/Chinese%20fishing%20nets%20at%20Fort%20Kochi.jpg',
}

export const states = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry']

const karnatakaAdditions = [
  ['jog-falls', 'Jog Falls', 'Shivamogga', 'Waterfall', 'One of India\'s highest plunge waterfalls in the forested Sharavathi valley.', 14.2297, 74.8069, 0, 4, ['Nature', 'Waterfall', 'Photography'], false],
  ['dudhsagar-karnataka', 'Dudhsagar Viewpoint', 'Belagavi', 'Waterfall', 'A dramatic monsoon cascade reached through the Western Ghats.', 15.3144, 74.3144, 100, 4, ['Nature', 'Waterfall', 'Adventure'], false],
  ['kudremukh', 'Kudremukh National Park', 'Chikkamagaluru', 'Wildlife', 'Rolling grasslands, rainforest trails, and an iconic mountain ridge.', 13.195, 75.353, 200, 6, ['Nature', 'Adventure', 'Wildlife'], false],
  ['chikmagalur-mullayanagiri', 'Mullayanagiri', 'Chikkamagaluru', 'Adventure', 'Karnataka\'s highest peak with cool air and sweeping hill views.', 13.3902, 75.718, 50, 4, ['Nature', 'Adventure', 'Photography'], false],
  ['belur-temple', 'Chennakeshava Temple', 'Hassan', 'Heritage', 'A Hoysala masterpiece of stone sculpture and living worship.', 13.1656, 75.865, 40, 2, ['History', 'Heritage', 'Photography'], true],
  ['halebidu', 'Hoysaleswara Temple', 'Hassan', 'Heritage', 'Intricate Hoysala carvings set among quiet historic landscapes.', 13.2129, 75.994, 40, 2, ['History', 'Heritage', 'Photography'], true],
  ['bandipur', 'Bandipur Tiger Reserve', 'Chamarajanagar', 'Wildlife', 'A protected Nilgiri landscape known for elephants and forest safaris.', 11.667, 76.63, 850, 5, ['Wildlife', 'Nature', 'Photography'], true],
  ['biligiriranga', 'BRT Wildlife Sanctuary', 'Chamarajanagar', 'Wildlife', 'Hill forests and wildlife corridors at the meeting of two mountain ranges.', 11.982, 77.135, 500, 5, ['Wildlife', 'Nature', 'Adventure'], false],
  ['skandagiri', 'Skandagiri Hills', 'Chikkaballapur', 'Adventure', 'A popular night trek to sunrise views over the Deccan plateau.', 13.4846, 77.6838, 500, 5, ['Adventure', 'Nature', 'Photography'], false],
  ['shivagange', 'Shivagange', 'Tumakuru', 'Spiritual', 'A hill pilgrimage with rock formations and panoramic trails.', 13.171, 77.228, 100, 4, ['Spiritual', 'Adventure', 'Nature'], true],
  ['shivanasamudra', 'Shivanasamudra Falls', 'Mandya', 'Waterfall', 'Twin waterfalls and river islands in the Cauvery landscape.', 12.293, 77.17, 50, 4, ['Nature', 'Waterfall', 'Photography'], true],
  ['ramanagara-hills', 'Ramanagara Hills', 'Ramanagara', 'Adventure', 'Granite hills made famous by climbing, trekking, and birdlife.', 12.721, 77.281, 150, 4, ['Adventure', 'Nature', 'Photography'], false],
  ['chitradurga-fort', 'Chitradurga Fort', 'Chitradurga', 'Heritage', 'A vast layered fort of gateways, boulders, and local legends.', 14.2267, 76.398, 50, 4, ['History', 'Heritage', 'Photography'], true],
  ['pattadakal', 'Pattadakal', 'Bagalkote', 'Heritage', 'UNESCO-listed temples showing the evolution of Indian architecture.', 15.948, 75.816, 40, 3, ['History', 'Heritage', 'Photography'], true],
  ['badami-caves', 'Badami Cave Temples', 'Bagalkote', 'Heritage', 'Rock-cut cave temples rising above an ochre sandstone lake.', 15.9186, 75.676, 40, 3, ['History', 'Heritage', 'Photography'], true],
  ['aihole', 'Aihole', 'Bagalkote', 'Heritage', 'An open-air school of early Chalukyan temple architecture.', 16.021, 75.883, 35, 3, ['History', 'Heritage', 'Photography'], true],
  ['vijayapura-gol-gumbaz', 'Gol Gumbaz', 'Vijayapura', 'Heritage', 'A monumental Deccan mausoleum with a famous whispering gallery.', 16.83, 75.71, 25, 2, ['History', 'Heritage', 'Photography'], true],
  ['bidar-fort', 'Bidar Fort', 'Bidar', 'Heritage', 'A striking hilltop fort with Bahmani-era gateways and palaces.', 17.913, 77.53, 25, 3, ['History', 'Heritage', 'Photography'], true],
  ['sannati', 'Sannati Buddhist Site', 'Kalaburagi', 'Heritage', 'An important archaeological landscape connected with Buddhist history.', 16.765, 76.91, 20, 2, ['History', 'Heritage'], true],
  ['anegundi', 'Anegundi', 'Koppal', 'Heritage', 'A riverside village of legends, craft traditions, and ancient ruins.', 15.347, 76.47, 40, 4, ['History', 'Heritage', 'Photography'], true],
  ['dandeli', 'Dandeli Wildlife Sanctuary', 'Uttara Kannada', 'Wildlife', 'River forests, hornbills, and adventure on the Kali landscape.', 15.247, 74.618, 700, 6, ['Wildlife', 'Adventure', 'Nature'], false],
  ['om-beach', 'Om Beach', 'Uttara Kannada', 'Beach', 'A distinctive shoreline with coastal trails and sunset views.', 14.515, 74.319, 100, 4, ['Beach', 'Nature', 'Photography'], true],
  ['st-marys-island', 'St. Mary\'s Island', 'Udupi', 'Beach', 'Basalt formations and clear coastal views off Malpe.', 13.36, 74.68, 300, 4, ['Beach', 'Nature', 'Photography'], true],
  ['kapu-lighthouse', 'Kapu Lighthouse', 'Udupi', 'Beach', 'A historic lighthouse above a broad Arabian Sea beach.', 13.221, 74.742, 50, 2, ['Beach', 'Photography', 'Family'], true],
  ['pilikula', 'Pilikula Nisargadhama', 'Dakshina Kannada', 'Wildlife', 'An integrated nature park with a zoo, lake, and heritage village.', 12.94, 74.941, 150, 4, ['Wildlife', 'Family', 'Nature'], true],
  ['sultan-battery', 'Sultan Battery', 'Dakshina Kannada', 'Heritage', 'A coastal watchtower and gateway to Mangaluru river views.', 12.89, 74.844, 20, 2, ['History', 'Heritage', 'Photography'], true],
  ['madikeri-fort', 'Madikeri Fort', 'Kodagu', 'Heritage', 'A hill-town fort with museum rooms and views across Kodagu.', 12.421, 75.738, 20, 2, ['History', 'Heritage', 'Photography'], true],
  ['iruppu-falls', 'Iruppu Falls', 'Kodagu', 'Waterfall', 'A forest waterfall near the Brahmagiri hills and pilgrimage routes.', 11.965, 75.92, 50, 4, ['Nature', 'Waterfall', 'Adventure'], false],
  ['nandi-hills', 'Nandi Hills', 'Chikkaballapur', 'Nature', 'A cool hill escape for sunrise, cycling, and wide valley views.', 13.3702, 77.6835, 100, 4, ['Nature', 'Photography', 'Family'], true],
  ['kaivara', 'Kaivara', 'Kolar', 'Spiritual', 'A quiet heritage and spiritual landscape east of Bengaluru.', 13.421, 77.863, 50, 3, ['Spiritual', 'Heritage', 'Nature'], true],
  ['hampi-vittala', 'Vijaya Vittala Temple', 'Vijayanagara', 'Heritage', 'The iconic stone chariot and musical pillars of Hampi.', 15.335, 76.47, 40, 3, ['History', 'Heritage', 'Photography'], true],
]

const toRecord = ([id, name, district, category, description, latitude, longitude, _entryFee, hours, tags, familyFriendly]) => ({ id, name, state: 'Karnataka', district, city: district, description, category, latitude, longitude, image: '', image_url: '', image_source: 'India-themed placeholder; destination image unavailable', image_license: 'Placeholder artwork', image_attribution: '', rating: 4.2, popularity: 70, estimatedVisitDuration: hours, estimatedVisitHours: hours, entryFee: null, estimatedCost: 0, entryFeeIndian: null, entryFeeForeigner: null, priceCurrency: 'INR', priceSource: 'Information unavailable', priceLastVerified: null, priceStatus: 'UNAVAILABLE', officialVerified: false, officialAuthority: '', officialSourceUrl: '', verificationDate: null, verificationStatus: 'UNAVAILABLE', openingTime: '06:00', closingTime: '18:00', bestTimeToVisit: 'October to March', bestSeason: 'October to March', indoorOutdoor: category === 'Heritage' && familyFriendly ? 'Indoor / Outdoor' : 'Outdoor', familyFriendly, adventureLevel: tags.includes('Adventure') ? 'High' : 'Low', budgetLevel: 'UNAVAILABLE', interests: tags, tags })

export const touristPlaces = [...legacyPlaces.map((place) => ({ ...place, district: place.district || place.city, entryFee: place.entryFee ?? null, estimatedVisitDuration: place.estimatedVisitDuration || place.estimatedVisitHours, openingTime: place.openingTime || '06:00', closingTime: place.closingTime || 'Information unavailable', bestTimeToVisit: place.bestTimeToVisit || place.bestSeason || 'Information unavailable', rating: place.rating || 4.2, popularity: place.popularity || 70, tags: place.tags || place.interests, image_url: place.image_url || destinationImages[place.name] || '', image_source: place.image_source || (destinationImages[place.name] ? 'Wikimedia Commons; destination-specific file' : 'India-themed placeholder; destination image unavailable'), image_license: place.image_license || (destinationImages[place.name] ? 'Check Wikimedia Commons file license' : 'Placeholder artwork'), image_attribution: place.image_attribution || (destinationImages[place.name] ? 'Wikimedia Commons' : ''), entryFeeIndian: place.entryFeeIndian ?? null, entryFeeForeigner: place.entryFeeForeigner ?? null, priceCurrency: place.priceCurrency || 'INR', priceSource: place.priceSource || 'Information unavailable', priceLastVerified: place.priceLastVerified || null, priceStatus: place.priceStatus || 'UNAVAILABLE', officialVerified: Boolean(place.officialVerified), officialAuthority: place.officialAuthority || '', officialSourceUrl: place.officialSourceUrl || '', verificationDate: place.verificationDate || null, verificationStatus: place.verificationStatus || 'UNAVAILABLE', adventureLevel: place.adventureLevel || (place.interests?.includes('Adventure') ? 'High' : 'Low'), budgetLevel: place.budgetLevel || 'UNAVAILABLE' })), ...karnatakaAdditions.map(toRecord)]
export const districts = [...new Set(touristPlaces.map((place) => place.district))].sort()
export const touristCategories = [...new Set(touristPlaces.flatMap((place) => [place.category, ...(place.tags || [])]))].sort()

export function searchTouristPlaces(query = '') {
  const terms = query.toLowerCase().replace(/[^a-z0-9₹ ]/g, ' ').split(/\s+/).filter(Boolean)
  if (!terms.length) return touristPlaces
  return touristPlaces.map((place) => {
    const haystack = [place.name, place.state, place.district, place.city, place.category, place.description, ...(place.tags || [])].join(' ').toLowerCase()
    const score = terms.reduce((total, term) => total + (haystack.includes(term) ? (place.name.toLowerCase().includes(term) ? 4 : 1) : 0), 0)
    return { ...place, searchScore: score }
  }).filter((place) => place.searchScore > 0).sort((a, b) => b.searchScore - a.searchScore)
}
