const axios = require('axios')
const env = process.env.NODE_ENV || 'development'

let baseURL = 'http://the-api-development-domain.com'
if (env === 'production') {
    baseURL = 'http://the-api-production-domain.com';
}
else if (env === 'test') {
    baseUR = 'http://the-api-test-domain.com'
}

let config = {
    baseURL
    // timeout: 60 * 1000, // Timeout
    // withCredentials: true, // Check cross-site Access-Control
};
const _axios = axios.create(config);

_axios.interceptors.request.use(
    function (config) {
        // Do something before request is sent

        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Add a response interceptor
_axios.interceptors.response.use(
    function (response) {
        // Do something with response data
        return response.data;
    },
    function (error) {
        // Do something with response error

        const response = error.response || null
        if (response == null) {
            return Promise.reject(error)
        }

        const data = response.data || null
        if (data == null) {
            return Promise.reject(response)
        }
        
        return Promise.reject(data)
    }
);

module.exports = _axios;