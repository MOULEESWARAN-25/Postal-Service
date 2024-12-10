// app/api/districts/[state]/route.js
import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { state , district } = params;

  // Ensure state is provided in the request
  if (!state || !district) {
    return NextResponse.json({ error: 'State and district parameter is required' }, { status: 400 });
  }

  try {
    // Path to the district GeoJSON file
    const filePath = path.join(process.cwd(), 'public', 'geojson', 'subdistricts', `${state}.json`);

    // Check if the file exists
    try {
      await fs.access(filePath);
    } catch (err) {
      return NextResponse.json({ error: `District data not found for state: ${state}` }, { status: 404 });
    }

    // Read the GeoJSON file
    const fileContents = await fs.readFile(filePath, 'utf8');
    const districtData = JSON.parse(fileContents);
    
    // Respond with the GeoJSON data
    return NextResponse.json(districtData);
  } catch (error) {
    console.error('Error reading district data:', error);
    return NextResponse.json({ error: 'Failed to read district data' }, { status: 500 });
  }
}