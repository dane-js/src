import express  from 'express';
const cookieParser = require('cookie-parser')
const cors = require('cors')
const http = require('http')
import fs from 'fs'

import { _route } from "../types/_router";
import { _base } from "../types/_base";

const Dispatcher = require('./router/Dispatcher')
const Router = require('./router/Router')
const Route = require('./router/Route')
const Db = require('./db/Db')
module.exports = class Kernel {
 
    #PATH : _base.PATH = {
        STATIC_DIR     : '',
        CONFIG_DIR     : '',
        CONTROLLER_DIR : '',
        MIDDLEWARE_DIR: '',
        MODEL_DIR      : '',
        PLUGIN_DIR     : '',
        REPOSITORY_DIR : '',
        VIEW_DIR       : '',
    }

    constructor(path: _base.PATH) {
        this.#PATH = {...this.#PATH, ...path}
    }
 
    init() {
        const app : express.Application = express()
        const server = http.Server(app)
        const models : { 
            sequelize: any,
            Op: any
            [Key: string]: _db.BaseModel, 
        } = Db.initialize(this.#PATH)

        const corsOptions = require(`${this.#PATH.CONFIG_DIR}/cors`)
        app.use(cors(corsOptions))

        app.use(cookieParser())
        app.use('/static', express.static(this.#PATH.STATIC_DIR))
        app.use(express.urlencoded({ extended: true }))
        app.use(express.json({ limit: '250mb' }))
        
        
        const socketFile = `${this.#PATH.CONFIG_DIR}/socket.js`
        let io = null
        if (fs.existsSync(socketFile)) {
            const socket = require(socketFile)
            io = require('socket.io')(server, socket.options || {})
            io = socket.handler(io, models)
        }
        this.#initializeApp(app, models, io)
        
        const { port, host } = require(`${this.#PATH.CONFIG_DIR}/env`)
        server.listen(port, host, async() => {
            await this.sync(models)
            console.log(`Le serveur a demarré sur l\'hôte http://${host}:${port}`)
        })
    }

    #initializeApp(app : any, models : {[key: string]: _db.BaseModel}, io : any) {
        const app_middlewares : Array<Function|string> = require(`${this.#PATH.CONFIG_DIR}/middlewares.js`)([])
        const middlewares = Route.makeMiddlewares(this.#PATH, app_middlewares)
        if (middlewares.length) {
            app.use(...middlewares)
        }
        const router : _route.Router = require(`${this.#PATH.CONFIG_DIR}/routes.js`)(new Router(this.#PATH))
        const routes : {[key: string]: Array<_route.Route>} = router.getAllRoutes()
        for (let key in routes) {
            routes[key].forEach(route => {
                const middlewares : Function[] = route.getMiddlewares()
                const runner : Function = function (req : express.Request, res : express.Response, next : Function) {
                    return route.getRunner(models, io, req, res, next)
                }
                if (key == 'delete') {
                    app.delete(`/${route.getPath()}`, ...middlewares, runner)
                }
                if (key == 'get') {
                    app.get(`/${route.getPath()}`, ...middlewares, runner)
                }
                if (key == 'head') {
                    app.head(`/${route.getPath()}`, ...middlewares, runner)
                }
                if (key == 'post') {
                    app.post(`/${route.getPath()}`, ...middlewares, runner)
                }
                if (key == 'put') {
                    app.put(`/${route.getPath()}`, ...middlewares, runner)
                }
            })
        }
        const dispatcher : _route.Dispatcher = new Dispatcher(this.#PATH, models);
        app.use(function (req : express.Request, res : express.Response, next : Function) {
            return dispatcher.dispatch(io, req, res, next)
        })
    }

    async sync(models : { 
        sequelize: any,
        Op: any
        [Key: string]: _db.BaseModel, 
    }) {
        const config : {sync: boolean, [Key: string]: any} = Db.getConfig(this.#PATH)
        if (config.sync) {
            if ('sequelize' in models) {
                await models.sequelize.sync({ alter: true })
            }
        }
    }
}