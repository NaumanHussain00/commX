import React, { useState } from "react";
import ProfileCard from "../components/ProfileCard"; // Adjust path if needed
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../redux/userSlice";
import axios from "axios";

const EditProfilePage = ({ user }) => {
  const { firstName, lastName, gender, profileImageURL, department, username } =
    user;
  const userData = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    firstName,
    lastName,
    profileImageURL,
    department,
    gender,
    username,
  });
  console.log(formData);
  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(BASE_URL + "/user/profile/edit", formData, {
        withCredentials: true,
      });
      dispatch(addUser(res?.data?.data));
      // toast.success(" Profile is Successfully Updated!");
    } catch (err) {
      // toast.error(err.message);
      console.log(err.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br p-6 pt-52">
      {/* Add top padding (pt-32) to account for fixed/sticky header height */}

      <div className="flex flex-col md:flex-row-reverse gap-10 items-start justify-center max-w-6xl mx-auto">
        {/* Right: Profile Card */}
        <div className="flex-shrink-0">
          {userData && <ProfileCard user={formData} />}
        </div>

        {/* Left: Edit Form */}
        <div className="bg-black/30 backdrop-blur-2xl rounded-2xl p-8 shadow-xl w-full max-w-2xl">
          <h2 className="text-2xl font-bold mb-6 text-white">Edit Profile</h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-white">
            <div>
              <label className="block mb-1 font-semibold">First Name</label>
              <input
                value={formData.firstName}
                name="firstName"
                type="text"
                onChange={handleChange}
                defaultValue="Jane Doe"
                className="input input-bordered w-full text-cyan-500"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold ">Last Name</label>
              <input
                value={formData.lastName}
                name="lastName"
                type="text"
                defaultValue="janedoe"
                onChange={handleChange}
                className="input input-bordered w-full text-cyan-500"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">
                profile Image URL
              </label>
              <input
                name="profileImageURL"
                value={formData.profileImageURL}
                type="text"
                onChange={handleChange}
                defaultValue="profileImageURL"
                className="input input-bordered w-full text-cyan-500"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Username</label>
              <input
                value={formData.username}
                name="username"
                type="text"
                // defaultValue="janedoe"
                onChange={handleChange}
                className="input input-bordered w-full text-cyan-500"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Department</label>
              <input
                value={formData.department}
                name="department"
                onChange={handleChange}
                type="text"
                className="input input-bordered w-full text-cyan-500"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Gender</label>
              <input
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                type="text"
                className="input input-bordered w-full text-cyan-500"
              />
            </div>

            <div className="md:col-span-2 text-right">
              <button
                onClick={saveProfile}
                className="btn border-none text-white bg-gradient-to-l rounded-xl from-[#3bf2ff] to-[#404647]"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
