import express from 'express';
import { _http } from '../../types/_http';
const Request = require('../http/Request');
const Response = require('../http/Response');
const fs = require('fs');
const pij = require('php-in-js/cjs')
module.exports = class BaseController 
{
    protected pij : {[key: string]: any} = pij
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
            if (pluginsConfig[k] == true) {
                let pluginFile = `${this.path.PLUGIN_DIR}/${k}.js`;
                const pluginConfigFile = `${this.path.CONFIG_DIR}/plugin.${k}.js`;

                if (!fs.existsSync(pluginFile)) {
                    pluginFile = `${__dirname}/../plugins/${k}.js`;
                }
                if (fs.existsSync(pluginFile)) {
                    let pluginConfig = {};
                    if (fs.existsSync(pluginConfigFile)) {
                        pluginConfig = require(pluginConfigFile);
                    }
                    const plugin = require(pluginFile);
                    Object.defineProperties(this, {
                        ['$' + k]: { get: function() { return plugin({...pluginConfig, path: this.path}) } }
                    });
                }
            }
        }
    }

    #initDb(models : {[key: string]: _db.BaseModel}): void {
        this.db = models
        for (let k in models) {
            if (!this.pij.in_array(k, ['sequelize', 'Sequelize', 'Op', 'DataTypes'])) {
                Object.defineProperties(this, {
                    [`${this.pij.ucfirst(k)}Model`]: { get: function() { return models[k] } }
                });
            }
        }
    }
}