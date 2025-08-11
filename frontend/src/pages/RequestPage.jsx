import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from ".././redux/requestSlice";
import { useEffect } from "react";

const RequestPage = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();

  const reviewRequest = async (status, _id) => {
    try {
      const res = axios.patch(
        BASE_URL + "/connectionrequest/acceptOrReject/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      console.log(res.data);
      dispatch(removeRequest(_id));
    } catch (err) {
      console.log(err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/connection/request/received", {
        withCredentials: true,
      });

      dispatch(addRequests(res.data.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return;

  if (requests.length === 0)
    return (
      <h1 className="text-center text-5xl text-white font-bold mt-50">
        No Request Found!
      </h1>
    );

  return (
    <div className="text-center mt-30">
      <h1 className="text-bold text-white text-3xl">Connection Request</h1>

      {requests.map((request) => {
        const {
          _id,
          firstName,
          lastName,
          profileImageURL,
          username,
          department,
        } = request.fromUserId;

        return (
          <div
            key={_id}
            className="flex m-6 p-6 rounded-xl bg-black/60 backdrop-blur-md w-[60%] mx-auto items-center shadow-2xs hover:shadow-2xl shadow-cyan-300 transition-shadow duration-300"
          >
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
                onClick={() => reviewRequest("accepted", request._id)}
                className="px-8 py-3 font-semibold rounded-md bg-gradient-to-r from-[#3bf2ff] to-[#404647] hover:scale-105 text-white shadow-md hover:opacity-90 transition cursor-pointer"
                aria-label={`Accept request from ${firstName} ${lastName}`}
              >
                Accept
              </button>
              <button
                onClick={() => reviewRequest("rejected", request._id)}
                className="px-8 py-3 font-semibold rounded-md bg-gradient-to-r from-[#3bf2ff] to-[#404647] hover:scale-105 text-white shadow-md hover:opacity-90 transition cursor-pointer"
                aria-label={`Reject request from ${firstName} ${lastName}`}
              >
                Reject
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default RequestPage;
