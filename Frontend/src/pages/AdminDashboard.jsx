import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";

function AdminDashboard() {
  const token = localStorage.getItem("token");
  const [analytics, setAnalytics] = useState(null);

  const authHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchAnalytics = async () => {
    const res = await API.get("/tokens/admin/analytics", authHeader);
    setAnalytics(res.data);
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-linear-to-br from-blue-50 via-slate-100 to-cyan-50 px-4 sm:px-6 md:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center sm:text-left">
            <p className="text-blue-600 font-semibold text-sm sm:text-base">
              Administration Panel
            </p>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Admin Dashboard
            </h1>
          </div>

          {analytics && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
              {[
                ["Total Tokens", analytics.totalTokens, "text-slate-900"],
                ["Waiting", analytics.waitingTokens, "text-yellow-600"],
                ["Completed", analytics.completedTokens, "text-green-600"],
                ["Skipped", analytics.skippedTokens, "text-orange-500"],
                ["Cancelled", analytics.cancelledTokens, "text-red-600"],
              ].map((item) => (
                <div
                  key={item[0]}
                  className="bg-white rounded-2xl p-5 shadow-lg border border-slate-200"
                >
                  <p className="text-slate-500 text-sm">{item[0]}</p>
                  <h3 className={`text-3xl font-extrabold mt-2 ${item[2]}`}>
                    {item[1]}
                  </h3>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              to="/admin/departments"
              className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200 hover:-translate-y-1 hover:shadow-xl transition"
            >
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Manage Departments
              </h2>

              <p className="text-slate-500 mt-2 text-sm sm:text-base">
                Create and delete hospital departments.
              </p>
            </Link>

            <Link
              to="/admin/queue"
              className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200 hover:-translate-y-1 hover:shadow-xl transition"
            >
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Manage Queue
              </h2>

              <p className="text-slate-500 mt-2 text-sm sm:text-base">
                Call, complete, and skip patient tokens.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;