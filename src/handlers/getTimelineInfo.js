export const getTimelineInfo = (timeline) => {
  switch (timeline){
    case "1":
      return { labelTimeline: "Q1 - 2024", colorTimeline: 'blue-gray'};
    case "2":
      return { labelTimeline: "Q2 - 2024", colorTimeline: 'blue-gray'};
    case "3":
      return { labelTimeline: "Q3 - 2024", colorTimeline: 'blue-gray'};
    case "4":
      return { labelTimeline: "Q4 - 2024", colorTimeline: 'blue-gray'};
    default:
      console.warn(`Unknown timeline value: ${timeline}`);
      return { labelTimeline: "Unknown", colorTimeline: 'gray'};
  }
}

export default getTimelineInfo;