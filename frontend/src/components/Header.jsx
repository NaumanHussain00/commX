import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../redux/userSlice";

const Header = () => {
  const Navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      await axios.post(
        BASE_URL + "/auth/logout",
        {},
        { withCredentials: true }
      );
      dispatch(removeUser());
      return Navigate("/signup");
    } catch (err) {
      //TODO:ERROR HANDLING
      console.log(err);
    }
  };

  return (
    <div className="navbar bg-transparent flex justify-between  shadow-none w-[98%] right-[1%] top-2  absolute px-6 z-50">
      <div className="absolute inset-0 rounded-full bg-black/60"></div>
      <div
        className="flex items-center z-10 cursor-pointer"
        onClick={() => Navigate("/")}
      >
        <svg
          className="w-13"
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
          fill="#fff"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <title>network-platform</title>{" "}
            <g id="Layer_2" data-name="Layer 2">
              {" "}
              <g id="invisible_box" data-name="invisible box">
                {" "}
                <rect width="48" height="48" fill="none"></rect>{" "}
                <rect width="48" height="48" fill="none"></rect>{" "}
                <rect width="48" height="48" fill="none"></rect>{" "}
              </g>{" "}
              <g id="icons_Q2" data-name="icons Q2">
                {" "}
                <path d="M40,18a6.2,6.2,0,0,0-5.7,4H25.8a9.9,9.9,0,0,0-1.5-3.3l3.5-4.1A7.8,7.8,0,0,0,30,15a6,6,0,1,0-6-6,6.1,6.1,0,0,0,.8,3l-3.6,4.1A8.5,8.5,0,0,0,17,15l-1.7.2-1.2-2.8A6,6,0,1,0,10,14h.4l1.3,2.8a8.9,8.9,0,0,0,0,14.4L10.4,34H10a6,6,0,1,0,4.1,1.6l1.2-2.8L17,33a8.5,8.5,0,0,0,4.2-1.1L24.8,36a6.1,6.1,0,0,0-.8,3,6,6,0,1,0,6-6,7.8,7.8,0,0,0-2.2.4l-3.5-4.1A9.9,9.9,0,0,0,25.8,26h8.5A6.2,6.2,0,0,0,40,30a6,6,0,0,0,0-12ZM8,8a2,2,0,1,1,2,2A2,2,0,0,1,8,8Zm2,34a2,2,0,1,1,2-2A2,2,0,0,1,10,42ZM30,7a2,2,0,1,1-2,2A2,2,0,0,1,30,7ZM12,24a5,5,0,1,1,5,5A5,5,0,0,1,12,24ZM32,39a2,2,0,1,1-2-2A2,2,0,0,1,32,39Zm8-13a2,2,0,1,1,2-2A2,2,0,0,1,40,26Z"></path>{" "}
              </g>{" "}
            </g>{" "}
          </g>
        </svg>
        <div className="afacad-flux-title font-bold px-3 text-4xl text-white">
          commX
        </div>
      </div>
      {user && (
        <div className="flex gap-2">
          <p className="text-white pt-1 z-10 px-4 text-lg font-medium">
            Hello, {user.firstName}
          </p>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img alt="Profile" src={user.profileImageURL} />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-white text-black  rounded-box z-10 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/profile/edit" className="justify-between">
                  Profile
                  <span className="badge bg-cyan-600 rounded-2xl border-none">New</span>
                </Link>
              </li>
              <li>
                <Link to="/allusers">All Users</Link>
              </li>
              <li>
                <Link to="/connections">Connections</Link>
              </li>
              <li>
                <Link to="/requests">Requests</Link>
              </li>
              <li>
                <a onClick={handleLogout}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
