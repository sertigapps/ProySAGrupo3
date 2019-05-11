let fs = require('fs');
var jwt = require('jsonwebtoken');
const express = require('express')
const app = express();
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('servers.json');
const db = low(adapter);

app.use(express.json());
const port = 80;
const functionsRole = {
    'tienda' : 'obtenerCatalogo,enriquecerCatalogo,obtenerInventario,realizarDespacho',
    'pim' : 'obtenerCatalogo,enriquecerCatalogo,obtenerInventario,realizarDespacho',
    'bodega' : 'obtenerCatalogo,enriquecerCatalogo,obtenerInventario,realizarDespacho',
}
var servers = {};
app.get('/getServers', (req, res) => {
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(servers))
});

app.post('/getToken', (req, res) => {
    let response = {};
    let body = req.body;
    console.log(body);
    if ( !body.client_id || !body.client_secret || !servers[body.client_id] || servers[body.client_id].client_secret !== body.client_secret) {
        response.success = false;
        response.message = "Incorrect client_id o client_secret"
    } else {

        let token = jwt.sign({ scope: functionsRole[servers[body.client_id].rol] }, 'softwareavanzado', { algorithm: 'HS256'});
        const tokenData = {
            "access_token": token,
            "token_type": "bearer",
            "expires_in": 3600,
            "refresh_token": token,
            "scope":functionsRole[servers[body.client_id].rol]
        }
        jwt.verify(token, 'softwareavanzado', function(err, decoded) {
            if (err) {
                /*
                err = {
                    name: 'JsonWebTokenError',
                    message: 'jwt malformed'
                }
                */
            } else {
                response = tokenData;
            }
            });
    }
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(response))
});
app.get('/validateToken', (req, res) => {
    let response = {};
    let body = req.body;
    let token = req.header('authorization').split(' ')[1];
    jwt.verify(token, 'softwareavanzado', function(err, decoded) {
        console.log(err, decoded);
        if ( err ) {
            response.success = false;
            response.message = 'Token is not valid';
        } else {
            response.success = true;
            response.message = 'Welcome';
        }
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(response))
      });
});
/*Inicializar array de servers con archivo */
fs.readFile('entrada.json', 'utf-8', (err, data) => {
    if(err) {
      console.log('error: ', err);
    } else {
        try {
        let serversToCreate = JSON.parse(data);
        serversToCreate.forEach((ser, index) => {
            ser.client_secret = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            ser.id = index + 1;
            let server = db.get('servers')
            .find({ id: ser.id }).value();
            if ( server ) {
                servers[ser.id] = server;
            } else {
                db.get('servers').push(ser).write();
                servers[ser.id] = ser;
            }
        })
        } catch(e) {
            console.log('Mal Json en entrada.json', e)
        }
    }
  });
app.listen(port, () => console.log(`Servidor Autenticacion iniciado en puerto ${port} de contenedor!`))