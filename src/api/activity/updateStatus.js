export default async function updateStatus( data, auth ){
  try{
    const res = await fetch(import.meta.env.VITE_HOST + '/' + import.meta.env.VITE_VERSION +'/primary/dnm/update-status',
      {
        method: "PUT",
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
          'Authorization': auth,
        },
        body: JSON.stringify(data),
      }
    ).then( (res) => res.json());
    
    if(res){
      if(res.status === 200){
        return {status: '200', data: res};
      }
    }

  } catch {
    return {status : 'err'}
  }
}