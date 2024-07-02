import mongoose from "mongoose";
import { DB_NAME } from '../contants.js';

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

export default connectDB;