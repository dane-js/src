/**
 * Renommez ce fichier en "routes.ws.js" pour pouvoir l'utiliser 
 * il defini les endpoints websocket et necessite l'installation du pacquet "express-ws"
 * 
 * @param {*} router 
 * @param {*} models 
 * @returns 
 */
module.exports = (router, models) => {
    router.ws('/echo' ,  function(ws, req) { 
        ws.on('message' ,function(msg) { 
            console.log(msg);
        }); 
    });


    return {router, path: '/ws'}
}