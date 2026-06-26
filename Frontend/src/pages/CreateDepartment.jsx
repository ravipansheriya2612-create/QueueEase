import React from 'react';
import Navbar from '../components/Navbar';
import { useState, useEffect } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function CreateDepartment() {

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        averageServiceTime: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData, [e.target.name]: e.target.value
        })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await API.post("/services", formData, { headers: { Authorization: `Bearer ${token}` } });

            toast.success("Department created successfully");
            navigate("/admin/departments");
        } catch (error) {
            toast.error(error.response?.data?.message || "Department creation failed");
        } finally {
            setLoading(false);
        }
    }
    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-linear-to-br from-blue-50 via-slate-100 to-cyan-50 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-10">
                <div className="w-full max-w-lg">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8"
                    >
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-3xl">
                                🏥
                            </div>

                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                                Create Department
                            </h2>

                            <p className="text-slate-500 mt-2 text-sm sm:text-base">
                                Add a new hospital department for queue management
                            </p>
                        </div>

                        <div className="space-y-5">

                            <div>
                                <label className="block mb-2 text-sm font-semibold text-slate-700">
                                    Department Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    placeholder="e.g. Cardiology"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full border border-slate-300 bg-slate-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-semibold text-slate-700">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    placeholder="Enter department description..."
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full border border-slate-300 bg-slate-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-semibold text-slate-700">
                                    Average Service Time (Minutes)
                                </label>

                                <input
                                    type="number"
                                    name="averageServiceTime"
                                    placeholder="e.g. 15"
                                    value={formData.averageServiceTime}
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
                                {loading ? "Creating..." : "Create Department"}
                            </button>

                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreateDepartment;
