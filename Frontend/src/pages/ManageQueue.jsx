import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const socket = io("https://queueease-backend-20e9.onrender.com");

function ManageQueue() {
    const token = localStorage.getItem("token");

    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState("");
    const [tokens, setTokens] = useState([]);
    const [actionLoading, setActionLoading] = useState(null);
    const [pageLoading, setPageLoading] = useState(false);

    const authHeader = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const fetchServices = async () => {
        try {
            const res = await API.get("/services");
            setServices(res.data.services);
        } catch (error) {
            toast.error("Failed to load departments");
        }
    };

    const fetchQueue = async (serviceId) => {
        if (!serviceId) return;

        try {
            setPageLoading(true);
            const res = await API.get(`/tokens/live/${serviceId}`);
            setTokens(res.data.tokens);
        } catch (error) {
            toast.error("Failed to load queue");
        } finally {
            setPageLoading(false);
        }
    };

    const handleTokenAction = async (id, action) => {
        setActionLoading(`${action}-${id}`);

        try {
            await API.put(`/tokens/admin/${id}/${action}`, {}, authHeader);
            await fetchQueue(selectedService);
        } catch (error) {
            toast.error(error.response?.data?.message || `${action} failed`);
        } finally {
            setActionLoading(null);
        }
    };

    useEffect(() => {
        fetchServices();

        const savedService = localStorage.getItem("selectedService");

        if (savedService) {
            setSelectedService(savedService);
            fetchQueue(savedService);
        }
    }, []);

    useEffect(() => {
        if (!selectedService) return;

        socket.emit("join_department", selectedService);

        const updateQueue = () => {
            fetchQueue(selectedService);
        };

        socket.on("queue_updated", updateQueue);
        socket.on("token_called", updateQueue);
        socket.on("token_completed", updateQueue);

        return () => {
            socket.off("queue_updated", updateQueue);
            socket.off("token_called", updateQueue);
            socket.off("token_completed", updateQueue);
        };
    }, [selectedService]);

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-linear-to-br from-blue-50 via-slate-100 to-cyan-50 px-4 sm:px-6 md:px-8 py-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8 text-center sm:text-left">
                        <p className="text-blue-600 font-semibold text-sm sm:text-base">
                            Admin
                        </p>

                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                            Manage Queue
                        </h1>

                        <p className="text-slate-500 mt-2 text-sm sm:text-base">
                            Manage patient tokens department-wise in real-time.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-5 sm:p-6 mb-8">
                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-4">
                            Department Queue
                        </h2>

                        <select
                            className="w-full sm:w-96 border border-slate-300 bg-slate-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                            value={selectedService}
                            disabled={pageLoading || actionLoading}
                            onChange={(e) => {
                                const serviceId = e.target.value;

                                if (!serviceId) {
                                    localStorage.removeItem("selectedService");
                                    setSelectedService("");
                                    setTokens([]);
                                    return;
                                }

                                setSelectedService(serviceId);
                                localStorage.setItem("selectedService", serviceId);
                                fetchQueue(serviceId);
                            }}
                        >
                            <option value="">Select Department</option>

                            {services.map((service) => (
                                <option key={service._id} value={service._id}>
                                    {service.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-5 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-5">
                            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                                Today's Queue
                            </h2>

                            {pageLoading && (
                                <span className="text-sm text-blue-600 font-semibold">
                                    Loading queue...
                                </span>
                            )}
                        </div>

                        {!selectedService ? (
                            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-slate-500">
                                    Please select a department
                                </p>
                            </div>
                        ) : pageLoading ? (
                            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-slate-500">Loading queue...</p>
                            </div>
                        ) : tokens.length === 0 ? (
                            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-slate-500">No active queue</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {tokens.map((queueToken) => {
                                    const isThisTokenLoading =
                                        actionLoading?.endsWith(queueToken._id);

                                    return (
                                        <div
                                            key={queueToken._id}
                                            className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row justify-between lg:items-center gap-4"
                                        >
                                            <div>
                                                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                                                    Token #{queueToken.tokenNumber}
                                                </h3>

                                                <p className="text-slate-600">
                                                    {queueToken.user?.name}
                                                </p>

                                                <span className="inline-block mt-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                                                    {queueToken.status}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
                                                <button
                                                    disabled={isThisTokenLoading}
                                                    onClick={() =>
                                                        handleTokenAction(queueToken._id, "call")
                                                    }
                                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl font-semibold"
                                                >
                                                    {actionLoading === `call-${queueToken._id}`
                                                        ? "Calling..."
                                                        : "Call"}
                                                </button>

                                                <button
                                                    disabled={isThisTokenLoading}
                                                    onClick={() =>
                                                        handleTokenAction(queueToken._id, "complete")
                                                    }
                                                    className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl font-semibold"
                                                >
                                                    {actionLoading === `complete-${queueToken._id}`
                                                        ? "Completing..."
                                                        : "Complete"}
                                                </button>

                                                <button
                                                    disabled={isThisTokenLoading}
                                                    onClick={() =>
                                                        handleTokenAction(queueToken._id, "skip")
                                                    }
                                                    className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl font-semibold"
                                                >
                                                    {actionLoading === `skip-${queueToken._id}`
                                                        ? "Skipping..."
                                                        : "Skip"}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ManageQueue;