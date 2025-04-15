import { Router } from "express";
import {loginUser, logoutUser, registerUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateUserAvatar, updateUserCoverImage, updateAccountDetails, removeUserCoverImage } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name:"coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)

// secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").patch(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account-details").patch(verifyJWT, updateAccountDetails)
router.route("/update-avatar").patch(
    upload.fields([{name: "avatar", maxCount:1}]),
    verifyJWT,
    updateUserAvatar
)
router.route("/update-coverimage").patch(
    upload.fields([{name: "coverImage", maxCount:1}]),
    verifyJWT,
    updateUserCoverImage
)

router.route("/remove-coverimage").patch(
    verifyJWT,
    removeUserCoverImage
)

export default router