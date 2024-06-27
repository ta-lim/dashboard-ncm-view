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
  ArrowLeftIcon,
  ArrowRightIcon
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
// import getKpiRetail from "@/api/activity/getKpiRitel";
// import getKpiTrxSettle from "@/api/activity/getKpiTrxSettle";

import GetAnalyzeKpi from "@/api/activity/getAnalyzeKpi";
import getKpiAtmCrm from "@/api/activity/getKpiAtmCrm";
import Kpi from "./kpi";





export function KpiAtm() {
  const location = useLocation();
  const [data, setData] = useState([]);
  const isLogin = useContext(IsLogin);
  const [dataSearch, setDataSearch] = useState("");
  const [dataAnalyze, setDataAnalyze] = useState([]);
  const [selectedValues, setSelectedValues] = useState({});
  const [dataAnalyzeRank, setDataAnalyzeRank] = useState([]);
  const [rowToggleStatus, setRowToggleStatus] = useState({});
  const [masterDataFilter, setMasterDataFilter] = useState([])
  const [handleOpenFilter, setHandleOpenFilter] = useState(false);
  const [spesificKpi, setSpesificKpi] = useState(0);

  const [loading, setLoading] = useState(true);

  const categoryKpi = spesificKpi === 0 ? "categoryJaringan" : spesificKpi === 1 ? "categoryOpsRetail" : spesificKpi === 2 ? "categoryTrxDefect" : null;


  // const isProjectPath = location.pathname.includes("project");
  // const isActivityPath = location.pathname.includes("activity");
  // const isBusinessPlanPath = location.pathname.includes("business-plan");

  const handleFilter = () => setHandleOpenFilter(!handleOpenFilter);

  // const category = isBusinessPlanPath
  //   ? "Business plan"
  //   : isActivityPath
  //     ? "Activity"
  //     : isProjectPath
  //       ? "Project"
  //       : "";


  const toggleRowStatus = (rowId) => {
    setRowToggleStatus((prevState) => ({
      ...prevState,
      [rowId]: !prevState[rowId], // Toggle the status for the specified row
    }));
  };

  const handleChange = async (e) => {
    const { id, name, value } = e.target;

    // Update the status in the state
    setData((prevData) => {
      const updatedData = prevData.map((item, idx) => {
        if (idx === parseInt(id)) {
          return { ...item, status: value };
        } else {
          return item;
        }
      });

      // Prepare the updated status object to send to the API
      const statusUpdate = {
        id: updatedData[id].id,
        status: value,
        category: updatedData[id].category,
        subCategory: updatedData[id].subCategory,
      };

      // Call the API to update the status
      updateStatus(statusUpdate, getCookie("token"))
        .then((res) => console.log(res))
        .catch((error) => console.error("Error updating status:", error));

      return updatedData;
    });
  };

  const remapData = (data) => {
    // Check if data is not an array or is undefined
    if (!Array.isArray(data) || data === undefined) {
      console.error("Input data is not an array or is undefined.");
      return []; // Return an empty array or handle this case based on your requirement
    }

    // Perform mapping operation on the array
    return data.map((item) => ({
      ...item,
      // statusInfo: getStatusInfo(item.status),
      timelineInfo: getTimelineInfo(item.timeline),
    }));
  };

  // const remapData = (remapData) => {

  //   return remapData.map((item) => ({
  //     ...item,
  //     // statusInfo: getStatusInfo(item.status),
  //     timelineInfo: getTimelineInfo(item.timeline),
  //   }));
  // };

  async function search() {
    const res = await searchData(dataSearch, isBusinessPlanPath ? "3" : isActivityPath ? "2" : "1",
      isBusinessPlanPath ? spesificBusinessPlan + 1 : "-1");

    if (res.status === "200") {
      setDataSearch("");
      let remappedData = remapData(res.data);
      setData(remappedData);
    }
  }

  async function searchFilterData(data) {
    const res = await searchFilter(data, isBusinessPlanPath ? "3" : isActivityPath ? "2" : "1",
      isBusinessPlanPath ? spesificBusinessPlan + 1 : "-1")

    if (res.status === "200") {
      // console.log(remappedData)
      let remappedData = remapData(res.data);
      // console.log(res.data)
      setData(remappedData);
    }
  }

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
    const res = await getKpiAtmCrm(spesificKpi)
    if (res) {
      if (res.status === "200") {
        // let remappedData = remapData(res.data);
        // setData(remappedData);
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
      // console.log(masterDataFilter)
    }
  }

  const getLabel = (key, value) => {
    // console.log(key)
    switch (key) {
      case 'status':
        return getStatusInfo(value).labelStatus;
      case 'timeline':
        return getTimelineInfo(value).label
      // Add more cases for other keys as needed
      // case 'masterDataPicOne':
      //   // Handle logic for picOne keys if necessary
      //   return `Label for ${value}`;
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

  const renderCheckboxes = (dataArray, keyName, handleCheckboxToggle) => {

    return (
      <>
        {dataArray.map((item, index) => (
          <ListItem key={index} className=" h-8 p-0">
            <label className="flex w-full cursor-pointer items-center px-4 py-3">
              <ListItemPrefix>
                <Checkbox
                  ripple={false}
                  checked={(selectedValues[keyName] && selectedValues[keyName][item[keyName]]) || false}
                  onChange={() => handleCheckboxToggle(keyName, item[keyName])}
                />
              </ListItemPrefix>
              <Typography>
                {getLabel(keyName, item[keyName])}
              </Typography>
            </label>
          </ListItem>
        ))}
      </>
    );
  };

  useEffect(() => {
    if (!getCookie("isReload") && getCookie("token")) {
      setCookie("isReload", "true");
      window.location.reload();
    }

    getAnalyze();
    getAllData();
    // getMasterData();
  }, [spesificKpi]);

  useEffect(() => {
    if (handleOpenFilter) {
      getMasterData()
    }
  }, [handleOpenFilter])

  // const integratedData = statisticsCardsData.map((card) => {
  //   const statusCount = dataAnalyze[card.status];
  //   const statusRankCount = dataAnalyzeRank[card.status];
  //   return { ...card, count: statusCount ?? 0, rank: statusRankCount ?? {} };
  // });
  // console.log(data)
  // console.log(data)
  // const options= (data) => {
  //   console.log(data)
  //   return(

  //     {type: "donut",
  //     height: 150,
  //     series: data['datasets'],
  //     options: {
  //       chart: {
  //         // stacked: true,
  //         toolbar: {
  //           show: false,
  //         },
  //       },
  //       title: {
  //         show: false,
  //       },
  //       dataLabels: {
  //         enabled: false,
  //       },
  //       // colors: ["#020617", "#ff8f00", "#00897b", "#1e88e5", "#d81b60"],
  //       // colors: ["#ff8f00", "#ff6600", "#ffaa33", "#ff8000"],
  //       colors: ["#009c8f", "#00afa3", "#00c2b7", "#00e8df", "#00897b"],
  //       plotOptions: {
  //         bar: {
  //           columnWidth: "40%",
  //           distributed: true,
  //           borderRadius: 1,
  //         },
  //       },
  //       xaxis: {
  //         axisTicks: {
  //           show: false,
  //         },
  //         axisBorder: {
  //           show: false,
  //         },
  //         labels: {
  //           show: false,
  //           style: {
  //             colors: "#616161",
  //             fontSize: "12px",
  //             fontFamily: "inherit",
  //             fontWeight: 400,
  //           },
  //         },
  //         // categories: categories,
  //       },
  //       yaxis: {
  //         labels: {
  //           style: {
  //             colors: "#616161",
  //             fontSize: "12px",
  //             fontFamily: "inherit",
  //             fontWeight: 400,
  //           },
  //         },
  //       },
  //       grid: {
  //         show: true,
  //         borderColor: "#dddddd",
  //         strokeDashArray: 8,
  //         xaxis: {
  //           lines: {
  //             show: false,
  //           },
  //         },
  //         padding: {
  //           top: 5,
  //           right: 20,
  //         },
  //       },
  //       fill: {
  //         opacity: 0.8,
  //       },
  //       // tooltip: {
  //       //   theme: "dark",
  //       //   y:{
  //       //     title: {
  //       //       formatter: function (val, opt) {
  //       //         return opt.w.globals.labels[opt.dataPointIndex]
  //       //       }
  //       //     }
  //       //   },
  //       // },
  //     },}
  //   )
  // }

  const chartConfig = (dataset, index) => {
    // console.log(dataset)
    // console.log(data.category["categoryWilayahOperasional"])
    function formatDateToMMMMYYYY(dateString) {
      const date = new Date(dateString);
      const formatter = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short' });
      return formatter.format(date);
    }
    const formattedPeriods = data.periods.map(formatDateToMMMMYYYY);
    return ({

      // type: "bar",
      height: 350,
      // series: [
      //   // { name: "April", data: [7, 0, 1] },
      //   // { name: "Christina", data: [5, 0, 1] },
      //   // { name: "Rachmat", data: [5, 0, 0] },
      //   // { name: "name", data: [0, 0, 1] }
      //   {name: "On Progress", data: [7, 5, 5, 0]},
      //   {name: "Pending", data: [0, 0, 0, 0]},
      //   {name: "Done", data: [1, 1, 0, 1]}
      // ],
      series: [{
        name: "Persentase Pengisian (%)",
        data: data.avgCash,
        type: "column"
      },
      {
        name: "Persentase rata-rata YTD (%)",
        data: data.ytdAverages,
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
          // text: data.category[index][categoryKpi],
          // text: data.category[index]["categoryWilayahOperasional"]
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
            // style: {
            //   colors: "#616161",
            //   fontSize: "12px",
            //   fontFamily: "inherit",
            //   fontWeight: 400,
            // },
          },
          categories: formattedPeriods,
        },
        // yaxis: {
        //   labels: {
        //     style: {
        //       colors: "#616161",
        //       fontSize: "12px",
        //       fontFamily: "inherit",
        //       fontWeight: 400,
        //     },
        //   },
        // },
        yaxis: [{
          title: {
            text: "Persentase Pengisian (%) "
          }
        },
        {
          title: {
            text: "Persentase rata-rata YTD (%)"
          },
          opposite: true
        }
        ],
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
        // tooltip: {
        //   theme: "dark",
        //   y:{
        //     title: {
        //       formatter: function (val, opt) {
        //         return opt.w.globals.labels[opt.dataPointIndex]
        //       }
        //     }
        //   },
        // }
      },
      // },
    })
  };
  const chartConfigUptime = (dataset, index) => {
    // console.log(dataset)
    // console.log(data.category["categoryWilayahOperasional"])
    function formatDateToMMMMYYYY(dateString) {
      const date = new Date(dateString);
      const formatter = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short' });
      return formatter.format(date);
    }
    const formattedPeriods = data.periods.map(formatDateToMMMMYYYY);
    return ({

      // type: "bar",
      height: 350,
      // series: [
      //   // { name: "April", data: [7, 0, 1] },
      //   // { name: "Christina", data: [5, 0, 1] },
      //   // { name: "Rachmat", data: [5, 0, 0] },
      //   // { name: "name", data: [0, 0, 1] }
      //   {name: "On Progress", data: [7, 5, 5, 0]},
      //   {name: "Pending", data: [0, 0, 0, 0]},
      //   {name: "Done", data: [1, 1, 0, 1]}
      // ],
      series: [{
        name: "ATM",
        data: dataset.data.series1,
        type: "column"
      },
      {
        name: "CRM",
        data: dataset.data.series2,
        type: "column"
      }
      ],
      options: {
        chart: {
          toolbar: {
            show: false,
          },
        },
        title: {
          // text: data.category[index][categoryKpi],
          text: data.category[index]["categoryWilayahOperasional"]
        },
        dataLabels: {
          enabled: false,
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
            // style: {
            //   colors: "#616161",
            //   fontSize: "12px",
            //   fontFamily: "inherit",
            //   fontWeight: 400,
            // },
          },
          categories: formattedPeriods,
        },
        // yaxis: {
        //   labels: {
        //     style: {
        //       colors: "#616161",
        //       fontSize: "12px",
        //       fontFamily: "inherit",
        //       fontWeight: 400,
        //     },
        //   },
        // },
        yaxis: [{
          title: {
            text: "Percentage Uptime (%) "
          }
        },
        {
          title: {
            text: "YTD Average (%)"
          },
          opposite: true
        }
        ],
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
        // tooltip: {
        //   theme: "dark",
        //   y:{
        //     title: {
        //       formatter: function (val, opt) {
        //         return opt.w.globals.labels[opt.dataPointIndex]
        //       }
        //     }
        //   },
        // }
      },
      // },
    })
  };

  // const chartConfigSummary = (dataset, index) => {
  //   // console.log(dataset)
  //   function formatDateToMMMMYYYY(dateString) {
  //     const date = new Date(dateString);
  //     const formatter = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short' });
  //     return formatter.format(date);
  //   }
  //   const formattedPeriods = dataset.data.dateTrx.map(formatDateToMMMMYYYY);
  //   console.log(dataset)
  //   return ({

  //     // type: "bar",
  //     height: 250,
  //     // series: [
  //     //   // { name: "April", data: [7, 0, 1] },
  //     //   // { name: "Christina", data: [5, 0, 1] },
  //     //   // { name: "Rachmat", data: [5, 0, 0] },
  //     //   // { name: "name", data: [0, 0, 1] }
  //     //   {name: "On Progress", data: [7, 5, 5, 0]},
  //     //   {name: "Pending", data: [0, 0, 0, 0]},
  //     //   {name: "Done", data: [1, 1, 0, 1]}
  //     // ],
  //     series: [{
  //       name: "Item Trx",
  //       data: dataset.data.totalItemTrx,
  //       type: "column"
  //     },{
  //       name: "Percentage Trx",
  //       data: dataset.data.percentageSLA,
  //       type: "line"
  //     }
  //     ],
  //     options: {
  //       chart: {
  //         toolbar: {
  //           show: false,
  //         },
  //       },
  //       dataLabels: {
  //         enabled: true,
  //         enabledOnSeries: [1]
  //       },
  //       // colors: ["#020617", "#ff8f00", "#00897b", "#1e88e5", "#d81b60"],
  //       // colors: ["#ff8f00", "#ff6600", "#ffaa33", "#ff8000"],
  //       // colors: ["#009c8f", "#00afa3", "#00c2b7", "#00e8df", "#00897b"],
  //       colors: ["#fdd835", "#e53935", "#43a047"],
  //       plotOptions: {
  //         bar: {
  //           columnWidth: "40%",
  //           // distributed: true,
  //           borderRadius: 1,
  //         },
  //       },
  //       xaxis: {
  //         axisTicks: {
  //           show: false,
  //         },
  //         axisBorder: {
  //           show: false,
  //         },
  //         labels: {
  //           show: true,
  //           // style: {
  //           //   colors: "#616161",
  //           //   fontSize: "12px",
  //           //   fontFamily: "inherit",
  //           //   fontWeight: 400,
  //           // },
  //         },
  //         categories: formattedPeriods,
  //       },
  //       // yaxis: {
  //       //   labels: {
  //       //     style: {
  //       //       colors: "#616161",
  //       //       fontSize: "12px",
  //       //       fontFamily: "inherit",
  //       //       fontWeight: 400,
  //       //     },
  //       //   },
  //       // },
  //       yaxis: [{
  //         title: {
  //           text: "Item Transaction"
  //         }
  //       }, {
  //         title: {
  //           text: "Percentage SLA (%)"
  //         },
  //         opposite: true
  //       },],
  //       grid: {
  //         show: true,
  //         borderColor: "#dddddd",
  //         strokeDashArray: 8,
  //         xaxis: {
  //           lines: {
  //             show: false,
  //           },
  //         },
  //         padding: {
  //           top: 5,
  //           right: 20,
  //         },
  //       },
  //       stroke: {
  //         curve: 'smooth'
  //       },
  //       fill: {
  //         opacity: 0.8,
  //       },
  //       legend: {
  //         show: false,
  //       },
  //       // tooltip: {
  //       //   theme: "dark",
  //       //   y:{
  //       //     title: {
  //       //       formatter: function (val, opt) {
  //       //         return opt.w.globals.labels[opt.dataPointIndex]
  //       //       }
  //       //     }
  //       //   },
  //       // }
  //     },
  //     // },
  //   })
  // };

  const KPI = ["Pagu Kas ATM", "SLA Pengisian Kas ATM", "Uptime ATM"];



  // console.log(data)
  return (
    // <SearchBar.Provider value={{ searchData, setSearchData }}>
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-1 xl:grid-cols-2">
        {/* {integratedData.map(
          ({ icon, title, footer, color, label, count, rank }, key) => (
            <StatisticsCard
              key={key}
              // {...rest}
              color={color}
              status={label}
              title={title}
              count={count}
              rank={rank}
              icon={React.createElement(icon, {
                className: "w-6 h-6 text-white",
              })}
            />
          ),
        )} */}
        {/* {
          dataAnalyze.length !== 0 && dataAnalyze.map((item, index) => {
            console.log(item)
            return (
              <Card className="border border-blue-gray-100 shadow-sm ">
                <CardBody className="p-4 text-left">
                  <Typography variant="small" className="font-normal text-blue-gray-600">
                  </Typography>
                  <Typography variant="h4" color="blue-gray" className=" capitalize">
                    {projects[index]}
                  </Typography>
                  {<Chart className="object-cover" key={index} {...chartConfigSummary(item)} />}
                </CardBody>
              
              </Card>
            )
          })
        } */}

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
                  KPI.map((project, index) => (
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
                  // ) : (
                  //   <div className="py-4">
                  //     <Typography variant="h6" color="blue-gray" className="mb-1 align-middle">
                  //       {category}
                  //     </Typography>
                  //   </div>
                  // )
                }
                {
                  isLogin && (
                    <div className={`flex items-start md:flex-1`}>
                      <Link to={`./upload/${spesificKpi === 0 ? "pagu-kas" : spesificKpi === 1 ? "sla-kas" : spesificKpi === 2 ? "uptime-atm" : null}`}>
                        <IconButton
                          size="sm"
                          variant="text"
                          color="blue-gray"
                        // onClick={() => console.log("tambah")}
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
          <div className="flex justify-center items-center w-full">
            {loading ? (
              <div className="h-10">Loading...</div>
            ) : (
              spesificKpi === 2 && (
                <Carousel
                  className="rounded-xl overflow-y-hidden"
                  loop={true}
                  {...(spesificKpi === 2 && {
                    prevArrow: ({ handlePrev }) => (
                      <IconButton
                        variant="text"
                        color="blue-gray"
                        size="lg"
                        onClick={handlePrev}
                        className="!absolute top-2/4 left-4 -translate-y-2/4"
                      >
                        <ArrowLeftIcon strokeWidth={2} className="h-6 w-6" />
                      </IconButton>
                    ),
                    nextArrow: ({ handleNext }) => (
                      <IconButton
                        variant="text"
                        color="blue-gray"
                        size="lg"
                        onClick={handleNext}
                        className="!absolute top-2/4 !right-4 -translate-y-2/4"
                      >
                        <ArrowRightIcon strokeWidth={2} className="h-6 w-6" />
                      </IconButton>
                    ),
                  })}
                >
                  {data.datasets?.length ? (
                    data.datasets.map((item, key) => (
                      <Card className="w-full py-3 px-12" key={key}>
                        <Chart className="grow px-8" {...chartConfigUptime(item, key)} />
                      </Card>
                    ))
                  ) : (
                    <div>No data available</div>
                  )}
                </Carousel>
              )
            )}
            {(data.length !== 0 && spesificKpi !== 2) && <Chart className="grow px-8" {...chartConfig(data)} />}
          </div>
        </Card>
      </div>
    </div>
    // </SearchBar.Provider>
  );
}

export default KpiAtm;
