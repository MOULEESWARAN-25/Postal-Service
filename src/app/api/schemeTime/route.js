export const dynamic = 'force-dynamic';

// seperate the modal if have time

import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongoose";

// Singleton function to create and cache models
function createModel(name, schema) {
  // Check if the model already exists
  if (mongoose.models[name]) {
    return mongoose.models[name];
  }

  // Create the model if it doesn't exist
  return mongoose.model(name, schema);
}

// Mongoose Schema Definitions
const cropSubDistrictSchema = new mongoose.Schema({
  village: { type: String, required: true },
  crops: [
    {
      village: { type: String },
      crops: [{ type: String }],
    },
  ],
  district: { type: String },
});

const cropTimingSchema = new mongoose.Schema({
  cropname: { type: String, required: true },
  timing: [
    {
      district: { type: String, required: true },
      seasons: {
        sowing: [{ type: String }], // Array of strings
        harvesting: [{ type: String }], // Array of strings
      },
    },
  ],
});

// Use the singleton model creation approach
const CropSubDistrict = createModel("CropSubDistrict", cropSubDistrictSchema);
const CropTiming = createModel("CropTiming", cropTimingSchema);

// Function to fetch data from MongoDB using village name
async function fetchAllDocuments(villageName) {
  try {
    await connectToDatabase();
    const db = mongoose.connection.db;

    // Ensure lowercase match with seed data (all stored as lowercase)
    const normalisedVillage = (villageName || "").trim().toLowerCase();

    // Query CropSubDistrict for village crop details
    const document1 = await db.collection('cropsubdistricts').findOne(
      { "crops.village": normalisedVillage },
      { projection: { district: 1, "crops.$": 1 } }
    );

    if (!document1 || !document1.crops || document1.crops.length === 0) {
      console.log(
        `No data found for village: ${normalisedVillage} in CropSubDistrict`
      );
      return null;
    }

    const district = document1.district;
    const cropName = document1.crops[0]?.crops[0]; // Extract the crop name

    if (!cropName) {
      console.log(`No crop data found for village: ${villageName}`);
      return null;
    }

    // Query CropTiming for sowing and harvesting times
    const document2 = await db.collection('croptimings').findOne(
      { cropname: cropName, "timing.district": district },
      { projection: { "timing.$": 1 } }
    );

    if (!document2 || !document2.timing || document2.timing.length === 0) {
      console.log(
        `No seasons data found for crop: ${cropName} in district: ${district}`
      );
      return null;
    }

    const seasons = document2.timing[0].seasons;
    const { sowing, harvesting } = seasons;
    
    // Combine and return the results
    return {
      district,
      crop: cropName,
      sowing,
      harvesting,
    };
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw error;
  }
}

// GET handler for fetching data
// export async function GET(request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const villageName = searchParams.get('village') || 'bhavani';

//     const result = await fetchAllDocuments(villageName);

//     if (result) {
//       return Response.json(result, { status: 200 });
//     } else {
//       return Response.json({ message: "No data found for the specified village" }, { status: 404 });
//     }
//   } catch (error) {
//     return Response.json(
//       { error: "Internal Server Error", details: error.message },
//       { status: 500 }
//     );
//   }
// }

// POST handler for receiving and processing data
export async function POST(request) {
  try {
    const body = await request.json();
    // Seed data stores village names in lowercase — normalise input to match
    const villageName = (body.village || "").trim().toLowerCase();

    console.log("Village Name (normalised):", villageName);
    if (!villageName) {
      return Response.json(
        { error: "Village name is required" },
        { status: 400 }
      );
    }

    const result = await fetchAllDocuments(villageName);

    if (result) {
      return Response.json(
        {
          message: "Data received and fetched successfully",
          result,
        },
        { status: 200 }
      );
    } else {
      return Response.json(
        { message: "No data found for the specified village" },
        { status: 404 }
      );
    }
  } catch (error) {
    return Response.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
