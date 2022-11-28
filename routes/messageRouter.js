import express from "express";
import {auth} from "../middleware/auth.js";
import messageCtrl from "../controllers/messageCtrl.js";

const router = express.Router()

router.post('/message', auth, messageCtrl.createMessage)

router.get('/conversation', auth, messageCtrl.getConversations)

router.get('/messages/:id', auth, messageCtrl.getMessages)

router.delete('/messages/:id', auth, messageCtrl.deleteMessage)

router.delete('/conversation/:id', auth, messageCtrl.deleteConversation)

export default router