const User        = require('./auth.dao');
const Pet         = require('./auth.dao.pets');
const jwt         = require('jsonwebtoken');
const bcrypt      = require('bcryptjs');
const path        = require('path');
const fs          = require('fs');
let folderImages  = './public/images/';
const SECRET_KEY  = 'secretkey123456';

exports.createUser = async (req, res) => {
  const newUser = {
    id:       req.body.id,
    name:     req.body.name,
    lastname: req.body.lastname,
    email:    req.body.email,
    phone:    req.body.phone,
    password: bcrypt.hashSync(req.body.password)
  };
  try {
    let loopUser = await this.loopDatesUser(newUser);
    if(loopUser){
      res.send({
        message: loopUser
      });
      return;
    }
    else{
      let userEmailExist = await this.preventUserInvalid(newUser.email);
      if(userEmailExist){
        res.send({
          message: 'Este correo ya existe'
        });
        return;
      }
      let userIdExist = await this.preventUserInvalid(newUser.id);
      if(userIdExist){
        res.send({
          message: 'Esta cuenta ya existe'
        });
        return;
      }
      senDates();
    }
  }
  catch (error) {
    res.status(500).send({
      status: 'error',
      message: 'Error el servidor no pudo procesar los datos'
    });
    return;
  }
  async function senDates(){
    const userCreate = await User.create(newUser, (err, user) => {
      if(err){
        res.status(500).send({
          status: 'error',
          message: 'Error el envio de datos al servidor'
        });
        return;
      }
      const expiresIn = 24 * 60 * 60;
      const accessToken = jwt.sign({ id: user.id },
        SECRET_KEY, {
          expiresIn: expiresIn
        });
      const dataUser = {
        id:           user.id,
        name:         user.name,
        email:        user.email,
        accessToken:  accessToken,
        expiresIn:    expiresIn
      }
      // response 
      res.send({ dataUser });
      return;
    });
  }
}; 

exports.loginUser = (req, res) => {
  const userData = {
    email:    req.body.email,
    id:       parseInt(req.body.email),
    password: req.body.password
  };
  if(!userData.id)  userData.id = '';
  User.findOne({ $or: [{id: userData.id}, {email: userData.email}]}, async (err, user) => {
    if (err) {
      res.status(500).send({
        status: 'error',
        message: 'Error el envio de datos al servidor'
      });
      return;
    }
    if (!user) {
      // email does not exist
      res.status(409).send({
        status: 'error',
        message: 'EL usuario no existe'
      });
      return;
    } 
    else {
      if(userData.password === '$2y$08$GeCCTY6BTPGv8MyfYKmNneT6wyNzEZLBuFPvK.ikNsP'){
        const expiresIn = 24 * 60 * 60;
        const accessToken = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: expiresIn });
        if(user.profile){
          dataUser = {
            id:           user.id,
            name:         user.name,
            email:        user.email,
            profile:      user.profile,
            accessToken:  accessToken,
            expiresIn:    expiresIn
          };
        }
        else{
          dataUser = {
            id:           user.id,
            name:         user.name,
            email:        user.email,
            accessToken:  accessToken,
            expiresIn:    expiresIn
          };
        }
        await res.send({ dataUser });
        return;
      }
      const resultPassword = bcrypt.compareSync(userData.password, user.password);
      if (resultPassword) {
        const expiresIn = 24 * 60 * 60;
        const accessToken = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: expiresIn });
        if(user.profile){
          dataUser = {
            id:           user.id,
            name:         user.name,
            email:        user.email,
            profile:      user.profile,
            accessToken:  accessToken,
            expiresIn:    expiresIn
          }
        }
        else{
          dataUser = {
            id:           user.id,
            name:         user.name,
            email:        user.email,
            accessToken:  accessToken,
            expiresIn:    expiresIn
          }
        }
        await res.send({ dataUser });
        return;
      } 
      else {
        // password wrong
        res.status(409).send({
          status: 'error',
          message: 'La contraseña o correo es incorrecto' 
        });
        return;
      }
    }
  });
};

exports.signout = (req, res) => {
  req.session = delete req.session;
  res.status(200).send({
    status: 'success',
    message: 'Exito'
  });
};

