import mongoose from "mongoose";

const conversationModule = new mongoose.Schema({

    recipients: [
        {
            type: mongoose.Types.ObjectId, ref: "user"
        }
    ],
    text: String,
    media: Array
}, {
    timestamps: true,
})

export default mongoose.model("conversation", conversationModule)