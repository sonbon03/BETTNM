const {
    json
} = require("body-parser")
let Product = require("../models/productModel")

exports.get_list = function (req, res) {
    Product.getAll(function (data) {
        res.send(data)
    })
}

exports.get_list_pagination = function (req, res) {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const typeProduct = req.query.typeProduct || null;

    Product.getAllPagination(page, pageSize, typeProduct, function (err, data) {
        if (err) {
            res.status(500).send({
                error: err
            });
        } else {
            res.send(data);
        }
    })
}

exports.getTypeName = function (req, res) {
    Product.getTypeProduct(function (data) {
        res.send(data)
    })
}

exports.detail = function (req, res) {
    Product.getById(req.params.id, function (response) {
        res.send(response)
    })
}

// Body parser
exports.addProduct = function (req, res) {
    let data = req.body;
    Product.create(data, function (response) {
        res.send(response)
    })
}

exports.removeProduct = function (req, res) {
    let id = req.params.id;
    Product.remove(id, function (response) {
        res.send(response)
    })
}

exports.updateProduct = function (req, res) {
    let data = req.body;
    let id = req.params.id;
    Product.update(data, id, function (response) {
        res.send(response)
    })
}