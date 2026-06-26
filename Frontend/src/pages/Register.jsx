import React from 'react';
import API from '../services/api.js';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ImageOff } from 'lucide-react';
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
        setLoading(true);

        try {
            await API.post("/auth/register", formData);

            const loginRes = await API.post("/auth/login", {
                email: formData.email,
                password: formData.password,
            });

            localStorage.setItem("token", loginRes.data.token);
            localStorage.setItem("user", JSON.stringify(loginRes.data.user));

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
                            Create Account
                        </h2>

                        <p className="text-slate-500 mt-2 text-sm sm:text-base">
                            Register to get your hospital queue token.
                        </p>
                    </div>

                    <div className="space-y-5">
                        <input
                            type="text"
                            name="name"
                            placeholder="Full name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border border-slate-300 bg-slate-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Email address"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border border-slate-300 bg-slate-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />

                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone number with country code"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full border border-slate-300 bg-slate-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full border border-slate-300 bg-slate-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
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

                    <p className="text-center mt-6 text-slate-600 text-sm sm:text-base">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-blue-600 font-semibold hover:underline"
                        >
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register
