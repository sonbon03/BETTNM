module.exports = function (router) {
    const locationController = require("../controllers/locationController");

    router.get("/city", locationController.get_list_city);
    router.get("/district/:id", locationController.get_list_district);
    router.get("/ward/:id", locationController.get_list_ward);
}