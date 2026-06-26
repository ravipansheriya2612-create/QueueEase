import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
    return (
        <>
            <Navbar />

            <section className="min-h-screen bg-linear-to-br from-blue-50 via-slate-100 to-cyan-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="text-center lg:text-left">
                        <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-5">
                            Smart Hospital Queue System
                        </span>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
                            Skip the long hospital waiting lines
                        </h1>

                        <p className="text-slate-600 mt-6 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                            MediQueue allows patients to generate digital tokens, track live
                            queue status, and get estimated waiting time in real-time.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mt-8">
                            <Link
                                to="/dashboard"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-xl font-semibold shadow-lg transition text-center"
                            >
                                Get Token
                            </Link>

                            <Link
                                to="/live-queue"
                                className="bg-white hover:bg-slate-50 text-blue-600 px-7 py-3 rounded-xl font-semibold border border-blue-200 shadow transition text-center"
                            >
                                View Live Queue
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
                            <div className="bg-white/70 rounded-2xl p-4 border border-slate-200 shadow-sm">
                                <h3 className="text-2xl font-bold text-slate-800">24/7</h3>
                                <p className="text-slate-500 text-sm">Queue Access</p>
                            </div>

                            <div className="bg-white/70 rounded-2xl p-4 border border-slate-200 shadow-sm">
                                <h3 className="text-2xl font-bold text-slate-800">Live</h3>
                                <p className="text-slate-500 text-sm">Updates</p>
                            </div>

                            <div className="bg-white/70 rounded-2xl p-4 border border-slate-200 shadow-sm">
                                <h3 className="text-2xl font-bold text-slate-800">Fast</h3>
                                <p className="text-slate-500 text-sm">Token Booking</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -top-6 -right-4 sm:-right-6 w-24 sm:w-32 h-24 sm:h-32 bg-blue-200 rounded-full blur-3xl opacity-70"></div>
                        <div className="absolute -bottom-6 -left-4 sm:-left-6 w-24 sm:w-32 h-24 sm:h-32 bg-cyan-200 rounded-full blur-3xl opacity-70"></div>

                        <div className="relative bg-white/90 backdrop-blur rounded-3xl shadow-2xl border border-slate-200 p-5 sm:p-8">
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">
                                Live Queue Preview
                            </h2>

                            <p className="text-slate-500 text-sm mb-5">
                                Sample preview. Open Live Queue to view real-time data.
                            </p>

                            <div className="space-y-4">
                                {[
                                    ["Token #12", "OPD Department", "Called", "bg-green-100 text-green-700"],
                                    ["Token #13", "Estimated wait: 10 min", "Waiting", "bg-yellow-100 text-yellow-700"],
                                    ["Token #14", "Estimated wait: 20 min", "Waiting", "bg-yellow-100 text-yellow-700"],
                                ].map((item) => (
                                    <div
                                        key={item[0]}
                                        className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100"
                                    >
                                        <div>
                                            <p className="font-bold text-slate-800">{item[0]}</p>
                                            <p className="text-sm text-slate-500">{item[1]}</p>
                                        </div>

                                        <span className={`${item[3]} px-3 py-1 rounded-full text-sm font-semibold w-fit`}>
                                            {item[2]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-slate-800 mb-3">
                        How MediQueue Works
                    </h2>

                    <p className="text-center text-slate-500 mb-10">
                        A simple digital flow for patients and hospital staff
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            ["1", "Register/Login", "Create your account securely."],
                            ["2", "Select Department", "Choose OPD, Dental, X-Ray, etc."],
                            ["3", "Generate Token", "Get your digital queue token."],
                            ["4", "Track Live Queue", "Watch status update in real-time."],
                        ].map((item) => (
                            <div
                                key={item[0]}
                                className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 text-center hover:-translate-y-1 transition"
                            >
                                <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto text-xl font-bold shadow">
                                    {item[0]}
                                </div>

                                <h3 className="mt-5 font-bold text-lg text-slate-800">
                                    {item[1]}
                                </h3>

                                <p className="text-slate-500 text-sm mt-2">{item[2]}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;