import {
  ClipboardDocumentListIcon,
  CalendarIcon,
  ChartBarIcon
} from "@heroicons/react/24/solid";
import { Home, ProjectForm, ProjectDetail } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import { PlusIcon } from "@heroicons/react/24/outline";
import Activities from "./pages/dashboard/activities";

const icon = {
  className: "w-5 h-5 text-inherit",
};

const path = ['project', 'activity', 'business-plan']

export const routes = [
  {
    layout: "dashboard",
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
        name: "Business Plan",
        path: "/business-plan",
        element: <Home />,
      },
    ],

  },
  {
    // title: "auth pages",
    layout: "auth",
    pages: [
      {
        // icon: <CalendarIcon {...icon} />,
        // name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      // {
      //   // icon: <CalendarIcon {...icon} />,
      //   // name: "sign up",
      //   path: "/sign-up",
      //   element: <SignUp />,
      // },
    ],
  },
];

export default routes;
