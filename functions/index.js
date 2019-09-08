const functions = require('firebase-functions');

const firebaseService  = require('./services/firebase-service');


exports.createUser = functions
    .https
    .onCall(async (data, context) => {

        const { nick, email, password, sexo } = data;

        if ( nick == null || nick == undefined || nick.trim() == "" ) {
            return console.log("Parametro nick está vazio ou incorreto");
        }

        if ( email == null || email == undefined || email.trim() == "" ) {
            return console.log("Parametro email está vazio ou incorreto");
        }

        if ( password == null || password == undefined || password.trim() == "" ) {
            return console.log("Parametro password está vazio ou incorreto");
        }

        if ( sexo == null || sexo == undefined || (sexo != "M" && sexo != "F") ) {
            return console.log("Parametro sexo está vazio ou incorreto");
        }

        if (await firebaseService.userNickExists(nick)) {
            return console.log("Nick já se encontra em uso");
        }

        if (await firebaseService.userEmailExists(email)) {
            return console.log("Email já se encontra em uso");
        }

        const { uid } = await firebaseService.createAuthUser(email, password);

        firebaseService.createFirestorageUser(uid, email, password, nick, sexo);
        
    });