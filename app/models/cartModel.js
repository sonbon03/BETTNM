const db = require('../common/connect')


const Cart = function (cart) {
    this.id = cart.id;
    this.idAccount = cart.idAccount;
    this.idProduct = cart.idProduct;
    this.idCart = cart.idCart;
    this.name = cart.name;
    this.quantity = cart.quantity;
}

Cart.getAll = function (result) {
    db.query("SELECT GIOHANG_SANPHAM.id, GIOHANG_SANPHAM.id_sanpham, GIOHANG_SANPHAM.tensanpham, GIOHANG_SANPHAM.soluong, SANPHAM.anhsanpham ,SANPHAM.giaban, SANPHAM.soluong AS soluongton  FROM GIOHANG_SANPHAM INNER JOIN SANPHAM ON  GIOHANG_SANPHAM.id_sanpham = SANPHAM.id ORDER BY GIOHANG_SANPHAM.tensanpham DESC", function (err, cart) {
        if (err) {
            result(null);
        } else {
            result(cart);
        }
    })
}


Cart.create = function (data, result) {
    const {
        idProduct,
        idCart,
        name,
        quantity,
    } = data;
    const values = [
        idProduct,
        idCart,
        name,
        quantity,
    ];
    db.query("SELECT GIOHANG_SANPHAM.id, GIOHANG_SANPHAM.id_sanpham, GIOHANG_SANPHAM.id_giohang, GIOHANG_SANPHAM.tensanpham, GIOHANG_SANPHAM.soluong, SANPHAM.soluong AS soluongton FROM GIOHANG_SANPHAM INNER JOIN SANPHAM ON GIOHANG_SANPHAM.id_sanpham = SANPHAM.id WHERE GIOHANG_SANPHAM.id_sanpham=?", data.idProduct, function (err, product) {
        if (err) {
            return (err, null);
        } else {
            if (product.length !== 0) {
                let quanlity = data.quantity + product[0].soluong;
                if (quanlity <= product[0].soluongton) {
                    db.query("UPDATE GIOHANG_SANPHAM SET soluong = ? WHERE id = ?", [quanlity, product[0].id], function (err, cart) {
                        if (err) {
                            result(err);
                        } else {
                            result(cart);
                        }
                    })
                } else {
                    result("Số lượng sản phẩm không đủ");
                }
            } else {
                const sql = "INSERT INTO GIOHANG_SANPHAM (id_sanpham, id_giohang, tensanpham, soluong) VALUES (?, ?, ?, ?)";

                db.query(sql, values, function (err, card) {
                    if (err) {
                        result(err);
                    } else {
                        result(card);
                    }
                });
            }
        }
    })




}


Cart.remove = function (id, result) {
    db.query("DELETE FROM GIOHANG_SANPHAM WHERE id = ?", id, function (err) {
        if (err) {
            result(err);
        } else {
            result();
        }
    })
}

Cart.update = function (data, id, result) {
    db.query("UPDATE GIOHANG_SANPHAM SET soluong = ? WHERE id = ?", [data.soluong, id], function (err, cart) {
        if (err) {
            result(null);
        } else {
            result(cart);
        }
    })
}


module.exports = Cart;