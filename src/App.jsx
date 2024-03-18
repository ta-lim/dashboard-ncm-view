import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { IsLogin } from "./context";
import { useEffect, useState } from "react";
import  CheckToken  from "./api/auth/checkToken";
import { getCookie } from "cookies-next";


function App() {
  const [isLogin, setIsLogin] = useState(null);
  

  useEffect(() => {
    const checkToken = async () => {
      if(getCookie('token')){
        const res = await CheckToken(getCookie('token'))
        if(res){
          console.log(res)
          if(res.status === '200'){
            setIsLogin(true)
          }
        }
      }
    }
    
    checkToken()
  }, [])

  return (
    <IsLogin.Provider value={isLogin}>
      <Routes>
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/auth/*" element={<Auth />} />
        <Route path="*" element={<Navigate to="/dashboard/project" replace />} />
      </Routes>
    </IsLogin.Provider>
  );
}

export default App;
