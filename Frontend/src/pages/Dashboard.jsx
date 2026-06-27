import React from 'react';
import Navbar from '../components/Navbar';
import API from "../services/api";
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

function Dashboard() {

    const storedUser = localStorage.getItem("user");
    const user = storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
    const token = localStorage.getItem("token");

    const [services, setServices] = useState([]);
    const [myToken, setMyToken] = useState(null);
    const [generatingId, setGeneratingId] = useState(null);
    const [cancelling, setCancelling] = useState(false);

    const fetchServices = async () => {
        try {
            const res = await API.get("/services");
            setServices(res.data.services);
        } catch (error) {
            toast.error("Failed to load departments");
        }
    };

    const generateToken = async (serviceId) => {
        setGeneratingId(serviceId);

        try {
            const res = await API.post("/tokens/generate", { serviceId }, { headers: { Authorization: `Bearer ${token}` } });

            toast.success(`Token generated: ${res.data.token.tokenNumber}`);
            fetchMyToken();

        } catch (error) {
            toast.error(error.response?.data?.message || "Token generation failed");
        } finally {
            setGeneratingId(null);
        }
    };

    const fetchMyToken = async () => {
        try {
            const res = await API.get("/tokens/my-token", { headers: { Authorization: `Bearer ${token}` } });

            setMyToken(res.data.token);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => { fetchServices(), fetchMyToken() }, []);

    const cancelToken = async (id) => {
        setCancelling(true);

        try {

            await API.put(`/tokens/${id}/cancel`, {}, { headers: { Authorization: `Bearer ${token}` } });

            toast.success("Token cancelled successfully");
            fetchMyToken();

        } catch (error) {
            toast.error(error.response?.data?.message || "Token cancel failed");
        } finally {
            setCancelling(false);
        }
    }

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-linear-to-br from-blue-50 via-slate-100 to-cyan-50 px-4 sm:px-6 md:px-8 py-8">
                <div className="max-w-7xl mx-auto">

                    <div className="mb-8 text-center sm:text-left">
                        <p className="text-blue-600 font-semibold text-sm sm:text-base">
                            Patient Dashboard
                        </p>

                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                            Welcome, {user?.name}
                        </h1>

                        <p className="text-slate-500 mt-2 text-sm sm:text-base">
                            Generate your hospital token and track your queue status.
                        </p>
                    </div>

                    {myToken && (
                        <div className="bg-white/90 backdrop-blur p-5 sm:p-6 rounded-2xl shadow-xl border border-slate-200 mb-8">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                                <div className="w-full">
                                    <p className="text-sm font-semibold text-blue-600">
                                        My Current Token
                                    </p>

                                    <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mt-1">
                                        #{myToken.tokenNumber}
                                    </h2>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                            <p className="text-xs text-slate-500">Status</p>
                                            <p className="font-bold capitalize text-slate-800">
                                                {myToken.status}
                                            </p>
                                        </div>

                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                            <p className="text-xs text-slate-500">Estimated Wait</p>
                                            <p className="font-bold text-slate-800">
                                                {myToken.estimatedWaitTime} minutes
                                            </p>
                                        </div>

                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                            <p className="text-xs text-slate-500">Department</p>
                                            <p className="font-bold text-slate-800">
                                                {myToken.service?.name}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    disabled={cancelling}
                                    onClick={() => cancelToken(myToken._id)}
                                    className={`w-full lg:w-auto text-white px-5 py-3 rounded-xl font-semibold shadow transition ${cancelling
                                        ? "bg-red-400 cursor-not-allowed"
                                        : "bg-red-600 hover:bg-red-700"
                                        }`}
                                >
                                    {cancelling ? "Cancelling..." : "Cancel Token"}
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                        <div>
                            <h2 className="text-2xl font-extrabold text-slate-900">
                                Hospital Departments
                            </h2>

                            <p className="text-slate-500 text-sm">
                                Choose a department and generate your token.
                            </p>
                        </div>
                    </div>

                    {services.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow border border-slate-200 p-10 text-center">
                            <p className="text-slate-500">
                                No departments available.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {services.map((service) => (
                                <div
                                    key={service._id}
                                    className="bg-white rounded-2xl shadow-lg border border-slate-200 p-5 sm:p-6 hover:-translate-y-1 hover:shadow-xl transition"
                                >
                                    <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center font-bold mb-4">
                                        {service.name?.charAt(0)}
                                    </div>

                                    <h3 className="text-xl font-extrabold text-slate-900">
                                        {service.name}
                                    </h3>

                                    <p className="text-slate-500 mt-2 min-h-12">
                                        {service.description}
                                    </p>

                                    <div className="mt-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <p className="text-xs text-slate-500">
                                            Average Service Time
                                        </p>

                                        <p className="font-bold text-slate-800">
                                            {service.averageServiceTime} min
                                        </p>
                                    </div>

                                    <button
                                        disabled={generatingId === service._id}
                                        onClick={() => generateToken(service._id)}
                                        className={`mt-5 w-full text-white px-4 py-3 rounded-xl font-semibold shadow transition ${generatingId === service._id
                                            ? "bg-blue-400 cursor-not-allowed"
                                            : "bg-blue-600 hover:bg-blue-700"
                                            }`}
                                    >
                                        {generatingId === service._id
                                            ? "Generating..."
                                            : "Generate Token"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Dashboard;
