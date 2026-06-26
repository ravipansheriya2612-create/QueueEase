import React from 'react';
import API from '../services/api';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {

            const res = await API.post("/auth/login", formData);

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            toast.success("Login successful");
            navigate("/");
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-slate-100 to-cyan-50 flex items-center justify-center px-4 sm:px-6 py-8">
            <div className="w-full max-w-md">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8"
                >
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
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full border border-slate-300 bg-slate-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
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
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full border border-slate-300 bg-slate-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
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

                    <div className="mt-6 text-center">
                        <p className="text-slate-600">
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                className="text-blue-600 font-semibold hover:underline"
                            >
                                Register
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login
