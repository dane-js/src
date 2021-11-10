import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

declare namespace _http {
    class Message {
        constructor(req : ExpressRequest, res : ExpressResponse)
        /**
         * Common HTTP status codes and their respective description.
         *
         * @link http://www.restapitutorial.com/httpstatuscodes.html
         */
        HTTP_OK                 : number = 200;
        HTTP_CREATED            : number = 201;
        HTTP_NO_CONTENT         : number = 204;
        HTTP_NOT_MODIFIED       : number = 304;
        HTTP_BAD_REQUEST        : number = 400;
        HTTP_UNAUTHORIZED       : number = 401;
        HTTP_FORBIDDEN          : number = 403;
        HTTP_NOT_FOUND          : number = 404;
        HTTP_METHOD_NOT_ALLOWED : number = 405;
        HTTP_NOT_ACCEPTABLE     : number = 406;
        HTTP_CONFLICT           : number = 409;
        HTTP_INVALID_TOKEN      : number = 498;
        HTTP_INTERNAL_ERROR     : number = 500;
        HTTP_NOT_IMPLEMENTED    : number = 501;
    }
    
    class Request extends Message {
        
    }
    class Response  extends Message {
        public fail(message : string, status : number, errors : any)
        public success(message : string, result : any, status : number)
        public send(data: any, status: number)

        public getStatusCode() : number
        public withStatus(code : number, reasonPhrase : string) : Response
        public getReasonPhrase() : string
    }
    
}

