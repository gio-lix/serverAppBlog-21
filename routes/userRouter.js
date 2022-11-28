import express from "express";
import {auth} from "../middleware/auth.js";
import userCtrl from "../controllers/userCtrl.js";
const router = express.Router()

router.get("/search", auth, userCtrl.searchUser)
router.get("/user/:id", auth, userCtrl.getUser)
router.put("/user", auth, userCtrl.uploadUser)

router.get("/suggestionsUser", auth, userCtrl.suggestionsUser)

router.put("/user/:id/follow", auth, userCtrl.follow)
router.put("/user/:id/unfollow", auth, userCtrl.unfollow)


export default router