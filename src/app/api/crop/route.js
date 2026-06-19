export const dynamic = 'force-dynamic';

import connectToDatabase from '@/lib/mongoose';
import CropTaluk from '@/models/CropTaluk';
import AgriculturalData from '@/models/AgriculturalData';

export async function GET() {
  await connectToDatabase();

  try {
    const cropTaluks = await CropTaluk.find();
    return new Response(JSON.stringify(cropTaluks), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching crop taluk data:', error);
    return new Response(
      JSON.stringify({ error: 'Error fetching data' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(request) {
  await connectToDatabase();

  try {
    const body = await request.json();
    const { areas, crop, landArea, amount, startMonth, endMonth } = body;

    if (!areas || !crop || !landArea || !amount || !startMonth || !endMonth) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const newData = new AgriculturalData({
      areas,
      crop,
      landArea: Number(landArea),
      amount: Number(amount),
      startMonth,
      endMonth,
    });

    await newData.save();

    return new Response(
      JSON.stringify({ message: 'Agricultural data saved successfully', data: newData }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error saving agricultural data:', error);
    return new Response(
      JSON.stringify({ error: 'Error saving data' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

