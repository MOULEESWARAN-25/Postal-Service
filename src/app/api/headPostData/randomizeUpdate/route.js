import connectToDatabase from "@/lib/mongoose";
import HeadPostData from "@/models/headpostdata"; // Adjust the model if needed

export async function POST(req) {
  try {
    // Establish a database connection
    await connectToDatabase();

    // Step 1: Find 10 random documents where scheme1 is 0
    const randomDocs = await HeadPostData.aggregate([
      { $match: { scheme1: 0 } }, // Optional filter, modify if needed
      { $sample: { size: 10 } }, // Get 10 random documents
    ]);

    // If no documents are found, return a response indicating so
    if (randomDocs.length === 0) {
      return new Response(
        JSON.stringify({ message: "No documents found to update" }),
        { status: 404 }
      );
    }

    // Step 2: Extract the _ids of the random documents
    const idsToUpdate = randomDocs.map(doc => doc._id);

    // Step 3: Update those documents by setting scheme1 to 1
    const result = await HeadPostData.updateMany(
      { _id: { $in: idsToUpdate } },
      { $set: { scheme1: 1 } }
    );

    // If the update is successful, return the updated count
    return new Response(
      JSON.stringify({
        message: "Successfully updated 10 random documents",
        updatedCount: result.modifiedCount,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating documents:", error);

    // Return an error response if something goes wrong
    return new Response(
      JSON.stringify({ message: "An error occurred", error: error.message }),
      { status: 500 }
    );
  }
}
