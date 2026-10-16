
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  price: {
    type: Number,
    required: true,
    min: 0.01
  },

  category: {
    type: String,
    required: true,
    trim: true
  },

  image: {
    type: String,
    default: ""
  },

  icon: {
    type: String,
    default: "🛍️"
  }
});

module.exports = mongoose.model("Product", productSchema);