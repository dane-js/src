/**
 * CORS Options configuration 
 * 
 * For more information about configuration options see https://www.npmjs.com/package/cors#configuration-options
 */
module.exports = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204
}