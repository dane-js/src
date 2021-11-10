const { DataTypes, Sequelize, Op } = require('sequelize');
const {ucfirst}= require('php-in-js/modules/string')

const fs = require('fs');
const path = require('path');

module.exports = class Db
{
    static #db : typeof Sequelize | null = null

    static #connect($path : {[key: string]: string}) : typeof Sequelize | boolean {
        if (this.#db !== null) {
            return this.#db
        } 
        const config = this.getConfig($path)
        if (config.enabled === false) {
            return false
        }

        this.#db = new Sequelize(config.database, config.username, config.password, {
          host: config.hostname,
          dialect: config.dialect,
          logging: config.logging === true ? console.log : false
        })
        return this.#db
    }

    static initialize($path : {[key: string]: string}) : {[key: string]: _db.BaseModel} {
        const models : {[key: string]: _db.BaseModel} = {};
        const connection : typeof Sequelize | boolean = this.#connect($path)
        if (connection === false) {
            return models
        }

        fs.readdirSync($path.MODEL_DIR).filter((file : string) => {
            return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js' && !file.startsWith('AppModel'));
        })
        .forEach((file : string) => {
            const model : _db.BaseModel = this.#createModel($path, file)
            const name = model.getModelName();
            if (name) {
                models[name] = model.make(connection);
            }
        });

        Object.keys(models).forEach(modelName => {
            if ('associate' in models[modelName]) {
                models[modelName].associate(models);
            }
        });
        
        models.sequelize = connection;
        models.Sequelize = Sequelize;
        models.Op = Op

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
        const model : _db.BaseModel = new m(DataTypes, Sequelize, Op);

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