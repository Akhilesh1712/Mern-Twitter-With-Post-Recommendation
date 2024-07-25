import { Navigate, Route, Routes } from "react-router-dom"
import HomePage from "./pages/home/HomePage"
import SignUpPage from "./pages/auth/signup/SignUpPage"
import LoginPage from "./pages/auth/login/LoginPage"
import Sidebar from "./components/common/Sidebar"
import RightPanel from "./components/common/RightPanel"
import NotificationPage from "./pages/notification/NotificationPage"
import ProfilePage from "./pages/profile/ProfilePage"
import {Toaster} from "react-hot-toast";
import { useQuery } from "@tanstack/react-query"
import LoadingSpinner from "./components/common/LoadingSpinner"

function App() {
     //below finction is use to getme from backend (all details of login user) , user login hoga tabhi
      const {data: authUser,isLoading,error} = useQuery({
        queryKey: ['authUser'], // passing query key so on other files can refer to this query (maltab ye auth walla function har jaghe bannne ke jarut nhi padegi)
        queryFn: async() => {
          try {
            const res = await fetch("/api/auth/getme");
            const data = await res.json();
            if(data.error) return null; //ye logout ke liye vo authuser ko undefined ker dega to ham null ker dete hai and fir vo login page per chala jayega
            if(!res.ok){
              throw new Error(data.error || "Something went wrong in it");
            }
            console.log(data);
            return data;
          } catch (error) {
            throw new Error(error)
          }
        },
        retry: false, //ak bar hi kare ga
      });

      if(isLoading){
        return (
          <div className="h-screen flex justify-center items-center">
                  <LoadingSpinner size="lg" />
          </div>
        )
      }

      return (
        <div className='flex max-w-6xl mx-auto'>
          {authUser && <Sidebar />}
          <Routes>
            <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />} />
            <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
            <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
            <Route path='/notifications' element={authUser ? <NotificationPage /> : <Navigate to="/login" />} />
            <Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
          </Routes>
          {authUser && <RightPanel />}
          <Toaster />
        </div>
      );
}

export default App
