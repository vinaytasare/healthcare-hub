import Navbar from "../components/Navbar";
import { useAuth } from "../context/useAuth";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">My Profile 👤</h2>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-100 dark:border-gray-700 p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-3xl font-bold text-blue-600 dark:text-blue-300">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{user?.name}</h3>
              <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs px-3 py-1 rounded-full mt-1 inline-block">
                {user?.role}
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="border border-gray-100 dark:border-gray-700 rounded-xl p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
              <p className="font-medium text-gray-800 dark:text-white mt-1">{user?.name}</p>
            </div>
            <div className="border border-gray-100 dark:border-gray-700 rounded-xl p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Email Address</p>
              <p className="font-medium text-gray-800 dark:text-white mt-1">{user?.email}</p>
            </div>
            <div className="border border-gray-100 dark:border-gray-700 rounded-xl p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
              <p className="font-medium text-gray-800 dark:text-white mt-1">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;