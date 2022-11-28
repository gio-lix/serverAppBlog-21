import express from "express";
import {auth} from "../middleware/auth.js";
import commentsCtrl from "../controllers/commentsCtrl.js";

const router = express.Router()

router.post("/comment", auth, commentsCtrl.createComment)

router.put("/comment/:id", auth, commentsCtrl.updateComment)

router.put("/comment/:id/like", auth, commentsCtrl.likeComment)
router.put("/comment/:id/unlike", auth, commentsCtrl.unLikeComment)

router.delete("/comment/:id", auth, commentsCtrl.deleteComment)

export default router