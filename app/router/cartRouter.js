module.exports = function (router) {
    let cartController = require('../controllers/cartSession');

    router.get("/cart/list", cartController.get_list);
    router.post('/cart/add', cartController.addProductOnCart);
    router.patch("/cart/update/:id", cartController.updateCart);
    router.delete("/cart/remove/:id", cartController.removeCart);
}