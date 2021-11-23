const test = require('../middlewares/test')

module.exports = (queue, request) => {

    queue.push(test)

    return queue
}