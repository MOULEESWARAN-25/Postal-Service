import mongoose from 'mongoose';

const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected !!!!!!!!!!');

    const collections = await mongoose.connection.db.collections();
    const collectionNames = collections.map(collection => collection.collectionName);
    console.log('Collections:', collectionNames);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

export default connectToDatabase;

