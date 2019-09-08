const admin = require('firebase-admin');
admin.initializeApp();

class FirebaseService {

    userEmailExists(email) {
        return admin
            .firestore()
            .collection("usuario")
            .where("email", "==", email)
            .select("email")
            .get()
            .then(value => {
                return value.size > 0
            });
    }

    userNickExists(nick) {
        return admin
            .firestore()
            .collection("usuario")
            .where("nick", "==", nick)
            .select("nick")
            .get()
            .then(value => {
                return value.size > 0
            });
    }

    createAuthUser(email, password) {
        return admin
            .auth()
            .createUser({
                email,
                password
            });
    }

    createFirestorageUser(uid, email, password, nick, sexo) {

        

        admin
            .firestore()
            .collection("usuario")
            .add({
                uid,
                email,
                password,
                nick,
                sexo,
                dinheiro: 500,
                roupaAtiva: 1,
                conversas: []
            });
    }

    
}    

module.exports = new FirebaseService