const mongoose = require('mongoose');

async function main() {
  const uri = 'mongodb://localhost:27017';
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
    
    const admin = mongoose.connection.useDb('admin').db;
    const dbs = await admin.admin().listDatabases();
    console.log('Databases on server:');
    for (const dbInfo of dbs.databases) {
      console.log(`- ${dbInfo.name}`);
      const db = mongoose.connection.useDb(dbInfo.name).db;
      const collections = await db.listCollections().toArray();
      for (const col of collections) {
        const count = await db.collection(col.name).countDocuments();
        console.log(`   * ${col.name}: ${count} documents`);
      }
    }
  } catch (err) {
    console.error('Error connecting or querying:', err);
  } finally {
    await mongoose.connection.close();
  }
}

main();
