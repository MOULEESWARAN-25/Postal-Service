export const dynamic = 'force-dynamic';

import connectToDatabase from "@/lib/mongoose";
import Village from "@/models/Village";

// All 38 official Tamil Nadu districts + other major state districts
const TN_DISTRICTS = [
  "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore",
  "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram",
  "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai",
  "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai",
  "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi",
  "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli",
  "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur",
  "Vellore", "Viluppuram", "Virudhunagar"
];

const STATE_DISTRICTS = {
  "Tamil Nadu": TN_DISTRICTS,
  "Karnataka": [
    "Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban",
    "Bidar", "Chamarajanagara", "Chikkaballapura", "Chikkamagaluru", "Chitradurga",
    "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan",
    "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal",
    "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga",
    "Tumakuru", "Udupi", "Uttara Kannada", "Vijayapura", "Yadgir"
  ],
  "Maharashtra": [
    "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed",
    "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli",
    "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur",
    "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded",
    "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani",
    "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara",
    "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"
  ],
  "Kerala": [
    "Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod",
    "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad",
    "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"
  ],
  "Andhra Pradesh": [
    "Alluri Sitharama Raju", "Anakapalli", "Ananthapuramu", "Annamayya",
    "Bapatla", "Chittoor", "Dr. B.R. Ambedkar Konaseema", "East Godavari",
    "Eluru", "Guntur", "Kakinada", "Krishna", "Kurnool",
    "Nandyal", "NTR", "Palnadu", "Parvathipuram Manyam",
    "Prakasam", "Sri Potti Sriramulu Nellore", "Sri Sathya Sai",
    "Srikakulam", "Tirupati", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR"
  ],
  "Telangana": [
    "Adilabad", "Bhadradri Kothagudem", "Hanumakonda", "Hyderabad",
    "Jagtial", "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal",
    "Kamareddy", "Karimnagar", "Khammam", "Kumuram Bheem",
    "Mahabubabad", "Mahabubnagar", "Mancherial", "Medak",
    "Medchal-Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda",
    "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli",
    "Rajanna Sircilla", "Rangareddy", "Sangareddy", "Siddipet",
    "Suryapet", "Vikarabad", "Wanaparthy", "Warangal", "Yadadri Bhuvanagiri"
  ],
};

export async function POST(req) {
  await connectToDatabase();

  try {
    const body = await req.json();
    const { state } = body;

    if (!state) {
      return new Response(
        JSON.stringify({ error: 'State parameter is required' }),
        { status: 400 }
      );
    }

    // Handle state as object {name, image} or string
    const stateName = typeof state === 'object' ? state.name : state;

    // Return known districts for the state if available
    const knownDistricts = STATE_DISTRICTS[stateName];
    if (knownDistricts) {
      return new Response(
        JSON.stringify({ matches: knownDistricts.sort((a, b) => a.localeCompare(b)) }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Fallback: try MongoDB for unknown states
    const EXCLUDE = ['INDIA', 'India', 'india', stateName];
    const districts = await Village.distinct("district", {
      district: { $nin: EXCLUDE },
      $expr: { $ne: ["$district", "$name"] }
    });

    const sorted = districts
      .filter(d => d && d.trim().length > 0)
      .sort((a, b) => a.localeCompare(b));

    return new Response(
      JSON.stringify({ matches: sorted }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Error reading district data:', error);
    return new Response(
      JSON.stringify({ error: "Error fetching District." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
