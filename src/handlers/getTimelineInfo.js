export const getTimelineInfo = (timeline) => {
  switch (timeline){
    case "1":
      return { label: "Q1 - 2024", color: 'blue-gray'};
    case "2":
      return { label: "Q2 - 2024", color: 'blue-gray'};
    case "3":
      return { label: "Q3 - 2024", color: 'blue-gray'};
    case "4":
      return { label: "Q4 - 2024", color: 'blue-gray'};
    default:
      console.warn(`Unknown timeline value: ${timeline}`);
      return { label: "Unknown", color: 'gray'};
  }
}

export default getTimelineInfo;