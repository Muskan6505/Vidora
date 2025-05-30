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
            const res = await axios.get("/api/v1/videos", 
                {
                    page: page,
                    limit: limit,
                    query: query,
                },
                {withCredentials: true,}
            );

            if (res.data.data.docs.length < limit) setHasMore(false);

            if (page === 1) {
                dispatch(setVideos(res.data.data.docs));
            } else {
                dispatch(appendVideos(res.data.data.docs));
            }
        } catch (err) {
            console.error("Failed to fetch videos", err);
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleSearchChange = (query) => {
        setSearchQuery(query);
        setPageNo(1);
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
        <div className="flex flex-col min-h-screen bg-gray-900" >
            <Navbar />
            <SearchBar onChange={handleSearchChange} />
            <div  className="flex flex-1 pt-30">
                <Sidebar />
                <main style={{ overflow: 'scroll', scrollbarWidth: 'none' }} className="flex-1 p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 " >
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
