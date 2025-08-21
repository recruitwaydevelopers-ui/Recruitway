// Load environment variables
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Concatenate MONGODB_URL and DB_NAME to form the full MongoDB URI
        const mongoURI = `${process.env.MONGODB_URL}${process.env.DB_NAME}`;
        // console.log(mongoURI);

        const conn = await mongoose.connect(mongoURI);

        if (conn) {
            console.log(`MongoDB Connected: ${conn?.connection?.host}`);
        }

    } catch (error) {
        console.error(`MongoDB Connection Failed: ${error?.message}`);
        process.exit(1); // Exit the process if the connection fails
    }
};

module.exports = connectDB;
