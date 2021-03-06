import { Request as ExpressRequest } from 'express';
const Message = require('./Message');
const { completeAssign } = require('../utils/objects')

module.exports = class Request extends Message {

    /**
     * Retrieve server parameters.
     *
     * @return {object}
     */
    public getServerParams() : {[key: string] : any} {
        return {}
    }

    /**
     * Retrieve cookies.
     *
     * @return {object}
     */
    public getCookieParams() : {[key: string] : any} {
        return this._req.cookies || {};
    }

    /**
     * 
     * @param name 
     * @returns 
     */
    public getCookies(name: string | Array<string>) : any {
        const cookies : {[key: string] : any} = this.getCookieParams()

        if (typeof name === 'string') {
            return cookies[name] || null
        }
        const result : {[key: string]: any} = {}

        name.forEach(key => {
            if (cookies[key]) {
                result[key] = cookies[key]
            }
        })
        
        return result
    }

    /**
     * Return an instance with the specified cookies.
     *
     * @param {object} cookies Array of key/value pairs representing cookies.
     * @return static
     */
    public withCookieParams(cookies : {[key: string]: any}[]) : Request {
        const clone : Request = completeAssign({}, this)
        cookies.forEach(cookie => {
            clone._res.cookie(cookie.name, cookie.value, cookie.options)
        })
      
        return clone
    }

    /**
     * Retrieve query string arguments.
     *
     * @return {object}
     */
    public getQueryParams() : {[key: string] : any} {
        return this._req.query
    }

    /**
     * Return an instance with the specified query string arguments.
     *
     * @param {object} query Array of query string arguments, typically from $_GET.
     * @return static
     */
    public withQueryParams(query : {[key: string] : string | boolean | number}) : Request {
        this._req.query = {...this._req.query, ...query}
        return this 
    }

    /**
     * Retrieve query string argument.
     *
     * @param {string} name Case-insensitive query string name
     * @return {string | boolean | number}
     */
    public getQueryParam(name : string) : string | boolean | number {
        return this._req.query[name] || null
    } 

    /**
     * Retrieve request parameters
     *
     * @return {object}
     */
     public getParams() : {[key: string] : any} {
        return this._req.params
    }

    /**
     * Retrieve a single request parameter
     *
     * @param {string} name Case-insensitive parameter name
     * @return {any}
     */
     public getParam(name : string) : any {
        return this._req.params[name] || null
    } 

    /**
     * Retrieve normalized file upload data.
     *
     * @return array An array tree of UploadedFileInterface instances; an empty
     *     array MUST be returned if no data is present.
     */
    public getUploadedFiles() : Array<any> {
        return []
    };

    /**
     * Create a new instance with the specified uploaded files.
     *
     * @param {Array<any>} uploadedFiles An array tree of UploadedFileInterface instances.
     * @return static
     * @throws \InvalidArgumentException if an invalid structure is provided.
     */
    public withUploadedFiles(uploadedFiles : Array<any>) : Request {
        return this
    }

    /**
     * Retrieve any parameters provided in the request body.
     *
     * @return null|array|object The deserialized body parameters, if any.
     *     These will typically be an array or object.
     */
    public getParsedBody() : {[key: string] : any} {
        return this._req.body
    }

    /**
     * Return an instance with the specified body parameters.
     *
     * @param {object} data The deserialized body data. This will
     *     typically be in an array or object.
     * @return {this}
     * @throws \InvalidArgumentException if an unsupported argument type is
     *     provided.
     */
    public withParsedBody(data : {[key: string]: any}) : Request {
        this._req.body = {...this._req.body, ...data}
        return this
    }

    /**
     * Retrieve attributes derived from the request.
     *
     * @return array Attributes derived from the request.
     */
    public getAttributes() : Array<any> {
        return JSON.parse(JSON.stringify(this._req))
    }

    /**
     * Retrieve a single derived request attribute.
     *
     * @see getAttributes()
     * @param {string} $name The attribute name.
     * @param {any} $default Default value to return if the attribute does not exist.
     * @return {any}
     */
    public getAttribute(name : string, defaut : any = null) : any {
        return this._req[name] || defaut
    }

    /**
     * Return an instance with the specified derived request attribute.
     *
     * This method allows setting a single derived request attribute as
     * described in getAttributes().
     *
     * This method MUST be implemented in such a way as to retain the
     * immutability of the message, and MUST return an instance that has the
     * updated attribute.
     *
     * @see getAttributes()
     * @param string $name The attribute name.
     * @param mixed $value The value of the attribute.
     * @return static
     */
    public withAttribute(name : string, value : any) : Request {
        this._req[name] = value;
        return this
    }

    /**
     * Return an instance that removes the specified derived request attribute.
     *
     * This method allows removing a single derived request attribute as
     * described in getAttributes().
     *
     * This method MUST be implemented in such a way as to retain the
     * immutability of the message, and MUST return an instance that removes
     * the attribute.
     *
     * @see getAttributes()
     * @param string $name The attribute name.
     * @return static
     */
    public withoutAttribute(name : string) : Request {
        this._req[name] = null;
        delete this._req[name];
        return this
    }

    /**
     * Retrieves the message's request target.
     *
     * @return {string}
     */
    public getRequestTarget() : string {
        return ''
    }

    /**
     * Return an instance with the specific request-target.
     *
     * @link http://tools.ietf.org/html/rfc7230#section-5.3 (for the various
     *     request-target forms allowed in request messages)
     * @param {any} requestTarget
     * @return static
     */
    public withRequestTarget(requestTarget : any) : Request {
        return this
    }

    /**
     * Retrieves the HTTP method of the request.
     *
     * @return string Returns the request method.
     */
    public getMethod() : string {
        return this._req.method;
    }

    /**
     * Return an instance with the provided HTTP method.
     *
     * @param {string } method Case-sensitive method.
     * @return static
     * @throws \InvalidArgumentException for invalid HTTP methods.
     */
    public withMethod(method : string) : Request {
        this._req.method = method;

        return this
    }

    /**
     * Retrieves the URI instance.
     *
     * @link http://tools.ietf.org/html/rfc3986#section-4.3
     * @return {Uri} Returns a UriInterface instance
     *     representing the URI of the request.
     */
    public getUri() : any {
        return null;
    }

    /**
     * Returns an instance with the provided URI.
     * 
     * @link http://tools.ietf.org/html/rfc3986#section-4.3
     * @param {Uri} uri New request URI to use.
     * @param {boolean} preserveHost Preserve the original state of the Host header.
     * @return static
     */
    public withUri(uri : any, preserveHost : boolean) : Request {
        preserveHost = preserveHost || false;

        return this
    }
}