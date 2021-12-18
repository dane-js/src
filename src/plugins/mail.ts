const nodemailer = require('nodemailer')

declare type Address = string | { address: string, name: string }


/**
 * Service d'envoie de mail
 * 
 * @param {object} config 
 * @use nodemailer
 * @returns 
 */
module.exports = function(config : {
    host: string
    port: number
    username: string
    password: string
    from: Address
    [key: string]: any
}) {
    
	const data : {
        from: Address
        to: null | Address | Array<Address>
        replyTo: null | Address | Array<Address>
        subject: null | string
        body: null | string
        isHtml: boolean
    } = {
        from: config.from,
        to: null,
        replyTo: null,
        subject: null,
        body: null,
        isHtml: true
    };

    /**
     * Defini l'emeteur de l'email
     * 
     * @param {Address} address 
     * @param {String} name
     * 
     * @returns {self} 
     */
    exports.from = (address : Address, name : string) => {
        if (name && typeof address == 'string') {
            address = { address, name };
        }
        data.from = address;

        return this;
    };

    /**
     * Defini le(s) recepteur(s) de l'email
     * 
     * @param {String|Address|Array<Address>} address 
     * @param {String} name
     * 
     * @returns {this} 
     */
    exports.to = (address : string | Address | Array<Address>, name : string) => {
        if (name && typeof address == 'string') {
            address = { address, name };
        }
        data.to = address;

        return this;
    }

    /**
     * Defini le(s) personnes a qui on doit repondre
     * 
     * @param {String|Address|Array<Address>} address 
     * @param {String} name
     * 
     * @returns {this} 
     */
    exports.replyTo = (address : string | Address | Array<Address>, name : string) => {
        if (name && typeof address == 'string') {
            address = { address, name };
        }
        data.replyTo = address;

        return this;
    }

    /**
     * Defini le sujet du message
     * 
     * @param {String} subject
     * 
     * @returns {Self} 
     */
    exports.subject = (subject : string) => {
        data.subject = subject;

        return this;
    }

    /**
     * Defini le corps du message
     * 
     * @param {String} body 
     * @param {Boolean} isHtml 
     * 
     * @returns {Self}
     */
    exports.body = (body : string, isHtml : boolean) => {
        data.body = body;
        data.isHtml = !(isHtml === false);

        return this;
    }

    /**
     * Envoi du message
     * 
     * @param {String | null} filename
     * @param {object} params
     */
    exports.send = async(filename : string | null, params: {[key: string] : any}) => {
        let transporter = nodemailer.createTransport({
            host: config.host,
            port: config.port,
            secure: false, // true for 465, false for other ports
            auth: {
                user: config.username, // generated ethereal user
                pass: config.password, // generated ethereal password
            },
        });

        let message : {
            html: string | null
            text: string | null
            [key: string]: any
        } = {
            from: data.from,
            to: data.to,
            replyTo: data.replyTo,
            subject: data.subject,
            html: null,
            text: null
        };
        if (!filename) {
            if (data.isHtml) {
                message.html = data.body;
            } else {
                message.text = data.body;
            }

            transporter.sendMail(message);
        } else {
			const ejs = require('ejs');

            ejs.renderFile(config.path.VIEW_DIR + '/sendmail/' + filename + '.ejs', params, {}, (err : any, html : string) => {
                message.html = html;

                transporter.sendMail(message);
            })
        }
    }

    return this;
}
