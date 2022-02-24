import express from 'express';

declare namespace _route {
    class Router {
        constructor(path: {[key: string]: string})
        getAllRoutes() : {[key: string]: Array<Route>}

        get(path : string, action : string | Function, name : string) : Route
        post(path : string, action : string | Function, name : string) : Route
        put(path : string, action : string | Function, name : string) : Route
        patch(path : string, action : string | Function, name : string) : Route
        delete(path : string, action : string | Function, name : string) : Route
        options(path : string, action : string | Function, name : string) : Route
        add(verb : string, path : string, action : string | Function, name : string) : Route

        getDefaultController() : string
        setDefaultController(value : string) : this
        getDefaultMethod() : string
        setDefaultMethod(value : string) : this
        setAutoRoute(value : boolean) : this
        getAutoRoute() : boolean
        getRoutes(verb : string) : Array<Route> | null
        url(name : string, params : {[key: string] : any}) : string
    }

    class Route {
        constructor(path : string, callable : string | Function, middlewares : string | Function | Array<string|Function>)
        setPATH(path : {[key: string]: string}) : Route
        getMiddlewares() : Array<Function>
        getRunner(models : {[key: string]: _db.BaseModel}, io : any, req : express.Request, res : express.Response, next : Function) : Function

        getPath() : string
        with(param : string, regex : string) : Route
        getUrl(params : {[key: string] : any}) : string
        call(router : Router, path : {[key: string]: string}, app : express.Application | undefined, req: any, res: any) : any
        match(url : string) : boolean
    }

    class Dispatcher {
        constructor(path : {[key: string]: string}, models : {[key: string]: _db.BaseModel})
        dispatch(io: any, req : express.Request, res : express.Response, next : Function) : any
        launchAction(parts : Array<string>, req: express.Request, res: express.Response)
    }
}

