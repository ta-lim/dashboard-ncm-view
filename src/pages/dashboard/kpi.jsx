import React, { useContext, useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  IconButton,
  Menu,
  MenuHandler,
  Chip,
  Button,
  Input,
  Select,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Checkbox,
  Option,
  List,
  ListItem,
  ListItemPrefix,
  Carousel,
} from "@material-tailwind/react";
import {
  PlusIcon,
  UserCircleIcon,
  DocumentArrowDownIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/widgets/cards";
import { statisticsCardsData } from "@/data";
import { Link, useLocation } from "react-router-dom";
import getData from "@/api/activity/getData";
import getStatusInfo from "@/handlers/getStatusInfo";
import getTimelineInfo from "@/handlers/getTimelineInfo";
import { IsLogin } from "@/context";
import { getCookie, setCookie } from "cookies-next";
import GetAnalyze from "@/api/activity/getAnalyze";
import searchData from "@/api/activity/searchData";
import downloadXls from "@/api/activity/downloadXls";
import updateStatus from "@/api/activity/updateStatus";
import getMasterDataFilter from "@/api/activity/getMasteraDataFilter";
import searchFilter from "@/api/activity/searchFilter";
import Chart from "react-apexcharts";
import getKpiRetail from "@/api/activity/getKpiRitel";
import getKpiTrxSettle from "@/api/activity/getKpiTrxSettle";
import GetAnalyzeKpi from "@/api/activity/getAnalyzeKpi";





export function Kpi() {
  const [data, setData] = useState([]);
  const isLogin = useContext(IsLogin);
  const [dataAnalyze, setDataAnalyze] = useState([]);
  const [handleOpenFilter, setHandleOpenFilter] = useState(false);
  const [spesificKpi, setSpesificKpi] = useState(0);

  const [loading, setLoading] = useState(true);

  const categoryKpi = spesificKpi === 0 ? "categoryJaringan" : spesificKpi === 1 ? "categoryOpsRetail" : spesificKpi === 2 ? "categoryTrxDefect" : null;
  

  async function getAnalyze() {
    const res = await GetAnalyzeKpi();
    if (res) {
      if (res.status === "200") {
        setDataAnalyze(res.data);
        // setDataAnalyzeRank(res.data.summaryRank);
      }
    }
  }

  async function getAllData() {
    const res = await getKpiTrxSettle(spesificKpi)
    if (res) {
      if (res.status === "200") {
        setData(res.data)
        setLoading(false)
      }
    }
  }

  async function getMasterData() {
    const res = await getMasterDataFilter(isBusinessPlanPath ? "3" : isActivityPath ? "2" : "1",
      isBusinessPlanPath ? spesificBusinessPlan + 1 : "-1")

    if (res.status === "200") {
      setMasterDataFilter(res.data)
    }
  }

  const getLabel = (key, value) => {
    switch (key) {
      case 'status':
        return getStatusInfo(value).labelStatus;
      case 'timeline':
        return getTimelineInfo(value).label
      default:
        return value;
    }
  };

  const handleCheckboxToggle = (key, value) => {
    setSelectedValues(prevState => ({
      ...prevState,
      [key]: {
        ...(prevState[key] || {}),
        [value]: !(prevState[key] && prevState[key][value])
      }
    }));
  };

  useEffect(() => {
    if (!getCookie("isReload") && getCookie("token")) {
      setCookie("isReload", "true");
      window.location.reload();
    }

    getAnalyze();
    getAllData();
  }, [spesificKpi]);

  useEffect(() => {
    if (handleOpenFilter) {
      getMasterData()
    }
  }, [handleOpenFilter])

  const chartConfig = (dataset, index) => {
      function formatDateToMMMMYYYY(dateString) {
      const date = new Date(dateString);
      const formatter = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long' });
      return formatter.format(date);
    }
    const formattedPeriods = data.periods.map(formatDateToMMMMYYYY);
    return ({
      height: 250,
      series: [{
        name: "Item Trx",
        data: dataset.data.itemTrx,
        type: "column"
      }, {
        name: "Percentage SLA",
        data: dataset.data.percentageSLA,
        type: "line"
      }
      ],
      options: {
        chart: {
          toolbar: {
            show: false,
          },
        },
        title: {
          text: `${data.category[index][categoryKpi]} / ${index+1}`,
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [1]
        },
        // colors: ["#020617", "#ff8f00", "#00897b", "#1e88e5", "#d81b60"],
        // colors: ["#ff8f00", "#ff6600", "#ffaa33", "#ff8000"],
        // colors: ["#009c8f", "#00afa3", "#00c2b7", "#00e8df", "#00897b"],
        colors: ["#fdd835", "#e53935", "#43a047"],
        plotOptions: {
          bar: {
            columnWidth: "40%",
            // distributed: true,
            borderRadius: 1,
          },
        },
        xaxis: {
          axisTicks: {
            show: false,
          },
          axisBorder: {
            show: false,
          },
          labels: {
            show: true,
          },
          categories: formattedPeriods,
        },
        yaxis: [{
          title: {
            text: "Item Transaction"
          },
          labels:{
            formatter: (val) => {
              return val / 1000 + ' K'
            }
          }
        }, {
          title: {
            text: "Percentage SLA (%)"
          },
          opposite: true
        }],
        grid: {
          show: true,
          borderColor: "#dddddd",
          strokeDashArray: 8,
          xaxis: {
            lines: {
              show: false,
            },
          },
          padding: {
            top: 5,
            right: 20,
          },
        },
        stroke: {
          curve: 'smooth'
        },
        fill: {
          opacity: 0.8,
        },
        legend: {
          show: false,
        },
      },
    })
  };

  const chartConfigSummary = (dataset, index) => {
    function formatDateToMMMMYYYY(dateString) {
      const date = new Date(dateString);
      const formatter = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short' });
      return formatter.format(date);
    }
    const formattedPeriods = dataset.data.dateTrx.map(formatDateToMMMMYYYY);
    return ({

      height: 250,
      series: [{
        name: "Item Trx",
        data: dataset.data.totalItemTrx,
        type: "column"
      },{
        name: "Percentage Trx",
        data: dataset.data.percentageSLA,
        type: "line"
      }
      ],
      options: {
        chart: {
          toolbar: {
            show: false,
          },
        },
        dataLabels: {
          enabled: true,
          
          enabledOnSeries: [1]
        },
        colors: ["#fdd835", "#e53935", "#43a047"],
        plotOptions: {
          bar: {
            columnWidth: "40%",
            borderRadius: 1,
          },
        },
        xaxis: {
          axisTicks: {
            show: false,
          },
          axisBorder: {
            show: false,
          },
          labels: {
            show: true,
          },
          categories: formattedPeriods,
        },
        yaxis: [{
          title: {
            text: "Item Transaction"
          },
          labels: {
            formatter: (val) => {
              return val / 1000 + ' K'
            }
          }
        }, {
          title: {
            text: "Percentage SLA (%)"
          },
          opposite: true
        },],
        grid: {
          show: true,
          borderColor: "#dddddd",
          strokeDashArray: 8,
          xaxis: {
            lines: {
              show: false,
            },
          },
          padding: {
            top: 5,
            right: 20,
          },
        },
        stroke: {
          curve: 'smooth'
        },
        fill: {
          opacity: 0.8,
        },
        legend: {
          show: false,
        },
      },
    })
  };

  const projects = ["Rekonsiliasi", "Opersional Ritel", "Operasional Wholesale"];



  return (
    // <SearchBar.Provider value={{ searchData, setSearchData }}>
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-1 xl:grid-cols-2">
        {
          dataAnalyze.length !== 0 && dataAnalyze.map((item, index) => {
            return (
              <Card className="border border-blue-gray-100 shadow-sm ">
                <CardBody className="p-4 text-left">
                  <Typography variant="small" className="font-normal text-blue-gray-600">
                    {/* {title} */}
                  </Typography>
                  <Typography variant="h4" color="blue-gray" className=" capitalize">
                    {/* {count}{status} */}
                    {projects[index]}
                  </Typography>
                  {/* {
            Object.keys(rank).length !== 0 && <Chart {...title === 'Total' ? { ...chartConfigTotal(rank) } : { ...chartConfig(rank) }} />
          } */}
                  {/* Ensure chartConfigSummary expects the correct format */}
                  {<Chart className="object-cover" key={index} {...chartConfigSummary(item)} />}
                </CardBody>
                {/* {footer && (
          <CardFooter className="border-t border-blue-gray-50 p-4">
            {footer}
          </CardFooter>
        )} */}
              </Card>
            )
          })
        }

      </div>
      <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-1">
        <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center gap-4 p-6"
          >
            <div className="flex items-center justify-between w-full gap-3 flex-wrap">
              <div
                className={` flex flex-wrap items-center gap-4 flex-1 `}
              >
                {
                  projects.map((project, index) => (
                    <div
                      key={index}
                      onClick={() => setSpesificKpi(index)}
                    >
                      <Button
                        color={
                          index === spesificKpi ? "dark" : "white"
                        }
                        className="flex items-center capitalize h-10 justify-center whitespace-nowrap cursor-pointer"
                      >
                        <Typography
                          variant="h6"
                          color={
                            index === spesificKpi ? "white" : "black"
                          }
                          className="mb-1 text-center"
                        >
                          {project}
                        </Typography>
                      </Button>
                    </div>
                  ))
                }
                {
                  isLogin && (
                    <div className={`flex items-start md:flex-1`}>
                      <Link to={`./upload/${spesificKpi === 0 ? "rekon" : spesificKpi === 1 ? "retail" : spesificKpi === 2 ? "wholesale" : ""}`}>
                        <IconButton
                          size="sm"
                          variant="text"
                          color="blue-gray"
                        >
                          <PlusIcon
                            strokeWidth={3}
                            fill="currenColor"
                            className="h-6 w-6"
                          />
                        </IconButton>
                      </Link>
                    <div
                      onClick={() =>
                        downloadXls(
                          isBusinessPlanPath ? "3" : isActivityPath ? "2" : "1",
                          getCookie("token"),
                        )
                      }
                      className=""
                    >
                      <IconButton size="sm" variant="text" color="blue-gray">
                        <DocumentArrowDownIcon
                          strokeWidth={2}
                          // fill="currenColor"
                          className="h-6 w-6"
                        />
                      </IconButton>
                    </div>
                    </div>
                    
                  )
                }
              </div>
            </div>
          </CardHeader>
          <div className="flex justify-center items-center">
            {/* <div className=" h-10">

            </div> */}
            <Carousel className=" rounded-xl overflow-y-hidden"
              prevArrow={({ handlePrev }) => (
                <IconButton
                  variant="text"
                  color="blue-gray"
                  size="lg"
                  onClick={handlePrev}
                  className="!absolute top-2/4 left-4 -translate-y-2/4"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                    />
                  </svg>
                </IconButton>
              )}
              nextArrow={({ handleNext }) => (
                <IconButton
                  variant="text"
                  color="blue-gray"
                  size="lg"
                  onClick={handleNext}
                  className="!absolute top-2/4 !right-4 -translate-y-2/4"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </IconButton>
              )}
            >
              {
                data.length !== 0 && data.datasets.map((item, key) => {
                  return (
                    <Card className=" w-full py-3 px-12">
                      <Chart className="object-cover" key={key} {...chartConfig(item, key)} />
                    </Card>
                  );
                })
              }
            </Carousel>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Kpi;
