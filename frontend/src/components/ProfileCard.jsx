// components/ProfileCard.js
import React from "react";

const ProfileCard = ({ user }) => {
  const {
    firstName,
    lastName,
    username,
    profileImageURL,
    gender,
    about,
    department,
  } = user;

  return (
    <div className="w-[300px] p-6 bg-gradient-to-tr from-[#3bf2ff] to-[#404647] backdrop-blur-2xl rounded-2xl shadow-2xl h-max text-gray-900 mx-auto text-center">
      {/* Profile Picture */}
      <div className="avatar mb-4 mx-auto">
        <div className="w-28 h-28 rounded-full ring ring-emerald-400 ring-offset-2 ring-offset-green-300">
          <img src={profileImageURL} alt="User" className="object-cover" />
        </div>
      </div>

      {/* Name & Title */}
      <h2 className="text-2xl font-bold text-white">
        {firstName + " " + lastName}
      </h2>
      <p className="text-black/70 mb-4">@{username}</p>

      {/* About Section */}
      <div className="text-left text-sm text-white space-y-4">
        <div>
          <h3 className="font-semibold text-gray-800">About</h3>
          <p className="">
            {about ||
              "You should bring together user attitudes and behaviours in relation to a product or service. You can also include demographic information about the individual."}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-gray-800">Department</h3>
            <p>{department}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800">Gender</h3>
            <p className="">{gender ||"Not Selected"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
