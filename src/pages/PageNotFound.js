import { Link } from "react-router-dom";
import { useTitle } from "../hooks/useTitle";

export const PageNotFound = () => {
    useTitle("Page Not Found");
    return (
        <section className="pageNotFound" style={{
            minHeight: "80vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            color: "#f4f2ee",
            padding: "20px"
        }}>
            <h1 style={{
                fontSize: "clamp(100px, 20vw, 250px)",
                fontWeight: 500,
                lineHeight: 0.8,
                letterSpacing: "-0.05em",
                margin: 0,
                background: "linear-gradient(135deg, #e8c97a, #f0d68a, #c9a44e)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "0 20px 40px rgba(232, 201, 122, 0.2)"
            }}>404</h1>
            <p style={{
                fontSize: "clamp(20px, 3vw, 32px)",
                fontWeight: 300,
                marginTop: "40px",
                color: "rgba(244, 242, 238, 0.8)",
                letterSpacing: "-0.02em"
            }}>This scene was cut from the final edit.</p>
            
            <Link to="/" style={{ textDecoration: "none" }}>
                <button style={{
                    marginTop: "60px",
                    padding: "20px 40px",
                    border: "1px solid rgba(232, 201, 122, 0.4)",
                    background: "rgba(255, 255, 255, 0.03)",
                    color: "#e8c97a",
                    fontSize: "12px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "4px"
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.background = "rgba(232, 201, 122, 0.15)";
                    e.currentTarget.style.borderColor = "#e8c97a";
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 10px 30px rgba(232, 201, 122, 0.15)";
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                    e.currentTarget.style.borderColor = "rgba(232, 201, 122, 0.4)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                }}>
                    RETURN TO PREMIERE
                </button>
            </Link>
        </section>
    );
};
