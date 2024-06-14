const Comment = require("../models/commentModel");

exports.get_list = function (req, res) {
    Comment.getAll(function (data) {
        res.send(data)
    })
}

exports.addComment = function (req, res) {
    let data = req.body;
    Comment.create(data, function (response) {
        res.send(response)
    })
}

exports.updateComment = function (req, res) {
    let data = req.body;
    let id = req.params.id;
    Comment.update(data, id, function (response) {
        res.send(response)
    })
}

exports.removeComment = function (req, res) {
    let id = req.params.id;
    Comment.remove(id, function (response) {
        res.send(response)
    })
}