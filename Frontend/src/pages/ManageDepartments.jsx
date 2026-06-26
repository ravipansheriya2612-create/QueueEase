import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";
import toast from "react-hot-toast";

function ManageDepartments() {
    const token = localStorage.getItem("token");
    const [services, setServices] = useState([]);
    const [deletingId, setDeletingId] = useState(null);

    const authHeader = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const fetchServices = async () => {
        const res = await API.get("/services");
        setServices(res.data.services);
    };

    const deleteDepartment = async (id) => {
        const confirmDelete = window.confirm("Delete this department?");
        if (!confirmDelete) return;

        setDeletingId(id);

        try {
            await API.delete(`/services/${id}`, authHeader);
            toast.success("Department deleted");
            fetchServices();
        } catch (error) {
            toast.error(error.response?.data?.message || "Delete failed");
        } finally {
            setDeletingId(null);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-linear-to-br from-blue-50 via-slate-100 to-cyan-50 px-4 sm:px-6 md:px-8 py-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8 text-center sm:text-left">
                        <div>
                            <p className="text-blue-600 font-semibold text-sm sm:text-base">
                                Admin
                            </p>

                            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                                Manage Departments
                            </h1>

                            <p className="text-slate-500 mt-2 text-sm sm:text-base">
                                Create, view, and remove hospital departments.
                            </p>
                        </div>

                        <Link
                            to="/admin/create-department"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold shadow-lg transition text-center"
                        >
                            + Create Department
                        </Link>
                    </div>

                    {services.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-10 text-center">
                            <p className="text-slate-500">
                                No departments found.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
                                        disabled={deletingId === service._id}
                                        onClick={() => deleteDepartment(service._id)}
                                        className={`mt-5 w-full text-white py-3 rounded-xl font-semibold transition ${deletingId === service._id
                                            ? "bg-red-400 cursor-not-allowed"
                                            : "bg-red-600 hover:bg-red-700"
                                            }`}
                                    >
                                        {deletingId === service._id
                                            ? "Deleting..."
                                            : "Delete Department"}
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

export default ManageDepartments;