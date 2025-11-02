import mongoose from "mongoose";

 const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/pyq`)
    console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("DB connection Failed: ", err);
    process.exit(1);
  }
}

export default connectDB;