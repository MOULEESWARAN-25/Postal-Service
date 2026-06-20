const mongoose = require('mongoose');
const fs = require('fs');

if (fs.existsSync('.env.local')) {
  const envFile = fs.readFileSync('.env.local', 'utf-8');
  envFile.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length > 1) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim().replace(/(^['"]|['"]$)/g, '');
      process.env[key] = val;
    }
  });
}

const MONGODB_URI = process.env.MONGODB_URI;

async function check() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  const dem = await db.collection('demographic_tamilnadu').findOne({ name: "Arasur" });
  console.log("Demographics of Arasur:", dem);

  const rec = await db.collection('campaign_recommendations').findOne({ village: "Arasur" });
  console.log("Seeded Recommendation of Arasur:", rec);

  await mongoose.connection.close();
}

check().catch(console.error);
