import React, { useEffect } from "react";
import Header from "./Header";
import { Outlet, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import bgImage from "../assets/bg-image12.png";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { addUser } from "../redux/userSlice";
// import { Toaster } from "react-hot-toast";

const Body = () => {
  const userData = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const fetchUser = async () => {
    if (userData) return;
    try {
      const res = await axios.get(BASE_URL + "/user/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(res.data));
    } catch (err) {
      if (err.status === 401) {
        Navigate("/signup");
      }
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Toaster /> */}
      <Header />
      <div
        className="flex-1 bg-no-repeat h-screen w-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <Outlet />
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default Body;
