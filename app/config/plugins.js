module.exports = {
    /**
     * Active l'utilisation de l'outil de requetage http
     * 
     * Necessite l'installation de axios
     * `npm install axios`
     */
    http: false,

    /**
     * Active l'utilisation de l'outil d'envoi des mail
     * 
     * Necessite l'installation de nodemailer
     * `npm install nodemailer`
     * 
     * Si vous devez envoyer les mail formatés sous forme HTML, vous devez installer ejs
     * `npm install ejs`
     */
    mail: false,

    /**
     * Active l'utilisation de l'outil d'upload des images
     * 
     * Necessite l'installation de base64-img
     * `npm install base64-img`
     */
    upload: false,
}
