const mongoose = require('mongoose');
const dbUrl    = require('./properties').DB;

module.exports = () => {
    mongoose.connect(dbUrl, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
    .then(() => console.log('Mongo conectado', dbUrl))
    .catch( err => console.log('Conexion Fallida', err))

    process.on('SIGINT', () => {
        mongoose.connection.close(()=>{
            console.log('Mongo esta desconectado');
            process.exit(0);
        });
    });
}