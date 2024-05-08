export default async function searchFilter( data, category, subCategory ){
  console.log(data)

  try{
      let queryString = '';

        // Iterate over each filter object in the input data
        data.forEach(filter => {
            // Extract the filter key and value
            const key = Object.keys(filter)[0];
            const value = filter[key][0];

            // Append the filter to the query string
            queryString += `&${key}=${value}`;
        });

        // Remove the leading '&' character from the query string
        queryString = queryString.slice(1);
      if(queryString !== ''){
        const res = await fetch(`${import.meta.env.VITE_HOST}/${import.meta.env.VITE_VERSION}/primary/dnm/filter?${queryString}&category=${category}&subCategory=${subCategory}`,
          {
            method: "GET",
            headers: {
              'Accept': '*/*',
              'Content-Type': 'application/json',
              // 'Authorization': auth,
            },
            // body: JSON.stringify(data),
          }
        ).then( (res) => res.json());
        
        if(res){
          if(res.status === 200){
            // console.log(res)
            return {status: '200', data: res.data};
          }
        }
      }

  } catch {
    return {status : 'err'}
  }
}