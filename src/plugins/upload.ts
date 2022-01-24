const { imgSync } = require("base64-img")
const Str = require('../utils/Str');

/**
 * Service d'upload de fichier
 * 
 * @param {object} config 
 * @use base64-img
 * @returns 
 */
module.exports = function(config : { [key: string]: any }) {
    
    const upload : {
        fromBase64?: Function,
    } = {}

    upload.fromBase64 = (data: string, folder : string, name?: string) => {
        if (name == undefined) {
            name = Str.generateKey(32).toLowerCase()
        }
        try {
            const filepath : string = imgSync(data, `${config.path.STATIC_DIR}/${folder}`, name),
                pathArr = filepath.split(/(\/|\\)/g)
                
            return `${config.baseUrl}/static/${folder}/${pathArr[pathArr.length - 1]}`
        }
        catch(error) {
            return ''
        }
    }

    return upload
}
