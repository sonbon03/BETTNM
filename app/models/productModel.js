const db = require("../common/connect");

const Product = function (product) {
    this.id = product.id;
    this.name = product.name;
    this.image = product.image;
    this.typeProduct = product.typeProduct;
    this.description = product.description;
    this.price = product.price;
    this.quantity = product.quantity;
    this.idTypeProduct = product.idTypeProduct;
}

Product.getAll = function (result) {
    db.query("SELECT * FROM SANPHAM ORDER BY tensanpham DESC", function (err, product) {
        if (err) {
            result(err);
        } else {
            result(product);
        }
    });
}

Product.getAllPagination = function (page, pageSize, typeProduct, result) {
    const offset = (page - 1) * pageSize;

    let queryProducts = "SELECT * FROM SANPHAM ";
    let queryCount = "SELECT COUNT(*) AS total FROM SANPHAM ";
    let queryParams = [];
    let orderByQuery = "ORDER BY tensanpham DESC LIMIT ?, ?";
    let queryWhere = "WHERE id_loaisanpham=? "

    if (typeProduct !== null) {
        queryProducts += queryWhere;
        queryCount += queryWhere;
        queryParams.push(typeProduct);
    }

    queryProducts += orderByQuery;
    queryParams.push(offset, pageSize);


    db.query(queryProducts, queryParams, function (err, products) {
        if (err) {
            result(err, null);
        } else {
            db.query(queryCount, typeProduct !== null ? [typeProduct] : [], function (err, countResult) {
                if (err) {
                    result(err, null);
                } else {
                    const totalItems = countResult[0].total;
                    const totalPages = Math.ceil(totalItems / pageSize);
                    const itemCount = products.length;
                    const data = {
                        items: products,
                        meta: {
                            itemCount,
                            totalItems,
                            itemsPerPage: pageSize,
                            totalPages,
                            currentPage: page,
                        }
                    }
                    result(null, data);
                }
            })
        }
    })
}

Product.getById = function (id, result) {
    db.query(`SELECT SANPHAM.id, SANPHAM.anhsanpham, SANPHAM.tensanpham, SANPHAM.motasanpham, SANPHAM.soluong, SANPHAM.giaban, SANPHAM.id_loaisanpham, LOAISANPHAM.tenloaisanpham FROM SANPHAM INNER JOIN LOAISANPHAM ON SANPHAM.id_loaisanpham = LOAISANPHAM.id WHERE SANPHAM.id = "${id}"`, function (err, product) {
        if (err) {
            result(err);
        } else {
            result(product);
        }
    })
}


Product.getTypeProduct = function (result) {
    db.query("SELECT * FROM LOAISANPHAM", function (err, product) {
        if (err) {
            result(null, "Cann't get data for product!");
        } else {
            result(product, ("Get data success"));
        }
    })
}

Product.create = function (data, result) {
    const {
        name,
        image,
        description,
        price,
        quantity,
        idTypeProduct
    } = data;

    const sql = "INSERT INTO SANPHAM (tensanpham, anhsanpham, motasanpham, soluong, giaban, id_loaisanpham) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [name, image, description, quantity, price, idTypeProduct];

    db.query(sql, values, function (err, product) {
        if (err) {
            result(err);
        } else {
            result(product);
        }
    });
}

Product.remove = function (id, result) {
    db.query("DELETE FROM SANPHAM WHERE id = ?", id, function (err, product) {
        if (err) {
            result(err);
        } else {
            result(product);
        }
    })
}

Product.update = function (data, id, result) {
    db.query("UPDATE SANPHAM SET anhsanpham=?, tensanpham=?, motasanpham=?, soluong=?, giaban=?, id_loaisanpham=? WHERE id=?", [data.image, data.name, data.description, data.quantity, data.price, data.idTypeProduct, id], function (err, product) {
        if (err) {
            result(err);
        } else {
            result(product);
        }
    })
}


module.exports = Product;