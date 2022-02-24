import express, {Request, Response, Application} from 'express';
import fs from 'fs';
import { _controller } from '../../types/_controller';
import { _route } from '../../types/_router';
const { trim } = require('php-in-js/modules/string')
const { call_user_func_array } = require('php-in-js/modules/functions');
const launcher = require('./launcher')
module.exports = class Route
{
    /**
     * @var {String}
     */
    path : string;

    /**
     * @var {String|Function}
     */
    callable : string | Function;
    
    /**
     * @var {Array}
     */
    #matches : Array<string> = [];

    #PATH : {[key: string]: string} = {};

    /**
     * @var {Object}
     */
    #params : {[key: string]: any} = {};
    #middlewares: Array<Function> = [];


    constructor(path : string, callable : string | Function, middlewares : string | Function | Array<string|Function>) {
        this.path = trim(path, '/')
        this.callable = callable
        this.#middlewares = Route.makeMiddlewares(this.#PATH, middlewares)
    }
    setPATH(path : {[key: string]: string}) : this {
        this.#PATH = path

        return this
    }

    /**
     * 
     * @param {String} param 
     * @param {String} regex 
     * @returns {Route}
     */
    with(param : string, regex : string) : Route {
        this.#params = {...this.#params, ...{ [param]: regex.replace('(', '(?:') }};

        return this;
    }

    getPath() : string {
        return this.path
    }

    /**
     * Verifie si une route matche une URL
     * 
     * @param {String} url 
     * @returns {Boolean}
     */
    match(url : string) : boolean {
        url = trim(url, '/')

        //let path = this.path.replace(, '([^/]+)');

        let path = this.path.replace(/:([\w]+)/, (match) => {
            if (match[1] in this.#params) {
                return '(' + this.#params[match[1]] + ')';
            }
            return '([^/]+)';
        })
        
        const regex = new RegExp(`^${path}$`, 'i');
        const matches = url.match(regex);
       
        if (matches == null) {
           return false;
        }
        matches.shift();
        this.#matches = matches;

        return true;
    }

    /**
     * Execute le callback au cas où la route matche l'URL
     * 
     * @param {Router} router
     * @param {Object} path
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    call(router : _route.Router, path : {[key: string]: string}, app : express.Application | undefined, reqe: Request, rese: any) : any {
        return this.#runApp(router, path, reqe, rese)
        /* 
        const middlewares =  this.getMiddlewares()
        if (!middlewares.length ) {
        }
        if (app) {
            middlewares.forEach(middleware => {
                app.use(middleware)
            })
            app.use((req :any, res :any) => {
                return this.#runApp(router, path, req, res)
            })
        } */
    }

    #runApp(router : _route.Router, path : {[key: string]: string}, req : any, res : any) : any { 
        let params = this.#matches;
        
        params.push(...[req, res]);
        if (this.callable instanceof Function) {
            return call_user_func_array(this.callable, params);
        }

        const parts = this.callable.split('@');
        let controller = parts.shift();
        if (!controller?.endsWith('Controller')) {
            controller += 'Controller'
        }

        let method = parts.shift();
        if (method == undefined || typeof method == 'undefined' || method == null) {
            method = router.getDefaultMethod();
        }
        if (!fs.existsSync(`${path.CONTROLLER_DIR}/${controller}.js`)) {
        throw Error('Controller file "'+controller+'.js" do not exist')
        }
    
        const classe = require(`${path.CONTROLLER_DIR}/${controller}`)
        const obj = new classe(path)

        if (!(method in obj)) {
            throw Error(`Methode "${method}" non definie dans le controleur ${controller}`)
        }
        return call_user_func_array([obj, method], params)        
    }

    use(middlewares : string | Function | Array<string|Function>) : this {
        this.#middlewares.push(...Route.makeMiddlewares(this.#PATH, middlewares))

        return this
    }

    static makeMiddlewares($path : {[key: string] : string}, middlewares : string | Function | Array<string|Function>) : Array<Function> {
        if (middlewares == null || middlewares === undefined || typeof middlewares == 'undefined') {
			return []
		}
        if (typeof middlewares =='function') {
            return [middlewares]        
        }
        if (typeof middlewares == 'string') {
            if (fs.existsSync(`${$path.MIDDLEWARE_DIR}/${middlewares}.js`)) {
                const middleware : Function = require(`${$path.MIDDLEWARE_DIR}/${middlewares}.js`)
                return [middleware]
            }
            return []
        }
        const result : Array<Function> = []
        
        middlewares.forEach(middleware => {
            if (typeof middleware == 'function') {
                result.push(middleware)
            }
            else if (fs.existsSync(`${$path.MIDDLEWARE_DIR}/${middleware}.js`)) {
                const middle : Function = require(`${$path.MIDDLEWARE_DIR}/${middleware}.js`)
                result.push(middle)
            }
        })
        
        return result
    }

    getMiddlewares() : Array<Function> {
        return this.#middlewares
    }

    getRunner(models : {[key: string]: _db.BaseModel}, io : any, req : any, res : any, next : any) : any {
        return this.#launch(models, io, req, res)
    }


    #launch(models : {[key: string]: _db.BaseModel}, io : any, req : any, res : any) : Function {
        let params = this.#matches;
        
        params.push(...[req, res]);
        if (this.callable instanceof Function) {
            return call_user_func_array(this.callable, [req, res]);
        }

        return launcher(this.callable.split('@'), req, res, this.#PATH, models, io)
    }

    /**
     * Genere l'url d'une route avec les parametres 
     * 
     * @param {Object} params 
     * @returns {String}
     */
    getUrl(params : {[key: string] : any}) : String {
        let path = this.path

        for (let k in params) {
            path = path.replace(':'+k, params[k]);
        }

        return path
    }
}