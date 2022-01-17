const jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET : string = 'ghjdekjdwqe185366edflkwdq2508qwasd2dc0wed42336eda';

module.exports = class Jwt {
    /**
     * Genere un token pour l'utilisateur
     * 
     * @param {Object} payload 
     * @param {string} expiresIn 
     * @param {string} secret 
     * @returns {String}
     */
    public static createToken(payload : {[key: string]: any}, expiresIn : string, secret : string = JWT_SIGN_SECRET) : string {
        expiresIn = expiresIn || '1h'

        return jwt.sign(payload, secret, { expiresIn })
    }

    /**
     * Decode un token et recupere les informations
     * 
     * @param {String} authorization 
     * @param {String} secret 
     * @returns {Object|null}
     */
    public static decode(authorization : string, secret : string = JWT_SIGN_SECRET) : {[key: string]: any} | null {
        const token = authorization != null ? authorization.replace('Bearer ', '') : null
        let payload = null
        if (token != null) {
            try {
                payload = jwt.verify(token, secret);
            } catch (err) {}
        }
        return payload
    }
}
