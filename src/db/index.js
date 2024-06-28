const mongoose = require("mongoose");
const { DB_NAME } = require('../contants.js');

const connectDB = async function () {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`DataBase connection successful!! 🎉🎉`);
    }
    catch (err) {
        console.log(`An Error Occurred !! \n ${err}`);
        throw err;
    }
}

module.exports = connectDB;