import React from "react";
import { useSelector } from "react-redux";
import EditProfilePage from "./EditProfilePage";

const Profile = () => {
  const user = useSelector((store) => store.user);
  return (
    user && (
      <div>
        <EditProfilePage user={user} />
      </div>
    )
  );
};

export default Profile;
