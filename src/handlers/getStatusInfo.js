export const getStatusInfo = (status) => {
  switch (status) {
    case "1":
      return { labelStatus: 'Design', colorStatus: 'blue' };
    case "2":
      return { labelStatus: 'Development', colorStatus: 'green' };
    case "3":
      return { labelStatus: 'Testing', colorStatus: 'orange' };
    case "4":
      return { labelStatus: 'Promote', colorStatus: 'purple' };
    case "5":
      return { labelStatus: 'PIR', colorStatus: 'pink' };
    case "6":
      return { labelStatus: 'Go Live', colorStatus: 'teal' };
    case "7":
      return { labelStatus: 'Requirement', colorStatus: 'indigo'}
    default:
      return { labelStatus: 'Unknown Status', colorStatus: 'gray' };
  }
};

export default getStatusInfo;