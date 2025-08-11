import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAllUsers, removeAllUsers } from ".././redux/allUsersSlice";
import { Link } from "react-router-dom";

const AllUsers = () => {
  const allUsers = useSelector((store) => store.allUsers);
  const currentUser = useSelector((store) => store.user);
  const dispatch = useDispatch();

  console.log("🏪 Current allUsers state:", allUsers);
  console.log("🔢 allUsers type:", typeof allUsers);
  console.log("📏 allUsers length:", allUsers?.length);
  console.log("👤 Current user:", currentUser);
  const fetchAllUsers = async () => {
    try {
      console.log(
        "🔍 Fetching all users from:",
        BASE_URL + "/connection/users"
      );
      const res = await axios.get(BASE_URL + "/connection/users", {
        withCredentials: true,
      });
      console.log("✅ Users API response:", res.data);
      console.log("📊 Users data:", res.data?.data);
      console.log("📈 Number of users:", res.data?.data?.length);
      dispatch(addAllUsers(res.data?.data));
    } catch (err) {
      console.error("❌ Error fetching users:", err);
      console.error("❌ Error response:", err.response?.data);
      console.error("❌ Error status:", err.response?.status);
    }
  };

  useEffect(() => {
    if (currentUser) {
      console.log("✅ User is authenticated, fetching users...");
      fetchAllUsers();
    } else {
      console.log("❌ User not authenticated, skipping fetch");
    }
  }, []);

  const handleSendRequest = async (status, userId) => {
    try {
      console.log("📤 Sending connection request:", { status, userId });
      console.log(
        "🔗 Request URL:",
        BASE_URL + "/connectionrequest/send/" + status + "/" + userId
      );

      const res = await axios.post(
        BASE_URL + "/connectionrequest/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );

      console.log("✅ Connection request sent successfully:", res.data);
      dispatch(removeAllUsers(userId));
    } catch (err) {
      console.error("❌ Connection request failed:", err);
      console.error("❌ Error response:", err.response?.data);
      console.error("❌ Error status:", err.response?.status);
      console.error("❌ Error message:", err.message);
    }
  };

  // Show loading state if user is authenticated but allUsers is still null
  if (currentUser && !allUsers) {
    return (
      <div className="text-center mt-30">
        <h1 className="text-white text-4xl font-bold">Loading Users...</h1>
      </div>
    );
  }

  // Show authentication required message if user is not logged in
  if (!currentUser) {
    return (
      <div className="text-center mt-30">
        <h1 className="text-white text-4xl font-bold">
          Please log in to view users
        </h1>
      </div>
    );
  }

  // Show no users found if array is empty
  if (allUsers && allUsers.length === 0) {
    return (
      <div className="text-center mt-30">
        <h1 className="text-white text-4xl font-bold">No Users Found!</h1>
        <p className="text-white/60 mt-4">
          All available users are already in your connections.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center mt-30">
      <h1 className="text-bold text-white text-3xl">All Users</h1>

      {allUsers.map((user) => {
        const {
          _id,
          firstName,
          lastName,
          profileImageURL,
          username,
          department,
        } = user;

        return (
          <div className="flex m-6 p-6 rounded-xl bg-black/60 backdrop-blur-md w-[60%] mx-auto items-center shadow-2xs hover:shadow-2xl shadow-cyan-300 transition-shadow duration-300">
            <img
              alt={`${firstName} ${lastName}`}
              className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400"
              src={profileImageURL}
            />
            <div className="flex flex-row ml-4 flex-grow">
              <div className="flex-row items-center gap-2">
                <h2 className="font-extrabold text-2xl text-white leading-tight">
                  {firstName} {lastName}
                </h2>

                {department && username && (
                  <p className="text-sm text-white/60 tracking-wide">
                    @{username} &bull; {department}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-5">
              <button
                className="px-8 py-3 font-semibold rounded-md bg-gradient-to-r from-[#3bf2ff] to-[#404647] hover:scale-105 text-white shadow-md hover:opacity-90 transition"
                onClick={() => handleSendRequest("pending", _id)}
              >
                Send Request
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default AllUsers;
