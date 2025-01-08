import mongoose from "mongoose";

let dbConn;

export const connectDB = () => {
  const DATABASE_URL = process.env.DATABASE_URL;
  try {
    mongoose.connect(DATABASE_URL);
  } catch (error) {
    console.log(`Error connecting to MongoDB :${DATABASE_URL}`);
    console.log(error);
    process.exit(1);
  }
  dbConn = mongoose.connection;
  dbConn.once("open", () => {
    console.log(`Connected to MongoDB :${DATABASE_URL}`);
  });
  dbConn.on("error", (error) => {
    console.log(`Error connecting to MongoDB :${DATABASE_URL}`);
    console.log(error);
    process.exit(1);
  });
};
