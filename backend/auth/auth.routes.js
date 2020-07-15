const Users     = require('./auth.controller');
const multipart = require('connect-multiparty');
const md_upload = multipart({ uploadDir: './public/images' });
module.exports  = (router) => {
  router.post('/register', Users.createUser);
  router.post('/login', Users.loginUser);
  router.post('/logout', Users.signout);
  router.post('/pets', Users.createPets);
  router.post('/showPetsAll', Users.showPetsAll)
  router.delete('/deletePets:id/:name/:imageUrl', Users.deletePets);
  router.put('/updatePets', Users.updatePets);
  router.post('/uploadImage:name/:id', md_upload, Users.uploadImage);
  router.get('/getImagePet/:nameFile', Users.getImagePet);
  // router.get('/showPets:id', Users.showPets);
}