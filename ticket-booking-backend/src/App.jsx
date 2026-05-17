import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

// Common Pages
import Login from "./Pages/CommonPages/Login";
import Register from "./Pages/CommonPages/Register";
import Unauthorized from "./Pages/CommonPages/Unauthorized";
import NotFound from "./Pages/CommonPages/NotFound";

// User Pages
import Dashboard from "./Pages/UserPages/Dashboard";
import MyBookings from "./Pages/UserPages/MyBookings";
import Profile from "./Pages/UserPages/Profile";
import Events from "./Pages/UserPages/Events";

// Admin Pages
import AdminDashboard from "./Pages/AdminPages/Dashboard";
import AdminBookings from "./Pages/AdminPages/Bookings";
import AdminEvents from "./Pages/AdminPages/Events";

// Layouts
import UserLayout from "./Layout/UserLayout";
import AdminLayout from "./Layout/AdminLayout";
import AuthGuard from "./Guards/AuthGuard";
import RoleIndex from "./Guards/RoleIndex";

function App() {
  const router = createBrowserRouter([
    // ---------- PUBLIC ROUTES ----------
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    // ---------- PROTECTED ROOT ----------
    {
      path: "/",
      element: (
        <AuthGuard requireAuth={true}>
          <RoleIndex />
        </AuthGuard>
      ),
    },
    // ---------- USER ROUTES ----------
    {
      path: "/user",
      element: <UserLayout />,
      children: [
        { path: "dashboard", element: <Dashboard /> },
        // { path: "my-bookings", element: <MyBookings /> },
        { path: "profile", element: <Profile /> },
        // { path: "events", element: <Events /> },
      ],
    },

    // ---------- ADMIN ROUTES ----------
    // {
    //   path: "/admin",
    //   element: <AdminLayout />,
    //   children: [
    //     { path: "dashboard", element: <AdminDashboard /> },
    //     { path: "bookings", element: <AdminBookings /> },
    //     { path: "events", element: <AdminEvents /> },
    //   ],
    // },

    // ---------- OTHER ----------
    { path: "/unauthorized", element: <Unauthorized /> },
    { path: "*", element: <NotFound /> },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
