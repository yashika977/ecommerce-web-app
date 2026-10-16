const express = require("express");
const Cart = require("../models/Cart");

const router = express.Router();

// GET cart items for a user
router.get("/:userId", async (req, res) => {
  try {
    const cartItems = await Cart.find({
      userId: req.params.userId
    }).populate("productId");

    res.json(cartItems);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching cart"
    });
  }
});

// ADD item to cart
router.post("/", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || !quantity) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const cartItem = new Cart({
      userId,
      productId,
      quantity
    });

    const savedItem = await cartItem.save();

    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({
      message: "Error adding item to cart"
    });
  }
});

// UPDATE cart quantity
router.put("/:id", async (req, res) => {
  try {
    const updatedItem = await Cart.findByIdAndUpdate(
      req.params.id,
      { quantity: req.body.quantity },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({
        message: "Cart item not found"
      });
    }

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({
      message: "Error updating cart"
    });
  }
});

// DELETE item from cart
router.delete("/:id", async (req, res) => {
  try {
    const deletedItem = await Cart.findByIdAndDelete(
      req.params.id
    );

    if (!deletedItem) {
      return res.status(404).json({
        message: "Cart item not found"
      });
    }

    res.json({
      message: "Item removed from cart"
    });
  } catch (error) {
    res.status(500).json({
      message: "Error removing item from cart"
    });
  }
});

module.exports = router;