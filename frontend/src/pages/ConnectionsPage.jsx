import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from ".././redux/connectionSlice";
import { Link, useNavigate } from "react-router-dom";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections);
  const Navigate = useNavigate();

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

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return;

  if (connections.length === 0)
    return (
      <h1 className="text-center text-5xl text-white font-bold mt-50">
        No Connections Found!
      </h1>
    );

  return (
    <div className="text-center mt-30">
      <h1 className="text-bold text-white text-4xl font-bold">Connections</h1>

      {connections.map((connection) => {
        const { firstName, lastName, profileImageURL, username, department } =
          connection;

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
                className="px-8 py-3 cursor-pointer font-semibold rounded-md bg-gradient-to-r from-[#3bf2ff] to-[#404647] hover:scale-105 text-white shadow-md hover:opacity-90 transition"
                onClick={() => Navigate("/")}
              >
                Message
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default Connections;
