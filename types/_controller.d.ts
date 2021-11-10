import { Request as ExpressRequest, Response as ExpressResponse } from 'express'
import { _http } from './_http'
declare namespace _controller {
    class BaseController {
        protected request : _http.Request | null
        protected response : _http.Response | null
        constructor(path: {[key: string]: string})
        public initialize(req : ExpressRequest, res : ExpressResponse, models : {[key: string]: _db.BaseModel})
    }

    class RestfullController extends BaseController {

    }

}

