const { success, error } = require("../utils/responseWrapper");
const User = require("../models/User");
const Post = require("../models/Post");
const cloudinary = require('cloudinary').v2;
// const { mapPostOutput } = require("../utils/Utils");

const followOrUnfollowUserController = async(req, res) => {
    try {
        const { userIdToFollow } = req.body;
        const curUserId = req._id;

        const userToFollow = await User.findById(userIdToFollow);
        const currentUser = await User.findById(curUserId);

        if (curUserId === userIdToFollow) {
            return res.send(error(409, "User cannot follow themselves"));
        }

        if (!userToFollow) {
            return res.send(error(404, "User to follow not found"));
        }

        if (currentUser.followings.includes(userIdToFollow)) {
            //Alerady followed
            const followingindex = currentUser.followings.indexOf(userIdToFollow);
            currentUser.followings.splice(followingindex, 1);

            const followerIndex = userToFollow.followers.indexOf(curUserId);
            userToFollow.followers.splice(followerIndex, 1);

            console.log("currentUser", currentUser);
            console.log("userToFollow", userToFollow);

            await userToFollow.save();
            await currentUser.save();
            return res.send(success(200, "User unfollowed"));
        } else {
            // if not followed
            userToFollow.followers.push(curUserId);
            currentUser.followings.push(userIdToFollow);
            await userToFollow.save();
            await currentUser.save();
            return res.send(success(200, "User followed"));
        }
    } catch (e) {
        console.log("error form followUserController", e);
        return res.send(error(500, e.message));
    }
};

const getPostsOfFollowings = async(req, res) => {
    try {
        const curUserId = req._id;

        const curUser = await User.findById(curUserId);
        const posts = await Post.find({
            owner: {
                $in: curUser.followings,
            },
        });
        return res.send(success(200, posts));
    } catch (e) {
        console.log("error in getPostsOfFollowings", e);
        return res.send(error(200, e.message));
    }
};

const getMyPostController = async(req, res) => {
    try {
        const curUserId = req._id;
        //   const curUser = await User.findById(userId);
        const allPost = await Post.find({
            owner: curUserId,
        }).populate("likes");
        if (!allPost) {
            return res.send(success(200, "There is no post yet"));
        }
        return res.send(success(200, allPost));
    } catch (e) {
        console.log("error in getMyPostController", e);
        return res.send(error(500, e.message));
    }
};

const getUserPostController = async(req, res) => {
    try {
        const userId = req.body.userId;
        if (!userId) {
            return res.send(error(400, "userId is required"));
        }
        const allUserPosts = await Post.find({
            owner: userId,
        }).populate("likes");

        return res.send(success(200, { allUserPosts }));
    } catch (e) {
        console.log("Error form getUserPostController", e);
        return res.send(error(500, e.message));
    }
};

const deleteMyProfileController = async(req, res) => {
    try {
        const curUserId = req._id;
        const curUser = await User.findById(curUserId);

        //delete all posts
        await Post.deleteMany({
            owner: curUserId,
        });

        //remove myself from followers following
        curUser.followers.forEach(async(followerId) => {
            const follower = await User.findById(followerId);
            const index = follower.followings.indexOf(curUserId);
            follower.followings.splice(index, 1);
            await follower.save();
        });

        //remove myself from my following's followers list
        curUser.followings.forEach(async(followingId) => {
            const following = await User.findById(followingId);
            const index = following.followers.indexOf(curUserId);
            following.followers.splice(index, 1);
            await following.save();
        });

        // remove myself from all likes
        const allPost = await Post.find();
        allPost.forEach(async(post) => {
            const index = post.likes.indexOf(curUserId);
            post.likes.splice(index, 1);
            await post.save();

            // delete user
            await curUser.deleteOne();

            res.clearCookie("jwt", {
                httpOnly: true,
                secure: true,
            });
            return res.send(success(200, "user deleted successfully"));
        });
    } catch (e) {
        console.log("Error in deletMyProfileController", e);
        return res.send(error(500, e.message));
    }
};

const getMyInfoController = async(req, res) => {
    try {
        const user = await User.findById(req._id);
        return res.send(success(200, { user }))

    } catch (e) {
        console.log("Error from getMyInfoController", e)
        return res.send(error(500, e.message))
    }
}

const updateUserProfileController = async(req, res) => {
    try {
        const { name, bio, userImg } = req.body;

        const user = await User.findById(req._id);
        if (name) {
            user.name = name;
        }
        if (bio) {
            user.bio = bio;
        }
        if (userImg) {
            const cloudImg = await cloudinary.uploader.upload(userImg, {
                folder: 'userProfileImg'
            })
            console.log("cloud", cloudImg);
            user.avatar = {
                url: cloudImg.secure_url,
                publicId: cloudImg.public_id
            }
        }
        await user.save();
        return res.send(success(200, { user }))

    } catch (e) {
        return res.send(error(500, e.message))
    }
}


const getUserProfileController = async(req, res) => {
    try {
        const userId = req.body.userId
        const user = await User.findById(userId).populate({
            path: 'posts',
            populate: {
                path: 'owner'
            }
        });

        const fullPosts = user.posts;
        const posts = fullPosts.map(item => mapPostOutput(item, req._id)).reverse();

        console.log("posts", posts)
        console.log("user", user)

        return res.send(success(200, {...user._doc, posts }))
    } catch (e) {
        console.log("error form get user profile", e)
        return res.send(error(500, e.message))
    }
}


const mapPostOutput = (post, userId) => {
    console.log("inside map PostOutput")
    return {
        _id: post._id,
        caption: post.caption,
        image: post.image,
        owner: {
            _id: post.owner._id,
            name: post.owner.name,
            avatar: post.owner.avatar
        },
        likesCount: post.likes.length,
        isLiked: post.likes.includes(userId)
    }
}

module.exports = {
    followOrUnfollowUserController,
    getPostsOfFollowings,
    getMyPostController,
    getUserPostController,
    deleteMyProfileController,
    getMyInfoController,
    updateUserProfileController,
    getUserProfileController
};