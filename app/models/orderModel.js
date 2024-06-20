const db = require("../common/connect");
const moment = require('moment');

const Order = function (order) {
    this.id = order.id;
    this.idProduct = order.idProduct;
    this.idShip = order.idShip;
    this.location = order.location;
    this.quantity = order.quantity;
    this.startDate = order.startDate;
    this.timeShip = order.timeShip;
    this.money = order.money;
    this.action = order.action;
}

Order.getAll = function (idAccount, result) {
    db.query(
        "SELECT DONHANG.id AS donhang_id, DONHANG_SANPHAM.id_sanpham, DONHANG_SANPHAM.soluong AS soluongmua, DONHANG.id_donvivanchuyen, DONHANG.diachi, " +
        "DONHANG.soluong AS tongsoluong, DONHANG.ngaydathang, DONHANG.thoigiandukien, DONHANG.thanhtien, DONHANG.trangthai, " +
        "DONVIVANCHUYEN.tendonvivanchuyen, SANPHAM.anhsanpham, SANPHAM.tensanpham, SANPHAM.motasanpham " +
        "FROM DONHANG " +
        "INNER JOIN DONVIVANCHUYEN ON DONHANG.id_donvivanchuyen = DONVIVANCHUYEN.id " +
        "INNER JOIN DONHANG_SANPHAM ON DONHANG.id = DONHANG_SANPHAM.id_donhang " +
        "INNER JOIN SANPHAM ON DONHANG_SANPHAM.id_sanpham = SANPHAM.id " +
        "WHERE DONHANG.id_taikhoan = ?", [idAccount],
        function (err, orders) {
            if (err) {
                result(err, null);
            } else {
                let groupedOrders = {};

                orders.forEach(order => {
                    let donhangId = order.donhang_id;

                    if (!groupedOrders[donhangId]) {
                        groupedOrders[donhangId] = {
                            id: donhangId,
                            id_donvivanchuyen: order.id_donvivanchuyen,
                            diachi: order.diachi,
                            soluong: order.tongsoluong,
                            ngaydathang: order.ngaydathang,
                            thoigiandukien: order.thoigiandukien,
                            thanhtien: order.thanhtien,
                            trangthai: order.trangthai,
                            tendonvivanchuyen: order.tendonvivanchuyen,
                            sanpham: [],
                        };
                    }

                    groupedOrders[donhangId].sanpham.push({
                        id_sanpham: order.id_sanpham,
                        anhsanpham: order.anhsanpham,
                        tensanpham: order.tensanpham,
                        motasanpham: order.motasanpham,
                        soluong: order.soluongmua,
                        giaban: order.giaban,
                    });
                });


                result(Object.values(groupedOrders));
            }
        }
    );
};


Order.getOrderPaginate = function (page, pageSize, result) {
    const offset = (page - 1) * pageSize;
    db.query("SELECT DONHANG.id AS donhang_id, DONHANG_SANPHAM.id_sanpham, DONHANG_SANPHAM.soluong, DONHANG.id_donvivanchuyen, DONHANG.diachi, " +
        "DONHANG.soluong, DONHANG.ngaydathang, DONHANG.thoigiandukien, DONHANG.thanhtien, DONHANG.trangthai, " +
        "DONVIVANCHUYEN.tendonvivanchuyen, SANPHAM.anhsanpham, SANPHAM.tensanpham, SANPHAM.motasanpham " +
        "FROM DONHANG " +
        "INNER JOIN DONVIVANCHUYEN ON DONHANG.id_donvivanchuyen = DONVIVANCHUYEN.id " +
        "INNER JOIN DONHANG_SANPHAM ON DONHANG.id = DONHANG_SANPHAM.id_donhang " +
        "INNER JOIN SANPHAM ON DONHANG_SANPHAM.id_sanpham = SANPHAM.id LIMIT ?, ?", [offset, pageSize],
        function (err, orders) {
            if (err) {
                result(err, null);
            } else {
                db.query("SELECT COUNT(*) AS total FROM DONHANG", function (err, countResult) {
                    if (err) {
                        result(err, null);
                    } else {
                        const totalItems = countResult[0].total;
                        const totalPages = Math.ceil(totalItems / pageSize);
                        const itemCount = orders.length;
                        const data = {
                            items: orders,
                            meta: {
                                itemCount,
                                totalItems,
                                itemsPerPage: pageSize,
                                totalPages,
                                currentPage: page,
                            }
                        };
                        result(null, data);
                    }
                });
            }
        });
}

