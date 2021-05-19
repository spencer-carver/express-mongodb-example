import mongoose from "mongoose";
const { Schema } = mongoose;

const RestaurantSchema = new Schema({
    _id: String,
    address: {
        building: Number,
        coord: [ Number ],
        street: String,
        zipcode: Number
    },
    borough: String,
    cuisine: String,
    grades: [{
        date: Date,
        grade: String,
        score: Number
    }],
    name: String,
    restaurant_id: String
}, { collection: "restaurants" });

export default RestaurantSchema;
