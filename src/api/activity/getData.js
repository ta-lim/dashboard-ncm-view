export default async function getData( category, subCategory = "" ) {
  let url = `${import.meta.env.VITE_HOST}/${import.meta.env.VITE_VERSION}/primary/dnm?category=${category}`;
  if (subCategory !== "-1") {
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