Order.create = function (data, result) {
    const {
        id_taikhoan,
        idShip,
        city,
        district,
        ward,
        location,
        name,
        phone,
        total,
        typePay,
        product,
        dateShip,
    } = data;

    const address = `${city}, ${district}, ${ward}, ${location}`;
    const quantity = product.reduce((acc, item) => acc + item.quantity, 0);
    const startDate = new Date();
    const formattedDate = moment(dateShip).format('YYYY-MM-DD HH:mm:ss');

    const sqlOrder = "INSERT INTO DONHANG (id_taikhoan, id_donvivanchuyen, tennguoinhan, sodienthoai, diachi, soluong, ngaydathang, thoigiandukien, thanhtien, trangthai) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const valuesOrder = [
        id_taikhoan,
        idShip,
        name,
        phone,
        address,
        quantity,
        startDate,
        formattedDate,
        total,
        typePay,
    ];

    db.query(sqlOrder, valuesOrder, function (err, orderResult) {
        if (err) {
            result(err);
            return;
        } else {
            const sqlGetLastInsertedId = "SELECT id FROM DONHANG ORDER BY id DESC LIMIT 1";
            db.query(sqlGetLastInsertedId, function (err, rows) {
                if (err) {
                    result(err);
                    return;
                } else {
                    const orderId = rows[0].id;
                    const sqlOrderProduct = "INSERT INTO DONHANG_SANPHAM (id_donhang, id_sanpham, soluong, giaban) VALUES ?";

                    const valuesOrderProduct = product.map(item => [
                        orderId,
                        item.idProduct,
                        item.quantity,
                        item.price
                    ]);

                    db.query(sqlOrderProduct, [valuesOrderProduct], function (err, orderProductResult) {
                        if (err) {
                            result(err);
                            return;
                        }

                        const updateProductPromises = product.map(item => {
                            return new Promise((resolve, reject) => {
                                const sqlUpdateProduct = "UPDATE SANPHAM SET soluong = soluong - ? WHERE id = ?";
                                db.query(sqlUpdateProduct, [item.quantity, item.idProduct], function (err, updateProductResult) {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        resolve(updateProductResult);
                                    }
                                });
                            });
                        });

                        Promise.all(updateProductPromises)
                            .then(updateResults => {
                                result(null, {
                                    id: orderId,
                                    ...data
                                });
                            })
                            .catch(err => {
                                result(err);
                            });
                    });
                }
            });
        }
    });
};

Order.getById = function (id, result) {
    db.query("SELECT DONHANG.id AS donhang_id, DONHANG_SANPHAM.id_sanpham, DONHANG_SANPHAM.soluong as soluongmua, DONHANG_SANPHAM.giaban, DONHANG.id_donvivanchuyen, DONHANG.tennguoinhan, DONHANG.sodienthoai, DONHANG.diachi, DONHANG.diachi, " +
        "DONHANG.soluong as soluongtong, DONHANG.ngaydathang, DONHANG.thoigiandukien, DONHANG.thanhtien, DONHANG.trangthai, " +
        "DONVIVANCHUYEN.tendonvivanchuyen, SANPHAM.anhsanpham, SANPHAM.tensanpham, SANPHAM.motasanpham " +
        "FROM DONHANG " +
        "INNER JOIN DONVIVANCHUYEN ON DONHANG.id_donvivanchuyen = DONVIVANCHUYEN.id " +
        "INNER JOIN DONHANG_SANPHAM ON DONHANG.id = DONHANG_SANPHAM.id_donhang " +
        "INNER JOIN SANPHAM ON DONHANG_SANPHAM.id_sanpham = SANPHAM.id WHERE DONHANG.id = ?", id,
        function (err, orders) {
            if (err) {
                result(err);
            } else {
                let detailOrder = {};
                orders.forEach((order) => {
                    let detailOrderId = order.donhang_id;
                    if (!detailOrder[detailOrderId]) {
                        detailOrder[detailOrderId] = {
                            id: order.donhang_id,
                            id_donvivanchuyen: order.id_donvivanchuyen,
                            tennguoinhan: order.tennguoinhan,
                            sodienthoai: order.sodienthoai,
                            diachi: order.diachi,
                            soluong: order.soluongtong,
                            ngaydathang: order.ngaydathang,
                            thoigiandukien: order.thoigiandukien,
                            thanhtien: order.thanhtien,
                            trangthai: order.trangthai,
                            sanpham: [],
                        }
                    }
                    detailOrder[detailOrderId].sanpham.push({
                        id_sanpham: order.id_sanpham,
                        anhsanpham: order.anhsanpham,
                        tensanpham: order.tensanpham,
                        motasanpham: order.motasanpham,
                        soluong: order.soluongmua,
                        giaban: order.giaban,
                    });

                })
                result(Object.values(detailOrder));
            }
        });
}

Order.update = function (data, id, result) {
    db.query("UPDATE DONHANG SET trangthai = ? WHERE id = ?", [data.action, id], function (err, order) {
        if (err) {
            result(err);
        } else {
            result(order);
        }
    });
}

module.exports = Order;