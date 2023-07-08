const requireUser = require("../middleware/requireUser");
const userController = require("../controllers/userController");
const router = require("express").Router();

router.post(
    "/follow",
    requireUser,
    userController.followOrUnfollowUserController
);

router.get(
    "/getPostsOfFollowings",
    requireUser,
    userController.getPostsOfFollowings
);

router.get("/myposts", requireUser, userController.getMyPostController);

router.get("/getUserPosts", requireUser, userController.getUserPostController);

router.delete(
    "/deleteMyProfile",
    requireUser,
    userController.deleteMyProfileController
);

router.get("/getMyInfo", requireUser, userController.getMyInfoController)

router.put("/", requireUser, userController.updateUserProfileController)
router.post("/getUserProfile", requireUser, userController.getUserProfileController)

module.exports = router;