const functions = require('firebase-functions');

exports.atualizaItens = functions
    .https
    .onRequest(async (data, context) => {
        const itensService  = require('./services/itens-service');

        try {
            await itensService.createItens();
        } catch (err) {
            context.send(err);
        }
        
        context.send("CABO");
    });

exports.createUser = functions
    .https
    .onCall(async (data, context) => {
        const firebaseService  = require('./services/firebase-service');
        
        const { nick, email, password, sexo } = data;

        if ( nick === null || nick === undefined || nick.trim() === "" ) {
            return console.log("Parametro nick está vazio ou incorreto");
        }

        if ( email === null || email === undefined || email.trim() === "" ) {
            return console.log("Parametro email está vazio ou incorreto");
        }

        if ( password === null || password === undefined || password.trim() === "" ) {
            return console.log("Parametro password está vazio ou incorreto");
        }

        if ( sexo === null || sexo === undefined || (sexo !== "M" && sexo !== "F") ) {
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
        
        return "deu certo";
    });