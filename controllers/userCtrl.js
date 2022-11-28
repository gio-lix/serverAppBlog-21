import User from "../models/User.js"

const userCtrl = {
    searchUser: async (req, res) => {
        try {
            const users = await User.find({username: {$regex: req.query.username}})
                .limit(10)

            res.json({users})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    getUser: async (req, res) => {
        try {
            const user = await User.findById(req.params.id)
            if (!user) return res.status(400).json({msg: "User does not exist."})
            console.log("user-vuser-user",user)
            res.json({user})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    uploadUser: async (req, res) => {
        try {
            const {avatar, fullname, mobile, address, story, website, gender} = req.body
            if (!fullname) return res.status(400).json({msg: "Please add your full name."})

            const user = await User.findOneAndUpdate({_id: req.user._id}, {
                avatar, fullname, mobile, address, story, website, gender
            })


            res.json({msg: "Update Success!", user})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    follow: async (req, res) => {
        try {
            const user = await User.find({_id: req.params.id, followers: req.user._id})
            if (user.length > 0) return res.status(500).json({msg: "You followed this user."})

            const newUser = await User.findOneAndUpdate({_id: req.params.id}, {
                $push: {followers: req.user._id}
            }, {new: true})

            await User.findOneAndUpdate({_id: req.user._id}, {
                $push: {following: req.params.id}
            }, {new: true})

            res.json({msg: "Following User.", newUser})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    unfollow: async (req, res) => {
        try {

          const newUser = await User.findOneAndUpdate({_id: req.params.id}, {
                $pull: {followers: req.user._id}
            }, {new: true})

            await User.findOneAndUpdate({_id: req.user._id}, {
                $pull: {following: req.params.id}
            }, {new: true})

            res.json({msg: "UnFollowing User.", newUser})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    suggestionsUser: async (req, res) => {
        try {
            const newArr = [...req.user.following, req.user._id]
            const num = req.query.num || 10

            const users = await User.aggregate([
                {$match: {_id: {$nin: newArr}}},
                {$sample: {size: num}},
                {$lookup: {from: "users", localField: "followers", foreignField: "_id", as: 'followers'}},
                {$lookup: {from: "users", localField: "following", foreignField: "_id", as: 'following'}}
            ])


            return res.json({
                users
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

export default userCtrl