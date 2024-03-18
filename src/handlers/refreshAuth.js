import RefreshToken from "@/api/auth/refreshToken";
import { Cookies } from "react-cookie";

export async function getNewToken(event) {
  const cookie = new Cookies()
  const res = await RefreshToken(cookie.get('token'), cookie.get('refreshToken'));

  if(res.status === '200'){
    cookie.set('token', res.data.token)
    cookie.set('refreshToken', res.data.refreshToken)

    event();
    return;
  }else{
    cookie.remove('token');
    cookie.remove('refreshToken');

    return;
  }
}