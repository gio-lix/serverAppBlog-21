import mongoose from "mongoose";

const postModels = new mongoose.Schema({
    content: String,
    images: {
        type: Array,
        required: true
    },
    likes: [{type: mongoose.Types.ObjectId, ref: "user"}],
    comments: [{type: mongoose.Types.ObjectId, ref: "comment"}],
    user: {type: mongoose.Types.ObjectId, ref: 'user'}
}, {
    timestamps: true,
    strictPopulate: false
})


export default mongoose.model("Post", postModels)
