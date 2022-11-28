import Message from "../models/messageModule.js"
import Conversation from "../models/conversationModule.js"

const messageCtrl = {
    createMessage: async (req, res) => {
        try {
            const {recipient, text, media} = req.body


            if (!recipient || (!text.trim() && media.length === 0)) return;

            const newConversation = await Conversation.findOneAndUpdate({
                $or: [
                    {recipients: [req.user._id, recipient]},
                    {recipients: [req.user._id, req.user._id]},
                ]
            }, {
                recipients: [req.user._id, recipient],
                text, media
            }, {new: true, upsert: true})

            const newMessage = new Message({
                conversation: newConversation._id,
                sender: req.user._id,
                recipient, text, media
            })


            await newMessage.save()

            res.json({msg: "Create success!", newMessage})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    getMessages: async (req, res) => {
        const {limit, page} = req.query


        let pageX = page * 1 || 1
        let limitX = limit * 1 || 6
        const skip = (pageX - 1) * limitX



        try {

            const messages = await Message.find({
                $or: [
                    {sender: req.user._id, recipient: req.params.id},
                    {sender: req.params.id, recipient: req.user._id}
                ]
            })
                .sort("-createdAt")
                .skip(skip).limit(6)
                .populate("recipient")
                .exec()

            res.json({
                messages,
                result: messages.length
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getConversations: async (req, res) => {
        const {limit, page} = req.query

        let pageX = page * 1 || 1
        let limitX = limit * 1 || 3
        const skip = (pageX - 1) * limitX

        try {

            const conversation = await Conversation.find({
                recipients: req.user._id
            })
                .sort("-createdAt")
                .skip(skip).limit(3)
                .populate("recipients", "avatar username fullname")
                .exec()

            res.json({
                conversation,
                result: conversation.length
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteMessage: async (req, res) => {
        try {
            await Message.findOneAndDelete({
                _id: req.params.id,
                sender: req.user._id
            })
            res.json({msg: "Delete Success!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteConversation: async (req, res) => {
        try {
            const newConv = await Conversation.findOneAndDelete({
                $or: [
                    {recipients: [req.user._id, req.params.id]},
                    {recipients: [req.params.id, req.user._id]}
                ]
            })
            await Message.deleteMany({conversation: newConv._id})
            res.json({msg: "Delete Success!"})

        } catch (err) {

        }
    }
}

export default messageCtrl