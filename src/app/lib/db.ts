import mongoose from "mongoose";
const connectionURL = process.env.MONGODB_URL!;
type connectionObj = {
  isConnected?: number;
};

const connection: connectionObj = {};

async function db(): Promise<void> {
  if (connection.isConnected) {
    console.log("already connected");
    return;
  }

  try {
    const db = await mongoose.connect(connectionURL, {});
    connection.isConnected = db.connections[0].readyState;
    console.log("db connected");
  } catch (error) {
    console.log("database connection failed", error);

    // process.exit(1);
  }
}

export default db;
