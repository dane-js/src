import express from 'express';
import { _base } from '../../types/_base';
import { _controller } from '../../types/_controller';
import { _route } from '../../types/_router';
const { trim } = require('php-in-js/modules/string');

const Router = require('./Router');
const launcher = require('./launcher')
module.exports = class Dispatcher {

    /**
     * @var {Router}
     */
    #router : _route.Router

    /**
     * @var {object}
     */
    #path: _base.PATH;
    #models: { [key: string]: _db.BaseModel; };
    
    constructor(path : _base.PATH, models : {[key: string]: _db.BaseModel}) {
        this.#router = require(`${path.CONFIG_DIR}/routes`)(new Router)
        this.#path = path
        this.#models = models
    }

    dispatch(io: any, req : express.Request, res : express.Response, next : Function) : any {  
        const URL : string = req.path
        if (false === this.#router.getAutoRoute()) {
            throw Error('Not routes found for this URL')
        }
        else {
            return launcher(trim(URL, '/').split('/'), req, res, this.#path, this.#models, io, this.#router)
        }
    }
}