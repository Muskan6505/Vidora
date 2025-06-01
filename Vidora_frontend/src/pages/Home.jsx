import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setVideos, appendVideos, setLoading } from "../features/videoSlice";
import { Navbar, Sidebar, SearchBar, VideoCard } from "../components";
import { useInView } from "react-intersection-observer";

const Home = () => {
    const dispatch = useDispatch();
    const { videos, loading } = useSelector((state) => state.video);
    const [pageNo, setPageNo] = useState(1);
    const limit = 20;
    const [hasMore, setHasMore] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const { ref, inView } = useInView({ threshold: 1 });

    const fetchVideos = async (page = 1, query = "") => {
        try {
            dispatch(setLoading(true));

            const res = await axios.get("/api/v1/videos", {
                params: { page, limit, query },
                withCredentials: true,
            });

            const newVideos = res.data.data;

            if (newVideos?.length < limit) setHasMore(false);
            else setHasMore(true);

            if (page === 1) {
                dispatch(setVideos(newVideos));
            } else if (page > 1) {
                dispatch(appendVideos(newVideos));
            }
        } catch (err) {
            console.error("Failed to fetch videos", err);
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleSearchChange = (query) => {
        setSearchQuery(query);
        setPageNo(1); // triggers useEffect to fetch new results
    };

    useEffect(() => {
        fetchVideos(pageNo, searchQuery);
    }, [pageNo, searchQuery]);

    useEffect(() => {
        if (inView && hasMore && !loading) {
            setPageNo((prev) => prev + 1);
        }
    }, [inView, hasMore, loading]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-200 dark:bg-gray-950">
            <Navbar />
            <SearchBar onChange={handleSearchChange} />

            <div className="flex flex-1 pt-30">
                {/* Fixed Sidebar */}
                <div className="fixed top-20 left-0 h-[calc(100vh-5rem)] z-30 pt-10">
                    <Sidebar />
                </div>

                {/* Main content */}
                <main
                    className="flex-1 ml-0 sm:ml-64 md:pt-4 md:pr-4 p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto"
                    style={{ scrollbarWidth: "none" }}
                >
                    {videos.map((video) => (
                        <div key={video._id}>
                            <VideoCard video={video} />
                        </div>
                    ))}
                </main>
            </div>

            <div ref={ref} className="my-4 text-center text-white">
                {loading && <p>Loading more videos...</p>}
                {!hasMore && <p>No more videos to load.</p>}
            </div>
        </div>
    );
};

export default Home;
