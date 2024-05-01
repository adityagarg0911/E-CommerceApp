import mongoose from 'mongoose';


const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Connected to MongoDB database ${connection.connection.host} `)
    } catch (error) {
        console.log(`Error in MongoDB ${error}`);
    }
}

export default connectDB;