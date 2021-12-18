/**
 * Configuration du gestionnaire de requetage HTTP
 */

const env = process.env.NODE_ENV || 'development'

let baseURL = 'http://the-api-development-domain.com'
if (env === 'production') {
    baseURL = 'http://the-api-production-domain.com';
}
else if (env === 'test') {
    baseURL = 'http://the-api-test-domain.com'
}

module.exports = {
    /**
     * URL de base
     * Elle sera précédée de l'url sauf si cette deniere est absolue.
     * 
     * @var string
     */
    baseURL: process.env.API_URL || baseURL,

    /**
     * `timeout` spécifie le nombre de millisecondes avant l'expiration de la requête.
     *  Si la requête prend plus de temps que `timeout`, la requête sera abandonnée.
     * 
     * @var int
     */
    timeout: 0,

    /**
     * `withCredentials` indique si oui ou non les demandes de contrôle d'accès intersites
     * doit être fait en utilisant les informations d'identification
     * 
     * @var bool
     */
    withCredentials: false,
    
    /**
     * Faire quelque chose avant que la requete ne soit envoyée
     * 
     * @var Function
     */
    onRequest: function(config) {
        return config;
    },

    /**
     * Faire quelque chose avec une erreur de requête
     * 
     * @var Function
     */
    onRequestError: function(error) {
        return Promise.reject(error);
    },

    /**
     * Faire quelque chose avec les données de réponse
     * 
     * @var Function
     */
    onResponse: function(response) {
        return response.data;
    },

    /**
     * Faire quelque chose avec une erreur de réponse
     * 
     * @var Function
     */
    onResponseError: function (error) {
        // Gerer les erreurs de la reponse ici

        const response = error.response || null;
        if (response == null) {
            return Promise.reject(error);
        }

        const data = response.data || null;
        if (data == null) {
            return Promise.reject(response);
        }
        
        return Promise.reject(data);
    }
}