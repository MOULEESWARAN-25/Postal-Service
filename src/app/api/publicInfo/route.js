import PersonalInfo from '@/models/personalInfo';
import connectToDatabase from '@/lib/mongoose';

export async function GET(request) {
  await connectToDatabase();

  // Get query parameters
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page')) || 1;
  const limit = parseInt(url.searchParams.get('limit')) || 10;
  const searchTerm = url.searchParams.get('search') || '';
  const villages = url.searchParams.get('villages')?.split(',').filter(Boolean) || [];
  const schemes = url.searchParams.get('schemes')?.split(',').filter(Boolean) || [];

  try {
    // Build query
    const query = {};
    
    
    if (searchTerm) {
      query.$or = [
        { $expr: { $regexMatch: { input: { $toString: "$aadharId" }, regex: searchTerm, options: "i" } } },
            { name: { $regex: searchTerm, $options: 'i' } },
            { area: { $regex: searchTerm, $options: 'i' } }
      ];
    }
    
    

    console.log(query);
    // Village filter
    if (villages.length > 0) {
      query.area = { $in: villages };
    }
    
    // Scheme filter
    if (schemes.length > 0) {
      query.$or = schemes.map(scheme => ({
        $or: [
          { recommendedScheme1: scheme },
          { recommendedScheme2: scheme },
          { recommendedScheme3: scheme }
        ]
      }));
    }
    

    // Calculate skip
    const skip = (page - 1) * limit;

    // Fetch paginated data
    const personalInfos = await PersonalInfo.find(query)
      .skip(skip)
      .limit(limit);

    // Get total count
    const totalCount = await PersonalInfo.countDocuments(query);

    return new Response(
      JSON.stringify({
        success: true,
        data: personalInfos,
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}