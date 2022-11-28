import Post from "../models/postModels.js"
import Comment from "../models/commentModel.js"
import User from "../models/User.js"


const postCtrl = {
    createPost: async (req, res) => {
        try {
            const {content, images} = req.body

            if (images.length === 0) {
                return res.status(500).json({msg: "Please add your photo"})
            }

            const newPost = new Post({
                content, images, user: req.user._id
            })

            await newPost.save()
            res.json({
                msg: "Create posts",
                newPost: {
                    ...newPost._doc,
                    user: req.user
                }
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updatePost: async (req, res) => {
        try {
            const {content, images} = req.body
            const post = await Post.findOneAndUpdate({_id: req.params.id}, {
                content, images
            }).populate("user", "avatar username fullname")
                .populate({
                    path: "comments",
                    populate: {
                        path: "user likes",
                        select: "-password"
                    }
                }).exec()


            res.json({
                msg: "Update Post!",
                newPost: {
                    ...post._doc,
                    content, images
                }
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getPosts: async (req, res) => {
        try {
            const {limit, page} = req.query


            let pageX = page * 1 || 1
            let limitX = limit * 1 || 4
            const skip = (pageX - 1) * limitX


            const posts = await Post.find({
                user: [...req.user.following, req.user._id]
            })
                .sort("-createdAt")
                .skip(skip).limit(4)
                .populate("user", "avatar username fullname followers")
                .populate({
                    path: "comments",
                    populate: {
                        path: "user likes",
                        select: "-password"
                    }
                }).exec()

            res.json({
                msg: "Success!",
                result: posts.length,
                posts
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    likePost: async (req, res) => {
        try {
            const post = await Post.find({_id: req.params.id, likes: req.user._id})
            if (post.length > 0) return res.status(400).json({msg: "You liked this post."})

            const like = await Post.findOneAndUpdate({_id: req.params.id}, {
                $push: {likes: req.user._id}
            }, {new: true})

            if (!like) return res.status(400).json({msg: "This post does not exist."})

            res.json({msg: "Liked Post!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    unLikePost: async (req, res) => {
        try {
            const like = await Post.findOneAndUpdate({_id: req.params.id}, {
                $pull: {likes: req.user._id}
            }, {new: true})
            if (!like) return res.status(400).json({msg: "This post does not exist."})

            res.json({msg: "UnLiked Post!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getUserPost: async (req, res) => {
        try {

            const {limit, page} = req.query

            let pageX = page * 1 || 1
            let limitX = limit * 1 || 3
            const skip = (pageX - 1) * limitX


            const post = await Post.find({user: req.params.id})
                .sort("-createAt")
                .skip(skip).limit(3)
            res.json({
                post,
                result: post.length
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getPost: async (req, res) => {
        try {
            const post = await Post.findById(req.params.id)
                .populate("user", "avatar username fullname followers")
                .populate({
                    path: "comments",
                    populate: {
                        path: "user likes",
                        select: "-password"
                    }
                }).exec()
            if (!post) return res.status(400).json({msg: "This post does not exist."})

            res.json({post})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getPostsDiscover: async (req, res) => {
        try {
            const {limit, page} = req.query

            let pageX = page * 1 || 1
            let limitX = limit * 1 || 3
            const skip = (pageX - 1) * limitX


            const posts = await Post.find({
                user: {$nin: [...req.user.following, req.user._id]}
            })
                .sort("-createdAt")
                .skip(skip).limit(3)
                .populate("user likes", "avatar username fullname")
                .populate({
                    path: "comments",
                    populate: {
                        path: "user likes",
                        select: "-password"
                    }
                }).exec()


            res.json({
                msg: "Success!",
                result: posts.length,
                posts
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    deletePost: async (req, res) => {
        try {
            const post = await Post.findOneAndDelete({_id: req.params.id, user: req.user._id})

            await Comment.deleteMany({_id: {$in: post.comments}})
            res.json({
                msg: "Delete Posts!",
                post: {
                    ...post._doc,
                    user: req.user
                }
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    savedPost: async (req, res) => {
        try {
            const user = await User.find({_id: req.user._id, saved: req.params.id})
            if (user.length > 0) return res.status(400).json({msg: "You saved this post."})

            const save = await User.findOneAndUpdate({_id: req.user._id}, {
                $push: {saved: req.params.id}
            }, {new: true})

            if (!save) return res.status(400).json({msg: "This post does not exist."})

            res.json({msg: "Saved Post!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    removeSavedPost: async (req, res) => {
        try {
            const save = await User.findOneAndUpdate({_id: req.user._id}, {
                $pull: {saved: req.params.id}
            }, {new: true})

            if (!save) return res.status(400).json({msg: "This post does not exist."})

            res.json({msg: "unSaved Post!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },


    getSavedPost: async (req, res) => {
        try {
            const {limit, page} = req.query

            let pageX = page * 1 || 1
            let limitX = limit * 1 || 3
            const skip = (pageX - 1) * limitX


            const savedPosts = await Post.find({
                _id: {$in: req.user.saved}
            })
                .sort("-createdAt")
                .skip(skip).limit(3)


            res.json({
                result: savedPosts.length,
                savedPosts
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

export default postCtrl