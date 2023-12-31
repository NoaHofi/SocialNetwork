import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Admin from "./pages/admin/admin";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import LeftBar from "./components/leftBar/LeftBar";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import "./style.scss";
import { useContext, useEffect} from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { QueryClient , QueryClientProvider } from "react-query"; 
import Readme from "./components/Readme";

function App() {
  const { darkMode } = useContext(DarkModeContext);


  const queryClient = new QueryClient()

  useEffect(() => {
    document.title = "SportyNet";
  }, []); 


  const Layout = () => {
    return (
      <QueryClientProvider client={queryClient}>
      <div className={`theme-${darkMode ? "dark" : "light"}`}>
        <Navbar />
        <div style={{ display: "flex" }}>
          <LeftBar />
          <div style={{ flex: 6 }}>
            <Outlet />
          </div>
        </div>
      </div>
      </QueryClientProvider>
    );
  };

  const ProtectedRoute = ({ children, role }) => {
    return children;
  };
  

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          index: true,
          element: <Navigate to="/login" />
        },
        {
          path: "/home",
          element: <Home />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/admin",
      element: (
          <Admin />
      ),
    },
    {
      path: "/readme",
      element: <Readme />,
    }
    
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
