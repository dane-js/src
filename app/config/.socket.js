/**
 * Renommez ce fichier en "socket.js" pour pouvoir l'utiliser 
 * il defini les endpoints websocket et necessite l'installation du pacquet "socket.io"
 */

/**
 * Options de configuration de socket.io
 * 
 * @link https://socket.io/docs/v4/server-options/
 */
exports.options = {
    allowEIO3: true,
    cors: {
        /* origin: ["https://example.com", "https://dev.example.com"],
        allowedHeaders: ["my-custom-header"],
        credentials: true */
    }
}

/**
 * Definition des evenements
 * 
 * @param {*} io l'objet socket.io
 * @param {*} models les differents modeles (si vous devez interagir avec la base de données)
 * @returns 
 */
exports.handler = (io, models) => {
    
    io.on('connection', (socket) => {
        console.log("an user is connected")
    
        socket.on('message', (data) => {
            console.log("new message " + JSON.stringify(data));
        })
    })

    return io
}