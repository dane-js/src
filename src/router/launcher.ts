import express from 'express';
import { _base } from '../../types/_base';
import { _controller } from '../../types/_controller';
import { _route } from '../../types/_router';

const fs = require('fs');
const { call_user_func_array } = require('php-in-js/modules/functions');
const { ucfirst } = require('php-in-js/modules/string');
const { empty } = require('php-in-js/modules/types');

module.exports = (parts : Array<string>, req: express.Request, res: express.Response, path: _base.PATH, models : {[key: string]: _db.BaseModel}, router : _route.Router) => {
    let controller : string | undefined = parts.shift();
    if (controller?.toLowerCase() !== 'favicon.ico') {
        if (empty(controller)) {
            controller = router?.getDefaultController()
        }
        if (empty(controller)) {
            controller = 'Home'
        }
        if (!controller?.endsWith('Controller')) {
            controller += 'Controller'
        }
        controller = ucfirst(controller);

        let method : string | undefined = parts.shift();
        if (empty(method)) {
            method = router?.getDefaultMethod();
        }
        if (empty(method)) {
            method = 'index'
        }
        method = method!.replace(/-/g, '_')

        if (!fs.existsSync(`${path.CONTROLLER_DIR}/${controller}.js`)) {
            throw Error(`Controller file "${path.CONTROLLER_DIR}/${controller}.js" do not exist`);
        }

        const params = [...parts, req, res]
        const classe = require(`${path.CONTROLLER_DIR}/${controller}`)

        const obj : _controller.BaseController = new classe(path)
        obj.initialize(req, res, models);

        if (!method || !(method in obj)) {
            throw Error(`Methode "${method}" non definie dans le controleur ${controller}`)
        }
        return call_user_func_array([obj, method], params)
    }
}