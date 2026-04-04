import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import twilio from "twilio";
import crypto from "crypto";
import nodemailer from "nodemailer";

dotenv.config();

// ✅ Twilio Config for SMS OTP
let twilioClient = null;
let twilioPhoneNumber = null;

if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_ACCOUNT_SID !== 'your_twilio_account_sid' && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_AUTH_TOKEN !== 'your_twilio_auth_token' && process.env.TWILIO_PHONE_NUMBER && process.env.TWILIO_PHONE_NUMBER !== 'your_twilio_phone_number') {
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
} else {
  console.warn("⚠️ Twilio credentials not configured. OTP will not be sent via SMS. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in .env");
}

// ✅ Email Config for OTP
let emailTransporter = null;
const adminEmail = "chitteshdharshan14@gmail.com";

if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_PASS !== 'your_app_password' && process.env.EMAIL_HOST && process.env.EMAIL_PORT) {
  emailTransporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
} else {
  console.warn("⚠️ Email credentials not configured. OTP will not be sent via email. Set EMAIL_USER, EMAIL_PASS, EMAIL_HOST, EMAIL_PORT in .env");
}

// ✅ In-memory OTP storage (use Redis in production)
const otpStore = new Map();

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
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, default: "" },
  mrp: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  image: { type: String, default: "" },
  imageUrl: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model("Product", productSchema);

// ================= ROUTES =================

// ✅ Add Product (Image + Data)
app.post("/api/add-product", upload.single("image"), async (req, res) => {
  try {
    console.log("Received add product request:", req.body, req.file);

    const { name, category, description, mrp, sellingPrice, discount, imageUrl } = req.body;

    // Validate required fields
    if (!name || !category || !mrp || !sellingPrice) {
      return res.status(400).json({ error: "Missing required fields (name, category, mrp, sellingPrice)" });
    }

    const mrpNum = parseFloat(mrp);
    const sellingPriceNum = parseFloat(sellingPrice);

    // Validate prices
    if (mrpNum <= 0 || sellingPriceNum <= 0 || sellingPriceNum > mrpNum) {
      return res.status(400).json({ error: "Invalid prices: MRP must be greater than selling price" });
    }

    // Calculate discount if not provided
    let calculatedDiscount = discount ? parseFloat(discount) : Math.round(((mrpNum - sellingPriceNum) / mrpNum) * 100);

    let imagePath = imageUrl || "https://via.placeholder.com/300?text=No+Image"; // Default placeholder

    // Handle file upload to Cloudinary
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== "your_cloud_name" && req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imagePath = result.secure_url;
      fs.unlinkSync(req.file.path);
    } else if (req.file) {
      // If no Cloudinary configured, delete local file
      fs.unlinkSync(req.file.path);
    }

    // Save to MongoDB
    const product = new Product({
      name,
      category,
      description: description || "",
      mrp: mrpNum,
      sellingPrice: sellingPriceNum,
      discount: calculatedDiscount,
      image: imagePath,
      imageUrl: imageUrl || null
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

// ✅ Clear all products (for debugging/reset)
app.delete("/api/products-all", async (req, res) => {
  try {
    await Product.deleteMany({});
    res.json({ message: "All products deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= ADMIN OTP LOGIN =================

// ✅ Send OTP to admin email
app.post("/api/admin/send-otp", async (req, res) => {
  console.log("Send OTP called");
  try {
    // Generate random 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Store OTP with timestamp (expires in 5 minutes)
    otpStore.set("admin", {
      otp,
      timestamp: Date.now(),
      expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
    });

    // Send email
    if (emailTransporter) {
      try {
        const professionalHTML = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; }
              .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
              .content { padding: 40px 30px; }
              .otp-box { background: #f0f0f0; border-left: 4px solid #667eea; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center; }
              .otp-code { font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 2px; margin: 15px 0; font-family: 'Courier New', monospace; }
              .info { font-size: 14px; color: #666; line-height: 1.8; }
              .footer { background: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #ddd; }
              .warning { color: #ff6b6b; font-weight: 600; margin: 10px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔐 Admin Login</h1>
                <p>JayaSuriya Admin Panel</p>
              </div>
              
              <div class="content">
                <p>Hello Admin,</p>
                
                <p>You have requested to log in to your admin panel. Use the OTP below to verify your identity:</p>
                
                <div class="otp-box">
                  <p style="margin: 0; font-size: 14px; color: #666;">Your One-Time Password (OTP)</p>
                  <div class="otp-code">${otp}</div>
                  <p style="margin: 10px 0 0 0; font-size: 13px; color: #999;">Valid for 5 minutes</p>
                </div>
                
                <div class="info">
                  <p><strong>Important Security Information:</strong></p>
                  <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Never share this OTP with anyone</li>
                    <li>JayaSuriya support will never ask for your OTP</li>
                    <li>This OTP expires in 5 minutes</li>
                    <li>If you didn't request this OTP, please ignore this email</li>
                  </ul>
                </div>
                
                <p style="margin-top: 20px; font-size: 13px; color: #999;">
                  <strong>Didn't request this OTP?</strong> If this wasn't you, please secure your account immediately.
                </p>
              </div>
              
              <div class="footer">
                <p style="margin: 0 0 8px 0;">JayaSuriya Admin Panel</p>
                <p style="margin: 0;">© 2026 All rights reserved. This is an automated email, please do not reply.</p>
              </div>
            </div>
          </body>
          </html>
        `;

        await emailTransporter.sendMail({
          from: `"JayaSuriya Admin" <${process.env.EMAIL_USER}>`,
          to: adminEmail,
          subject: "🔐 Your Admin Login OTP - Valid for 5 Minutes",
          text: `Your admin login OTP is: ${otp}. Valid for 5 minutes. Never share this OTP with anyone.`,
          html: professionalHTML,
        });
        console.log(`📧 Professional OTP email sent to ${adminEmail}`);
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        console.log(`📧 DEMO: OTP for ${adminEmail}: ${otp} (Email not configured properly)`);
        // Still return success for demo purposes
      }
    } else {
      console.log(`📧 DEMO: OTP for ${adminEmail}: ${otp} (Email not configured)`);
    }

    res.json({
      message: "OTP sent successfully to your email"
    });
  } catch (err) {
    console.error("Error sending OTP:", err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// ✅ Verify OTP
app.post("/api/admin/verify-otp", async (req, res) => {
  try {
    const { otp } = req.body;

    // Validate input
    if (!otp) {
      return res.status(400).json({ error: "OTP is required" });
    }

    // Check if OTP exists and is not expired
    const storedOtpData = otpStore.get("admin");
    if (!storedOtpData) {
      return res.status(401).json({ error: "OTP not found or expired. Please request a new OTP." });
    }

    if (Date.now() > storedOtpData.expiresAt) {
      otpStore.delete("admin"); // Clean up expired OTP
      return res.status(401).json({ error: "OTP has expired. Please request a new OTP." });
    }

    if (storedOtpData.otp !== otp) {
      return res.status(401).json({ error: "Invalid OTP" });
    }

    // OTP verified, remove from store
    otpStore.delete("admin");

    res.json({
      message: "OTP verified successfully",
      isAdmin: true
    });
  } catch (err) {
    console.error("Error verifying OTP:", err);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
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