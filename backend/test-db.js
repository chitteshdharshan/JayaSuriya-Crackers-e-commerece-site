import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

console.log("Testing connection with URI:", process.env.MONGO_URI.replace(/:([^@]+)@/, ':****@'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ SUCCESS: Connected to MongoDB Atlas!");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ FAILURE: Connection failed.");
    console.error("Error Name:", err.name);
    console.error("Error Message:", err.message);
    if (err.reason) console.error("Reason:", err.reason);
    process.exit(1);
  });
