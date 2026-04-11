import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Navbar from "../components/Navbar";
import "leaflet/dist/leaflet.css";

// eslint-disable-next-line no-unused-vars
const hospitalIcon = new L.DivIcon({
  className: "",
  html: `<div style="background:#2563eb;width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -30],
});

const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        setLocation({ lat: 17.385, lng: 78.4867 });
      },
    );
  }, []);

  const fetchHospitals = async () => {
    setLoading(true);
    setError("");
    setHospitals([]);

    const searchTerm = search.trim()
      ? `${search} hospital`
      : "hospital near Hyderabad";

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchTerm)}&format=json&limit=20&addressdetails=1&countrycodes=in`,
        {
          headers: {
            "Accept-Language": "en",
            "User-Agent": "HealthcareHub/1.0",
          },
        },
      );
      const data = await res.json();
      const results = data
        .filter((el) => el.lat && el.lon)
        .map((el) => ({
          id: el.place_id,
          name: el.display_name.split(",")[0],
          type: el.type || "hospital",
          lat: parseFloat(el.lat),
          lng: parseFloat(el.lon),
          phone: "N/A",
          address: el.display_name.split(",").slice(1, 3).join(","),
        }));
      setHospitals(results);
      if (results.length === 0)
        setError("No hospitals found. Try a different search.");
    } catch {
      setError("Failed to fetch hospitals. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Find Hospitals
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Powered by OpenStreetMap
          </p>
        </div>
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search hospitals near you..."
            className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={fetchHospitals}
            disabled={loading || !location}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Map */}
          <div className="rounded-2xl overflow-hidden shadow border border-gray-100 h-[500px]">
            {location && (
              <MapContainer
                center={[location.lat, location.lng]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                {hospitals.map((h) => (
                  <Marker
                    key={h.id}
                    position={[h.lat, h.lng]}
                    icon={hospitalIcon}
                  >
                    <Popup>
                      <strong>{h.name}</strong>
                      <br />
                      Type: {h.type}
                      <br />
                      Phone: {h.phone}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
          </div>

          {/* List */}
          <div className="h-[500px] overflow-y-auto flex flex-col gap-3">
            {hospitals.length === 0 && !loading && (
              <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 text-center text-gray-400">
                Click Search to find hospitals near you
              </div>
            )}
            {hospitals.map((h) => (
              <div
                key={h.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-100 dark:border-gray-700 p-4 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">
                      {h.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 capitalize">
                      {h.type}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {h.address}
                    </p>
                    <p className="text-sm text-blue-600 mt-1">📞 {h.phone}</p>
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                    Nearby
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hospitals;
