const fs = require('fs');
const path = require('path');

const admin = require('firebase-admin');
admin.initializeApp();

class ItensService {

    createItens() {
        return admin
            .firestore()
            .doc("configuracao/versaoItem")
            .get()
            .then(resultVersaoItem => {
                let versaoServidor = resultVersaoItem.data().versao;
                
                this.atualizarVersaoItem(versaoServidor);

                return;
            }).catch(err => {
                console.log(err);
            });
    }

    atualizarVersaoItem(versaoServidor) {
        const versionItem = 1;
        
        if (versaoServidor >= versionItem) {
            console.log("Versao servidor já esta atualizada");
            return;
        }

        while (versaoServidor !== versionItem) {
            versaoServidor++;

            let data;
            try {
                data = fs.readFileSync(path.join(__dirname, `/../assets/itens_${versaoServidor}.json`));
            } catch (e) {
                throw e;
            }

            let itensJson = JSON.parse(data);
            
            itensJson.forEach(item => {
                this.adicionaItem(item, versaoServidor)
                    .then(file => {
                        console.log(file)
                        return;
                    }).catch(err => {
                        console.log(err)
                    });
            });
        }
    }

    adicionaItem(item, versaoServidor) {
        return admin
            .firestore()
            .collection(`itens/${item.tipoItem}/listItens`)
            .add({
                foto: item.foto,
                valor: item.valor,
                dificuldadeItem: item.dificuldadeItem,
                sexo: item.sexo
            }).then(uidItem => {
                return admin
                    .storage()
                    .bucket()
                    .upload(path.join(__dirname, `/../assets/itens_${versaoServidor}/${item.tipoItem}/${item.foto}.png`), {
                        destination: `itens/${item.tipoItem}/${uidItem.id}.png` 
                    });

            }).catch(err => {
                console.log(err)
            });
    }

}

module.exports = new ItensService