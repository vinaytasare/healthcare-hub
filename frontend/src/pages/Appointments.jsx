import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

const doctors = [
  { name: "Dr. Rajesh Kumar", specialization: "Cardiologist" },
  { name: "Dr. Priya Sharma", specialization: "Dermatologist" },
  { name: "Dr. Anil Mehta", specialization: "Orthopedist" },
  { name: "Dr. Sunita Rao", specialization: "Gynecologist" },
  { name: "Dr. Vikram Singh", specialization: "Neurologist" },
  { name: "Dr. Meena Patel", specialization: "Pediatrician" },
  { name: "Dr. Ramesh Gupta", specialization: "General Physician" },
  { name: "Dr. Kavitha Nair", specialization: "Endocrinologist" },
];

const hospitals = [
  "Apollo Hospital", "KIMS Hospital", "Yashoda Hospital",
  "Care Hospital", "Medicover Hospital",
];

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
];

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  COMPLETED: "bg-blue-100 text-blue-700",
};

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    doctorName: "", specialization: "",
    appointmentDate: "", appointmentTime: "",
    hospital: "", notes: "",
  });

  useEffect(() => { fetchAppointments(); }, []);

  const fetchAppointments = async () => {
    try {
      const res = await api.get("/api/appointments");
      setAppointments(res.data);
    } catch { /* empty */ }
  };

  const handleDoctorChange = (e) => {
    const doctor = doctors.find((d) => d.name === e.target.value);
    setForm({ ...form, doctorName: doctor?.name || "", specialization: doctor?.specialization || "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/appointments", form);
      setShowForm(false);
      setForm({ doctorName: "", specialization: "", appointmentDate: "", appointmentTime: "", hospital: "", notes: "" });
      fetchAppointments();
    } catch { /* empty */ } finally { setLoading(false); }
  };

  const cancelAppointment = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;
    try { await api.put(`/api/appointments/${id}/cancel`); fetchAppointments(); } catch { /* empty */ }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Appointments</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Book and manage your medical appointments</p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-5 py-2 rounded-xl font-medium hover:bg-blue-700 transition">
            {showForm ? "Cancel" : "+ Book Appointment"}
          </button>
        </div>

        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-100 dark:border-gray-700 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Book New Appointment</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Doctor</label>
                <select onChange={handleDoctorChange} required
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Choose a doctor</option>
                  {doctors.map((d) => (
                    <option key={d.name} value={d.name}>{d.name} — {d.specialization}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hospital</label>
                <select value={form.hospital} onChange={(e) => setForm({ ...form, hospital: e.target.value })} required
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Choose a hospital</option>
                  {hospitals.map((h) => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                <input type="date" value={form.appointmentDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })} required
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time Slot</label>
                <select value={form.appointmentTime} onChange={(e) => setForm({ ...form, appointmentTime: e.target.value })} required
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Choose a time</option>
                  {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes (optional)</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3} placeholder="Describe your symptoms..." />
              </div>
              <div className="md:col-span-2">
                <button type="submit" disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50">
                  {loading ? "Booking..." : "Confirm Appointment"}
                </button>
              </div>
            </form>
          </div>
        )}

        {appointments.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-100 dark:border-gray-700 p-10 text-center text-gray-400 dark:text-gray-500">
            No appointments yet. Book your first appointment!
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {appointments.map((apt) => (
              <div key={apt.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-100 dark:border-gray-700 p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-800 dark:text-white">{apt.doctorName}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColors[apt.status]}`}>
                        {apt.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{apt.specialization}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">🏥 {apt.hospital}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      📅 {apt.appointmentDate} at ⏰ {apt.appointmentTime}
                    </p>
                    {apt.notes && <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 italic">"{apt.notes}"</p>}
                  </div>
                  {apt.status === "PENDING" && (
                    <button onClick={() => cancelAppointment(apt.id)}
                      className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 transition">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;