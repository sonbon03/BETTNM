exports.addProductOnCart = function (req, res) {
    try {
        let cart = req.session.cart || [];
        let product = req.body;
        cart.push(product);
        req.session.cart = cart;
        console.log(req.session.cart)
        res.status(200).send(null, "Product added to cart");
    } catch (error) {
        console.error("Error adding product to cart:", error);
        res.status(500).send("An error occurred while adding the product to the cart");
    }
};

exports.get_list = (req, res) => {
    let cart = req.session.cart || [];
    res.json(cart);
};


exports.removeCart = function (req, res) {
    let id = req.params.id;
    Cart.remove(id, function (response) {
        res.send(response)
    })
}

exports.updateCart = function (req, res) {
    let data = req.body;
    let id = req.params.id;
    Cart.update(data, id, function (response) {
        res.send(response)
    })
}