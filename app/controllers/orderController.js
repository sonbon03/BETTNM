const Order = require("../models/orderModel")

exports.get_list = function (req, res) {
    Order.getAll(function (data) {
        res.send(data)
    })
}

exports.get_list_paginate = function (req, res) {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    Order.getOrderPaginate(page, pageSize, function (err, data) {
        if (err) {
            res.status(500).send({
                error: err
            })
        } else {
            res.send(data)
        }
    })
}

exports.detail = function (req, res) {
    const id = req.params.id;
    Order.getById(id, function (data) {
        res.send(data)
    })
}

exports.addOrder = function (req, res) {
    const data = req.body;
    Order.create(data, function (response) {
        res.send(response)
    })
}

exports.updateOrder = function (req, res) {
    const data = req.body;
    const id = req.params.id;
    Order.update(data, id, function (err, response) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(response);
        }
    })
}