export const getTimelineInfo = (timeline) => {
  switch (timeline){
    case "1":
      return { labelTimeline: "Q1 - 2024", colorTimeline: 'teal'};
    case "2":
      return { labelTimeline: "Q2 - 2024", colorTimeline: 'amber'};
    case "3":
      return { labelTimeline: "Q3 - 2024", colorTimeline: 'orange'};
    case "4":
      return { labelTimeline: "Q4 - 2024", colorTimeline: 'green'};
    default:
      console.warn(`Unknown timeline value: ${timeline}`);
      return { labelTimeline: "Unknown", colorTimeline: 'gray'};
  }
}

export default getTimelineInfo;