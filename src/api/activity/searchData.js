export default async function searchData( title, category, subCategory ) {

  let url = `${import.meta.env.VITE_HOST}/${import.meta.env.VITE_VERSION}/primary/dnm/search?title=${title}&category=${category}`;
  if (subCategory !== null) {
      url += `&subCategory=${subCategory}`;
  }
  try {
    const res = await fetch(url,
      {
        method: "GET",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          // ...(auth ? { Authorization: auth } : {}),
        },
      }
    )
    .then((res) => res.json());
      if (res.status === 200) {
        return { status: "200", data: res.data };
      }
  } catch {
    return { status: "err" };
  }
}
