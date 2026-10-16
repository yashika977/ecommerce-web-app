const express = require("express");
const Order = require("../models/Order");

const router = express.Router();

// CREATE ORDER
router.post("/", async (req, res) => {
  try {
    const { userId, items, totalAmount } = req.body;

    if (!userId || !items || items.length === 0 || !totalAmount) {
      return res.status(400).json({
        message: "User, items and total amount are required"
      });
    }

    const order = new Order({
      userId,
      items,
      totalAmount
    });

    const savedOrder = await order.save();

    res.status(201).json({
      message: "Order created successfully",
      order: savedOrder
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating order"
    });
  }
});

// GET ORDERS FOR A USER
router.get("/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.params.userId
    }).populate("items.productId");

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user orders"
    });
  }
});

// GET ALL ORDERS
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId")
      .populate("items.productId");

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching orders"
    });
  }
});

// UPDATE ORDER STATUS
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    res.json({
      message: "Order updated successfully",
      order: updatedOrder
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating order"
    });
  }
});

module.exports = router;