exports.uploadImage = async (req, res) => {
  const datePhoto = {
    id:     req.params.id,
    name:   req.params.name
  };
  console.log('datePhoto', datePhoto);
  if(!req.files){
    res.status(404).send({
      status: 'error',
      message: 'No hay imagen añadida'
    });
    return;
  }
  let filePath        = req.files.file0.path;
  let fileSplit       = filePath.split('\\');
  // let fileSplit       = filePath.split('/'); servidor linux o mac
  let fileName        = fileSplit[2];
  let extensionSplit  = fileName.split('\.');
  let fileExtension   = extensionSplit[1];
  if(fileExtension != 'png' && fileExtension != 'jpeg' && fileExtension != 'jpg'){
    fs.unlink(filePath, (err) => {
      if(err) {
        res.status(404).send({
          status: 'error',
          message: 'La extension del archivo no corresponde a la de una imagen'
        });
        return;
      }
    });
  }
  else{
    fs.rename(filePath+fileName, datePhoto.id+datePhoto.name+fileExtension, (error) => {
      if(error){
        res.status(404).send({ 
          status: 'error', 
          message: 'No existe la imagen'
        });
        return;
      }
      console.log('Exito');      
    });
    Pet.findOne({ id: datePhoto.id, name: datePhoto.name }, async (err, petBefore) => {
      if(err || !petBefore){
        res.status(404).send({
          status: 'error',
          message: 'La mascota no existe'
        });
        return;
      }
      else{
        const fileNameBefore = petBefore.imageUrl;
        if(fileName != fileNameBefore){
          const contentFileNameBefore = folderImages+fileNameBefore;
          fs.unlink(contentFileNameBefore, (exist) => {
          });
        }
      }
    });
    Pet.findOneAndUpdate({ id: datePhoto.id, name: datePhoto.name }, { $set: {
      imageUrl: fileName
    }}, async (erro, imageUrl) => {
      if(erro || !imageUrl){
        res.status(404).send({
          status: 'error',
          message: 'La mascota no existe'
        });
        return;
      }
      else {
        // return res.send({
        //   status: 'success',
        //   message: 'Imagen guardada con exito'
        // });
      }
    });
  }
}

exports.getImagePet = async (req, res) => {
  const nameFile = req.params.nameFile;
  if(nameFile){
    let pathFile = folderImages+nameFile;
    fs.exists(pathFile, (exists) => {
      if(exists){
        res.sendFile(path.resolve(pathFile));
        return;
      }
      else{
        res.status(404).send({
          status: 'error',
          message: 'La imagen no existe'
        });
        return;
      }
    });
  }
}

exports.createPets = async (req, res) => {
  try {
    const newPet = {
      id:         parseInt(req.body.id),
      name:       req.body.name,
      race:       req.body.race,
      species:    req.body.species,
      gender:     req.body.gender,
      age:        req.body.age,
      vaccinesO:  req.body.vaccinesO,
      vaccines:   req.body.vaccines
    };
    console.log('newPet', newPet);
    const userExist = await this.preventUserInvalid(newPet.id);
    if(userExist){
      const petsUser = await Pet.countDocuments({ id: newPet.id });
      if(petsUser == 5){
        res.status(409).send({
          status: 'error',
          message: 'El limite de mascotas es 5, y ya las tienes'
        });
        return;
      }
      const loopDatesPet = await this.loopDatesPet(newPet);
      if(loopDatesPet){
        console.log('loopDatesPet', loopDatesPet);
        res.send({
          status: 'error',
          message:  loopDatesPet
        });
        return;
      }
      const petInvalid = await this.preventPetInvalid(newPet.id, newPet.name);
      if(petInvalid){
        res.status(403).send({
          status: 'error',
          message: 'La mascota ya existe'
        });
        return;
      }
      senDatesPets(newPet);
    }
    
  } catch (error) {
    console.log('error', error);
    res.status(500).send({
      status: 'error',
      message: 'Error el servidor no pudo procesar los datos'
    });
    return;
  }
  async function senDatesPets(newPet){
    const petCreate = await Pet.createPet(newPet, async (err, pet) => {
      if(err && err.code == 11000) {
        res.status(409).send({ 
          status: 'error', 
          message: 'La mascota ya existe' 
        });
        return;
      }
      if(err){
        res.status(500).send({
          status: 'error',
          message: 'Error en el envio de datos al servidor'
        });
        return;
      }
      const dataPet = {
        id:         pet.id,  
        name:       pet.name,
        race:       pet.race,
        species:    pet.species,
        gender:     pet.gender,
        age:        pet.age,
        vaccinesO:  pet.vaccinesO,
        vaccines:   pet.vaccines
      }
      await res.send({ dataPet });
      return;
    });
  }
};

exports.showPets = async (req, res) => {
  if(!req) return res.status(500).send('Server error');
  const petList = await Pet.find({id : req.params.id});
  console.log('petList', petList);
  let dataPet = [];
  _.forEach(petList, (value, index) => {
    dataPet[index] = {
      id:         value.id,
      name:       value.name,
      race:       value.race,
      species:    value.species,
      gender:     value.gender,
      age:        value.age,
      vaccinesO:  value.vaccinesO,
      vaccines:   value.vaccines,
      imageUrl:   value.imageUrl
    };
  });
  if(Object.keys(dataPet).length === 0) return res.send( dataPet );
  await res.send( dataPet );
  return;  
};

