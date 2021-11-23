import { _route } from "../../types/_router";

const Route = require('./Route')

module.exports = class Router {
    routes : {[key: string]: Array<_route.Route>}= {
        get: [],
        post: [],
        put: [],
        patch: [],
        delete: []
    };

    namedRoutes : {[key: string]: _route.Route} = {};

    #PATH : { [key: string]: string} = {}

    /**
     * @var {String}
     */
    #defaultController : string = 'Home';
    
    /**
     * @var {String}
     */
    #defaultMethod : string = 'index';

    /**
     * @var {Boolean}
     */
    #autoRoute : boolean = true;


    constructor(path : {[key: string]: string}) {
        this.#PATH = path;
    }


    /**
     * Ajoute une route get
     * 
     * @param {String} path 
     * @param {String|Function} action 
     * @param {String} name 
     * @param {string|string[]|Function|Function[]} middlewares
     * @returns {Route}
     */
    get(path : string, action : string | Function, name : string, middlewares : string | Function | Array<string|Function>) : _route.Route {
        return this.add('get', path, action, name, middlewares);
    }

    /**
     * Ajoute une route post
     * 
     * @param {String} path
     * @param {String|Function} action
     * @param {String} name
     * @param {string|string[]|Function|Function[]} middlewares
     * @returns {Route}
     */
    post(path : string, action : string | Function, name : string, middlewares : string | Function | Array<string|Function>) : _route.Route {
        return this.add('post', path, action, name, middlewares);
    }

    /**
     * Ajoute une route put
     * 
     * @param {String} path 
     * @param {String|Function} action 
     * @param {String} name 
     * @param {string|string[]|Function|Function[]} middlewares
     * @returns {Route}
     */
    put(path : string, action : string | Function, name : string, middlewares : string | Function | Array<string|Function>) : _route.Route {
        return this.add('put', path, action, name, middlewares);
    }

    /**
     * Ajoute une route patch
     * 
     * @param {String} path 
     * @param {String|Function} action 
     * @param {String} name 
     * @param {string|string[]|Function|Function[]} middlewares
     * @returns {Route}
     */
    patch(path : string, action : string | Function, name : string, middlewares : string | Function | Array<string|Function>) : _route.Route {
        return this.add('patch', path, action, name, middlewares);
    }

    /**
     * Ajoute une route put
     * 
     * @param {String} path 
     * @param {String|Function} action 
     * @param {String} name 
     * @param {string|string[]|Function|Function[]} middlewares
     * @returns {Route}
     */
    delete(path : string, action : string | Function, name : string, middlewares : string | Function | Array<string|Function>) : _route.Route {
        return this.add('delete', path, action, name, middlewares);
    }  

    /**
     * Ajoute une route options
     * 
     * @param {String} path 
     * @param {String|Function} action 
     * @param {String} name 
     * @param {string|string[]|Function|Function[]} middlewares
     * @returns {Route}
     */
    options(path : string, action : string | Function, name : string, middlewares : string | Function | Array<string|Function>) : _route.Route {
        return this.add('options', path, action, name, middlewares);
    }

    /**
     * Ajoute une route
     * 
     * @param {String} verb 
     * @param {String} path 
     * @param {String|Function} action 
     * @param {String} name 
     * @param {string|string[]|Function|Function[]} middlewares
     * @returns {Route}
     */
    add(verb : string, path : string, action : string | Function, name : string, middlewares : string | Function | Array<string|Function>) : _route.Route {
        const route : _route.Route = new Route(path, action, middlewares);
        route.setPATH(this.#PATH)
        this.routes[verb.toLowerCase()].push(route);
        if (name && typeof name != undefined) {
            this.namedRoutes = Object.assign({}, this.namedRoutes, {[name] : route});
        }
        return route;
    }


    /**
     * Recupere la valeur de l'autoroute
     * 
     * @returns {Boolean}
     */
    getAutoRoute() : boolean {
        return this.#autoRoute
    }

    /**
     * Modifie la valeur de l'autoroute
     * 
     * @param {Boolean} value 
     * @return static
     */
    setAutoRoute(value : boolean) : this {
        this.#autoRoute = value === true

        return this
    }

    /**
     * Recupere le controleur par defaut a utiliser
     * 
     * @returns {String}
     */
    getDefaultController() : string {
        return this.#defaultController;        
    }

    /**
     * Modifie la valeur du controleur par defaut a utiliser
     * 
     * @param {String} value 
     * @return static
     */
     setDefaultController(value : string) : this {
        this.#defaultController = value

        return this
    }

    /**
     * Recupere la methode par defaut a utiliser
     * 
     * @returns {String}
     */
    getDefaultMethod() : string {
        return this.#defaultMethod;        
    }

    /**
     * Modifie la valeur de la methode par defaut a utiliser
     * 
     * @param {String} value 
     * @return static
     */
    setDefaultMethod(value : string) : this {
        this.#defaultMethod = value

        return this
    }

    /**
     * Renvoi la liste des routes d'une methode HTTP donnée
     * 
     * @param {String} verb 
     * @returns {Route[]|null}
     */
    getRoutes(verb : string) : Array<_route.Route> | null {
        return this.routes[verb.toLowerCase()] || null;        
    }

    getAllRoutes() : {[key: string] : Array<_route.Route>} {
        return this.routes
    }


    /**
     * Genere l'url d'une route nommée
     * 
     * @param {String} name 
     * @param {object} params  
     * @returns {String}
     */
    url(name : string, params : {[key: string] : any}) : string {
        if (typeof params == 'undefined') {
            params = []
        }
        if (name in this.namedRoutes) {
            return this.namedRoutes[name].getUrl(params);
        }
        throw Error('No route matche this name');
    }
}