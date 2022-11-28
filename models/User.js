import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    fullname: {
        type: String,
        required: true,
        trim: true,
        maxLength: 25
    },
    username: {
        type: String,
        required: true,
        trim: true,
        maxLength: 25,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "https://iconape.com/wp-content/files/jh/12297/png/user-circle.png"
    },
    role: {type: String, default: "user"},
    gender: {type: String, default: "male"},
    mobile: {type: String, default: ""},
    address: {type: String, default: ""},
    story: {
        type: String,
        default: "",
        maxLength: 200
    },
    website: {type: String, default: ""},
    followers: [{type: mongoose.Schema.Types.ObjectId, ref: "user"}],
    following: [{type: mongoose.Schema.Types.ObjectId, ref: "user"}],
    saved: [{type: mongoose.Schema.Types.ObjectId, ref: "user"}],

},{
    timestamps: true
})

export default mongoose.model("user",userSchema)