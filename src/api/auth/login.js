export default async function login( data ){
  const res = await fetch(import.meta.env.VITE_HOST + '/' + import.meta.env.VITE_VERSION + '/primary/auth/login', 
  {
    method: 'POST',
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  }).then((res) => res.json());

  if(res) {
    if(res.status === 200) {
      return {status: "200", data: res.data}
    }
    return {status: res.status, err: res.err, message: res.message}
  }
}