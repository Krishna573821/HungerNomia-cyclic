const mongoose = require("mongoose");
require("dotenv").config();

async function mongoDB() {
  const dbUrl = process.env.DBURL;

  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      socketTimeoutMS: 30000,
    });
    console.log("MongoDB connected successfully");

    const fetched_data = await mongoose.connection.db
      .collection("food_items")
      .find({})
      .toArray();
    const foodCategory = await mongoose.connection.db
      .collection("foodCategory")
      .find({})
      .toArray();

    global.food_items = fetched_data;
    global.foodCategory = foodCategory;
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

module.exports = mongoDB;
