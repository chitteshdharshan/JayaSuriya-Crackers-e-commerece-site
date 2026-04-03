import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log(err));

// ✅ Cloudinary Config (optional)
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== "your_cloud_name") {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// ✅ Multer (for image upload)
const upload = multer({ dest: "uploads/" });

// ✅ Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  image: String,
});

const Product = mongoose.model("Product", productSchema);

// ================= ROUTES =================

// ✅ Add Product (Image + Data)
app.post("/api/add-product", upload.single("image"), async (req, res) => {
  try {
    console.log("Received add product request:", req.body, req.file);

    let imageUrl = "https://via.placeholder.com/150"; // Default placeholder

    if (process.env.CLOUDINARY_CLOUD_NAME !== "your_cloud_name" && req.file) {
      // Upload image to Cloudinary if configured
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
      // Delete local file
      fs.unlinkSync(req.file.path);
    } else if (req.file) {
      // If no Cloudinary, delete local file and use placeholder
      fs.unlinkSync(req.file.path);
    }

    // Save to MongoDB
    const product = new Product({
      name: req.body.name,
      price: parseFloat(req.body.price), // Ensure number
      category: req.body.category,
      image: imageUrl,
    });

    await product.save();

    console.log("Product saved:", product);
    res.json(product);
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get Products (for frontend)
app.get("/api/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// ✅ Delete Product
app.delete("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product deleted", product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Root route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// ================= SERVER =================
app.listen(5001, () => console.log("🚀 Server running on port 5001"));