import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet

    const {content} = req.body
    const userId = req.user._id
    const user = await User.findById(userId)

    if(!user){
        throw new ApiError(404, "User not found")
    }

    if(!content){
        throw new ApiError(400, "Content is required")
    }

    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user id")
    }

    const tweet = await Tweet.create({
        content,
        owner: userId
    })

    if(!tweet){
        throw new ApiError(500, "Unable to create tweet")
    }

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            tweet,
            "Tweet created successfully"
        )
    )
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userId} = req.params
    const user= await User.findById(userId)

    if(!user){
        throw new ApiError(404, "User not found")
    }

    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user id")
    }

    const tweets = await Tweet.find({owner: userId}).populate("owner", "fullname email username avatar")
    if(!tweets){
        throw new ApiError(500, "Unable to get tweets")
    }

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            tweets,
            "Tweets fetched successfully"
        )
    )
})

const getTweets = asyncHandler(async(req, res) => {
    const tweets = await Tweet.find({})
        .populate("owner", "fullname email username avatar")
        .sort({createdAt: -1}) // Sort by creation date, most recent first  
    if(!tweets){
        throw new ApiError(500, "Unable to get tweets")
    }

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            tweets,
            "Tweets fetched successfully"
        )
    )
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId} = req.params
    const {content} = req.body

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweet id")
    }

    if(!content){
        throw new ApiError(400, "Content is required")
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {content},
        {new: true}
    ).populate("owner", "fullname email username avatar")

    if(!updatedTweet){
        throw new ApiError(404, "Tweet not found")
    }

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            updatedTweet,
            "Tweet updated Successfully"
        )
    )
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} = req.params

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweet id")
    }

    const deletedTweet = await Tweet.findByIdAndDelete(tweetId)

    if(!deletedTweet){
        throw new ApiError(404, "Tweet not found")
    }

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            null,
            "Tweet deleted successfully"
        )
    )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet,
    getTweets
}