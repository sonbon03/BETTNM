module.exports = function (router) {

    const productController = require("../controllers/productController")
    const uploadThumbnailsCloud = require("../config/cloudinary.config")

    router.get('/product/list', productController.get_list);
    router.get('/product/type', productController.getTypeName);
    router.get('/product/detail/:id', productController.detail);
    router.post('/product/add', productController.addProduct);
    router.patch("/product/update/:id", productController.updateProduct);
    router.delete("/product/remove/:id", productController.removeProduct);

    // Pagination
    router.get("/product/paginate", productController.get_list_pagination);

    // UploadThumbnail
    router.post('/thumbnail/add', uploadThumbnailsCloud.single("files"), (req, res, next) => {
        if (!req.file) {
            next(new Error('No file uploaded!'));
            return;
        }

        res.json(req.file.path)

    });
}