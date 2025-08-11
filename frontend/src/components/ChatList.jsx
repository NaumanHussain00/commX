import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addConnections } from "../redux/connectionSlice";
import { useEffect } from "react";
import axios from "axios";
import { addSelectedChat } from "../redux/selectedChatSlice";
import { useNavigate } from "react-router-dom";

const groups = [
  { id: 1, name: "Project Alpha", lastMessage: "Meeting at 5 PM" },
  { id: 2, name: "Dev Team", lastMessage: "Pushed new updates" },
];

const ChatList = () => {
  const connections = useSelector((store) => store.connections);
  const currentUser = useSelector((state) => state.user);
  const selectedChat = useSelector((store) => store.selectedChat);
  const Navigate = useNavigate();

  const dispatch = useDispatch();
  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/connection/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (err) {
      // Handle Error Case
      console.error(err);
    }
  };

  const handleUserClick = (connection) => {
    dispatch(addSelectedChat(connection));
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return;

  if (connections.length === 0)
    return (
      <div className="w-[21%] h-[calc(100vh-7rem)] overflow-y-auto flex flex-col gap-3">
        <div className="flex-1 bg-white/20  rounded-3xl backdrop-blur-md flex flex-col justify-center items-center text-white text-xl">
          <p className="mb-5 text-3xl">No Connections</p>
          <button
            onClick={() => Navigate("/allusers")}
            className="px-5 py-2 font-semibold rounded-md bg-gradient-to-r from-[#3bf2ff] to-[#404647] hover:scale-105 text-white shadow-md hover:opacity-90 transition"
          >
            + Add Connections
          </button>
        </div>
      </div>
    );
  return (
    <div className="w-[21%]  flex flex-col gap-3">
      {/* Connection Section */}
      <div className="bg-black/20 backdrop-blur-md h-[60%] overflow-y-auto p-4 rounded-3xl">
        <h2 className="text-white font-semibold text-lg ml-2 pb-3 mb-5 border-b border-cyan-500">
          Messages
        </h2>
        {connections.map((connection) => {
          const isSelected = selectedChat?._id === connection._id;
          return (
            <div
              key={connection._id}
              onClick={() => handleUserClick(connection)}
              className={`p-3 my-3 rounded-4xl flex gap-2 transition cursor-pointer ${
                isSelected
                  ? "bg-gradient-to-r from-[#3bf2ff] to-[#404647]"
                  : "hover:bg-white/20"
              }`}
            >
              <img
                src={connection.profileImageURL || "/default-avatar.png"}
                alt="profile"
                className="w-12 h-12 rounded-full object-cover"
              />

              <div>
                <p className="text-white font-medium">
                  {connection.firstName + " " + connection.lastName}
                </p>
                <p className=" text-sm font-medium text-white/80 ">
                  Send some Messages
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Groups Section */}
      <div className="bg-black/20 backdrop-blur-md h-[40%] p-4 rounded-xl">
        <h2 className="text-white font-semibold text-lg ml-2 pb-3 mb-5 border-b border-cyan-500">
          Groups
        </h2>
        {groups.map((group) => (
          <div
            key={group.id}
            className="p-2 rounded-lg hover:bg-white/20 transition cursor-pointer"
          >
            <p className="text-white font-medium">{group.name}</p>
            <p className="text-gray-300 text-sm">{group.lastMessage}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
