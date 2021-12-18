const axios = require('axios')

/**
 * Service de requetage HTTP
 * 
 * @param {object} config 
 * @use nodemailer
 * @returns 
 */
module.exports = function(config : {
    baseURL: string
    timeout: number | null
    withCredentials: boolean
    onRequest: Function
    onRequestError: Function
    onResponse: Function
    onResponseError: Function
    [key: string]: any
}) {
    
	const _axios = axios.create({
        baseURL: config.baseURL,
        timeout: config.timeout,
        withCredentials: config.withCredentials,
    });

	/**
	 * Intercepteur de la requete
	 */
	_axios.interceptors.request.use(
		function (_config: {[key: string]: any}) {
			// Faite quelques chose ici avant que la requete ne soit envoyée

			return config.onRequest(_config);
		},
		function (error : any) {
			// Faite quelques chose en cas d'erreur lors de la requete
			
			return config.onRequestError(error);
		}
	);

	/**
	 * Intercepteur de la reponse
	 */
	_axios.interceptors.response.use(
		function (response: {
            data: any,
            status: number,
            statusText: string,
            headers: {[key: string]: any},
            config: {[key: string]: any},
            request: {[key: string]: any}
        }) {
			// Faites quelques chose avec les données de la reponse

			return config.onResponse(response)
		},
		function (error : any) {
			// Gerer les erreurs de la reponse ici

			return config.onResponseError(error);
		}
	);

	return _axios;
}
