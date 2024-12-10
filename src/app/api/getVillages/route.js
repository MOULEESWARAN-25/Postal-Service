import connectToDatabase from "../../../lib/mongoose";
import Village from "../../../models/Village";

export async function POST(req) {
  await connectToDatabase();

  try {
    const body = await req.json();
    const { District } = body;

    console.log("state", District);

    if (!District) {
      return new Response(
        JSON.stringify({ error: 'District parameter is required' }),
        { status: 400 }
      );
    }

    // Filter villages by District
    const Villages = await Village.distinct("name", { District });

    // Limit the number of villages returned
    const limitedVillages = Villages.slice(0, 10);

    return new Response(
      JSON.stringify({ matches: limitedVillages }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error('Error reading district data:', error);
    return new Response(
      JSON.stringify({ error: "Error fetching District." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
