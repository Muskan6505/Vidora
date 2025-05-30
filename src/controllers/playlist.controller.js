import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {User} from "../models/user.model.js"
import {Video} from "../models/video.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist

    const userId = req.user._id
    if(!isValidObjectId(userId)){
        throw new ApiError(400, "User not found")
    }

    name.trim();
    description.trim()

    if(!(name || description)){
        throw new ApiError(404, "name and description are required")
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: userId
    })
    
    if(!playlist){
        throw new ApiError(400, "playlist creation failed")
    }

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            playlist,
            "Playlist created successfully"
        )
    )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists

    if(!isValidObjectId(userId)){
        throw new ApiError(404, "Enter valid user Id")
    }

    const user = await User.findById(userId);
    if(!user){
        throw new ApiError(404, "User not found")
    }

    const playlists = await Playlist.find({owner: userId})

    if(!playlists){
        throw new ApiError(400, "Playlist does not exist")
    }

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            playlists,
            "User playlists fetched successfully"
        )
    )
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(404, "Enter valid playlist Id");
    }

    const playlist = await Playlist.findById(playlistId);
    
    if (!playlist) {
        throw new ApiError(400, "Playlist not found!");
    }

    const populatedPlaylist = await playlist.populate("videos");

    res.status(200).json(
        new ApiResponse(
            200,
            populatedPlaylist,
            "Fetched playlist successfully"
        )
    );
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if(!isValidObjectId(playlistId)){
        throw new ApiError(404, "Enter valid playlistId")
    }

    if(!isValidObjectId(videoId)){
        throw new ApiError(404, "Enter valid videoId")
    }

    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404, "Playlist not found")
    }
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404, "Video not found")
    }

    const videoExists = playlist.videos.includes(videoId)
    if(videoExists){
        throw new ApiError(400, "Video already exists in playlist")
    }
    playlist.videos.push(videoId)
    await playlist.save()

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            null,
            "Video added to playlist successfully"
        )
    )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

    if(!isValidObjectId(playlistId)){
        throw new ApiError(404, "Enter valid playlistId")
    }

    if(!isValidObjectId(videoId)){
        throw new ApiError(404, "Enter valid videoId")
    }

    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404, "Playlist not found")
    }
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404, "Video not found")
    }
    const videoIndex = playlist.videos.indexOf(videoId)
    if(videoIndex === -1){
        throw new ApiError(404, "Video not found in playlist")
    }

    playlist.videos.splice(videoIndex, 1)
    await playlist.save()

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            null,
            "Video removed from playlist successfully"
        )
    )
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist

    if(!isValidObjectId(playlistId)){
        throw new ApiError(404, "Enter valid playlistId")
    }

    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId)

    if(!deletedPlaylist){
        throw new ApiError(400, "playlist deletion failed")
    }

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            null,
            "playlist deleted successfully"
        )
    )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    if(!isValidObjectId(playlistId)){
        throw new ApiError(404, "Enter valid playlistId")
    }

    if(!(name || description)){
        throw new ApiError(400, "name and description required")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            name,
            description
        },
        {new: true}
    )

    if(!updatedPlaylist){
        throw new ApiError(400, "playlist not found")
    }

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            updatedPlaylist,
            "playlist updated successfully"
        )
    )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}