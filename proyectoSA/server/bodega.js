let fs = require('fs');
var jwt = require('jsonwebtoken');
const express = require('express');
const app = express();
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('bodega.json');
const db = low(adapter);
app.use(express.json());
const port = 80;
var validateToken = function(req,cb){
    try {
        let token = req.header('authorization').split(' ')[1];
        jwt.verify(token, 'softwareavanzado', function(err, decoded) {
            if( err ){
                console.log(err);
                cb(false);
            } else {
                cb(true);
            }
        })
    } catch(e) {
        console.log(e);
        cb(false);
    }
}
app.listen(port, () => console.log(`Servidor Bodega iniciado en puerto ${port} de contenedor`))
app.get('/Bodega/obtenerInventario', (req, res) => {
    validateToken(req,function(valid){
        if ( valid ) {
            let periodo = Math.floor(Math.random() * 4) + 1;
            let response = {"products":[]};
            let body = req.body;
            body.periodo = periodo;
            db.get('solicitudes').push(body).write();
            body.arreglo.forEach(element => {
                let producto = db.get('productos')
                .find({ sku: element }).value();
                if( producto ) {
                    delete producto.tiempo;        
                    response.products.push(producto);
                }
            });
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify(response))
        } else {
            let response = {"error":true};
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify(response))
        }
    })
});
app.get('/Bodega/sincronizarInventario', (req, res) => {
    validateToken(req,function(valid){
        if ( valid ) {
            var request = require('request');
            var body = new Object();

            request({
                method: 'GET',
                preambleCRLF: true,
                postambleCRLF: true,
                uri: 'http://104.196.174.209/PIM/obtenerCatalogo',
                json: true
            },function (error, response, body) {
                if (error) {
                return console.error('upload failed:', error);
                }
                body.productos.forEach(function(o){
                    let obj = { 'sku' : o.sku , 'inventario' : Math.floor(Math.random() * 9999) + 1};
                    db.get('productos').push(obj).write();
                });

                let response2 = {"error":false};
                res.set('Content-Type', 'application/json');
                res.send(JSON.stringify(response2))
            });
        } else {
            let response = {"error":true};
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify(response))
        }
    })
});
app.post('/Bodega/realizarDespacho', (req, res) => {
    validateToken(req,function(valid){
        let periodo = Math.floor(Math.random() * 4) + 1;
        if ( valid ) {
            let response = {};
            let body = req.body;
            let producto = db.get('productos')
            .find({ sku: body.parametro.sku }).value();
            console.log(producto);
            if ( producto ) {
                if ( body.parametro.cantidad < producto.inventario ){
                    let newInv = producto.inventario - body.parametro.cantidad;
                    db.get('productos')
                    .find({ sku: body.parametro.sku })
                    .assign({ inventario: newInv})
                    .write();
                    body.parametro.periodo = periodo;
                    db.get('despachos').push(body.parametro).write();
                    response.resultado = true;
                } else {
                    body.parametro.periodo = periodo;
                    body.razon = 'Inventario no disponible';
                    db.get('despachosInvalidos').push(body.parametro).write();
                    response.resultado = false;
                }
            } else {
                body.parametro.periodo = periodo;
                body.razon = 'Producto no en inventario';
                db.get('despachosInvalidos').push(body.parametro).write();
                response.resultado = false;
            }
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify(response))
        } else {
            let response = {"error":true};
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify(response))
        }
    });
});

app.get('/Bodega/reporteInventario', (req, res) => {
    validateToken(req,function(valid){
        if ( valid ) {
            let reporte =       ["Tipo              Cantidad            SKUS"];
            let reporteIndexes = {  
                                    '1': {  
                                            'label' : 'Con Inventario',
                                            'cantidad' : 0,
                                            'SKUS' : [],
                                        },
                                    '0': {
                                            'label' : 'Sin Inventario',
                                            'cantidad' : 0,
                                            'SKUS' : [],
                                        },
                                };
            let productos = db.get('productos').value();
            console.log(productos);
            productos.forEach((pr) => {
                let index = '0';
                if ( pr.inventario && pr.inventario > 0 ) {
                    index = '1';
                }
                reporteIndexes[index].cantidad = reporteIndexes[index].cantidad + 1;
                reporteIndexes[index].SKUS.push(pr.sku);
            });
            console.log(reporteIndexes);
            Object.keys(reporteIndexes).forEach((item)=>{
                reporte.push(   `${reporteIndexes[item].label}     ${reporteIndexes[item].cantidad}         ${reporteIndexes[item].SKUS.join(',')}`)
            })
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify(reporte));
        } else {
            let response = {"error":true};
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify(response))
        }
    });
});

