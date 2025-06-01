import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import TweetCard from "../components/TweetCard";

const Tweets = () => {
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const [tweets, setTweets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newTweet, setNewTweet] = useState("");
    const [currentEditingId, setCurrentEditingId] = useState(null);
    const [showMyTweetsOnly, setShowMyTweetsOnly] = useState(false);

    const userId = user?.data?.user?._id
    const fetchTweets = async () => {
        setLoading(true);
        try {
            const url = showMyTweetsOnly
                ? `/api/v1/tweets/user/${userId}`
                : "/api/v1/tweets/";

            const res = await axios.get(url, {
                withCredentials: true,
            });

            setTweets(res.data.data);
        } catch (err) {
            console.error("Error fetching tweets", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTweets();
    }, [showMyTweetsOnly]);

    const handlePostTweet = async () => {
        if (!newTweet.trim()) return;
        try {
            if (currentEditingId) {
                const res = await axios.patch(
                    `/api/v1/tweets/${currentEditingId}`,
                    { content: newTweet },
                    { withCredentials: true }
                );
                const updatedTweet = res.data.data;
                setTweets((prev) =>
                    prev.map((tweet) =>
                        tweet._id === currentEditingId ? updatedTweet : tweet
                    )
                );
                setCurrentEditingId(null);
            } else {
                const res = await axios.post(
                    "/api/v1/tweets",
                    { content: newTweet },
                    { withCredentials: true }
                );
                const createdTweet = res.data.data;
                setTweets((prev) => [createdTweet, ...prev]);
            }
            setNewTweet("");
        } catch (err) {
            console.error("Tweet post/update failed", err);
        }
    };

    const handleDeleteTweet = async (tweetId) => {
        try {
            await axios.delete(`/api/v1/tweets/${tweetId}`, {
                withCredentials: true,
            });
            setTweets((prev) => prev.filter((tweet) => tweet._id !== tweetId));
        } catch (err) {
            console.error("Failed to delete tweet", err);
        }
    };

    const handleUpdateTweet = (tweetId, content) => {
        setCurrentEditingId(tweetId);
        setNewTweet(content);
    };


    return (
        <div className="min-h-screen dark:bg-gray-950 bg-gray-50   px-4 py-6">
            <div className="max-w-4xl mx-auto">
                <div className="dark:bg-gray-900 bg-gray-200 rounded-xl p-6 shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4 dark:text-blue-400 text-blue-900">Tweets</h2>

                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => setShowMyTweetsOnly((prev) => !prev)}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg"
                        >
                            {showMyTweetsOnly ? "Show All Tweets" : "Show My Tweets"}
                        </button>
                    </div>

                    <div className="mb-6">
                        <textarea
                            value={newTweet}
                            onChange={(e) => setNewTweet(e.target.value)}
                            placeholder="What's on your mind?"
                            className="w-full px-3 py-2 rounded-lg dark:bg-gray-800 border bg-gray-50 border-gray-700 dark:text-white text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            rows="3"
                        />
                        <div className="mt-2">
                            <button
                                onClick={handlePostTweet}
                                className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg text-white text-sm"
                            >
                                {currentEditingId ? "Update Tweet" : "Post Tweet"}
                            </button>
                            {currentEditingId && (
                                <button
                                    onClick={() => {
                                        setCurrentEditingId(null);
                                        setNewTweet("");
                                    }}
                                    className="ml-2 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white text-sm"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {tweets.map((tweet) => (
                            <TweetCard
                                key={tweet._id}
                                tweet={tweet}
                                isOwner={tweet.owner._id === userId}
                                onDelete={() => handleDeleteTweet(tweet._id)}
                                onUpdate={() =>
                                    handleUpdateTweet(tweet._id, tweet.content)
                                }
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tweets;
