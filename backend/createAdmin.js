
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

async function createAdmin() {
  try {
    if (
      !process.env.MONGO_URI ||
      !process.env.ADMIN_NAME ||
      !process.env.ADMIN_EMAIL ||
      !process.env.ADMIN_PASSWORD
    ) {
      throw new Error("Required environment settings are missing");
    }

    if (process.env.ADMIN_PASSWORD.length < 12) {
      throw new Error("Admin password must contain at least 12 characters");
    }

    await mongoose.connect(process.env.MONGO_URI);

    const email = process.env.ADMIN_EMAIL.trim().toLowerCase();

    let admin = await User.findOne({ email });

    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD,
      10
    );

    if (admin) {
      admin.name = process.env.ADMIN_NAME.trim();
      admin.password = hashedPassword;
      admin.role = "admin";
    } else {
      admin = new User({
        name: process.env.ADMIN_NAME.trim(),
        email,
        password: hashedPassword,
        role: "admin"
      });
    }

    await admin.save();

    console.log("Admin account created or updated successfully.");
    console.log("Admin email:", email);
  } catch (error) {
    console.error("Admin setup failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();