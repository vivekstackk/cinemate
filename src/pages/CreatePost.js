import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { useTitle } from "../hooks/useTitle";

export const CreatePost = () => {
    const navigate = useNavigate();
    useTitle("Create Post");
    const postRef = collection(db, "posts");
    
    async function handleCreatePost(event) {
        event.preventDefault();
        const document = {
            title: event.target.title.value,
            description: event.target.description.value,
            author: {
                name: auth.currentUser.displayName,
                id: auth.currentUser.uid,
            },
        };
        await addDoc(postRef, document);
        navigate("/");
    }

    return (
        <section className="create-post-section" style={{
            minHeight: "80vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 20px"
        }}>
            <div style={{
                width: "100%",
                maxWidth: "600px",
                background: "rgba(10, 10, 15, 0.4)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(20px)",
                padding: "60px",
                borderRadius: "16px",
                boxShadow: "0 25px 50px rgba(0,0,0,0.5)"
            }}>
                <div style={{ marginBottom: "50px", textAlign: "center" }}>
                    <span style={{
                        fontSize: "10px",
                        letterSpacing: "0.2em",
                        color: "#e8c97a",
                        textTransform: "uppercase"
                    }}>Director's Chair</span>
                    <h1 style={{
                        fontSize: "clamp(32px, 5vw, 48px)",
                        fontWeight: 300,
                        margin: "15px 0 0",
                        letterSpacing: "-0.04em",
                        color: "#f4f2ee"
                    }}>Write a Review</h1>
                </div>

                <form onSubmit={handleCreatePost} style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
                    <div>
                        <input
                            type="text"
                            name="title"
                            placeholder="Movie Title..."
                            maxLength="50"
                            required
                            style={{
                                width: "100%",
                                padding: "18px 0",
                                background: "transparent",
                                border: "none",
                                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                                color: "#f4f2ee",
                                fontSize: "20px",
                                outline: "none",
                                transition: "border-color 0.3s ease"
                            }}
                            onFocus={(e) => e.target.style.borderBottomColor = "#e8c97a"}
                            onBlur={(e) => e.target.style.borderBottomColor = "rgba(255, 255, 255, 0.1)"}
                        />
                    </div>
                    
                    <div>
                        <textarea
                            name="description"
                            placeholder="Your cinematic thoughts..."
                            required
                            style={{
                                width: "100%",
                                minHeight: "150px",
                                padding: "18px 0",
                                background: "transparent",
                                border: "none",
                                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                                color: "rgba(244, 242, 238, 0.8)",
                                fontSize: "16px",
                                lineHeight: "1.6",
                                outline: "none",
                                resize: "vertical",
                                transition: "border-color 0.3s ease"
                            }}
                            onFocus={(e) => e.target.style.borderBottomColor = "#e8c97a"}
                            onBlur={(e) => e.target.style.borderBottomColor = "rgba(255, 255, 255, 0.1)"}
                        ></textarea>
                    </div>

                    <button type="submit" style={{
                        marginTop: "20px",
                        padding: "20px",
                        background: "linear-gradient(135deg, #e8c97a, #c9a44e)",
                        border: "none",
                        color: "#0a0a0f",
                        fontSize: "12px",
                        fontWeight: 600,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        borderRadius: "4px",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease"
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 15px 30px rgba(232, 201, 122, 0.3)";
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                    }}>
                        Publish Review
                    </button>
                </form>
            </div>
        </section>
    );
};
