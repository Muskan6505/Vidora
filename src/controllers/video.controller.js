import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {deleteFromCloudinary, uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination

    const matchStage = {};

    if (query) {
        matchStage
        .$or = [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } }
        ];
    }

    if (userId) {

        if(!isValidObjectId(userId)) {
            throw new ApiError(400, "Invalid user id")
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        matchStage.owner = userId;
    }

    // Step 2: Build the sort stage
    const sortField = sortBy || "createdAt";
    const sortOrder = sortType === "asc" ? 1 : -1;
    const sortStage = { [sortField]: sortOrder };

    // Step 3: Build the aggregation pipeline
    const aggregationPipeline = [
        { 
            $match: matchStage 
        },
        {
            $lookup: {
                from: "users", // make sure this matches your actual User collection name
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails"
            }
        },
        { $unwind: "$ownerDetails" },
        { $sort: sortStage },
        {
            $project: {
                videoFile: 1,
                thumbnail: 1,
                title: 1,
                description: 1,
                duration: 1,
                views: 1,
                isPublished: 1,
                createdAt: 1,
                updatedAt: 1,
                owner: {
                    _id: "$ownerDetails._id",
                    username: "$ownerDetails.username",
                    email: "$ownerDetails.email"
                }
            }
        }
    ];

    // Step 4: Use aggregatePaginate
    const options = {
        page: parseInt(page),
        limit: parseInt(limit)
    };

    const result = await Video.aggregatePaginate(Video.aggregate(aggregationPipeline), options);

    // Step 5: Send the response
    return res.status(200).json(
        new ApiResponse(200, result, "Videos fetched successfully")
    );
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video

    const user = req.user
    if(!user) {
        throw new ApiError(401, "Login to publish a video")
    }
    if(!title || !description) {
        throw new ApiError(400, "Title and description are required")
    }
    if(!req.files || !req.files.videoFile || !req.files.thumbnail) {
        throw new ApiError(400, "Video file and thumbnail are required")
    }
    const videoFileLocalPath = req.files.videoFile[0].path
    const thumbnailLocalPath = req.files.thumbnail[0].path


    try {
        var thumbnailPath = await uploadOnCloudinary(thumbnailLocalPath)
        var videoFilePath = await uploadOnCloudinary(videoFileLocalPath)
        // console.log("Video file uploaded to Cloudinary:", videoFilePath);
        // console.log("Thumbnail uploaded to Cloudinary:", thumbnailPath);
    } catch (error) {
        console.error("Cloudinary upload failed:", error.message);
        throw new ApiError(500, "Video upload failed");
        
    }

    const video = await Video.create({
        videoFile: videoFilePath.url,
        thumbnail: thumbnailPath.url,
        title: title,
        description,
        duration: videoFilePath.duration? videoFilePath.duration : 0,
        owner: user._id
    })

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            video,
            "Video published successfully"
        )
    )

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id

    if(!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }
    const video = await Video.findById(videoId)
    if(!video) {
        throw new ApiError(404, "Video not found")
    }

    if (!video.isPublished && video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to access this video");
    }

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            video,
            "Video fetched successfully"
        )
    )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

    const { title, description, isPublished } = req.body
    if(!title || !description) {
        throw new ApiError(400, "Title and description are required")
    }

    if(!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    const video = await Video.findById(videoId)
    if(!video) {
        throw new ApiError(404, "Video not found")
    }


    const user = req.user
    if(!user || user._id.toString() !== video.owner.toString()) {
        throw new ApiError(403, "You are not authorized to perform this action")
    }

    
    if(req.file && req.file.path) {
        const newThumbnailLocalPath = req.file.path
        const newthumbnailPath = await uploadOnCloudinary(newThumbnailLocalPath)
        const oldThumbnailPath = video.thumbnail
        await deleteFromCloudinary(oldThumbnailPath)
        video.thumbnail = newthumbnailPath.url
    }
    video.title = title
    video.description = description
    if(isPublished) video.isPublished = isPublished
    await video.save()

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            video,
            "video updated successfully."
        )
    )
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

    const user = req.user
    if(!user) {
        throw new ApiError(401, "You are not authorized to perform this action")
    }

    if(!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    } 

    const video = await Video.findById(videoId)
    if(!video) {
        throw new ApiError(404, "Video not found")
    }

    if(video.owner.toString() !== user._id.toString()) {
        throw new ApiError(403, "You are not authorized to perform this action")
    }
    try {
        await deleteFromCloudinary(video.videoFile);
        await deleteFromCloudinary(video.thumbnail);
    } catch (error) {
        console.warn("Cloudinary deletion failed:", error.message);
    }
    
    try 
    {
        await Video.deleteOne({_id: videoId});
    }catch (error) {
        console.error("Video deletion failed:", error.message);
        throw new ApiError(500, "Video deletion failed");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Video deleted successfully"
        )
    )
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }
    const video = await Video.findById(videoId)
    if(!video) {
        throw new ApiError(404, "Video not found")
    }
    
    const user = req.user;
    if(!user || user._id.toString() !== video.owner.toString()) {
        throw new ApiError(403, "You are not authorized to perform this action")
    }
    video.isPublished = !video.isPublished
    await video.save()
    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            video, 
            "Video publish status updated successfully"
        )
    )

})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}