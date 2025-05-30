import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Video} from "../models/video.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { createdAt: -1 }
    };

    const pipeline = [
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $unwind: "$owner"
        },
        {
            $project: {
                _id: 1,
                content: 1,
                createdAt: 1,
                updatedAt: 1,
                owner: {
                    _id: "$owner._id",
                    fullname: "$owner.fullname",
                    email: "$owner.email",
                    username: "$owner.username"
                }
            }
        }
    ];

    const comments = await Comment.aggregatePaginate(Comment.aggregate(pipeline), options);

    if (!comments) {
        throw new ApiError(500, "Comments not found");
    }

    res.status(200).json(
        new ApiResponse(200, comments, "Comments found")
    );
});


const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video

    const {videoId} =  req.params
    const {text} = req.body
    if(!text){
        throw new ApiError(400, "Text is required")
    }

    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404, "Video not found")
    }

    const comment = await Comment.create({
        content: text,
        video: videoId,
        owner: req.user._id
    })

    if(!comment){
        throw new ApiError(500, "Comment not created")
    }

    const populatedComment = await comment.populate("owner", "fullname email")

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            populatedComment,
            "Comment added"
        )
    )
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params

    const {text} = req.body

    const comment = await Comment.findById(commentId)

    if(!comment){
        throw new ApiError(404, "Comment not found")
    }

    const user = req.user
    if(user._id.toString() !== comment.owner.toString()){
        throw new ApiError(404, "You are not the owner of this comment")
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {content: text},
        {new: true}
    )

    if(!updatedComment){
        throw new ApiError(500, "Comment not updated")
    }

    const populatedComment = await updatedComment.populate("owner", "fullname email")

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            populatedComment,
            "comment updated"
        )
    )
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params
    const comment = await Comment.findById(commentId)

    if(!comment){
        throw new ApiError(404, "Comment not found")
    }

    const user = req.user
    if(user._id.toString() !== comment.owner.toString()){
        throw new ApiError(404, "You can't delete this comment")
    }

    const deleteComment = await Comment.deleteOne({
        _id: commentId
    })

    if(!deleteComment){
        throw new ApiError(500, "Comment not deleted")
    }

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            null,
            "Comment deleted"
        )
    )
})



export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
}