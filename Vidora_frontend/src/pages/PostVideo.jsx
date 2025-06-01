import React, { useState } from "react";
import axios from "axios"
import {useNavigate} from "react-router-dom"
import { CheckCircle } from "lucide-react";


const PostVideo = () => {
    const [loading, setLoading] = useState(false)
    const [uploaded, setUploaded] = useState(false)
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        thumbnail: null,
        video: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading || uploaded) return;

        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("thumbnail", formData.thumbnail);
        data.append("videoFile", formData.video); 

        setLoading(true);

        try {
            const response = await axios.post(
                "/api/v1/videos/",
                data,
                {
                    withCredentials: true,
                    headers: {
                        // Let axios set Content-Type for FormData automatically
                    }
                }
            );
            setUploaded(true);
            console.log("Upload successful:", response.data);
        } catch (error) {
            console.error(error.response?.data || error.message, "video upload failed");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen dark:bg-gray-950 bg-gray-50 dark:text-white text-black px-4 py-8 pt-5">
            <div className="max-w-2xl mx-auto dark:bg-gray-900 bg-gray-200 p-6 rounded-xl shadow-lg border border-blue-700">
                <h2 className="text-2xl font-semibold mb-6 dark:text-blue-400 text-blue-700">Post a New Video</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block mb-1 font-medium dark:text-white text-black">
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 rounded-lg placeholder:text-gray-500 bg-gray-300 dark:bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-blue-600 outline-none"
                            placeholder="Enter video title"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block mb-1 font-medium dark:text-white text-black">
                            Description
                        </label>
                        <textarea
                            name="description"
                            id="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={4}
                            className="w-full px-4 py-2 rounded-lg placeholder:text-gray-500 bg-gray-300 dark:bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-blue-600 outline-none resize-none"
                            placeholder="Describe your video..."
                        />
                    </div>

                    {/* Thumbnail Upload */}
                    <div>
                        <label htmlFor="thumbnail" className="block mb-1 font-medium dark:text-white text-black">
                            Thumbnail Image
                        </label>
                        <input
                            type="file"
                            name="thumbnail"
                            id="thumbnail"
                            accept="image/*"
                            onChange={handleChange}
                            required
                            className="w-full text-sm dark:text-gray-400 text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-700 file:text-white hover:file:bg-blue-800"
                        />
                    </div>

                    {/* Video Upload */}
                    <div>
                        <label htmlFor="video" className="block mb-1 font-medium dark:text-white text-black">
                            Video File
                        </label>
                        <input
                            type="file"
                            name="video"
                            id="video"
                            accept="video/*"
                            onChange={handleChange}
                            required
                            className="w-full text-sm dark:text-gray-400 text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-700 file:text-white hover:file:bg-blue-800"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex flex-col gap-y-1">
                        {!uploaded? <button
                            type="submit"
                            className="w-full py-3 bg-blue-600 hover:bg-blue-800 text-white font-semibold rounded-lg transition duration-200"
                        >
                            {loading? "Uploading..." : "Upload Video"}
                        </button>
                        : <p className="text-md text-green-500"><CheckCircle className="w-5 h-5 text-green-500 inline" /> Video uploaded successfully 
                        </p>
                        }               
                        {uploaded && <button
                            type="button"
                            onClick={
                                ()=>{
                                    navigate("/")
                                }
                            }
                            className="w-full py-3 bg-blue-600 hover:bg-blue-800 text-white font-semibold rounded-lg transition duration-200"
                        >
                            Back to Home
                        </button>
                        }
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostVideo;
