import mongoose from "mongoose";
import { envConfig } from "./configs/env.js";

async function databaseConnect(){
    try {
        // need to fix "process.env"
        console.log("Connecting to:\n" + envConfig.mongo.host);
        await mongoose.connect(envConfig.mongo.host);
        console.log("Database connected!");
    } catch (error) {
        console.warn(`databaseConnect failed to connect to DB:\n${JSON.stringify(error)}`);
    }
}

export default databaseConnect;