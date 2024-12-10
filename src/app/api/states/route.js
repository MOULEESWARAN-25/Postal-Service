import path from "path";
import { promises as fs } from "fs";

export async function GET(req) {
  try {
    // Get the file path for the GeoJSON file
    const filePath = path.join(process.cwd(), "public", "geojson", "second-optimize.json");

    // Read the GeoJSON file
    const geojsonData = await fs.readFile(filePath, "utf8");

    // Return the GeoJSON data as JSON
    return new Response(geojsonData, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error reading GeoJSON file:", error);
    return new Response(
      JSON.stringify({ message: "Unable to load GeoJSON data." }),
      { status: 500 }
    );
  }
}
