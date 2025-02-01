import mongoose from "mongoose"

const connectDB = async ()=>{
    try {
        mongoose.connect(process.env.MONGO_URL)
        console.log("Mongo Connected")
    } catch (error) {
        console.log(error)
    }
}

export default connectDB;