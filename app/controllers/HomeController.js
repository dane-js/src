const AppController = require("./AppController")

module.exports = class HomeController extends AppController {
    
    async home(req, res) {
        return res.send('Hello World')
    }
}