const { is_int } = require('php-in-js/modules/types');
const Message = require('./Message')

module.exports = class Response extends Message {
    /**
     * 
     * @param {String} message 
     * @param {number} status 
     * @param {any} errors 
     * @returns 
     */
    fail(message : string, status : number, errors : any) {
        status = (status && is_int(status)) ? status : 500
        return this.send({
            success: false,
            status,
            message,
            errors
        }, status)
    }

    /**
     * 
     * @param {String} message  
     * @param {any} result 
     * @param {number} status  
     * @returns 
     */
    success(message : string, result : any, status : number) {
        status = (status && is_int(status)) ? status : 200
        return this.send({
            success: true,
            message,
            result,
            status
        }, status)
    }

    /**
     * 
     * @param {any} data 
     * @param {number} status 
     * @returns 
     */
    send(data: any, status: number) {
        return this._res.status(status || 200).send(data)
    }
    
    
    /**
     * Gets the response status code.
     *
     * @return {int} Status code.
     */
    public getStatusCode() : number { 
        return this._res.status || 200
    }

    /**
     * Return an instance with the specified status code and, optionally, reason phrase.
     *
     * If no reason phrase is specified, implementations MAY choose to default
     * to the RFC 7231 or IANA recommended reason phrase for the response's
     * status code.
     *
     * This method MUST be implemented in such a way as to retain the
     * immutability of the message, and MUST return an instance that has the
     * updated status and reason phrase.
     *
     * @link http://tools.ietf.org/html/rfc7231#section-6
     * @link http://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml
     * @param {int} code The 3-digit integer result code to set.
     * @param {string} reasonPhrase The reason phrase to use with the
     *     provided status code; if none is provided, implementations MAY
     *     use the defaults as suggested in the HTTP specification.
     * @return static
     * @throws \InvalidArgumentException For invalid status code arguments.
     */
    public withStatus(code : number, reasonPhrase : string) : Response {
        return this
    }

    /**
     * Gets the response reason phrase associated with the status code.
     *
     * @link http://tools.ietf.org/html/rfc7231#section-6
     * @link http://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml
     * @return string Reason phrase; must return an empty string if none present.
     */
    public getReasonPhrase() : string {
        return ''
    }
}