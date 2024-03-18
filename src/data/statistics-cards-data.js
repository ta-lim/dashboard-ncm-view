import {
  ClockIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ChartBarIcon,
  CheckBadgeIcon
} from "@heroicons/react/24/solid";

export const statisticsCardsData = [
  {
    color: "yellow",
    icon: ClockIcon,
    title: "Today's Status",
    label: " On Progress",
    status: "onProgress",
    footer: {
      color: "text-green-500",
      value: "+55%",
      label: "than last week",
    },
  },
  {
    color: "red",
    icon: ExclamationCircleIcon,
    title: "Today's status",
    label: " Pending",
    status: "pending",
    footer: {
      color: "text-green-500",
      value: "+3%",
      label: "than last month",
    },
  },
  {
    color: "green",
    icon: CheckCircleIcon,
    title: "Today's status",
    label: " Done",
    status: 'done',
    footer: {
      color: "text-red-500",
      value: "-2%",
      label: "than yesterday",
    },
  },
  {
    color: "gray",
    icon: CheckBadgeIcon,
    title: "Total",
    label: " in Total",
    status: "total",
    footer: {
      color: "text-green-500",
      value: "+5%",
      label: "than yesterday",
    },
  },
];

export default statisticsCardsData;
