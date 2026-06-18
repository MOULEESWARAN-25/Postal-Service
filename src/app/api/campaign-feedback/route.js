import connectToDatabase from "@/lib/mongoose";
import CampaignFeedback from "@/models/CampaignFeedback";

export async function GET(request) {
  await connectToDatabase();

  try {
    const feedbackList = await CampaignFeedback.find().sort({ date: -1 });

    return new Response(JSON.stringify({
      success: true,
      data: feedbackList
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching campaign feedback:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST(request) {
  await connectToDatabase();

  try {
    const body = await request.json();
    const { campaignId, village, scheme, attendees, newEnrollments, feedbackScore, remarks, status } = body;

    if (!campaignId || !village || !scheme) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Campaign ID, Village, and Scheme are required fields.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const newFeedback = new CampaignFeedback({
      campaignId,
      village,
      scheme,
      attendees: Number(attendees || 0),
      newEnrollments: Number(newEnrollments || 0),
      feedbackScore: Number(feedbackScore || 4),
      remarks: remarks || '',
      status: status || 'Completed',
      date: new Date()
    });

    await newFeedback.save();

    return new Response(JSON.stringify({
      success: true,
      message: 'Feedback submitted successfully.',
      data: newFeedback
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error saving campaign feedback:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
