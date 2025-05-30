import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription

    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid channel id")
    }
    
    const userId = req.user._id
    
    const subscription = await Subscription.findOne({subscriber: userId, channel: channelId})

    if(!subscription){
        const newSubscription = await Subscription.create({
            subscriber: userId,
            channel: channelId
        })

        if(!newSubscription){
            throw new ApiError(500, "Unable to subscribe to channel")
        }
    }
    else{
        const deleteSubscription = await Subscription.findOneAndDelete({subscriber: userId, channel: channelId})

        if(!deleteSubscription){
            throw new ApiError(500, "Unable to unsubscribe from channel")
        }
    }

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                subscription: subscription ? false : true,
            },
            "Subscription toggled successfully"
        )
    )
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid channel id")
    }

    const subscribers = await Subscription.find({channel: channelId})
    .populate("subscriber", "fullname avatar")
    .select("subscriber")

    if(!subscribers){
        throw new ApiError(404, "No subscribers found")
    }

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            subscribers,
            "channel Subscribers fetched successfully"
        )
    )
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if(!isValidObjectId(subscriberId)){
        throw new ApiError(400, "Invalid subscriber id")
    }

    const subscribedChannels = await Subscription.find({subscriber: subscriberId})
    .populate("channel", "fullname avatar username")
    .select("channel")

    if(!subscribedChannels){
        throw new ApiError(400, "No subscribed channels found")
    }

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            subscribedChannels,
            "Subscribed channels fetched successfully"
        )
    )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}