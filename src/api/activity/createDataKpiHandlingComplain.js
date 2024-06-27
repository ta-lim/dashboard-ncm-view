export default async function createDataKpiHandlingComplain( data, auth, category){
  try{
    let url = `${import.meta.env.VITE_HOST}/${import.meta.env.VITE_VERSION}/primary/kpi/create-handling-complain?kpi=${category}`
    const res = await fetch(url,
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
      if(res.status === 200){
        return {status: '200', data: res};
      }
    }

  } catch {
    return {status : 'err'}
  }
}