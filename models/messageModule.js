import mongoose from "mongoose";

const messageModule = new mongoose.Schema({
    conversation: {type: mongoose.Types.ObjectId, ref: "conversation"},
    sender: {type: mongoose.Types.ObjectId, ref: "user"},
    recipient: {type: mongoose.Types.ObjectId, ref: "user"},

    text: String,
    media: Array
}, {
    timestamps: true,
})

export default mongoose.model("message", messageModule)