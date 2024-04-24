import fileDownload from 'js-file-download'
export default async function downloadXls( category, auth ) {
  const categoryNames = {
    "1": "Project",
    "2": "Activity",
    "3": "Business Plan"
  };
  try {
    const res = await fetch(import.meta.env.VITE_HOST + '/' + import.meta.env.VITE_VERSION +'/primary/dnm/download?category=' + category ,
      {
        method: "GET",
        headers: {
          Accept: "*/*",
          ...(auth ? { Authorization: auth } : {}),
        },
      }
    )
    if (res.status === 200) {
      const blob = await res.blob();
      fileDownload(blob, `Data_${ categoryNames[category] }.xlsx`)
      return { status: "200"};
    }
  } catch {
    return { status: "err" };
  }
}
