import { _http } from "../../types/_http";

const BaseController = require('./BaseController');
const Message : _http.Message = require('../http/Message')

module.exports = class RestfullController extends BaseController
{
    protected response : _http.Response | null = null;
    protected request : _http.Request | null = null;

    /**
     * Reponse de type bad request
     *
     * @param {string} message
     * @param {any} errors
     * @return {any}
     */
    protected respondBadRequest(message : string, errors : any) : any {
        return this.respondError(message, Message.HTTP_BAD_REQUEST, errors);
    }
    protected badRequest(message : string, errors : any) : any {
        return this.respondBadRequest(message, errors);
    }
 
     /**
      * Reponse de type conflict
      *
      * @param {string} message
      * @param {any} errors
      * @return {any}
      */
    protected respondConflict(message : string, errors : any) : any {
        return this.respondError(message, Message.HTTP_CONFLICT, errors);
    }
    protected conflict(message : string, errors : any) : any {
        return this.respondConflict(message, errors)
    }
 
    /**
     * Reponse de type created
     *
     * @param {string} message
     * @param {any} result
     * @return {any}
     */
    protected respondCreated(message: string, result : any) : any {
        return this.respondSuccess(message, result, Message.HTTP_CREATED);
    }
    protected created(message : string, result : any) : any {
        return this.respondCreated(message, result)
    }
 
    /**
     * Reponse de type forbidden
     *
     * @param {string} message
     * @param {any} errors
     * @return {any}
     */
    protected respondForbidden(message : string, errors : any) : any {
        return this.respondError(message, Message.HTTP_FORBIDDEN, errors);
    }
    protected forbidden(message : string, errors : any) : any {
        return this.respondForbidden(message, errors)
    }
 
    /**
     * Reponse de type internal error
     *
     * @param {string} message
     * @param {any} errors
     * @return {any}
     */
    protected respondInternalError(message : string, errors : any) : any {
        return this.respondError(message, Message.HTTP_INTERNAL_ERROR, errors);
    }
    protected internalError(message : string, errors : any) : any {
        return this.respondInternalError(message, errors)
    }
 
    /**
     * Reponse de type invalid token
     *
     * @param {string} message
     * @param {any} errors
     * @return {any}
     */
    protected respondInvalidToken(message : string, errors : any) : any {
        return this.respondError(message, Message.HTTP_INVALID_TOKEN, errors);
    }
    protected invalidToken(message : string, errors : any) : any {
        return this.respondInvalidToken(message, errors)
    }
 
    /**
     * Reponse de type method not allowed
     *
     * @param {string} message
     * @param {any} errors
     * @return {any}
     */
    protected respondMethodNotAllowed(message : string, errors : any) : any {
        return this.respondError(message, Message.HTTP_METHOD_NOT_ALLOWED, errors);
    }
    protected methodNotAllowed(message : string, errors : any) : any {
        return this.respondMethodNotAllowed(message, errors)
    }
 
    /**
     * Reponse de type no content
     *
     * @param {string} message
     * @param {any} result
     * @return {any}
     */
    protected respondNoContent(message : string, result : any) : any {
        return this.respondSuccess(message, result, Message.HTTP_NO_CONTENT);
    }
    protected noContent(message : string, result : any) : any {
        return this.respondNoContent(message, result)
    }
 
    /**
     * Reponse de type not acceptable
     *
     * @param {string} message
     * @param {any} errors
     * @return {any}
     */
    protected respondNotAcceptable(message : string, errors : any) : any {
        return this.respondError(message, Message.HTTP_NOT_ACCEPTABLE, errors);
    }
    protected notAcceptable(message : string, errors : any) : any {
        return this.respondNotAcceptable(message, errors)
    }
 
    /**
     * Reponse de type not found
     *
     * @param {string} message
     * @param {any} errors
     * @return {any}
     */
    protected respondNotFound(message : string, errors : any) : any {
        return this.respondError(message, Message.HTTP_NOT_FOUND, errors);
    }
    protected notFound(message : string, errors : any) : any {
        return this.respondNotFound(message, errors)
    }
 
    /**
     * Reponse de type not implemented
     *
     * @param {string} message
     * @param {any} errors
     * @return {any}
     */
    protected respondNotImplemented(message : string, errors : any) : any {
        return this.respondError(message, Message.HTTP_NOT_IMPLEMENTED, errors);
    }
    protected notImplemented(message : string, errors : any) : any {
        return this.respondNotImplemented(message, errors)
    }
 
    /**
     * Reponse de type ok
     *
     * @param {string} message
     * @param {any} result
     * @return {any}
     */
    protected respondOk(message: string, result : any) : any{
        return this.respondSuccess(message, result, Message.HTTP_OK);
    }
    protected ok(message : string, result : any) : any {
        return this.respondOk(message, result)
    }
 
    /**
     * Reponse de type unauthorized
     *
     * @param {string} message
     * @param {any} errors
     * @return {any}
     */
    protected respondUnauthorized(message : string, errors : any) : any {
        return this.respondError(message, Message.HTTP_UNAUTHORIZED, errors);
    }
    protected unauthorized(message : string, errors : any) : any {
        return this.respondUnauthorized(message, errors)
    }
 

    /**
     * Rend une reponse generique au client
     *
     * @param {any} data 
     * @param {number} status 
     * @returns 
     */
    protected respond(data : any, status? : number) : any {
        return this.response?.send(data, status || 200);
    }

    /**
     * Renvoi un message de succes au client
     * 
     * @param {String} message 
     * @param {any} result 
     * @param {number} status  
     */
    protected respondSuccess(message : string, result : any, status? : number) : any {
        return this.response?.success(message, result, status || 200);
    }

    /**
     * Renvoi un message d'erreur au client
     * 
     * @param {String} message  
     * @param {number} status 
     * @param {any} errors 
     * @returns 
     */
    protected respondError(message: string, status? : number, errors? : any) : any {
        return this.response?.fail(message, status || 500, errors || undefined);
    }
}