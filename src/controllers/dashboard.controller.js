import mongoose , {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

    const channelId = req.user._id

    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Enter valid channel id")
    }

    const channel = await User.aggregate([
        {
            $match: {
                _id: channelId,        
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "_id",
                foreignField: "owner",
                as: "videos"
            }
        },
        {
            $lookup:{
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }, // subscribers of the users
        },
        {
            $lookup:{
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            } // channels subscribed by the users
        },
        {
            $addFields: {
                totalViews: {
                    $sum: "$videos.views"
                },
                totalVideoLikes: {
                    $sum: "$videos.likes"
                },
                totalVideos: {
                    $size: "$videos"
                },
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullname: 1,
                username: 1,
                totalViews: 1,
                totalVideoLikes: 1,
                totalVideos: 1,
                subscribersCount: 1,
                channelSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1,
                createdAt: 1
            },
        }
    ])
    
    if(!channel?.length){
        throw new ApiError(404, "channel does not exist")
    }

    res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            channel,
            "Channel stats fetched successfully."
        )
    )
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel

    const channelId = req.user._id

    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Enter valid channel id")
    }

    const channelVideos = await Video.aggregate([
        {
            $match: {
                owner: channelId,
            },

        },
        {
            $project: 
            {
                title:1,
                description: 1,
                thumbnail: 1,
                duration: 1,
                views: 1,
                likes: 1,
                createdAt: 1,
                isPublished: 1,
            }
        }
    ])

    if(!channelVideos?.length){
        throw new ApiError(404, "No videos found for this channel")
    }

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            channelVideos,
            "Channel videos fetched successfully."
        )
    )
})

export {
    getChannelStats, 
    getChannelVideos
}