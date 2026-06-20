export const dynamic = 'force-dynamic';

import connectToDatabase from "@/lib/mongoose";
import CampaignRecommendation from "@/models/CampaignRecommendation";

export async function GET(request) {
  await connectToDatabase();

  try {
    const url = new URL(request.url);
    const village = url.searchParams.get("village");

    const filter = {};
    if (village) {
      const escaped = village.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.village = { $regex: new RegExp(escaped, "i") };
    }

    const recommendations = await CampaignRecommendation.find(filter).sort({ opportunityScore: -1 });

    return new Response(JSON.stringify({
      success: true,
      data: recommendations
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error fetching campaign recommendations:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
