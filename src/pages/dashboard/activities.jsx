import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  Progress,
  Chip,
} from "@material-tailwind/react";
import {
  PlusIcon,
  EllipsisVerticalIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import {
  statisticsCardsData,
  statisticsChartsData,
  projectsTableData,
  ordersOverviewData,
} from "@/data";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import { Link,useLocation } from "react-router-dom";

export function Activities() {
  const [data, setData] = useState([]);
  const location = useLocation();
  const isBusinessPlanPath = location.pathname.includes('business-plan') 
  
  useEffect(() => {
    const fetchData = async () =>  {
      try {
        const res = await fetch('http://localhost:8080/api/project/')
        const result = await res.json();
        setData(result)
      }catch (err){
        console.log(err)
      }
    }
    fetchData();
  }, [])
console.log(data)
  return (
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        {statisticsCardsData.map(({ icon, title, footer, ...rest }) => (
          <StatisticsCard
            key={title}
            {...rest}
            title={title}
            icon={React.createElement(icon, {
              className: "w-6 h-6 text-white",
            })}
          />
        ))}
      </div>
      <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-1">
        <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-start gap-4 p-6"
          >
            <div className=" cursor-pointer">
              <Typography variant="h6" color="blue-gray" className="mb-1">
                Projects
              </Typography>
            </div>
            {/* {
            contentFilter === 0 ? (
              <Project />
            ) : contentFilter === 1 ? (
              <User />
            ) : null
          } */}
            {isBusinessPlanPath ? (
              <>
              <div className=" cursor-pointer">
                <Typography variant="h6" color="blue-gray" className="mb-1">
                  RPA
                </Typography>
              </div>
              <div className=" cursor-pointer">
                <Typography variant="h6" color="blue-gray" className="mb-1">
                  City Net
                </Typography>
              </div>
              <div className=" cursor-pointer">
                <Typography variant="h6" color="blue-gray" className="mb-1">
                  EUC
                </Typography>
              </div>
              <div className=" cursor-pointer">
                <Typography variant="h6" color="blue-gray" className="mb-1">
                  Pelatihan
                </Typography>
              </div>
              </>

            ) : null
            }
            <Menu placement="left-start">
              <MenuHandler>
              <Link to={`../upload`}>
                  <IconButton size="sm" variant="text" color="blue-gray" onClick={() => console.log("tambah")}>
                    <PlusIcon
                      strokeWidth={3}
                      fill="currenColor"
                      className="h-6 w-6"
                      />
                  </IconButton>
                </Link>
              </MenuHandler>
            </Menu>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["Project", "PIC", "UIC","Description","CR No", "Status", 'Timeline'].map(
                    (el) => (
                      <th
                        key={el}
                        className="border-b border-blue-gray-50 py-3 px-6 text-left"
                      >
                        <Typography
                          variant="small"
                          className="text-[11px] font-medium uppercase text-blue-gray-400"
                        >
                          {el}
                        </Typography>
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {data.map(
                  ({ id, title, picOne, picTwo, UIC, description, crNumber, status, timeline, category }, key) => {
                    const className = `py-3 px-5 ${
                      key === data.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;

                    return (
                      <tr key={key}>
                        <td className={`cursor-pointer ${className}`} onClick={() => {console.log('access profile')}} >
                          <Link to={`../project/${id}`}>
                            <Typography
                              variant="small"
                              className="text-xs font-medium text-blue-gray-600"
                              >
                              {title}
                            </Typography>
                          </Link>
                        </td>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            {/* <Avatar src={img} alt={picOne} size="sm" /> */}
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-bold"
                            >
                              {picOne} {picTwo}
                            </Typography>
                          </div>
                        </td>
                        <td className={className}>
                          <Typography
                            variant="small"
                            className="text-xs font-medium text-blue-gray-600"
                          >
                            {UIC}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography
                            variant="small"
                            className="text-xs font-medium text-blue-gray-600"
                          >
                            {description}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography
                            variant="small"
                            className="text-xs font-medium text-blue-gray-600"
                          >
                            {crNumber}
                          </Typography>
                        </td>
                        <td className={className}>
                          <div className="w-10/12">
                            <Typography
                              variant="small"
                              className="mb-1 block text-xs font-medium text-blue-gray-600"
                            >
                              <Chip 
                                size="sm" 
                                variant="gradient" 
                                value={
                                  <Typography
                                    variant="small"
                                    color="white"
                                    className="font-medium capitalize leading-none"
                                  >
                                    {status}
                                  </Typography>
                                } 
                                className="flex rounded-full items-center"/>
                            </Typography>
                          </div>
                        </td>
                        <td className={className}>
                          <Typography
                            variant="small"
                            className="text-xs font-medium text-blue-gray-600"
                          >
                            {timeline}
                          </Typography>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default Activities;
