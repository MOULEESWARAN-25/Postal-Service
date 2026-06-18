import connectToDatabase from "@/lib/mongoose";
import Village from "@/models/Village";

// Deduplicate results by tru field (Total/Rural/Urban)
const dedupeByTru = (arr) =>
  Array.from(new Map(arr.map((v) => [v.tru, v])).values());

// Try queries in order — return first non-empty result set
async function findWithFallback(queries) {
  for (const query of queries) {
    const results = await Village.find(query);
    if (results && results.length > 0) {
      return dedupeByTru(results);
    }
  }
  return [];
}

export async function POST(req) {
  await connectToDatabase();

  try {
    const body = await req.json();
    const { address } = body;

    if (!address) {
      return new Response(
        JSON.stringify({ success: false, message: "Address not found." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { State, District, Village: village, SubPostOffice, PostOffice, name } = address;

    if (!State && !District && !village && !SubPostOffice && !PostOffice && !name) {
      return new Response(
        JSON.stringify({ success: false, message: "All address fields are empty." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    let results = [];

    // Village level (most specific) — fallback chain: village → district → INDIA
    if (village) {
      results = await findWithFallback([
        { name: new RegExp(`^${village}$`, "i"), district: new RegExp(`^${District}$`, "i") },
        { name: new RegExp(`\\b${village}\\b`, "i") },
        { name: new RegExp(`^${District}$`, "i") },
        { name: /^INDIA$/i },
      ]);
    }

    // Post Office level — try SP sub-district → district → INDIA
    else if (PostOffice && SubPostOffice && District) {
      const spName = SubPostOffice.split(" ")[0].replace("Sathiyamangalam", "Sathyamangalam");
      results = await findWithFallback([
        {
          $or: [
            { name: new RegExp(`\\b${spName}\\b`, "i") },
            { subDistrict: new RegExp(`\\b${spName}\\b`, "i") },
          ],
          district: new RegExp(`\\b${District}\\b`, "i"),
        },
        { name: new RegExp(`^${District}$`, "i") },
        { name: /^INDIA$/i },
      ]);
    }

    // Sub Post Office level
    else if (SubPostOffice && District) {
      const spName = SubPostOffice.split(" ")[0].replace("Sathiyamangalam", "Sathyamangalam");
      results = await findWithFallback([
        {
          $or: [
            { name: new RegExp(`\\b${spName}\\b`, "i") },
            { subDistrict: new RegExp(`\\b${spName}\\b`, "i") },
          ],
          district: new RegExp(`\\b${District}\\b`, "i"),
        },
        { name: new RegExp(`^${District}$`, "i") },
        { name: /^INDIA$/i },
      ]);
    }

    // District level
    else if (District) {
      results = await findWithFallback([
        { name: new RegExp(`^${District}$`, "i") },
        { name: /^INDIA$/i },
      ]);
    }

    // State level
    else if (State) {
      results = await findWithFallback([
        { name: new RegExp(`^${State}$`, "i") },
        { name: /^INDIA$/i },
      ]);
    }

    // Name level (e.g. INDIA)
    else if (name) {
      results = await findWithFallback([
        { name: new RegExp(`^${name}$`, "i") },
        { name: /^INDIA$/i },
      ]);
    }

    if (!results || results.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "No demographic data found for this location." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.warn("Error occurred while fetching demographics:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error.", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
