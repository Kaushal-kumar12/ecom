const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected Successfully");
    } catch(err) {
        console.error("MongoDB connection failed.", err);
        process.exit(1);
    }
};

module.exports = connectDB;