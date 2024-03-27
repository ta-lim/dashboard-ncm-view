import RefreshToken from "@/api/auth/refreshToken";
import { getCookie, setCookie, deleteCookie } from "cookies-next";



export async function getNewToken(event) {
  const res = await RefreshToken(getCookie('token'), getCookie('refreshToken'));

  if(res.status === '200'){
    setCookie('token', res.data.token)
    setCookie('refreshToken', res.data.refreshToken)

    event();
    return;
  }else{
    deleteCookie('token');
    deleteCookie('refreshToken');
    return;
  }
}