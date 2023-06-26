import mongoose from 'mongoose';


const db = async () => {
    mongoose.connect('mongodb+srv://99977ujjwalpal:lBkBZcmmQdRP2slJ@cluster0.rlq6h2d.mongodb.net/db?retryWrites=true&w=majority')
}

export default db;