import express from 'express';
import { _http } from '../../types/_http';
const Request = require('../http/Request');
const Response = require('../http/Response');
const fs = require('fs');
const { in_array } = require('php-in-js/modules/array')
const { ucfirst } = require('php-in-js/modules/string')
module.exports = class BaseController 
{
    protected path : {[key: string]: string};

    protected request: _http.Request | null = null
    protected response: _http.Response | null = null
    
    protected db : {[key: string]: _db.BaseModel} = {}

    constructor(path: {[key: string]: string}) {
        this.path = path
    }

    public initialize(req : express.Request, res : express.Response, models : {[key: string]: _db.BaseModel}): void {
        this.request = new Request(req, res)
        this.response = new Response(req, res)
        
        this.#initDb(models)
        this.#initPlugins()
    }

    #initPlugins(): void {
        const pluginsConfig : {[key: string]: boolean | any} = require(this.path.CONFIG_DIR + '/plugins')
        for (let k in pluginsConfig) {
            if (pluginsConfig[k] === true && fs.existsSync(`${this.path.PLUGIN_DIR}/${k}.js`)) {
                const plugin = require(`${this.path.PLUGIN_DIR}/${k}.js`)
                Object.defineProperties(this, {
                    ['$' + k]: { get: function() { return plugin } }
                });
            }
        }
    }

    #initDb(models : {[key: string]: _db.BaseModel}): void {
        this.db = models
        for (let k in models) {
            if (!in_array(k, ['sequelize', 'Sequelize', 'Op', 'DataTypes'])) {
                Object.defineProperties(this, {
                    [`${ucfirst(k)}Model`]: { get: function() { return models[k] } }
                });
            }
        }
    }
}