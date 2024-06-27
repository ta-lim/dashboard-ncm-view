import { Routes, Route } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "@/widgets/layout";
import routes from "@/routes";
import { ProjectDetail } from "@/pages/dashboard";
import { ProjectForm } from "@/pages/dashboard";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";
import KpiForm from "@/pages/dashboard/kpiForm";
import KpiFormUpTimeATM from "@/pages/dashboard/kpiFormUpTimeATM";
import KpiFormHandlingComplain from "@/pages/dashboard/kpiFormHandlingComplain";
import KpiFormAtm from "@/pages/dashboard/kpiFormAtm";
import KpiFormEDC from "@/pages/dashboard/kpiFormEDC";


export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav
        routes={routes}
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
      />
      <div className="p-4 xl:ml-72">
        <DashboardNavbar />
        <Configurator />
        <IconButton
          size="lg"
          color="white"
          className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
          ripple={false}
          onClick={() => setOpenConfigurator(dispatch, true)}
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton>
        <Routes>
          {routes.map(
            ({ layout, pages }) =>
              layout === "dnm-ncm" &&
              pages.map(({ path, element }) => (
                <Route path={path} element={element} />
              ))
          )}
          <Route path="/project/:id" element={<ProjectDetail />}/>
          <Route path="/project/edit/:id" element={<ProjectForm />} />
          <Route path="/project/upload" element={<ProjectForm />} />
          <Route path="/activity/:id" element={<ProjectDetail />}/>
          <Route path="/activity/edit/:id" element={<ProjectForm />} />
          <Route path="/activity/upload" element={<ProjectForm />} />
          <Route path="/business-plan/:id" element={<ProjectDetail />}/>
          <Route path="/business-plan/edit/:id" element={<ProjectForm />} />
          <Route path="/business-plan/upload" element={<ProjectForm />} />
          <Route path="/kpi-rekon/upload/*" element={<KpiForm />} />
          <Route path="/kpi-atm/upload/*" element={<KpiFormAtm />} />
          <Route path="/kpi-atm/upload/uptime-atm" element={<KpiFormUpTimeATM />} />
          <Route path="/kpi-complain/upload/*" element={<KpiFormHandlingComplain />} />
          <Route path="/kpi-edc/upload/*" element={<KpiFormEDC />} />
          {/* <Route path="/kpi-edc/upload/availibility-edc" element={<KpiFormEDC />} /> */}
          {/* <Route path="/kpi-atm/upload/uptime-atm" element={<KpiFormUpTimeATM />} /> */}
        </Routes>
        <div className="text-blue-gray-600">
          <Footer />
        </div>
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
