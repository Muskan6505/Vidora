import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import { Video } from "../models/video.model.js"
import {User} from "../models/user.model.js"
import { Comment } from "../models/comment.model.js"
import { Tweet } from "../models/tweet.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id")
    }

    const userId = req.user._id
    const user = await User.findById(userId)

    if(!user){
        throw new ApiError(404, " User not found")
    }

    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404, "Video not found")
    }

    const like = await Like.findOne({video: videoId, likedBy: userId})

    if(like){
        await like.deleteOne({video: videoId, likedBy: userId})
    }
    else{
        const newLike = await Like.create({
            video: videoId,
            likedBy: userId
        })
        await newLike.save()
    }

    const updatedVideo = await Video.findByIdAndUpdate
    (
        videoId,
        {
            $inc: {likes: like ? -1 : 1}
        },
        {new: true}
    ).select("videoId title description likes")

    if(!updatedVideo){
        throw new ApiError(404, "Video not found")
    }

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                isLiked:like? false: true,
                updatedVideo
            },
            "Toggled video like successfully"
        )
    )
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment

    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid Comment Id")
    }

    const userId = req.user._id

    const user = await User.findById(userId)
    if(!user){
        throw new ApiError(404, "User not found")
    }

    const comment = await Like.findOne({comment: commentId, likedBy: userId})

    if(!comment){
        const newComment = await Like.create({
            comment: commentId,
            likedBy: userId
        })

        if(!newComment){
            throw new ApiError(400, "Comment could not be liked")
        }
    }else{
        await Like.deleteOne({
            comment: commentId,
            likedBy: userId
        })
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $inc: {likes: comment ? -1 : 1}
        },
        {new: true}
    )

    if(!updatedComment){
        throw new ApiError(404, "comment not found")
    }

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                isLiked: comment ? false : true,
                updatedComment,
            },
            "Toggled comment like successfully"
        )
    )
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweet Id")
    }

    const userId = req.user._id

    const user = await User.findById(userId)
    if(!user){
        throw new ApiError(404, "User not found")
    }

    const tweet = await Like.findOne({tweet: tweetId, likedBy: userId})

    if(!tweet){
        const newTweet = await Like.create({
            tweet: tweetId,
            likedBy: userId
        })

        if(!newTweet){
            throw new ApiError(400, "Tweet could not be liked")
        }
    }else{
        await Like.deleteOne({
            tweet: tweetId,
            likedBy: userId
        })
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $inc: {likes: tweet ? -1 : 1}
        },
        {new: true}
    )

    if(!updatedTweet){
        throw new ApiError(404, "tweet not found")
    }

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                isLiked: tweet ? false : true,
                updatedTweet,
            },
            "Toggled tweet like successfully"
        )
    )
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user id");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const likedVideos = await Like.find({
        likedBy: userId,
        video: { $ne: null }
    })
    .populate({
        path: "video",
        populate: {
            path: "owner", 
            select: "username email avatar" 
        }
    });

    if (!likedVideos) {
        throw new ApiError(404, "No liked videos found");
    }

    res.status(200).json(
        new ApiResponse(200, likedVideos, "Fetched liked Videos successfully")
    );
});


export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}