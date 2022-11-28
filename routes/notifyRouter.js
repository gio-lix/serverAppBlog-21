import express from "express";
import {auth} from "../middleware/auth.js";
import notifyCtrl from "../controllers/notifyCltr.js"

const router = express.Router()

router.get("/notifies", auth, notifyCtrl.getNotifies)

router.post("/notify", auth, notifyCtrl.createNotify)

router.delete("/notify/:id", auth, notifyCtrl.removeNotify)

router.put("/isReadyNotify/:id", auth, notifyCtrl.isReady)

router.delete("/deleteAllNotify", auth, notifyCtrl.deleteAllNotifies)



export default router