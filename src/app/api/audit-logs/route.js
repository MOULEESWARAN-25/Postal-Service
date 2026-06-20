export const dynamic = 'force-dynamic';

import connectToDatabase from "@/lib/mongoose";
import AuditLog from "@/models/AuditLog";

export async function POST(request) {
  await connectToDatabase();

  try {
    const body = await request.json();
    const actionType = body.actionType || body.action || "VIEW_RECOMMENDATION";
    const location = body.location || body.selectedVillage || "N/A";
    const recommendation = body.recommendation || body.recommendedScheme || "N/A";
    const opportunityIndex = Number(body.opportunityIndex !== undefined ? body.opportunityIndex : (body.opportunityScore || 0));
    const userActionTime = body.userActionTime ? new Date(body.userActionTime) : new Date();

    if (!location) {
      return new Response(JSON.stringify({
        success: false,
        error: "Missing required field: location"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const logEntry = new AuditLog({
      actionType,
      location,
      recommendation,
      opportunityIndex,
      userActionTime
    });

    await logEntry.save();

    return new Response(JSON.stringify({
      success: true,
      data: logEntry
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error creating audit log:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function GET(request) {
  await connectToDatabase();

  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "50");

    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(limit);

    return new Response(JSON.stringify({
      success: true,
      data: logs
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
