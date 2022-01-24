import express from 'express';
import { _base } from '../../types/_base';
import { _http } from '../../types/_http';
const Request = require('../http/Request');
const Response = require('../http/Response');
const fs = require('fs');
const pij = require('php-in-js/cjs')
const _path = require('path');

module.exports = class BaseController 
{
    protected pij : {[key: string]: any} = pij
    protected path : _base.PATH;

    protected request: _http.Request | null = null
    protected response: _http.Response | null = null
    
    protected db : {[key: string]: _db.BaseModel} = {}
    protected repo : {[key: string]: _db.BaseRepository} = {}

    constructor(path: _base.PATH) {
        this.path = path
    }

    public async initialize(
        req : express.Request, 
        res : express.Response, 
        models : {[key: string]: _db.BaseModel}
    ): Promise<void> {
        this.request = new Request(req, res)
        this.response = new Response(req, res)
        
        this.#initDb(models)
        this.#initPlugins()
        this.#initRepo()
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

    #initRepo(): void {
        let repositories : {[key: string]: _db.BaseRepository} = {};

        if (fs.existsSync(this.path.REPOSITORY_DIR)) {
            fs.readdirSync(this.path.REPOSITORY_DIR).filter((file : string) => {
                return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js' && !file.startsWith('AppRepository'));
            })
            .forEach((file : string) => {
                const repo : _db.BaseRepository = this.#createRepository(file)
                const name = repo.getRepoName();
                if (name) {
                    repositories[name] = repo;
                }
            });
        }
        
        this.repo = repositories
        for (let k in repositories) {
            Object.defineProperties(this, {
                [`${this.pij.ucfirst(k)}Repo`]: { get: function() { return repositories[k] } }
            });
        }
    }

    #createRepository(file : string) : _db.BaseRepository {
        const r  = require(_path.join(this.path.REPOSITORY_DIR, file))
        const repo : _db.BaseRepository = new r(this.db);

        file = file.replace('.js', '').replace(/Repository$/i, '')

        if (null == repo.getRepoName()) {
            repo.setRepoName(this.pij.ucfirst(file));
        }
        
        return repo.initializeModel();
    }
}