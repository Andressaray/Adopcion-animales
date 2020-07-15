const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

const userSchema = new Schema ({
    id: {
        type:       Number,
        required:   true,
        unique:     true
    },
    name: {
        type:       String,
        required:   true,
        uppercase:  true
    },
    lastname: {
        type:       String,
        required:   true,
        uppercase:  true
    }, 
    phone: {
        type:       Number,
        required:   true
    },
    email: {
        type:       String,
        required:   true,
        unique:     true,
        lowercase:  true
    },
    password: {
        type:       String,
        required:   true
    }
}, {
    timestamps: true
});

module.exports = userSchema;