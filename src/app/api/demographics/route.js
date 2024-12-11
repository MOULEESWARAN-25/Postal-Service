import { aggregateVillageData } from "../../../../agritiondata";
import connectToDatabase from "../../../lib/mongoose";
import Village from "../../../models/Village";

export async function POST(req) {
  await connectToDatabase(); // Ensure database connection is established
console.log("hello");
  try {
    const body = await req.json(); // Parse the request body
    const { address } = body;

    if (!address) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Address not found.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (address?.name) {
      const regex = new RegExp(`\\b${address.name}\\b`, "i");
      const villages = await Village.find({ name: { $regex: regex } });

      console.log(villages);
      // Remove duplicates based on the 'tru' field
      const uniqueVillages = Array.from(
        new Map(villages.map((village) => [village.tru, village])).values()
      );
      return new Response(JSON.stringify(uniqueVillages), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const {
      State,
      District,
      Village: village,
      SubPostOffice,
      PostOffice,
    } = address;

    // Case 1: Everything is null
    if (!State && !District && !village && !SubPostOffice && !PostOffice) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "All address fields are empty.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Case 2: State is not null and others are null
    if (State && !District && !village && !SubPostOffice && !PostOffice) {
      const results = await Village.find({
        name: { $regex: new RegExp(`^${State}$`, "i") },
      });
      const uniqueData = Array.from(
        new Map(results.map((village) => [village.tru, village])).values()
      );
      return new Response(JSON.stringify(uniqueData), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Case 3: State and District are not null
    if (State && District && !village && !SubPostOffice && !PostOffice) {
      const results = await Village.find({
        // state: { $regex: new RegExp(`^${State}$`, "i") },
        name: { $regex: new RegExp(`^${District}$`, "i") },
      });
      const uniqueData = Array.from(
        new Map(results.map((village) => [village.tru, village])).values()
      );
      return new Response(JSON.stringify(uniqueData), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Case 4: State, District, and SubPostOffice are not null
    if (State && District && SubPostOffice && !village && !PostOffice) {
      let extractedSubPostOffice = SubPostOffice.split(' ', 1)[0]; 
      
      if (extractedSubPostOffice === 'Sathiyamangalam') {
        extractedSubPostOffice = 'Sathyamangalam';
      }
      console.log(extractedSubPostOffice);
      const query = {
        $or: [
          { name: new RegExp(`\\b${extractedSubPostOffice}\\b`, "i") },
          { location: new RegExp(`\\b${extractedSubPostOffice}\\b`, "i") },
        ],
        District: new RegExp(`\\b${District}\\b`, "i"),
      };
      const results = await Village.find(query);
      const uniqueData = Array.from(
        new Map(results.map((village) => [village.tru, village])).values()
      );
      return new Response(JSON.stringify(uniqueData), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const sathyBranchOffices = {
      Araipalayam: [
        "Arasur",
        "Ayyampalayam",
        "Baguthampalayam",
        "Byannapuram",
        "Chikkahajanur",
        "Chikkarasampalayam",
        "Dasaripalayam",
        "Dhoddahajanur",
      ],
      Bannari: [
        "Rajan Nagar",
        "Pudupeerkadavu",
        "Bhavanisagar",
        "Pungar",
        "Dhoddampalayam",
        "Kothamangalam",
        "Akkaraithathappalli",
      ],
      Chikkarasampalayam: [
        "Chikkarasampalayam",
        "Ikkarainegamam",
        "Ikkaraithathappalli",
        "Vinnappalli",
        "Periyakallipatti",
        "Sunkakaranpalayam",
      ],
      Dhimbam: [
        "Erahanahalli",
        "Gettavadi",
        "Dhoddamudukkarai",
        "Kongahalli",
        "Talamalai",
      ],
      Germalam: [
        "Boosaripalayam",
        "Ikkarainegamam",
        "Ikkaraithathappalli",
        "Indiampalayam",
        "Madahalli",
        "Madampalayam",
        "Makkinancombai",
        "Malayadipudur",
        "Shenbagapudur",
      ],
      Hassanur: [
        "Marur",
        "Neithalapuram",
        "Thiginarai",
        "Gundri",
        "Guthiyalathur",
        "Guthiyalathur extension RF",
        "Guthiyalathur addition RF",
        "Akkurinjieri RF",
        "Akkurinjieri Extn RF",
        "Barabetta RF",
        "Velamundi RF",
      ],
      Ikkarainegamam: [
        "Ikkarainegamam",
        "Ikkaraithathappalli",
        "Kurumbapalayam",
        "Vinnappalli",
        "Periyakallipatti",
        "Sunkakaranpalayam",
      ],
      Komarapalayam: [
        "Komarapalayam",
        "Konamoolai",
        "Koothampalayam",
        "Kothamangalam",
      ],
      Kottuveerampalayam: [
        "Pudupeerkadavu",
        "Rajan Nagar",
        "Bhavani Sagar",
        "Pungar",
        "Dhoddampalayam",
        "Kothamangalam",
      ],
      Puduvadavalli: [
        "Talavadi",
        "Talamalai",
        "Talamalai Extn. RF",
        "Talamalai R.F.",
      ],
      Thingalur: [
        "Thingalur",
        "Thoppampalayam",
        "Talamalai",
        "Thiginarai",
        "Ukkaram",
      ],
      Varadampalayam: ["Alathucombai", "Mallankuli", "Karalavadi", "Karapadi"],
    };

    // Case 5: State, District, SubPostOffice, and PostOffice are not null
    if (State && District && SubPostOffice && PostOffice && !village) {

      // Check if the PostOffice exists in sathyBranchOffices
      const branchOffices = sathyBranchOffices[PostOffice];
      if (branchOffices) {
        // If found, fetch documents where postOffice matches any of the branch offices
        const allResults = [];
        for (let branch of branchOffices) {
          const query = {
            $or: [
              { name: new RegExp(`\\b${branch}\\b`, "i") },
              { location: new RegExp(`\\b${branch}\\b`, "i") },
            ],
            District: new RegExp(`\\b${District}\\b`, "i"),
          };

          const results = await Village.find(query);
          const uniqueData = Array.from(
            new Map(results.map((village) => [village.tru, village])).values()
          );
          allResults.push({ [branch]: uniqueData });
        }


        let arrayOfObjects = [];
        for (let i = 0; i < allResults.length; i++) {
          arrayOfObjects.push(allResults[i][branchOffices[i]][0]);
        }

        const sumObjectsByKey = (array) => {
          return array.reduce((accumulator, currentObject) => {
            // Skip undefined or null values
            if (!currentObject) return accumulator;

            Object.keys(currentObject).forEach((key) => {
              if (typeof currentObject[key] === "number") {
                accumulator[key] = (accumulator[key] || 0) + currentObject[key];
              } else if (!accumulator[key]) {
                accumulator[key] = currentObject[key];
              }
            });
            return accumulator;
          }, {});
        };
        const RES = sumObjectsByKey(arrayOfObjects);

        return new Response(JSON.stringify([RES._doc]), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } else {
        // If PostOffice doesn't match any key in sathyBranchOffices, fetch regular results
        const results = await Village.find({
          name: { $regex: new RegExp(`^${District}$`, "i") },
        });

        return new Response(JSON.stringify(results), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Case 6: Everything is not null
    if (State && District && SubPostOffice && PostOffice && village) {
      console.log(State, District, SubPostOffice, PostOffice, village);
      // Check if the PostOffice exists in sathyBranchOffices
      if (sathyBranchOffices[PostOffice]) {
        // Check if the village exists in the list for that PostOffice
        
        if (sathyBranchOffices[PostOffice].includes(village)) {
          const results = await Village.find({
            name: { $regex: new RegExp(`^${village}$`, "i") },
            District: { $regex: new RegExp(`^${District}$`, "i") },
          });

          return new Response(JSON.stringify(results), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } else {
          return new Response(
            JSON.stringify({
              success: false,
              message: `Village ${village} not found under the PostOffice ${PostOffice}.`,
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      } else {
        const results = await Village.find({
          name: { $regex: new RegExp(`^${village}$`, "i") },
          District: { $regex: new RegExp(`^${District}$`, "i") },
        });

        return new Response(JSON.stringify(results), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Default fallback if no conditions match
    return new Response(
      JSON.stringify({
        success: false,
        message: "Invalid combination of address fields provided.",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error occurred while fetching villages:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "An error occurred while processing the request.",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
