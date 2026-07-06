import React from "react";
import API from "../services/api";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const fillDemoPatient = () => {
        setFormData({
            email: "patient@queueease.com",
            password: "Patient@123",
        });
    };

    const fillDemoAdmin = () => {
        setFormData({
            email: "admin@queueease.com",
            password: "Admin@123",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        setLoading(true);

        try {
            const payload = {
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
            };

            const res = await API.post("/auth/login", payload);

            if (!res.data?.token || !res.data?.user) {
                toast.error("Login failed");
                return;
            }

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            toast.success("Login successful");

            if (res.data.user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/dashboard");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-slate-100 to-cyan-50 flex items-center justify-center px-4 sm:px-6 py-8">
            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

                <div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8">
                    <form onSubmit={handleSubmit}>
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-3xl">
                                🏥
                            </div>

                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                                Welcome Back
                            </h2>

                            <p className="text-slate-500 mt-2 text-sm sm:text-base">
                                Login to access your hospital queue dashboard.
                            </p>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-slate-700">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    disabled={loading}
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full border border-slate-300 bg-slate-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-semibold text-slate-700">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    name="password"
                                    disabled={loading}
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full border border-slate-300 bg-slate-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 rounded-xl font-semibold shadow-lg transition text-white ${loading
                                    ? "bg-blue-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                                    }`}
                            >
                                {loading ? "Logging in..." : "Login"}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-slate-600">
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                className={`text-blue-600 font-semibold hover:underline ${loading ? "pointer-events-none opacity-60" : ""
                                    }`}
                            >
                                Register
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 text-white rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col justify-center">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 mx-auto bg-blue-500 rounded-full flex items-center justify-center text-4xl">
                            🏥
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-bold mt-5 text-blue-400">
                            Demo Accounts
                        </h2>

                        <p className="text-slate-300 mt-3 text-sm sm:text-base">
                            HRs and interviewers can explore QueueEase using these demo accounts.
                        </p>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-400/20 rounded-xl p-4 mb-5">
                        <h3 className="font-bold text-blue-300 mb-3">
                            Explore Features
                        </h3>

                        <ul className="space-y-2 text-sm text-slate-300">
                            <li>✅ Generate Queue Tokens</li>
                            <li>✅ Live Queue Tracking</li>
                            <li>✅ Socket.IO Real-Time Updates</li>
                            <li>✅ Admin Dashboard</li>
                            <li>✅ Queue Analytics</li>
                        </ul>
                    </div>

                    <div className="space-y-5">
                        <div className="bg-white/10 rounded-2xl p-5 border border-white/10">
                            <h3 className="text-xl font-bold text-blue-300 mb-3">
                                👤 Demo Patient
                            </h3>

                            <p className="text-sm break-all">
                                <span className="font-semibold">Email:</span>{" "}
                                patient@queueease.com
                            </p>

                            <p className="text-sm mt-2">
                                <span className="font-semibold">Password:</span>{" "}
                                Patient@123
                            </p>

                            <button
                                type="button"
                                onClick={fillDemoPatient}
                                disabled={loading}
                                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold disabled:bg-blue-400 disabled:cursor-not-allowed"
                            >
                                Fill Patient Login
                            </button>
                        </div>

                        <div className="bg-white/10 rounded-2xl p-5 border border-white/10">
                            <h3 className="text-xl font-bold text-green-300 mb-3">
                                👨‍💼 Demo Admin
                            </h3>

                            <p className="text-sm break-all">
                                <span className="font-semibold">Email:</span>{" "}
                                admin@queueease.com
                            </p>

                            <p className="text-sm mt-2">
                                <span className="font-semibold">Password:</span>{" "}
                                Admin@123
                            </p>

                            <button
                                type="button"
                                onClick={fillDemoAdmin}
                                disabled={loading}
                                className="mt-4 w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg font-semibold disabled:bg-green-400 disabled:cursor-not-allowed"
                            >
                                Fill Admin Login
                            </button>
                        </div>
                    </div>

                    <p className="text-center text-xs text-slate-400 mt-6">
                        Portfolio Demo • QueueEase Hospital Queue Management System
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;