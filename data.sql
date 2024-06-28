CREATE TABLE TAIKHOAN (
    id VARCHAR(36) PRIMARY KEY DEFAULT UUID(),
    tendangnhap VARCHAR(255) NOT NULL,
    matkhau VARCHAR(255) NOT NULL,
    quyen INT NOT NULL
);

CREATE TABLE KHACHHANG (
    id VARCHAR(36) PRIMARY KEY DEFAULT UUID(),
    ho VARCHAR(100) NULL,
    ten VARCHAR(100) NOT NULL,
    sodienthoai VARCHAR(10) NULL,
    gmail VARCHAR(255) NOT NULL,
    diachi VARCHAR(255) NOT NULL,
    ngaysinh DATE,
    giowtinh ENUM('male', 'female', 'other'),
    id_taikhoan VARCHAR(36) NOT NULL,
    FOREIGN KEY (id_taikhoan) REFERENCES TAIKHOAN(id)
);

CREATE TABLE BINHLUAN (
    id VARCHAR(36) PRIMARY KEY DEFAULT UUID(),
    id_taikhoan VARCHAR(36) NOT NULL,
    binhluan VARCHAR(255) NOT NULL,
    id_sanpham VARCHAR(36) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_taikhoan) REFERENCES TAIKHOAN(id),
    FOREIGN KEY (id_sanpham) REFERENCES SANPHAM(id)
);

CREATE TABLE LOAISANPHAM (
    id VARCHAR(36) PRIMARY KEY DEFAULT UUID(),
    tenloaisanpham VARCHAR(255) NOT NULL
);

INSERT INTO LOAISANPHAM(tenloaisanpham) VALUES ('Chảo'), ('Nồi'), ('Thìa'), ('Đũa'), ('Đĩa');

CREATE TABLE SANPHAM(
    id VARCHAR(36) PRIMARY KEY DEFAULT UUID(),
    anhsanpham VARCHAR(255) NOT NULL,
    tensanpham VARCHAR(255) NOT NULL,
    motasanpham VARCHAR(255) NOT NULL,
    soluong INT NOT NULL,
    giaban INT NOT NULL,
    id_loaisanpham VARCHAR(36) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    FOREIGN KEY (id_loaisanpham) REFERENCES LOAISANPHAM(id)
);

CREATE TABLE GIOHANG (
    id VARCHAR(36) PRIMARY KEY DEFAULT UUID(),
    id_taikhoan VARCHAR(36) NOT NULL,
    FOREIGN KEY (id_taikhoan) REFERENCES TAIKHOAN(id)
);

CREATE TABLE GIOHANG_SANPHAM (
    id VARCHAR(36) PRIMARY KEY DEFAULT UUID(),
    id_sanpham VARCHAR(36) NOT NULL,
    id_giohang VARCHAR(36) NOT NULL,
    tensanpham VARCHAR(255) NOT NULL,
    soluong INT NOT NULL,
    FOREIGN KEY (id_sanpham) REFERENCES SANPHAM(id),
    FOREIGN KEY (id_giohang) REFERENCES GIOHANG(id)
);

CREATE TABLE DONHANG (
    id VARCHAR(36) PRIMARY KEY DEFAULT UUID(),
    id_taikhoan VARCHAR(36) NULL,
    id_donvivanchuyen VARCHAR(36) NULL,
    tennguoinhan VARCHAR(255) NOT NULL,
    sodienthoai VARCHAR(255) NOT NULL,
    diachi VARCHAR(255) NOT NULL,
    soluong INT NOT NULL,
    ngaydathang DATE,
    thoigiandukien DATETIME NULL,
    thanhtien DECIMAL(10, 2) NOT NULL,
    trangthai ENUM('1', '0', '-1'), -- 1: đã trả, 0: đang chờ, -1: đã hủy
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_donvivanchuyen) REFERENCES DONVIVANCHUYEN(id),
    FOREIGN KEY (id_taikhoan) REFERENCES TAIKHOAN(id)
);

CREATE TABLE DONHANG_SANPHAM (
    id VARCHAR(36) PRIMARY KEY DEFAULT UUID(),
    id_donhang VARCHAR(36) NOT NULL,
    id_sanpham VARCHAR(36) NOT NULL,
    soluong INT NOT NULL,
    giaban  INT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_sanpham) REFERENCES SANPHAM(id),
    FOREIGN KEY (id_donhang) REFERENCES DONHANG(id)
);

CREATE TABLE LICHSUGIAODICH (
    id VARCHAR(36) PRIMARY KEY DEFAULT UUID(),
    id_taikhoan VARCHAR(36) NOT NULL,
    id_donhang VARCHAR(36) NOT NULL,
    FOREIGN KEY (id_donhang) REFERENCES DONHANG(id),
    FOREIGN KEY (id_taikhoan) REFERENCES TAIKHOAN(id)
);

CREATE TABLE DONVIVANCHUYEN(
	id VARCHAR(36) PRIMARY KEY DEFAULT UUID(),
	tendonvivanchuyen VARCHAR(255) NOT NULL
);

