export const dynamic = 'force-dynamic';

import connectToDatabase from "@/lib/mongoose";
import Village from "@/models/Village";

function escapeRegExp(string) {
  if (!string) return "";
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getLevenshteinDistance(a, b) {
  a = a.toLowerCase();
  b = b.toLowerCase();
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1  // deletion
          )
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function getSortedMatches(query, candidates) {
  if (!query) return candidates;
  const q = query.toLowerCase().trim();
  
  const exact = [];
  const caseInsensitive = [];
  const contains = [];
  const fuzzy = [];

  candidates.forEach(cand => {
    if (!cand) return;
    const candLower = cand.toLowerCase().trim();
    if (cand === query) {
      exact.push(cand);
    } else if (candLower === q) {
      caseInsensitive.push(cand);
    } else if (candLower.includes(q)) {
      contains.push(cand);
    } else {
      const dist = getLevenshteinDistance(q, candLower);
      const threshold = q.length <= 4 ? 1 : 2;
      if (dist <= threshold) {
        fuzzy.push({ cand, dist });
      }
    }
  });

  fuzzy.sort((a, b) => a.dist - b.dist);

  return [
    ...exact,
    ...caseInsensitive,
    ...contains,
    ...fuzzy.map(f => f.cand)
  ];
}

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

    // Case 1: Match Query with states
    if (step == 1) {
      suggestions = getSortedMatches(Query, states);
      return new Response(
        JSON.stringify({ matches: suggestions }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Case 2: Match Query with districts in MongoDB
    if (step == 2) {
      const districts = await Village.find().distinct("district");
      suggestions = getSortedMatches(Query, districts);

      return new Response(
        JSON.stringify({ matches: suggestions }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Case 3: Match Query with names in MongoDB
    if (step == 3) {
      const targetDistrict = text.District || text.district || "";
      const escapedDistrict = escapeRegExp(targetDistrict);
      const filter = {
        district: { $regex: new RegExp(`^${escapDistrict}$`, "i") }
      };
      
      const villages = await Village.find(filter).distinct("name");
      suggestions = getSortedMatches(Query, villages);

      return new Response(
        JSON.stringify({ matches: suggestions }),
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
