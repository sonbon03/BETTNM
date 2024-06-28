const db = require("../common/connect");

const Location = function (location) {
    this.city = location.city;
    this.district = location.district;
    this.ward = location.ward;
}


Location.getCity = function (result) {
    db.query("SELECT * FROM CITY", function (err, city) {
        if (err) {
            result(err);
        } else {
            result(city);
        }
    })
}

Location.getDistrict = function (idCity, result) {
    db.query("SELECT * FROM DISTRICT WHERE idCity=?", idCity, function (err, district) {
        if (err) {
            result(err);
        } else {
            result(district);
        }
    })
}
Location.getWard = function (idDistrict, result) {
    db.query("SELECT * FROM WARD WHERE idDistrict=?", idDistrict, function (err, ward) {
        if (err) {
            result(err);
        } else {
            result(ward);
        }
    })
}


module.exports = Location;