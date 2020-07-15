const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
const petsSchema = new Schema ({
    id: {
        type:       Number,
        required:   true
    },
    name: {
        type:       String,
        required:   true,
        unique:     true,
        uppercase:  true
    },
    race: {
        type:       String,
        uppercase:  true
    },
    species: {
        type:       String,
        uppercase:  true
    },
    gender: {
        type:       String,
        uppercase:  true
    },
    age: {
        type:       Number
    },
    vaccinesO: {
        type:       String,
        uppercase:  true
    },
    vaccines: {
        type:       String,
        uppercase:  true
    },
    imageUrl: {
        type:       String
    },
    address: {
        type:       String
    }
}, {
    timestamps: true
});
module.exports = petsSchema;