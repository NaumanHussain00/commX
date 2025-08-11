import { Toaster } from "react-hot-toast";
import SignUpPage from "./pages/SignUpPage";
import { Provider } from "react-redux";
import { createBrowserRouter, Outlet } from "react-router-dom";
import Header from "./components/Header";
import Error from "./components/Error";
import Body from "./components/Body";
import ChatPage from "./pages/ChatPage";
import EditProfilePage from "./pages/EditProfilePage";
import Profile from "./pages/Profile";
import ConnectionsPage from "./pages/ConnectionsPage";
import RequestPage from "./pages/RequestPage";
import AllUsers from "./pages/AllUsers";

const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <Body />,
    children: [
      {
        path: "/",
        element: <ChatPage />,
      },
      {
        path: "/signup",
        element: <SignUpPage />,
      },
      {
        path: "/profile/edit",
        element: <Profile />,
      },
      {
        path: "/connections",
        element: <ConnectionsPage />,
      },
      {
        path: "/requests",
        element: <RequestPage />,
      },
      {
        path: "/allusers",
        element: <AllUsers />,
      },
    ],
  },
]);

export default AppRouter;