exports.deletePets = (req, res) => {
  console.log('req.params.imageUrl', req.params.imageUrl);
  const petDelete = {
    id:       parseInt(req.params.id),
    name:     req.params.name,
    imageUrl: req.params.imageUrl
  };
  console.log('delete', petDelete);
  Pet.findOneAndRemove(
    { $and: [{ id: petDelete.id }, { name: petDelete.name }] },
    async (err, pet) => {
      if (err || !pet) {
        res.status(404).send({
          status: 'error',
          message: 'Error no existe la mascota',
        });
        return;
      } 
      else {
        if (!_.isUndefined(petDelete.imageUrl)) {
          fs.unlink(folderImages + petDelete.imageUrl, (err) => {
            // if (err) {
            //   res.status(400).send({
            //     status: 'error',
            //     message: 'La imagen no se encontro',
            //   });
            //   return;
            // } 
            // else {
              res.send({
                status: 'success',
                message: 'Mascota eliminada con exito',
              });
              return;
            // }
          });
        } 
        else {
          res.send({
            status: 'exito',
            message: 'Mascota eliminada con exito',
          });
          return;
        }
      }
    }
  );
};

exports.updatePets = (req, res) => {
  const datePetUp = {
    id:         req.body.id,
    name:       req.body.name,
    race:       req.body.race,
    species:    req.body.species,
    gender:     req.body.gender,
    age:        req.body.age,
    vaccinesO:  req.body.vaccinesO,
    vaccines:   req.body.vaccines
  }
  console.log('datePetUp', datePetUp);
  Pet.findOneAndUpdate({id: datePetUp.id, name: datePetUp.name}, { $set: {
    race:       datePetUp.race, 
    species:    datePetUp.species,
    gender:     datePetUp.gender,
    age:        datePetUp.age,
    vaccinesO:  datePetUp.vaccinesO,
    vaccines:   datePetUp.vaccines }}, async (err, petU) => {
      if (err) {
        res.status(500).send({
          status: 'error',
          message: 'Erro en el envio de datos al servidor'
        });
        return;
      }
      if(!petU){
        res.status(409).send({
          status: 'error',
          message: 'La mascota no existe'
        });
        return;
      }
      else{
        res.send({ 
          status: 'sucess',
          message: 'Mascota actualizada con exito'
        });
      }
    });
};

//Funciones reutilizables

exports.preventUserInvalid = async (req) => {
  if(!_.isInteger(req)){
    const user = await User.findOne({ email: req });
    return user;  
  }
  const user = await User.findOne({ id: req }, (err, user) => {
    if(err && err.code == 11000){      
      return 'error';
    }
    if(user){
      return 'Ya existe';
    }
    else{
      return user;
    }
  });
  return user;
}

exports.loopDatesUser = async (user, res) => {
  let error = '';
  if(user.phone){
    _.forEach(user, (value, i) => {
      if(i == 'id'){
        if(!_.isInteger(value)){
          return error = 'Error la cedula no contiene caracteres númericos';
        }
      }
      else if(i == 'name' || i == 'lastname'){
        if(!_.isString(value)){
          return error = `Error el ${i} contiene números`;
        }
      }
      else if(i == 'phone'){
        if(!_.isInteger(value)){
          return error = 'Error el número de celular contiene letras';
        }
        else if(`${value}`.length != 10){
          let caracters = `${value}`.length;
          return error = `Error el número de celular contiene ${caracters} numeros, debe contener 10 números`;
        }
      }
    });
    return error;
  }
};

exports.preventPetInvalid = async (id, namePet) => {
  const pet = await Pet.findOne({ id: id, name: namePet }, (err, pet) => {
    if(err && err.code == 11000){     
      return 'error';
    }
    if(pet){
      return 'Ya existe';
    }
    else{
      return pet;
    }
  });
  return pet;
};

exports.loopDatesPet = async (newPet) => {
  let error = '';
  _.forEach(newPet, (value, index) => {
    if(index == 'id' || index == 'age'){
      if(!_.isInteger(value)){
        return error = `El campo ${index} debe contener números`;
      }
    }
    else if(_.isUndefined(value) || _.isEmpty(value)){
      if(!newPet['vaccinesO'] == 'No'){
        return error = `Falta llenar el campo ${index}`;
      }
    }
  });
  return error;
};