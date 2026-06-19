export const dynamic = 'force-dynamic';

import connectToDatabase from "@/lib/mongoose";
import Enrollment from "@/models/Enrollment";

export async function GET(request) {
  await connectToDatabase();

  try {
    const url = new URL(request.url);
    const village = url.searchParams.get("village");
    const schemeCode = url.searchParams.get("schemeCode");

    const filter = {};
    if (village) filter.village = village;
    if (schemeCode) filter.schemeCode = schemeCode;

    // Fetch raw enrollments
    const enrollments = await Enrollment.find(filter).sort({ enrollmentDate: -1 });

    // Calculate aggregations
    const totalCount = await Enrollment.countDocuments({ status: "Enrolled" });
    const pendingCount = await Enrollment.countDocuments({ status: "Pending" });

    // Aggregate by scheme
    const schemeStats = await Enrollment.aggregate([
      { $match: { status: "Enrolled" } },
      { $group: { _id: "$schemeCode", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Aggregate by village
    const villageStats = await Enrollment.aggregate([
      { $match: { status: "Enrolled" } },
      { $group: { _id: "$village", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    return new Response(JSON.stringify({
      success: true,
      data: enrollments,
      stats: {
        totalEnrolled: totalCount,
        totalPending: pendingCount,
        byScheme: schemeStats.map(s => ({ schemeCode: s._id, count: s.count })),
        byVillage: villageStats.map(v => ({ village: v._id || "Unknown", count: v.count }))
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function POST(request) {
  await connectToDatabase();

  try {
    const body = await request.json();
    const { citizenAadhaar, schemeCode, status, village, campaignId } = body;

    if (!citizenAadhaar || !schemeCode || !status) {
      return new Response(JSON.stringify({
        success: false,
        error: "citizenAadhaar, schemeCode, and status are required fields."
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const newEnrollment = new Enrollment({
      citizenAadhaar,
      schemeCode,
      status,
      village,
      campaignId,
      enrollmentDate: new Date()
    });

    await newEnrollment.save();

    return new Response(JSON.stringify({
      success: true,
      message: "Enrollment logged successfully.",
      data: newEnrollment
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error creating enrollment:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
