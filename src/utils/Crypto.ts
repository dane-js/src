const CryptoJS = require('crypto-js')

export enum CRYPTO_ALGO {
    MD5    = 'md5',
    SHA1   = 'sha1',
    SHA3   = 'sha3',
    SHA256 = 'sha256',
    SHA512 = 'sha512',
    BCRYPT = 'bcrypt',
};
export enum CRYPTO_ENCODER {
    Hex    = 'hex',
    Base64 = 'base64',
    Utf8   = 'utf8',
};
export type CRYPTO_OPTIONS = {
    algo    : CRYPTO_ALGO,
    encoder?: CRYPTO_ENCODER
    length? : number
};

export class Crypto {

    public static hash(str: string, salt: string = '', options : CRYPTO_OPTIONS = { algo: CRYPTO_ALGO.SHA512, encoder: CRYPTO_ENCODER.Hex}) : string {
        let output : any = '';
        if (options.algo == CRYPTO_ALGO.MD5) {
            output = CryptoJS.MD5(_salt(str, salt));
        }
        else if (options.algo == CRYPTO_ALGO.SHA1) {
            output = CryptoJS.SHA1(_salt(str, salt));
        }
        else if (options.algo == CRYPTO_ALGO.SHA3) {
            let length : number = 512;
            if ([224, 256, 384, 512].includes(options.length!)) {
                length = options.length!;
            }
            output = CryptoJS.SHA3(_salt(str, salt), {outputLength : length});
        }
        else if (options.algo == CRYPTO_ALGO.SHA256) {
            output = CryptoJS.SHA256(_salt(str, salt));
        }
        else {
            output = CryptoJS.SHA512(_salt(str, salt));
        }
        
        let encoder;
        if (options.encoder == undefined) {
            encoder = CryptoJS.enc.Hex
        }
        else {
            encoder = CryptoJS.enc[options.encoder]
        }
    
        return output.toString(encoder!);
    }
    
    public static verify(str: string, crypted: string, salt: string = '', options : CRYPTO_OPTIONS = { algo: CRYPTO_ALGO.SHA512, encoder: CRYPTO_ENCODER.Hex}) : boolean {
        return Crypto.hash(str, salt, options) == crypted;
    }
}

const _salt = (str : string, salt: string) : string  => {
    return `danejs${salt}${str}danejs${salt}`
};