import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

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

const products = [
  // One Sound Cracker
  { name: '3½" Lakshmi Crackers', category: 'One Sound Cracker', mrp: 70, sellingPrice: 14 },
  { name: '4" Lakshmi Crackers', category: 'One Sound Cracker', mrp: 105, sellingPrice: 21 },
  { name: '4" Deluxe Lakshmi', category: 'One Sound Cracker', mrp: 150, sellingPrice: 30 },
  { name: '4" Sup. Deluxe Hulk', category: 'One Sound Cracker', mrp: 160, sellingPrice: 32 },
  { name: '4" Deluxe Gold Lakshmi', category: 'One Sound Cracker', mrp: 160, sellingPrice: 32 },
  { name: 'Two Sound Crackers', category: 'One Sound Cracker', mrp: 160, sellingPrice: 32 },
  { name: '4" Mega Deluxe', category: 'One Sound Cracker', mrp: 220, sellingPrice: 44 },
  { name: '2¾" Kuruvi Crackers', category: 'One Sound Cracker', mrp: 45, sellingPrice: 9 },

  // Ground Chakkars
  { name: 'Ground Chakkar Big 10 Pcs', category: 'Ground Chakkars', mrp: 260, sellingPrice: 52 },
  { name: 'Ground Chakkar Big 25 Pcs', category: 'Ground Chakkars', mrp: 460, sellingPrice: 92 },
  { name: 'Ground Chakkar Asoka', category: 'Ground Chakkars', mrp: 350, sellingPrice: 70 },
  { name: 'Ground Chakkar Special', category: 'Ground Chakkars', mrp: 450, sellingPrice: 90 },
  { name: 'Ground Chakkar Deluxe', category: 'Ground Chakkars', mrp: 600, sellingPrice: 120 },
  { name: 'Whizzling Wheel', category: 'Ground Chakkars', mrp: 950, sellingPrice: 190 },
  { name: 'Disco Wheel', category: 'Ground Chakkars', mrp: 400, sellingPrice: 80 },

  // Flower Pots
  { name: 'Flower Pots Small', category: 'Flower Pots', mrp: 225, sellingPrice: 45 },
  { name: 'Flower Pots Big', category: 'Flower Pots', mrp: 400, sellingPrice: 80 },
  { name: 'Flower Pots Special', category: 'Flower Pots', mrp: 550, sellingPrice: 110 },
  { name: 'Flower Pots Asoka', category: 'Flower Pots', mrp: 900, sellingPrice: 180 },
  { name: 'Flower Pots Giant', category: 'Flower Pots', mrp: 1500, sellingPrice: 300 },
  { name: 'Flower Pots Deluxe (5 Pcs)', category: 'Flower Pots', mrp: 750, sellingPrice: 150 },
  { name: 'Flower Pots Sup.Dlx. (2 Pcs)', category: 'Flower Pots', mrp: 750, sellingPrice: 150 },
  { name: 'Colour Koti', category: 'Flower Pots', mrp: 1050, sellingPrice: 210 },
  { name: 'Colour Koti Deluxe', category: 'Flower Pots', mrp: 1550, sellingPrice: 310 },
  { name: 'Tri Colour Pots (5 Pcs)', category: 'Flower Pots', mrp: 1350, sellingPrice: 270 },

  // TWINKLING STAR
  { name: '1½" Twinkling Star', category: 'TWINKLING STAR', mrp: 130, sellingPrice: 26 },
  { name: '4" Twinkling Star', category: 'TWINKLING STAR', mrp: 300, sellingPrice: 60 },

  // CANDLES
  { name: '7" Pencil', category: 'CANDLES', mrp: 150, sellingPrice: 30 },
  { name: '10" Pencil', category: 'CANDLES', mrp: 325, sellingPrice: 65 },
  { name: '12" Silver Rock Torch', category: 'CANDLES', mrp: 425, sellingPrice: 85 },
  { name: 'Star Pencil Special (2 Pcs)', category: 'CANDLES', mrp: 950, sellingPrice: 190 },
  { name: 'Ultra Pencil (3 Pcs)', category: 'CANDLES', mrp: 400, sellingPrice: 80 },
  { name: 'Water Fall Pencil (5 Pcs)', category: 'CANDLES', mrp: 900, sellingPrice: 180 },

  // CHILDREN'S TOYS
  { name: 'Kit Kat', category: "CHILDREN'S TOYS", mrp: 175, sellingPrice: 35 },
  { name: 'Mega Kit Kat', category: "CHILDREN'S TOYS", mrp: 300, sellingPrice: 60 },
  { name: 'Top Gun (5 Pcs)', category: "CHILDREN'S TOYS", mrp: 1000, sellingPrice: 200 },
  { name: 'Smoke Colour Fountain Stick', category: "CHILDREN'S TOYS", mrp: 1250, sellingPrice: 250 },

  // ROCKETS
  { name: 'Baby Rocket', category: 'ROCKETS', mrp: 200, sellingPrice: 40 },
  { name: 'Rocket Bomb', category: 'ROCKETS', mrp: 350, sellingPrice: 70 },
  { name: 'Lunik Express', category: 'ROCKETS', mrp: 650, sellingPrice: 130 },
  { name: 'Two Sound Rocket', category: 'ROCKETS', mrp: 700, sellingPrice: 140 },
  { name: 'Whistling Rocket', category: 'ROCKETS', mrp: 700, sellingPrice: 140 },

  // Bijill Crackers
  { name: 'Old is Gold (25 Pcs)', category: 'Bijill Crackers', mrp: 750, sellingPrice: 150 },
  { name: 'Red Bijili 50\'s Crackers', category: 'Bijill Crackers', mrp: 100, sellingPrice: 20 },
  { name: 'Red Bijili 100\'s Crackers', category: 'Bijill Crackers', mrp: 200, sellingPrice: 40 },
  { name: '28 Chorsa Crackers', category: 'Bijill Crackers', mrp: 80, sellingPrice: 16 },
  { name: '28 Giant Crackers', category: 'Bijill Crackers', mrp: 130, sellingPrice: 26 },
  { name: '56 Giant Crackers', category: 'Bijill Crackers', mrp: 260, sellingPrice: 52 },
  { name: '24 Deluxe Crackers', category: 'Bijill Crackers', mrp: 250, sellingPrice: 50 },
  { name: '50 Deluxe Crackers', category: 'Bijill Crackers', mrp: 500, sellingPrice: 100 },
  { name: '100 Wala Deluxe', category: 'Bijill Crackers', mrp: 1000, sellingPrice: 200 },

  // ATOM BOMBS
  { name: 'Atom Bomb', category: 'ATOM BOMBS', mrp: 225, sellingPrice: 45 },
  { name: 'Hydro Bomb', category: 'ATOM BOMBS', mrp: 350, sellingPrice: 70 },
  { name: 'King of King Bomb', category: 'ATOM BOMBS', mrp: 450, sellingPrice: 90 },
  { name: 'Classic Bomb', category: 'ATOM BOMBS', mrp: 550, sellingPrice: 110 },
  { name: 'Agni Bomb', category: 'ATOM BOMBS', mrp: 800, sellingPrice: 160 },
  { name: 'Mega Deluxe Bomb', category: 'ATOM BOMBS', mrp: 1000, sellingPrice: 200 },
  { name: 'Bullet Bomb', category: 'ATOM BOMBS', mrp: 150, sellingPrice: 30 },

  // GARLAND CRACKERS
  { name: '100 Wala Garland', category: 'GARLAND CRACKERS', mrp: 200, sellingPrice: 40 },
  { name: '200 Wala Garland', category: 'GARLAND CRACKERS', mrp: 400, sellingPrice: 80 },
  { name: '300 Wala Garland', category: 'GARLAND CRACKERS', mrp: 600, sellingPrice: 120 },
  { name: '1000 Wala Express', category: 'GARLAND CRACKERS', mrp: 1400, sellingPrice: 280 },
  { name: '1000 Wala Garland', category: 'GARLAND CRACKERS', mrp: 950, sellingPrice: 190 },
  { name: '2000 Wala Express', category: 'GARLAND CRACKERS', mrp: 2800, sellingPrice: 560 },
  { name: '2000 Wala Garland', category: 'GARLAND CRACKERS', mrp: 1900, sellingPrice: 380 },
  { name: '5000 Wala Express', category: 'GARLAND CRACKERS', mrp: 7000, sellingPrice: 1400 },
  { name: '5000 Wala Garland', category: 'GARLAND CRACKERS', mrp: 5000, sellingPrice: 1000 },
  { name: '10000 Wala Express', category: 'GARLAND CRACKERS', mrp: 14000, sellingPrice: 2800 },
  { name: '10000 Wala Garland', category: 'GARLAND CRACKERS', mrp: 10000, sellingPrice: 2000 },

  // FANCY DELIGHTS
  { name: 'Photo Flash', category: 'FANCY DELIGHTS', mrp: 450, sellingPrice: 90 },
  { name: 'Magic Butterfly', category: 'FANCY DELIGHTS', mrp: 450, sellingPrice: 90 },
  { name: 'Ganga Jamuna', category: 'FANCY DELIGHTS', mrp: 450, sellingPrice: 90 },
  { name: 'Mega Siren (2 Pcs)', category: 'FANCY DELIGHTS', mrp: 800, sellingPrice: 160 },
  { name: 'Mini Siren (5 Pcs)', category: 'FANCY DELIGHTS', mrp: 750, sellingPrice: 150 },
  { name: '2" Magic Shower', category: 'FANCY DELIGHTS', mrp: 650, sellingPrice: 130 },
  { name: '3" Magic Shower', category: 'FANCY DELIGHTS', mrp: 750, sellingPrice: 150 },
  { name: 'Golden Rain Shower', category: 'FANCY DELIGHTS', mrp: 450, sellingPrice: 90 },
  { name: 'Sky Shots (6 Pcs)', category: 'FANCY DELIGHTS', mrp: 750, sellingPrice: 150 },
  { name: 'Peacock Dance', category: 'FANCY DELIGHTS', mrp: 850, sellingPrice: 170 },
  { name: 'Peacock Feather', category: 'FANCY DELIGHTS', mrp: 450, sellingPrice: 90 },
  { name: 'Star Show', category: 'FANCY DELIGHTS', mrp: 750, sellingPrice: 150 },
  { name: 'Water Falls Shower', category: 'FANCY DELIGHTS', mrp: 750, sellingPrice: 150 },
  { name: 'Angry Birds (5 Pcs)', category: 'FANCY DELIGHTS', mrp: 1250, sellingPrice: 250 },
  { name: 'Pogo (5 Pcs)', category: 'FANCY DELIGHTS', mrp: 800, sellingPrice: 160 },
  { name: 'Drone', category: 'FANCY DELIGHTS', mrp: 1000, sellingPrice: 200 },
  { name: 'Heli Copter', category: 'FANCY DELIGHTS', mrp: 625, sellingPrice: 125 },
  { name: 'Bambara', category: 'FANCY DELIGHTS', mrp: 625, sellingPrice: 125 },
  { name: 'Money Bank', category: 'FANCY DELIGHTS', mrp: 1250, sellingPrice: 250 },
  { name: 'Tin Beer Shower (1 Pce)', category: 'FANCY DELIGHTS', mrp: 600, sellingPrice: 120 },
  { name: 'Coins (Single Pce)', category: 'FANCY DELIGHTS', mrp: 300, sellingPrice: 60 },
  { name: 'Fun Zone (5 Pcs)', category: 'FANCY DELIGHTS', mrp: 1900, sellingPrice: 380 },

  // REPEATING SHOTS
  { name: '7 Shots (5 Pcs)', category: 'REPEATING SHOTS', mrp: 625, sellingPrice: 125 },
  { name: '12 Shots Multi Colour', category: 'REPEATING SHOTS', mrp: 1050, sellingPrice: 210 },
  { name: '15 Shots Multi Colour', category: 'REPEATING SHOTS', mrp: 1400, sellingPrice: 280 },
  { name: '25 Shots Multi Colour', category: 'REPEATING SHOTS', mrp: 1750, sellingPrice: 350 },
  { name: '30 Shots Multi Colour', category: 'REPEATING SHOTS', mrp: 1950, sellingPrice: 390 },
  { name: '60 Shots Multi Colour', category: 'REPEATING SHOTS', mrp: 3900, sellingPrice: 780 },
  { name: '120 Shot Multi Colour', category: 'REPEATING SHOTS', mrp: 7600, sellingPrice: 1520 },
  { name: '240 Shot Multi Colour', category: 'REPEATING SHOTS', mrp: 14250, sellingPrice: 2850 },
  { name: 'Thriller (32 Mega Shot)', category: 'REPEATING SHOTS', mrp: 19250, sellingPrice: 3850 },

  // NIGHT ATTRACTIONS
  { name: '1¼" Pipe Fancy (Single)', category: 'NIGHT ATTRACTIONS', mrp: 250, sellingPrice: 50 },
  { name: '1¼" Pipe Fancy (3 Pcs)', category: 'NIGHT ATTRACTIONS', mrp: 750, sellingPrice: 150 },
  { name: '2½" Pipe Fancy (Single)', category: 'NIGHT ATTRACTIONS', mrp: 750, sellingPrice: 150 },
  { name: '2½" Colour Out (3 Pcs)', category: 'NIGHT ATTRACTIONS', mrp: 1400, sellingPrice: 280 },
  { name: '3" Pipe Colour Out Fancy', category: 'NIGHT ATTRACTIONS', mrp: 1100, sellingPrice: 220 },
  { name: '3½" Pipe Colour Out Fancy', category: 'NIGHT ATTRACTIONS', mrp: 1300, sellingPrice: 260 },
  { name: '3½" Pipe Double Ball', category: 'NIGHT ATTRACTIONS', mrp: 1450, sellingPrice: 290 },
  { name: '3½" Pipe Colour Out Fancy (2 Pcs)', category: 'NIGHT ATTRACTIONS', mrp: 2900, sellingPrice: 580 },
  { name: '4" Pipe Colour Out Fancy', category: 'NIGHT ATTRACTIONS', mrp: 1600, sellingPrice: 320 },
  { name: '4" Pipe Colour Out Fancy (2 Pcs)', category: 'NIGHT ATTRACTIONS', mrp: 3500, sellingPrice: 700 },

  // SPARKLERS
  { name: '7cm Electric Sparklers', category: 'SPARKLERS', mrp: 45, sellingPrice: 9 },
  { name: '7cm Colour Sparklers', category: 'SPARKLERS', mrp: 55, sellingPrice: 11 },
  { name: '7cm Green Sparklers', category: 'SPARKLERS', mrp: 65, sellingPrice: 13 },
  { name: '7cm Red Sparklers', category: 'SPARKLERS', mrp: 75, sellingPrice: 15 },
  { name: '10cm Electric Sparklers', category: 'SPARKLERS', mrp: 80, sellingPrice: 16 },
  { name: '10cm Colour Sparklers', category: 'SPARKLERS', mrp: 90, sellingPrice: 18 },
  { name: '10cm Green Sparklers', category: 'SPARKLERS', mrp: 100, sellingPrice: 20 },
  { name: '10cm Red Sparklers', category: 'SPARKLERS', mrp: 110, sellingPrice: 22 },
  { name: '12cm Electric Sparklers', category: 'SPARKLERS', mrp: 125, sellingPrice: 25 },
  { name: '12cm Colour Sparklers', category: 'SPARKLERS', mrp: 140, sellingPrice: 28 },
  { name: '12cm Green Sparklers', category: 'SPARKLERS', mrp: 155, sellingPrice: 31 },
  { name: '12cm Red Sparklers', category: 'SPARKLERS', mrp: 175, sellingPrice: 35 },
  { name: '15cm Electric Sparklers', category: 'SPARKLERS', mrp: 220, sellingPrice: 44 },
  { name: '15cm Colour Sparklers', category: 'SPARKLERS', mrp: 240, sellingPrice: 48 },
  { name: '15cm Green Sparklers', category: 'SPARKLERS', mrp: 260, sellingPrice: 52 },
  { name: '15cm Red Sparklers', category: 'SPARKLERS', mrp: 275, sellingPrice: 55 },
  { name: '30cm Electric Sparklers', category: 'SPARKLERS', mrp: 220, sellingPrice: 44 },
  { name: '30cm Colour Sparklers', category: 'SPARKLERS', mrp: 240, sellingPrice: 48 },
  { name: '30cm Green Sparklers', category: 'SPARKLERS', mrp: 260, sellingPrice: 52 },
  { name: '30cm Red Sparklers', category: 'SPARKLERS', mrp: 275, sellingPrice: 55 },
  { name: '50cm Electric Sparklers', category: 'SPARKLERS', mrp: 875, sellingPrice: 175 },
  { name: '50cm Colour Sparklers', category: 'SPARKLERS', mrp: 900, sellingPrice: 180 },

  // COLOUR MATCHES
  { name: 'Royal Mini Deluxe', category: 'COLOUR MATCHES', mrp: 250, sellingPrice: 50 },
  { name: 'Royal Deluxe', category: 'COLOUR MATCHES', mrp: 350, sellingPrice: 70 },
  { name: 'Royal Lamba', category: 'COLOUR MATCHES', mrp: 750, sellingPrice: 150 },
  { name: 'Royal Mega', category: 'COLOUR MATCHES', mrp: 1250, sellingPrice: 250 },
  { name: 'Roll Cap', category: 'COLOUR MATCHES', mrp: 400, sellingPrice: 80 },
  { name: 'Snake Tablet', category: 'COLOUR MATCHES', mrp: 200, sellingPrice: 40 },

  // NEW ARRIVALS
  { name: 'Shin Chan (5 Pcs)', category: 'NEW ARRIVALS', mrp: 450, sellingPrice: 90 },
  { name: 'Money Bank (3 Pcs)', category: 'NEW ARRIVALS', mrp: 875, sellingPrice: 175 },
  { name: '4 x 4 Wheel (4 Pcs)', category: 'NEW ARRIVALS', mrp: 750, sellingPrice: 150 },
  { name: 'Dora Singer (5 Pcs)', category: 'NEW ARRIVALS', mrp: 625, sellingPrice: 125 },
  { name: '90" Watts (3 Pcs)', category: 'NEW ARRIVALS', mrp: 625, sellingPrice: 125 },
  { name: 'Pistol Gun 5G (2 Pcs)', category: 'NEW ARRIVALS', mrp: 1250, sellingPrice: 250 },
  { name: 'Black Money (5 Pcs)', category: 'NEW ARRIVALS', mrp: 1250, sellingPrice: 250 },
  { name: 'Little Peacock', category: 'NEW ARRIVALS', mrp: 550, sellingPrice: 110 },
  { name: '6" Inch Tin Fountain', category: 'NEW ARRIVALS', mrp: 750, sellingPrice: 150 },
  { name: '4.5" Inch Tin Fountain', category: 'NEW ARRIVALS', mrp: 625, sellingPrice: 125 },
  { name: 'EMU', category: 'NEW ARRIVALS', mrp: 1000, sellingPrice: 200 },
];

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected.");

    console.log("Clearing existing products...");
    await Product.deleteMany({});
    console.log("✅ Cleared.");

    console.log(`Inserting ${products.length} products...`);
    
    // Add discount calculation and defaults
    const processedProducts = products.map(p => ({
      ...p,
      discount: Math.round(((p.mrp - p.sellingPrice) / p.mrp) * 100),
      image: "https://via.placeholder.com/300?text=" + encodeURIComponent(p.name),
      imageUrl: null,
      description: `${p.name} - Premium quality cracker from JayaSuriya Crackers.`
    }));

    await Product.insertMany(processedProducts);
    console.log("✅ Success: All products inserted!");
    
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding database:", err);
    process.exit(1);
  }
}

seed();
