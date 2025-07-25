import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://sandunsalinda:sandun%40123@taskmanagercluster.t0844ws.mongodb.net/taskmanager?retryWrites=true&w=majority&appName=TaskManagerCluster';

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connection successful!');
    
    // Try to list collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections found:', collections.map(c => c.name));
    
    await mongoose.disconnect();
    console.log('Connection closed');
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Full error:', error);
  }
}

testConnection();
