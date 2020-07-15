const mongoose          = require('mongoose');
const petsSchema        = require('./auth.model.pets');

petsSchema.statics = {
  createPet: function (data, cb) {
    const pet = new this(data);
    pet.save(cb);
  }
};

const petsModel = mongoose.model('pets', petsSchema);
module.exports  = petsModel;