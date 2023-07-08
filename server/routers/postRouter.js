const routers = require("express").Router();
const postController = require("../controllers/postController");
const requireUser = require("../middleware/requireUser");

routers.post("/", requireUser, postController.createPostController);
routers.post("/like", requireUser, postController.likeAndUnlikePost);
routers.put("/updatePost", requireUser, postController.updatePostController);
routers.delete("/deletePost", requireUser, postController.deletePostController);

module.exports = routers;
