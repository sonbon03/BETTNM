const Location = require("../models/locationModel")

exports.get_list_city = function (req, res) {
    Location.getCity(function (data) {
        res.send(
            data
        )
    })
}

exports.get_list_district = function (req, res) {
    const idCity = req.params.id;
    Location.getDistrict(idCity, function (data) {
        res.send(
            data
        );
    })
}

exports.get_list_ward = function (req, res) {
    const idDistrict = req.params.id;
    Location.getWard(idDistrict, function (data) {
        res.send(
            data
        );
    })
}