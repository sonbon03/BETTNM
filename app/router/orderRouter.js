module.exports = function (router) {

    const orderController = require("../controllers/orderController");

    router.get("/order/list/:idAccount", orderController.get_list);
    router.get("/order/detail/:id", orderController.detail);
    router.post("/order/add", orderController.addOrder);
    router.patch("/order/update/:id", orderController.updateOrder);

    router.get("/order/paginate", orderController.get_list_paginate);
}