module.exports = function (router) {
    const commentController = require("../controllers/commentController");

    router.get("/comment/list", commentController.get_list);
    router.post("/comment/add", commentController.addComment);
    router.patch("/comment/update/:id", commentController.updateComment);
    router.delete("/comment/remove/:id", commentController.removeComment);
}