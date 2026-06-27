import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Navbar() {

    const navigate = useNavigate();

    const storedUser = localStorage.getItem("user");
    const user = storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    }
    return (
        <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

                    <Link
                        to="/"
                        className="text-2xl font-extrabold text-blue-600 tracking-tight text-center sm:text-left"
                    >
                        MediQueue
                    </Link>

                    <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-5 font-medium">
                        {user ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="text-slate-700 hover:text-blue-600 transition text-sm sm:text-base"
                                >
                                    Dashboard
                                </Link>

                                <Link
                                    to="/live-queue"
                                    className="text-slate-700 hover:text-blue-600 transition text-sm sm:text-base"
                                >
                                    Live Queue
                                </Link>

                                {user?.role === "admin" && (
                                    <Link
                                        to="/admin"
                                        className="text-slate-700 hover:text-blue-600 transition text-sm sm:text-base"
                                    >
                                        Admin
                                    </Link>
                                )}

                                <button
                                    onClick={logout}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-semibold shadow transition text-sm sm:text-base"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-slate-700 hover:text-blue-600 transition text-sm sm:text-base"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold shadow transition text-sm sm:text-base"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                </div>
            </div>
        </nav>
    )
};

export default Navbar
