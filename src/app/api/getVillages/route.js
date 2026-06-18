import connectToDatabase from "@/lib/mongoose";
import Village from "@/models/Village";

export async function POST(req) {
  await connectToDatabase();

  try {
    const body = await req.json();
    const { District, postoffice } = body;

    if (!District) {
      return new Response(
        JSON.stringify({ error: 'District parameter is required' }),
        { status: 400 }
      );
    }

    // Try MongoDB first (has detailed data for Erode and similar)
    // Filter using lowercase "district" field and filter out aggregate rows
    const mongoVillages = await Village.distinct("name", {
      district: { $regex: new RegExp(`^${District}$`, "i") },
      // Only real village records: name != district (excludes district-level aggregates)
      $expr: { $ne: ["$name", "$district"] },
      // Also ensure subDistrict exists and is different from district
      subDistrict: { $exists: true, $ne: District }
    });

    if (mongoVillages && mongoVillages.length > 0) {
      const sorted = mongoVillages
        .filter(v => v && v.trim().length > 0)
        .sort((a, b) => a.localeCompare(b));

      return new Response(
        JSON.stringify({ matches: sorted, source: "db" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Fallback: use India Postal API to get post office names as villages
    // This covers ALL districts across India
    const postalRes = await fetch(`https://api.postalpincode.in/postoffice/${District}`);
    const postalData = await postalRes.json();

    if (postalData[0]?.Status === "Success") {
      const postOffices = postalData[0].PostOffice || [];

      // Filter by postoffice division if selected
      let filtered = postOffices;
      if (postoffice) {
        filtered = postOffices.filter(o => 
          o.Division?.toLowerCase() === postoffice.toLowerCase() ||
          o.Name?.toLowerCase() === postoffice.toLowerCase()
        );
      }

      const names = [...new Set(filtered.map(o => o.Name))]
        .filter(n => n && n.trim().length > 0)
        .sort((a, b) => a.localeCompare(b));

      return new Response(
        JSON.stringify({ matches: names, source: "postal_api" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Nothing found
    return new Response(
      JSON.stringify({ matches: [], source: "none" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Error fetching villages:', error);
    return new Response(
      JSON.stringify({ error: "Error fetching villages." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
