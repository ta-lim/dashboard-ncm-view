export default async function CheckToken(auth){
  try{
    const res = await fetch(import.meta.env.VITE_HOST + '/' + import.meta.env.VITE_VERSION +'/primary/auth/check-token', 
    {
      method: 'GET',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json',
        'Authorization': auth,
      },
    }).then((res) => res.json());

    if(res) {
      if(res.status === 200) {
        return {status: '200', data: res.data};
      }
    }
  } catch (err) {
    return { status: err}
  }
}