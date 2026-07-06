import React from 'react';
import API from '../services/api.js';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
    });
    const [loading, setLoading] = useState(false);


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value, })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        const payload = {
            name: formData.name.trim(),
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
            phone: formData.phone.trim(),
        };

        if (!payload.name || !payload.email || !payload.password || !payload.phone) {
            toast.error("All fields are required");
            return;
        }

        setLoading(true);

        try {
            const res = await API.post("/auth/register", payload);

            if (!res.data?.token || !res.data?.user) {
                toast.error("Registration failed");
                return;
            }

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            toast.success("Registration successful");
            navigate("/dashboard");

        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-slate-100 to-cyan-50 flex items-center justify-center px-4 sm:px-6 py-8">
            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                <div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-3xl">
                            🏥
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                            Create Account
                        </h2>

                        <p className="text-slate-500 mt-2 text-sm sm:text-base">
                            Register to get your hospital queue token.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-5">
                            <input
                                type="text"
                                name="name"
                                disabled={loading}
                                placeholder="Full name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full border border-slate-300 bg-slate-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                                required
                            />

                            <input
                                type="email"
                                name="email"
                                disabled={loading}
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full border border-slate-300 bg-slate-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                                required
                            />

                            <input
                                type="text"
                                name="phone"
                                disabled={loading}
                                placeholder="Phone number with country code"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full border border-slate-300 bg-slate-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                                required
                            />

                            <input
                                type="password"
                                name="password"
                                disabled={loading}
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full border border-slate-300 bg-slate-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                                required
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 rounded-xl font-semibold shadow-lg transition text-white ${loading
                                    ? "bg-blue-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                                    }`}
                            >
                                {loading ? "Registering..." : "Register"}
                            </button>
                        </div>
                    </form>

                    <p className="text-center mt-6 text-slate-600 text-sm sm:text-base">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className={`text-blue-600 font-semibold hover:underline ${loading ? "pointer-events-none opacity-60" : ""
                                }`}
                        >
                            Login
                        </Link>
                    </p>
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
                            Skip registration and use demo accounts to explore the Hospital Queue Management System.
                        </p>
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
                        </div>
                    </div>

                    <Link
                        to="/login"
                        className="mt-8 bg-blue-600 hover:bg-blue-700 py-3 rounded-xl text-center font-bold transition"
                    >
                        Login Using Demo Account
                    </Link>
                </div>
            </div>
        </div>
    );
}


export default Register
