import Notify from "../models/notifyModel.js"

const notifyCtrl = {

    createNotify: async (req, res) => {
        try {
            if (req.body.msg.recipients.includes(req.user._id)) return


            const notify = new Notify({
                ...req.body.msg , user: req.user._id
            })

            await notify.save()

            return res.json({notify})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },


    removeNotify: async (req, res) => {
        console.log({id: req.params.id, url: req.query.url})
        try {
           const notify = await Notify.findOneAndDelete({
               id: req.params.id,
               url: req.query.url
           })
            return res.json({msg: "Delete notify",notify})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    getNotifies: async (req, res) => {
        try {
            const notifies = await Notify.find({recipients: req.user._id})
                .sort('-createdAt')
                .populate("user", "avatar username")
                .exec()


            return res.json({notifies})

        } catch (err) {
            return res.status(500).json({msg: err.message})

        }
    },
    isReady: async (req, res) => {
        try {
            const notifies = await Notify.findOneAndUpdate({_id: req.params.id}, {
                isRead: true
            })
            return res.json({notifies})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    deleteAllNotifies: async (req, res) => {
        try {
            const notifies = await Notify.deleteMany({recipients: req.user._id})
            return res.json({notifies})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

export default notifyCtrl