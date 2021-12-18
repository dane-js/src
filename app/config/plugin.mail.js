module.exports = {
	/**
	 * Adresse du serveur d'envoie de mail
	 * 
	 * @var string
	 */
    host: "smtp.google.com",
	/**
	 * Port d'écoute
	 * 
	 * @var int
	 */
    port: 587,
	/**
	 * Nom d'utilisateur sur le serveur de mail
	 * 
	 * @var string
	 */
    username: "user@gmail.com",
	/**
	 * Mot de passe
	 * 
	 * @var string
	 */
    password: "password",
	/**
	 * Information de l'expéditeur
	 * 
	 * @var string|object
	 */
    from: {
        address: "user@gmail.com",
        name: "The Company Name"
    }
}
