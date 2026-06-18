import connectToDatabase from "@/lib/mongoose";
import Event from "@/models/Event";

export async function GET(request) {
  await connectToDatabase();

  const url = new URL(request.url);
  const district = url.searchParams.get('district');

  try {
    const query = {};
    if (district && district !== 'Holiday') {
      query.district = { $regex: new RegExp(`^${district}$`, 'i') };
    }

    const events = await Event.find(query).sort({ date: 1 });

    return new Response(JSON.stringify({
      success: true,
      events
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
