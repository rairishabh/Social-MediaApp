const Post = require("../models/Post");
const User = require("../models/User");
const { error, success } = require("../utils/responseWrapper");
const cloudinary = require('cloudinary').v2;

const createPostController = async(req, res) => {
    try {
        const { caption, postImg } = req.body;
        const owner = req._id;

        if (!caption || !postImg) {
            res.send(error(400, "caption is required and post Image is required"));
        }

        const cloudImg = await cloudinary.uploader.upload(postImg, {
            folder: 'postImg'
        })

        const user = await User.findById(req._id);

        const post = await Post.create({
            caption,
            owner,
            image: {
                publicId: cloudImg.public_id,
                url: cloudImg.url
            }
        });

        user.posts.push(post._id);
        user.save();
        post.save();
        return res.send(success(201, post));
    } catch (e) {
        console.log("Error in createPost>>", e);
        return res.send(error(500, e.message));
    }
};

const likeAndUnlikePost = async(req, res) => {
    try {
        const { postId } = req.body;
        const curUserId = req._id;
        console.log("postId", postId);
        console.log("req._id", req._id);

        const post = await Post.findById(postId);
        console.log("post", post);
        if (!post) {
            return res.send(error(404, "Post not found"));
        }

        if (post.likes.includes(curUserId)) {
            const index = post.likes.indexOf(curUserId);
            post.likes.splice(index, 1);
            console.log(post.likes);

            await post.save();
            return res.send(success(200, "Post Unliked"));
        } else {
            post.likes.push(curUserId);
            await post.save();
            return res.send(success(200, "Post Liked"));
        }
    } catch (e) {
        console.log("error in like and unlike");
        return res.send(error(500, e.message));
    }
};

const updatePostController = async(req, res) => {
    try {
        const { postId, caption } = req.body;
        const curUserId = req._id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.send(error(404, "Post not found"));
        }

        if (post.owner.toString() !== curUserId) {
            return res.send(error(403, "Only owners can update their post"));
        }

        if (caption) {
            post.caption = caption;
        }
        await post.save();
        return res.send(success(200, post));
    } catch (e) {
        console.log("Error from updatePostController", e);
        return res.send(error(500, e.message));
    }
};

const deletePostController = async(req, res) => {
    try {
        const { postId } = req.body;
        const curUserId = req._id;

        const post = await Post.findById(postId);
        console.log("Post", post);
        const curUser = await User.findById(curUserId);
        if (!post) {
            return res.send(error(404, "Post not found"));
        }

        if (post.owner.toString() !== curUserId) {
            return res.send(error(403, "Only owners can delete their post"));
        }

        const index = curUser.posts.indexOf(postId);
        console.log("index>>", index);
        curUser.posts.splice(index, 1);
        await curUser.save();
        await post.deleteOne();

        return res.send(success(200, "Post deleted successfully"));
    } catch (e) {
        console.log("Error in deletePostController", e);
        return res.send(error(500, e.message));
    }
};
module.exports = {
    createPostController,
    likeAndUnlikePost,
    updatePostController,
    deletePostController,
};