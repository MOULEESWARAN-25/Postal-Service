import connectToDatabase from "@/lib/mongoose";
import HeadPostData from "@/models/headpostdata";

// Mapping of sub-branch offices with their areas
const sathyBranchOffices = {
  bannari: ["Rajan Nagar", "Pudupeerkadavu", "Pungar"],
  dhimbam: ["Erahanahalli", "Gettavadi", "Kongahalli"],
  hassanur: ["Marur", "Neithalapuram", "Gundri"],
};

const perunduraiBranchOffices = {
  ingur: ["Mukasi Pulavapalayam", "Kambiliampatti", "Varapalayam"],
  olapalayam: ["Singanallur", "Mullampatti", "Kandampalayam"]
};

export async function POST(req) {
  // Establish database connection
  await connectToDatabase();

  try {
    // Parse the JSON payload from the incoming request
    const data = await req.json();

    // Common filtering function to reduce code duplication
    async function filterDataByBranchOffices(branchOffices) {
      // Fetch all documents from the HeadPostData collection
      const headData = await HeadPostData.find();

      // Initialize the filtered result structure and scheme count dynamically
      const filteredResults = {};
      const schemeCount = {};
      const resultLengths = {};

      // Dynamically create keys based on branch offices
      Object.keys(branchOffices).forEach(key => {
        const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
        filteredResults[formattedKey] = [];
        schemeCount[formattedKey] = 0;
        resultLengths[formattedKey] = 0;
      });

      // Iterate over the headData array and filter based on the conditions
      headData.forEach(item => {
        const branchPostOffice = item.BranchPostOffice ? item.BranchPostOffice.toLowerCase() : null;
        const area = item.Area;

        // Check if the BranchPostOffice exists in the branch offices mapping
        const normalizedBranchOffices = Object.keys(branchOffices).map(key => key.toLowerCase());
        
        if (branchPostOffice && normalizedBranchOffices.includes(branchPostOffice)) {
          // Find the correct key to use (preserving original casing)
          const correctKey = Object.keys(branchOffices).find(
            key => key.toLowerCase() === branchPostOffice
          );

          // Check if the Area exists in the list of areas for the Branch Post Office
          if (branchOffices[correctKey].includes(area)) {
            // Add the item to the appropriate branch array in filteredResults
            const formattedKey = correctKey.charAt(0).toUpperCase() + correctKey.slice(1);
            filteredResults[formattedKey].push(item);
            
            // Update the length of filtered results for this branch
            resultLengths[formattedKey]++;

            // Count Scheme 1:1 items
            if (item.scheme1 === 1) {
              schemeCount[formattedKey]++;
            }
          }
        }
      });

      // Prepare the response object dynamically
      const responseObject = {
        message: "Filtered data received successfully",
        schemeCount: schemeCount,
        resultLengths: resultLengths, // Add result lengths to the response
        total: headData.length,
      };

      // Dynamically add count for each branch office
      Object.keys(branchOffices).forEach(key => {
        const formattedKey = key.toLowerCase();
        responseObject[formattedKey] = schemeCount[key.charAt(0).toUpperCase() + key.slice(1)];
      });

      return responseObject;
    }

    // Handle Sathyamangalam request
    if (data.State === "Tamil Nadu" && data.District === "Erode" && data.SubpostOffice === "Sathiyamangalam") {
      const result = await filterDataByBranchOffices(sathyBranchOffices);
      return new Response(JSON.stringify(result), { status: 200 });
    }

    // Handle Perundurai request
    if (data.State === "Tamil Nadu" && data.District === "Erode" && data.SubpostOffice === "Perundurai") {
      const result = await filterDataByBranchOffices(perunduraiBranchOffices);
      return new Response(JSON.stringify(result), { status: 200 });
    }

    // If the incoming request data is invalid
    return new Response(
      JSON.stringify({ message: "Invalid State, District, or SubpostOffice" }),
      { status: 400 }
    );
  } catch (error) {
    // Catch any errors and log them
    console.error("Error processing request:", error);

    // Return a response with an error message
    return new Response(
      JSON.stringify({ message: "An error occurred", error: error.message }),
      { status: 500 }
    );
  }
}