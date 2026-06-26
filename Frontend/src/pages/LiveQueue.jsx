import React from 'react';
import Navbar from '../components/Navbar';
import { useState, useEffect } from 'react';
import API from '../services/api.js';
import { io } from "socket.io-client";

const socket = io("import.meta.env.VITE_SOCKET_URL");

function LiveQueue() {

    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState("");
    const [tokens, setTokens] = useState([]);

    const fetchServices = async () => {
        try {
            const res = await API.get("/services");
            setServices(res.data.services);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchQueue = async (serviceId) => {
        try {
            const res = await API.get(`/tokens/live/${serviceId}`);
            setTokens(res.data.tokens);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => { fetchServices(); }, []);

    useEffect(() => {

        if (!selectedService) return;

        socket.emit("join_department", selectedService);

        socket.on("queue_updated", () => {
            fetchQueue(selectedService)
        });

        socket.on("token_called", () => {
            fetchQueue(selectedService);
        });

        socket.on("token_completed", () => {
            fetchQueue(selectedService);
        });

        socket.on("queue_updated", () => {
            fetchQueue(selectedService);
        });

        return () => {
            socket.off("queue_updated");
            socket.off("token_called");
            socket.off("token_completed");
        }
    }, [selectedService]);

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-linear-to-br from-blue-50 via-slate-100 to-cyan-50 px-4 sm:px-6 md:px-8 py-8">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-8 text-center sm:text-left">
                        <p className="text-blue-600 font-semibold text-sm sm:text-base">
                            Real-Time Tracking
                        </p>

                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                            Live Queue
                        </h1>

                        <p className="text-slate-500 mt-2 text-sm sm:text-base">
                            Select a department and track patient tokens in real-time.
                        </p>
                    </div>

                    <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-slate-200 p-5 sm:p-6">
                        <select
                            className="w-full sm:w-96 border border-slate-300 bg-slate-50 p-3 rounded-xl mb-6 outline-none focus:ring-2 focus:ring-blue-500"
                            value={selectedService}
                            onChange={(e) => {
                                setSelectedService(e.target.value);
                                fetchQueue(e.target.value);
                            }}
                        >
                            <option value="">Select Department</option>

                            {services.map((service) => (
                                <option key={service._id} value={service._id}>
                                    {service.name}
                                </option>
                            ))}
                        </select>

                        {tokens.length === 0 ? (
                            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-slate-500 font-medium">
                                    No active queue
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {tokens.map((token) => (
                                    <div
                                        key={token._id}
                                        className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 hover:bg-white transition"
                                    >
                                        <div>
                                            <p className="text-xl font-extrabold text-slate-900">
                                                Token #{token.tokenNumber}
                                            </p>

                                            <p className="text-slate-500">
                                                {token.user?.name}
                                            </p>
                                        </div>

                                        <span className="capitalize bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold w-fit">
                                            {token.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default LiveQueue
