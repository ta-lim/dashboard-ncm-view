export const getStatusInfo = (status) => {
  switch (status) {
    case "1":
      return { labelStatus: 'Design', colorStatus: 'bg-yellow-700' };
    case "2":
      return { labelStatus: 'Development', colorStatus: 'bg-light-blue-400' };
    case "3":
      return { labelStatus: 'Testing', colorStatus: 'bg-light-blue-400' };
    case "4":
      return { labelStatus: 'Promote', colorStatus: 'bg-deep-purple-400' };
    case "5":
      return { labelStatus: 'PIR', colorStatus: 'bg-deep-purple-400' };
    case "6":
      return { labelStatus: 'Go Live', colorStatus: 'bg-green-500' };
    case "7":
      return { labelStatus: 'Requirement', colorStatus: 'bg-red-500'};
    case "8":
      return { labelStatus: 'Pending', colorStatus: 'bg-red-500'};
    case "9":
      return { labelStatus: 'On Progress', colorStatus: 'bg-yellow-700'};
    case "10":
      return { labelStatus: 'Done', colorStatus: 'bg-green-500'}
    default:
      return { labelStatus: 'Unknown Status', colorStatus: 'gray' };
  }
};

export default getStatusInfo;