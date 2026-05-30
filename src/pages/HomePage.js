import { useState, useEffect, useRef } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase/config";
import { PostCard, SkeletonCard } from "../components";
import { useTitle } from "../hooks/useTitle";

export const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const [toggle, setToggle] = useState(false);
    useTitle("Home");
    const postRef = useRef(collection(db, "posts"));

    useEffect(() => {
        async function getPosts() {
            const data = await getDocs(postRef.current);
            setPosts(
                data.docs.map((document) => {
                    return {
                        ...document.data(),
                        id: document.id,
                    };
                })
            );
        }
        getPosts();
    }, [toggle, postRef]);

    return (
        <section>
            {posts.length !== 0 ? (
                posts.map((post) => (
                    <PostCard key={post.id} post={post} setToggle={setToggle} />
                ))
            ) : (
                <>
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </>
            )}
        </section>
    );
};
