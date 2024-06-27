import {
  ClipboardDocumentListIcon,
  CalendarIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  UsersIcon
} from "@heroicons/react/24/solid";
import { Home} from "@/pages/dashboard";
import { SignIn } from "@/pages/auth";
import Kpi from "./pages/dashboard/kpi";
import KpiAtm from "./pages/dashboard/kpiAtm";
import KpiEdc from "./pages/dashboard/kpiEdc";
import KpiHandlingComplain from "./pages/dashboard/kpiHandlingComplain";
import ManageUsers from "./pages/dashboard/manageUsers";


const icon = {
  className: "w-5 h-5 text-inherit",
};

const path = ['project', 'activity', 'business-plan']

export const routes = [
  {
    layout: "dnm-ncm",
    pages: [
      {
        icon: <ClipboardDocumentListIcon {...icon} />,
        name: "Project",
        path: "/project",
        element: <Home />,
      },
      {
        icon: <CalendarIcon {...icon} />,
        name: "Activity",
        path: "/activity",
        element: <Home />,
      },
      {
        icon: <ChartBarIcon {...icon} />,
        name: "Project Business Plan",
        path: "/business-plan",
        element: <Home />,
      },
      {
        icon: <ArrowTrendingUpIcon {...icon} />,
        name: "KPI Rekon",
        path: "/kpi-rekon",
        element: <Kpi />,
      },
      {
        icon: <ArrowTrendingUpIcon {...icon} />,
        name: "KPI ATM CRM",
        path: "/kpi-atm",
        element: <KpiAtm />,
      },
      {
        icon: <ArrowTrendingUpIcon {...icon} />,
        name: "KPI Handling Complain",
        path: "/kpi-complain",
        element: <KpiHandlingComplain />,
      },
      {
        icon: <ArrowTrendingUpIcon {...icon} />,
        name: "KPI EDC Performance",
        path: "/kpi-edc",
        element: <KpiEdc />,
      },
      {
        icon: <UsersIcon {...icon} />,
        name: "Manage User",
        path: "/manage-user",
        element: <ManageUsers />,
        allowedRoles: ["super admin"],
      }
    ],

  },
  {
    layout: "auth",
    pages: [
      {
        path: "/sign-in",
        element: <SignIn />,
      },
    ],
  },
];

export default routes;
