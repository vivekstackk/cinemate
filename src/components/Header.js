import { NavLink } from "react-router-dom";
import { auth, provider } from "../firebase/config";
import { signInWithPopup, signOut } from "firebase/auth";
import { useState } from "react";
import MovieSearch from "./MovieSearch";

export const Header = () => {
    const [isAuth, setIsAuth] = useState(
        JSON.parse(localStorage.getItem("isAuth")) || false
    );

    const login = () => {
        signInWithPopup(auth, provider).then(() => {
            setIsAuth(true);
            localStorage.setItem("isAuth", true);
        });
    };

    const logout = () => {
        signOut(auth);
        setIsAuth(false);
        localStorage.setItem("isAuth", false);
    };

    return (
        <header className="site-header">
            <NavLink to="/" className="site-brand">
                <span className="brand-symbol">
                    <svg viewBox="0 0 44 44" aria-hidden="true">
                        {/* Film reel outer ring */}
                        <circle
                            cx="22" cy="22" r="18"
                            fill="none"
                            stroke="url(#logoGrad)"
                            strokeWidth="2"
                        />
                        {/* Inner film hub */}
                        <circle
                            cx="22" cy="22" r="5"
                            fill="none"
                            stroke="url(#logoGrad)"
                            strokeWidth="1.5"
                        />
                        {/* Film sprocket holes */}
                        <circle cx="22" cy="8" r="2" fill="url(#logoGrad)" />
                        <circle cx="22" cy="36" r="2" fill="url(#logoGrad)" />
                        <circle cx="8" cy="22" r="2" fill="url(#logoGrad)" />
                        <circle cx="36" cy="22" r="2" fill="url(#logoGrad)" />
                        {/* Diagonal sprockets */}
                        <circle cx="12.1" cy="12.1" r="1.5" fill="url(#logoGrad)" opacity="0.7" />
                        <circle cx="31.9" cy="12.1" r="1.5" fill="url(#logoGrad)" opacity="0.7" />
                        <circle cx="12.1" cy="31.9" r="1.5" fill="url(#logoGrad)" opacity="0.7" />
                        <circle cx="31.9" cy="31.9" r="1.5" fill="url(#logoGrad)" opacity="0.7" />
                        {/* Gradient definition */}
                        <defs>
                            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#e8c97a" />
                                <stop offset="50%" stopColor="#f0d68a" />
                                <stop offset="100%" stopColor="#c9a44e" />
                            </linearGradient>
                        </defs>
                    </svg>
                </span>

                <span className="brand-word">CINEMATE</span>
            </NavLink>

            <div style={{ display: "flex", alignItems: "center", gap: "28px", justifySelf: "center" }}>
                <nav className="site-nav" style={{ margin: 0 }}>
                    <a href="#movies">MOVIES</a>
                    <a href="#radar">RADAR</a>
                    <a href="#awards">AWARDS</a>
                </nav>
                <MovieSearch />
            </div>

            <div className="header-right">
                <div className="local-time">
                    <span>LOCAL TIME</span>
                    <strong>
                        {new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                        })}
                    </strong>
                </div>

                {isAuth ? (
                    <button
                        className="round-control"
                        onClick={logout}
                        aria-label="Logout"
                    >
                        <span className="close-icon">×</span>
                    </button>
                ) : (
                    <button
                        className="round-control"
                        onClick={login}
                        aria-label="Login"
                    >
                        {/* User silhouette icon */}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </button>
                )}
            </div>
        </header>
    );
};