app.get('/Bodega/reporteSolicitudes', (req, res) => {
    validateToken(req,function(valid){
        if ( valid ) {
            let reporte = [];
            let solicitudes = db.get('solicitudes').value();
            reporte.push('Solicitudes totales = '+solicitudes.length);
            reporte.push('----------------------------------');
            let porPeriodo = {};
            let porNodo = {};
            solicitudes.forEach((sol) => {
                if ( !porNodo[sol.origen] ) {
                    porNodo[sol.origen] = 0;
                }
                porNodo[sol.origen] = porNodo[sol.origen] + 1;
                if ( !porPeriodo[sol.periodo] ) {
                    porPeriodo[sol.periodo] = 0;
                }
                porPeriodo[sol.periodo] = porPeriodo[sol.periodo] + 1;
            });

            reporte.push('Solicitudes por Nodo');
            Object.keys(porNodo).forEach((n) => {
                reporte.push('Nodo '+ n +' Cantidad ' + porNodo[n]);
            })
            reporte.push('----------------------------------');
            reporte.push('Solicitudes por Periodo');
            Object.keys(porPeriodo).forEach((n) => {
                reporte.push('Periodo '+ n +' Cantidad ' + porPeriodo[n]);
            })
            reporte.push('----------------------------------');
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify(reporte));
        } else {
            let response = {"error":true};
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify(response))
        }
    });
});
app.get('/Bodega/reporteDespachos', (req, res) => {
    validateToken(req,function(valid){
        if ( valid ) {
            let reporte = [];
            let despachos = db.get('despachos').value();
            reporte.push('Despachos totales = '+despachos.length);
            reporte.push('----------------------------------');
            let porPeriodo = {};
            let porNodo = {};
            despachos.forEach((sol) => {
                if ( !porNodo[sol.pais] ) {
                    porNodo[sol.pais] = 0;
                }
                porNodo[sol.pais] = porNodo[sol.pais] + 1;
                if ( !porPeriodo[sol.periodo] ) {
                    porPeriodo[sol.periodo] = 0;
                }
                porPeriodo[sol.periodo] = porPeriodo[sol.periodo] + 1;
            });

            reporte.push('Despachos por pais');
            Object.keys(porNodo).forEach((n) => {
                reporte.push('Nodo '+ n +' Cantidad ' + porNodo[n]);
            })
            reporte.push('----------------------------------');
            reporte.push('Despachos por Periodo');
            Object.keys(porPeriodo).forEach((n) => {
                reporte.push('Periodo '+ n +' Cantidad ' + porPeriodo[n]);
            })
            reporte.push('----------------------------------');
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify(reporte));
        } else {
            let response = {"error":true};
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify(response))
        }
    });
});

app.get('/Bodega/reporteDespachosInvalidos', (req, res) => {
    validateToken(req,function(valid){
        if ( valid ) {
            let reporte = [];
            let despachos = db.get('despachosInvalidos').value();
            reporte.push('Despachos Invalidos totales = '+despachos.length);
            reporte.push('----------------------------------');
            let porPeriodo = {};
            let porNodo = {};
            despachos.forEach((sol) => {
                if ( !porNodo[sol.pais] ) {
                    porNodo[sol.pais] = 0;
                }
                porNodo[sol.pais] = porNodo[sol.pais] + 1;
                if ( !porPeriodo[sol.periodo] ) {
                    porPeriodo[sol.periodo] = 0;
                }
                porPeriodo[sol.periodo] = porPeriodo[sol.periodo] + 1;
            });

            reporte.push('Despachos Invalidos por pais');
            Object.keys(porNodo).forEach((n) => {
                reporte.push('Nodo '+ n +' Cantidad ' + porNodo[n]);
            })
            reporte.push('----------------------------------');
            reporte.push('Despachos Invalidos por Periodo');
            Object.keys(porPeriodo).forEach((n) => {
                reporte.push('Periodo '+ n +' Cantidad ' + porPeriodo[n]);
            })
            reporte.push('----------------------------------');
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify(reporte));
        } else {
            let response = {"error":true};
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify(response))
        }
    });
});
