const db = require("../common/connect");



const Comment = function (comment) {
    this.id = comment.id;
    this.idAccount = comment.idAccount;
    this.comment = comment.comment;
    this.idProduct = comment.idProduct;
}

Comment.getAll = function (result) {
    db.query("SELECT * FROM BINHLUAN ORDER BY createdAt DESC", function (err, comment) {
        if (err) {
            result(err);
        } else {
            result(comment);
        }
    })
}

Comment.create = function (data, result) {
    const {
        idAccount,
        comment,
        idProduct,
    } = data;

    const sql = "INSERT INTO BINHLUAN(id_taikhoan, binhluan, id_sanpham) VALUES(?, ?, ?)";

    const values = [idAccount, comment, idProduct];

    db.query(sql, values, function (err, comments) {
        if (err) {
            return result(err);
        } else {
            return result(comments);
        }
    });
}

Comment.update = function (data, id, result) {
    db.query("UPDATE BINHLUAN SET binhluan=? WHERE id=? ", [data.comment, id], function (err, comment) {
        if (err) {
            result(err);
        } else {
            result(comment);
        }
    })
}

Comment.remove = function (id, result) {
    db.query("DELETE FROM BINHLUAN WHERE id=?", id, function (err, comment) {
        if (err) {
            result(err);
        } else {
            result(comment);
        }
    })
}



module.exports = Comment;