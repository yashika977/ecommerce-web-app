const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/Product");

const products = [
  {
    name: "Wireless Headphones",
    price: 2999,
    category: "Electronics",
    icon: "🎧"
  },
  {
    name: "Smart Watch",
    price: 3999,
    category: "Electronics",
    icon: "⌚"
  },
  {
    name: "Running Shoes",
    price: 2499,
    category: "Fashion",
    icon: "👟"
  },
  {
    name: "Cotton T-Shirt",
    price: 799,
    category: "Fashion",
    icon: "👕"
  },
  {
    name: "Classic Sunglasses",
    price: 1299,
    category: "Fashion",
    icon: "🕶️"
  },
  {
    name: "Laptop Backpack",
    price: 1499,
    category: "Bags",
    icon: "🎒"
  },
  {
    name: "Bluetooth Speaker",
    price: 1999,
    category: "Electronics",
    icon: "🔊"
  },
  {
    name: "Desk Lamp",
    price: 999,
    category: "Home",
    icon: "💡"
  }
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    await Product.deleteMany({});

    await Product.insertMany(products);

    console.log("8 products added successfully");

    mongoose.connection.close();
  } catch (error) {
    console.log("Error adding products");
    console.log(error.message);
  }
}

seedProducts();