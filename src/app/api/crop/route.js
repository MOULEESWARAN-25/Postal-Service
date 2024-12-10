
// import connectToDatabase from '../../../lib/mongoose';
// import CropTaluk from '../../../models/CropTaluk';

// export async function GET() {
//   await connectToDatabase();

//   try {
//     const cropTaluks = await CropTaluk.find();
//     return new Response(JSON.stringify(cropTaluks), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error('Error fetching crop taluk data:', error);
//     return new Response(
//       JSON.stringify({ error: 'Error fetching data' }),
//       { status: 500, headers: { 'Content-Type': 'application/json' } }
//     );
//   }
// }
