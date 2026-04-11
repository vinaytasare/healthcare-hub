import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/useAuth";
import api from "../api/axios";

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  COMPLETED: "bg-blue-100 text-blue-700",
};

const Admin = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalUsers: 0, totalChats: 0 });
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("users");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, aptsRes] = await Promise.all([
        api.get("/api/admin/stats"),
        api.get("/api/admin/users"),
        api.get("/api/admin/appointments"),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setAppointments(aptsRes.data);
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleUser = async (id) => {
    try { await api.put(`/api/admin/users/${id}/toggle`); fetchData(); } catch { /* empty */ }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try { await api.delete(`/api/admin/users/${id}`); fetchData(); } catch { /* empty */ }
  };

  const updateStatus = async (id, status) => {
    try { await api.put(`/api/admin/appointments/${id}/status`, { status }); fetchData(); } catch { /* empty */ }
  };

  const deleteAppointment = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;
    try { await api.delete(`/api/appointments/admin/${id}`); fetchData(); } catch { /* empty */ }
  };

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Dashboard 🛠️</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome, {user?.name}</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 border border-gray-100 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
            <p className="text-3xl font-bold text-blue-700 mt-1">{loading ? "..." : stats.totalUsers}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 border border-gray-100 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Appointments</p>
            <p className="text-3xl font-bold text-orange-500 mt-1">{loading ? "..." : appointments.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 border border-gray-100 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Hospitals</p>
            <p className="text-3xl font-bold text-green-600 mt-1">20+</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 border border-gray-100 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Chat Sessions</p>
            <p className="text-3xl font-bold text-purple-600 mt-1">{loading ? "..." : stats.totalChats}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setActiveTab("users")}
            className={`px-5 py-2 rounded-xl font-medium text-sm transition ${
              activeTab === "users"
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
            }`}>
            👥 Users
          </button>
          <button onClick={() => setActiveTab("appointments")}
            className={`px-5 py-2 rounded-xl font-medium text-sm transition ${
              activeTab === "appointments"
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
            }`}>
            📅 Appointments
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">All Users</h3>
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users..."
                className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Name</th>
                    <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Email</th>
                    <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Role</th>
                    <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr key={u.id} className="border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="py-3 px-4 font-medium text-gray-800 dark:text-white">{u.name}</td>
                      <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{u.email}</td>
                      <td className="py-3 px-4">
                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs px-2 py-1 rounded-full">
                          {u.roles?.map((r) => r.name).join(", ")}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          u.enabled ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {u.enabled ? "Active" : "Disabled"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button onClick={() => toggleUser(u.id)}
                            className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg hover:bg-yellow-200 transition">
                            {u.enabled ? "Disable" : "Enable"}
                          </button>
                          <button onClick={() => deleteUser(u.id)}
                            className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 transition">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <p className="text-center text-gray-400 dark:text-gray-500 py-6">No users found</p>
              )}
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === "appointments" && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">All Appointments</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">User</th>
                    <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Doctor</th>
                    <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Hospital</th>
                    <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Date & Time</th>
                    <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((apt) => (
                    <tr key={apt.id} className="border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-800 dark:text-white">{apt.user?.name}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{apt.user?.email}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-800 dark:text-white">{apt.doctorName}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{apt.specialization}</p>
                      </td>
                      <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{apt.hospital}</td>
                      <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                        <p>{apt.appointmentDate}</p>
                        <p className="text-xs">{apt.appointmentTime}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[apt.status]}`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2 items-center">
                          <select value={apt.status}
                            onChange={(e) => updateStatus(apt.id, e.target.value)}
                            className="text-xs border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-2 py-1 focus:outline-none">
                            <option value="PENDING">Pending</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="CANCELLED">Cancelled</option>
                            <option value="COMPLETED">Completed</option>
                          </select>
                          <button onClick={() => deleteAppointment(apt.id)}
                            className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 transition">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {appointments.length === 0 && (
                <p className="text-center text-gray-400 dark:text-gray-500 py-6">No appointments yet</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;