import connectToDatabase from "../../../lib/mongoose";
import Village from "../../../models/Village";

export async function POST(req) {
  await connectToDatabase();

 

  

  try {

    const body = await req.json();
    const { state } = body;

    console.log("state",state);

    if (!state) {
        return new Response(
          JSON.stringify({ error: 'State parameter is required' }),
          { status: 400 }
        );
      }
   
// for future use it i had all data of states

    // // Find first 10 documents without duplicates Districts
    // const filter = { District: { $regex: state, $options: "i" } };
    // const districts = await Village.distinct("District", filter).limit(10);
    
    const districts = await Village.distinct("District");
    console.log("districts",districts);
    const limitedDistricts = districts.slice(0, 10);


    return new Response(
        JSON.stringify({ matches: limitedDistricts }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
  }
   catch (error) {
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
