import { _base } from "../../types/_base";

const {ucfirst}= require('php-in-js/modules/string')

const fs = require('fs');
const path = require('path');

module.exports = class Db
{
    static #db : any = null
    static #sequelizeOptions : any = null

    static #connect($path : {[key: string]: string}) : any | boolean {
        if (this.#db !== null) {
            return this.#db
        } 
        const config = this.getConfig($path)
        if (config.enabled === false) {
            return false
        }

        const { DataTypes, Sequelize, Op } = require('sequelize');

        this.#db = new Sequelize(config.database, config.username, config.password, {
          host: config.hostname,
          dialect: config.dialect,
          logging: config.logging === true ? console.log : false
        })

        this.#sequelizeOptions = { DataTypes, Sequelize, Op }

        return this.#db
    }

    static initialize($path : _base.PATH) : {[key: string]: _db.BaseModel} {
        let models : {[key: string]: _db.BaseModel} = {};
        const trueModels : {[key: string]: _db.BaseModel} = {};
        
        const connection : any | boolean = this.#connect($path)
        if (connection === false) {
            return models
        }

        if (fs.existsSync($path.MODEL_DIR)) {
            fs.readdirSync($path.MODEL_DIR).filter((file : string) => {
                return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js' && !file.startsWith('AppModel'));
            })
            .forEach((file : string) => {
                const model : _db.BaseModel = this.#createModel($path, file)
                const name = model.getModelName();
                if (name) {
                    models[name] = model.make(connection);
                    trueModels[name] = model
                }
            });
        }
        
        Object.keys(models).forEach(name => {
            models = {...models, ...trueModels[name].associate(models)}
        })

        models.sequelize = connection;
        models.Sequelize = this.#sequelizeOptions.Sequelize;
        models.Op = this.#sequelizeOptions.Op

        return models
    }

    static getConfig($path : {[key: string]: string}) : {
        enabled: boolean,
        database : string,
        password : string | null,
        username : string,
        hostname : string,
        dialect: string,
        logging : boolean,

        [key: string]: any
      } {
        const config = require(path.join($path.CONFIG_DIR, '/database'))
          
        return {enabled : config.enable || false, ...config[process.env.NODE_ENV || 'development'] }
    }

    static #createModel($path : {[key: string]: string}, file : string) : _db.BaseModel {
        const m  = require(path.join($path.MODEL_DIR, file))
        const model : _db.BaseModel = new m(this.#sequelizeOptions.DataTypes, this.#sequelizeOptions.Sequelize, this.#sequelizeOptions.Op);

        file = file.replace('.js', '').replace(/Model$/i, '')

        if (null == model.getModelName()) {
            model.setModelName(ucfirst(file));
        }
        if (null == model.getTableName()) {
            model.setTableName(file.toLowerCase());
        }
        
        return model;
    }
}