import connectToDatabase from "../../../lib/mongoose";
import Village from "../../../models/Village";

const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export async function POST(req) {
  await connectToDatabase();

  try {
    const body = await req.json();
    const { text } = body;

    if (!text || !text.Query) {
      return new Response(
        JSON.stringify({ error: "Query is required." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { step, Query } = text;

    let suggestions = [];
    let filter = {};

    // Case 1: If everything is null except Query, match Query with states
    if (step==1) {
      suggestions = states.filter((state) =>
        state.toLowerCase().includes(Query.toLowerCase())
      );
      return new Response(
        JSON.stringify({ matches: suggestions }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Case 2: If State is not null but others are null, match Query with districts in MongoDB
    if (step==2) {
        // correct one but i dont have the data yet
    //   filter = { state: State, district: { $regex: Query, $options: "i" } };
    const filter = { District: { $regex: Query, $options: "i" } };
    const districts = await Village.find(filter).distinct("District"); // Fetch unique districts

      return new Response(
        JSON.stringify({ matches: districts }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Case 3: If nothing is null, match Query with names in MongoDB
    if (step==3) {
        console.log("iam here")
      filter = {
        District: text.District,
        name: { $regex: Query, $options: "i" },
        // tru: "Total"
      };
      const villages = await Village.find(filter).distinct("name"); // Fetch unique village names
    //   uncomment if nessary 
    //   const villages = await Village.find(filter);

      return new Response(
        JSON.stringify({ matches: villages }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid input combination." }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return new Response(
      JSON.stringify({ error: "Error fetching data." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