INSERT INTO DONVIVANCHUYEN(tendonvivanchuyen) VALUES ('DVVC1'), ('DVVC2'), ('DVVC3');


DELIMITER //
CREATE TRIGGER Add_New_Account AFTER INSERT ON TAIKHOAN
FOR EACH ROW
BEGIN
    INSERT INTO GIOHANG(id_taikhoan) VALUES (NEW.id);
END; //
DELIMITER;



DELIMITER //
CREATE TRIGGER Add_New_Account AFTER INSERT ON TAIKHOAN
FOR EACH ROW
BEGIN
    INSERT INTO GIOHANG(id_taikhoan) VALUES (NEW.id);
END; //
DELIMITER ;

-- CREATE TRIGGER Add_Product_Cart 
-- AFTER UPDATE, INSERT
-- ON GIOHANG 
-- FOR EACH ROW
-- BEGIN
-- 	 UPDATE GIOHANG
--    SET NEW.thanhtien = (SELECT giaban FROM SANPHAM WHERE id = NEW.id_sanpham) * NEW.soluong
--    WHERE id = NEW.id;
-- END;



-- CREATE TRIGGER Add_Order
-- AFTER UPDATE, INSERT
-- ON DONHANG 
-- FOR EACH ROW
-- BEGIN
-- 	 UPDATE SANPHAM
--    SET SANPHAM.soluong = SANPHAM.soluong - NEW.soluong
--    WHERE id = NEW.id_sanpham;
-- END;


-- CREATE TRIGGER Delete_Order
-- AFTER DELETE
-- ON DONHANG 
-- FOR EACH ROW
-- BEGIN
-- 	 UPDATE SANPHAM
--    SET SANPHAM.soluong = SANPHAM.soluong + OLD.soluong
--    WHERE id = OLD.id_sanpham;
-- END;


-- CREATE TRIGGER Check_Name_Product
-- BEFORE INSERT
-- ON SANPHAM
-- FOR EACH ROW
-- BEGIN
-- 	DECLARE product_name_exists INT DEFAULT 0;
-- 	SELECT COUNT(*) AS product_name_exists
-- 	FROM SANPHAM
-- 	INNER JOIN LOAISANPHAM
-- 	ON NEW.id_loaisanpham = LOAISANPHAM.id
-- 	WHERE NEW.tensanpham IN (SELECT tensanpham FROM SANPHAM WHERE SANPHAM.id_loaisanpham = NEW.id_loaisanpham)
-- 	IF product_name_exists > 0 THEN
--     SIGNAL SQLSTATE '45000'
--     SET MESSAGE_TEXT = 'Tên sản phẩm đã tồn tại trong cùng một mã sản phẩm.';
--   END IF
-- END





CREATE TABLE CITY (
     id VARCHAR(36) PRIMARY KEY DEFAULT UUID(),
     name VARCHAR(255) NOT NULL,
),

INSERT INTO CITY(name) VALUES("Hà Nội"),
CREATE TABLE  DISTRICT (
    id VARCHAR(36) PRIMARY KEY DEFAULT UUID(),
    idCity VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    FOREIGN KEY (idCity) REFERENCES CITY(id)
),

INSERT INTO DISTRICT(idCity, name) VALUES ("fcd7f36a-352e-11ef-8d8b-acde48001122", "Cầu Giấy"), ("fcd7f36a-352e-11ef-8d8b-acde48001122", "Đống Đa"), ("fcd7f36a-352e-11ef-8d8b-acde48001122", "Bắc Từ Liêm")

CREATE TABLE WARD (
    id VARCHAR(36) PRIMARY KEY DEFAULT UUID(),
    idDistrict VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    FOREIGN KEY (idDistrict) REFERENCES DISTRICT(id)
)

INSERT INTO WARD(idDistrict, name) VALUES ("17bbb3ce-352f-11ef-8d8b-acde48001122", "Dịch Vọng Hậu"), ("17bbb3ce-352f-11ef-8d8b-acde48001122", "Dịch Vọng"), ("17bbb3ce-352f-11ef-8d8b-acde48001122", "Quan Hoa"), ("17bbb3ce-352f-11ef-8d8b-acde48001122", "Nghĩa Đô"),
                        ("17bbd30e-352f-11ef-8d8b-acde48001122", "Ngã Tư Sở"), ("17bbd30e-352f-11ef-8d8b-acde48001122", "Ô Chợ Dừa"), ("17bbd30e-352f-11ef-8d8b-acde48001122", "Khương Thượng"), ("17bbd30e-352f-11ef-8d8b-acde48001122", "Láng Thượng"),
                        ("17bbd3ae-352f-11ef-8d8b-acde48001122", "Đông Ngạc"), ("17bbd3ae-352f-11ef-8d8b-acde48001122", "Xuân Đỉnh"), ("17bbd3ae-352f-11ef-8d8b-acde48001122", "Xuân Tảo"), ("17bbd3ae-352f-11ef-8d8b-acde48001122", "Phúc Diễn")







