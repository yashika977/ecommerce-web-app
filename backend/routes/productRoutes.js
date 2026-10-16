
const express = require("express");
const Product = require("../models/Product");

const {
  verifyToken,
  verifyAdmin
} = require("../middleware/authMiddleware");

const router = express.Router();

// GET ALL PRODUCTS
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;

    const filter = category ? { category } : {};
    const products = await Product.find(filter);

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products"
    });
  }
});

// GET ONE PRODUCT
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({
      message: "Invalid product ID"
    });
  }
});

// CREATE PRODUCT - ADMIN ONLY
router.post("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { name, price, category, image, icon } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      price === undefined ||
      price === null ||
      price === "" ||
      !Number.isFinite(Number(price)) ||
      Number(price) <= 0 ||
      typeof category !== "string" ||
      !category.trim()
    ) {
      return res.status(400).json({
        message: "Please provide a valid name, price and category"
      });
    }

    if (
      image !== undefined &&
      typeof image !== "string"
    ) {
      return res.status(400).json({
        message: "Product image URL must be text"
      });
    }

    if (
      icon !== undefined &&
      typeof icon !== "string"
    ) {
      return res.status(400).json({
        message: "Product icon must be text"
      });
    }

    const product = new Product({
      name: name.trim(),
      price: Number(price),
      category: category.trim(),
      image: image ? image.trim() : "",
      icon: icon && icon.trim() ? icon.trim() : "🛍️"
    });

    const savedProduct = await product.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({
      message: "Error creating product"
    });
  }
});

// UPDATE PRODUCT - ADMIN ONLY
router.put("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { name, price, category, image, icon } = req.body;
    const updates = {};

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          message: "Product name is invalid"
        });
      }

      updates.name = name.trim();
    }

    if (price !== undefined) {
      if (
        price === "" ||
        !Number.isFinite(Number(price)) ||
        Number(price) <= 0
      ) {
        return res.status(400).json({
          message: "Product price must be greater than zero"
        });
      }

      updates.price = Number(price);
    }

    if (category !== undefined) {
      if (typeof category !== "string" || !category.trim()) {
        return res.status(400).json({
          message: "Product category is invalid"
        });
      }

      updates.category = category.trim();
    }

    if (image !== undefined) {
      if (typeof image !== "string") {
        return res.status(400).json({
          message: "Product image URL must be text"
        });
      }

      updates.image = image.trim();
    }

    if (icon !== undefined) {
      if (typeof icon !== "string") {
        return res.status(400).json({
          message: "Product icon must be text"
        });
      }

      updates.icon = icon.trim() || "🛍️";
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "No product fields provided"
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({
      message: "Error updating product"
    });
  }
});

// DELETE PRODUCT - ADMIN ONLY
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(
      req.params.id
    );

    if (!deletedProduct) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json({
      message: "Product deleted successfully"
    });
  } catch (error) {
    res.status(400).json({
      message: "Error deleting product"
    });
  }
});

module.exports = router;