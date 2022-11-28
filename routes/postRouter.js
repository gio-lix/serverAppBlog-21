import express from "express";
import postCtrl from "../controllers/postCtrl.js";
import {auth} from "../middleware/auth.js";

const router = express.Router()

router.post("/posts", auth, postCtrl.createPost)

router.get("/posts", auth, postCtrl.getPosts)
router.get("/post_discover", auth, postCtrl.getPostsDiscover)
// get user posts
router.get("/user_post/:id", auth, postCtrl.getUserPost)
router.get("/post/:id", auth, postCtrl.getPost)

router.get("/getSavedPost", auth, postCtrl.getSavedPost)



router.put("/savePost/:id", auth, postCtrl.savedPost)
router.put("/unSavePost/:id", auth, postCtrl.removeSavedPost)

router.put("/posts/:id/like", auth, postCtrl.likePost)
router.put("/posts/:id/unlike", auth, postCtrl.unLikePost)
router.put("/posts/:id", auth, postCtrl.updatePost)
router.put("/posts/:id", auth, postCtrl.updatePost)

router.delete("/post/:id", auth, postCtrl.deletePost)





export default router