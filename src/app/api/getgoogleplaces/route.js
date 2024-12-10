// app/api/getgoogleplaces/route.js
export async function POST(request) {
  try {
    // Parse the request body
    const { address } = await request.json();

    // Validate input
    if (!address) {
      return new Response(JSON.stringify({ error: 'Address is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    console.log(address);
    // Geocoding API call
    const geocodeResponse = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
      { method: 'GET' }
    );
    const geocodeData = await geocodeResponse.json();

    // Check if geocoding was successful
    if (geocodeData.status !== 'OK') {
      return new Response(JSON.stringify({ error: `Could not geocode the address: ${geocodeData.error}` }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Extract coordinates of the input address
    const { lat, lng } = geocodeData.results[0].geometry.location;

    // Nearby Places API call
    const nearbyResponse = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=50000&type=post_office&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
      { method: 'GET' }
    );
    const nearbyData = await nearbyResponse.json();

    // Process and filter nearby post offices
    const postOffices = nearbyData.results.map((office) => {
      // Calculate distance using Haversine formula
      const officeLocation = office.geometry.location;
      const distance = calculateDistance(
        { lat, lng },
        { lat: officeLocation.lat, lng: officeLocation.lng }
      );

      return {
        name: office.name,
        vicinity: office.vicinity,
        location: officeLocation,
        distance: Number(distance.toFixed(2)) // Round to 2 decimal places
      };
    }).sort((a, b) => a.distance - b.distance); // Sort by distance

    // Return successful response
    return new Response(JSON.stringify(postOffices), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error finding post offices:', error);
    
    // Return error response
    return new Response(JSON.stringify({ error: 'Failed to find post offices' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Haversine formula to calculate distance between two coordinates
function calculateDistance(coord1, coord2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(coord2.lat - coord1.lat);
  const dLon = toRadians(coord2.lng - coord1.lng);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRadians(coord1.lat)) * Math.cos(toRadians(coord2.lat)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function toRadians(degrees) {
  return degrees * (Math.PI/180);
}

// Optional: Handle other HTTP methods
export async function GET() {
  return new Response(JSON.stringify({ error: 'Only POST method is supported' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' }
  });
}