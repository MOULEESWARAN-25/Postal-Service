export const dynamic = 'force-dynamic';

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
    const data = await req.json();
    const selectedScheme = data.selectedScheme || "Sukanya Samriddhi Account (SSA)";

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
            // Check if eligible for the selected scheme
            const isEligible = 
              item.recommendedScheme1 === selectedScheme ||
              item.recommendedScheme2 === selectedScheme ||
              item.recommendedScheme3 === selectedScheme ||
              (item.recommandendSchemes && item.recommandendSchemes.includes(selectedScheme));

            if (isEligible) {
              // Add the item to the appropriate branch array in filteredResults
              const formattedKey = correctKey.charAt(0).toUpperCase() + correctKey.slice(1);
              filteredResults[formattedKey].push(item);
              
              // Update the length of filtered results for this branch
              resultLengths[formattedKey]++;

              // Check if enrolled in this selected scheme
              const isEnrolled = 
                (item.recommendedScheme1 === selectedScheme && item.scheme1 === 1) ||
                (item.recommendedScheme2 === selectedScheme && item.scheme2 === 1) ||
                (item.recommendedScheme3 === selectedScheme && item.scheme3 === 1);

              if (isEnrolled) {
                schemeCount[formattedKey]++;
              }
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
        const lookupKey = key.charAt(0).toUpperCase() + key.slice(1);
        responseObject[formattedKey] = schemeCount[lookupKey];
      });

      return responseObject;
    }

    // Handle Sathyamangalam / Thirumangalam request
    const subPO = data.SubpostOffice ? data.SubpostOffice.toLowerCase() : "";
    if (data.State === "Tamil Nadu" && data.District === "Erode" && 
        (subPO.includes("sathy") || subPO.includes("thirumangalam"))) {
      const result = await filterDataByBranchOffices(sathyBranchOffices);
      return new Response(JSON.stringify(result), { status: 200 });
    }

    // Handle Perundurai request
    if (data.State === "Tamil Nadu" && data.District === "Erode" && subPO.includes("perundurai")) {
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