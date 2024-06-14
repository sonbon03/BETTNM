module.exports = function (router) {
    const homeController = require("../controllers/homeController");
    router.get('/', homeController.home)
}