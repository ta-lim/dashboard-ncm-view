export default async function createData( data, auth ){
  try{
    const res = await fetch(import.meta.env.VITE_HOST + '/' + import.meta.env.VITE_VERSION +'/primary/dnm/create',
      {
        method: "POST",
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
          'Authorization': auth,
        },
        body: JSON.stringify(data),
      }
    ).then( (res) => res.json());
    
    if(res){
      console.log(res)
      if(res.status === 200){
        return {status: '200', data: res};
      }
    }

  } catch {
    return {status : 'err'}
  }
}