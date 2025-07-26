const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const User = require("./models/User");
const Cart = require("./models/Cart");
const products = require("./data/products");

dotenv.config();

//Connect to mongoDB
mongoose.connect(process.env.MONGO_URI);

//Function to seed data

const seedData = async () => {
    try {
        // clear existing data
        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany();

        // Create a default admin User
        const createUser = await User.create({
            name: "Admin User",
            email: "admin@example.com",
            password: "1234567",
            role: "admin",
        });

        // Assign the default user Id to each product
        const UserID = createUser._id;

        const sampleProducts = products.map((product) => {
            return { ...product, user: UserID };
        });

        //Insert the product into the database
        await Product.insertMany(sampleProducts);

        console.log("Product data seeded successfylly");
        process.exit();
    } catch (error) {
        console.error("Error seeding the data:", error);
        process.exit(1);
    }
};

seedData();