import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { IsLogin, Role, Name } from "./context";
import { useEffect, useState } from "react";
import  CheckToken  from "./api/auth/checkToken";
import { getCookie } from "cookies-next";


function App() {
  const [isLogin, setIsLogin] = useState(null);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  

  useEffect(() => {
    const checkToken = async () => {
      if(getCookie('token')){
        const res = await CheckToken(getCookie('token'))
        if(res){
          if(res.status === '200'){
            setIsLogin(true)
            setRole(res.data.role)
            setName(res.data.name)   
          }
        }
      }
    }
    
    checkToken()
  }, [])

  return (
    <IsLogin.Provider value={isLogin}>
      <Role.Provider value={role}>
        <Name.Provider value={name}>
          <Routes>
            <Route path="/dnm-ncm/*" element={<Dashboard />} />
            <Route path="/auth/*" element={<Auth />} />
            <Route path="*" element={<Navigate to="/dnm-ncm/project" replace />} />
          </Routes>
        </Name.Provider>
      </Role.Provider>
    </IsLogin.Provider>
  );
}

export default App;
