import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

module.exports = class Message {

    protected _req : ExpressRequest;
    protected _res : ExpressResponse;

    constructor(req : ExpressRequest, res : ExpressResponse) {
        this._req = req;
        this._res = res;
    }

    /**
     * Common HTTP status codes and their respective description.
     *
     * @link http://www.restapitutorial.com/httpstatuscodes.html
     */
	static HTTP_OK                 : number = 200;
	static HTTP_CREATED            : number = 201;
	static HTTP_NO_CONTENT         : number = 204;
	static HTTP_NOT_MODIFIED       : number = 304;
	static HTTP_BAD_REQUEST        : number = 400;
	static HTTP_UNAUTHORIZED       : number = 401;
	static HTTP_FORBIDDEN          : number = 403;
	static HTTP_NOT_FOUND          : number = 404;
	static HTTP_METHOD_NOT_ALLOWED : number = 405;
	static HTTP_NOT_ACCEPTABLE     : number = 406;
	static HTTP_CONFLICT           : number = 409;
	static HTTP_INVALID_TOKEN      : number = 498;
	static HTTP_INTERNAL_ERROR     : number = 500;
	static HTTP_NOT_IMPLEMENTED    : number = 501;

    /**
     * Retrieves the HTTP protocol version as a string.
     *
     * The string MUST contain only the HTTP version number (e.g., "1.1", "1.0").
     *
     * @return string HTTP protocol version.
     */
    public getProtocolVersion() : string { 
        return 'HTTP/1.1'
    }

    /**
     * Return an instance with the specified HTTP protocol version.
     *
     * @param string $version HTTP protocol version
     * @return static
     */
    public withProtocolVersion(version : string) : Message {
        return this
    }

    /**
     * Retrieves all message header values.
     *
     * @return {string[][]} Returns an associative array of the message's headers. Each
     *     key MUST be a header name, and each value MUST be an array of strings
     *     for that header.
     */
    public getHeaders() : Array<Array<any>> {
        return []
    }

    /**
     * Checks if a header exists by the given case-insensitive name.
     *
     * @param {string} name Case-insensitive header field name.
     * @return {boolean} Returns true if any header names match the given header
     *     name using a case-insensitive string comparison. Returns false if
     *     no matching header name is found in the message.
     */
    public hasHeader(name : string) : boolean {
        return false
    }

    /**
     * Retrieves a message header value by the given case-insensitive name.
     *
     * @param {string} name Case-insensitive header field name.
     * @return {string[]} An array of string values as provided for the given
     *    header. If the header does not appear in the message, this method MUST
     *    return an empty array.
     */
    public getHeader(name : string) : string[] {
        return [name];
    }

    /**
     * Retrieves a comma-separated string of the values for a single header.
     *
     * @param {string} name Case-insensitive header field name.
     * @return {string} A string of values as provided for the given header
     *    concatenated together using a comma. If the header does not appear in
     *    the message, this method MUST return an empty string.
     */
    public getHeaderLine(name : string) : string {
        return name
    }

    /**
     * Return an instance with the provided value replacing the specified header.
     *
     * @param {string} name Case-insensitive header field name.
     * @param {string|string[]} value Header value(s).
     * @return static
     * @throws \InvalidArgumentException for invalid header names or values.
     */
    public withHeader(name : string, value : string |string[]) : Message {
        return this
    }

    /**
     * Return an instance with the specified header appended with the given value.
     *
     * @param {string} name Case-insensitive header field name to add.
     * @param {string|string[]} value Header value(s).
     * @return static
     * @throws \InvalidArgumentException for invalid header names or values.
     */
    public withAddedHeader(name : string, value : string | string[]) : Message {
        return this
    }

    /**
     * Return an instance without the specified header.
     *
     * @param {string} name Case-insensitive header field name to remove.
     * @return static
     */
    public withoutHeader(name : string) : Message {
        return this
    }

    /**
     * Gets the body of the message.
     *
     * @return {any} Returns the body as a stream.
     */
    public getBody() : any {
        return null
    }

    /**
     * Return an instance with the specified message body.
     *
     * @param {any} $body Body.
     * @return static
     * @throws \InvalidArgumentException When the body is not valid.
     */
    public withBody(body : any) : Message {
        return this
    }
}