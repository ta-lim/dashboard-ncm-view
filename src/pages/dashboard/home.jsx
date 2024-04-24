import React, { useContext, useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  Chip,
  Button,
  Input,
  Select
} from "@material-tailwind/react";
import {
  PlusIcon,
  UserCircleIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/widgets/cards";
import { statisticsCardsData } from "@/data";
import { Link,useLocation } from "react-router-dom";
import getData from "@/api/activity/getData";
import getStatusInfo from "@/handlers/getStatusInfo";
import getTimelineInfo from "@/handlers/getTimelineInfo";
import { IsLogin } from "@/context";
import { getCookie, setCookie } from "cookies-next";
import GetAnalyze from "@/api/activity/getAnalyze";
import SearchData from "@/api/activity/searchData";
import downloadXls from "@/api/activity/downloadXls";


export function Home() {
  const location = useLocation();
  const [data, setData] = useState([]);
  const [dataAnalyze, setDataAnalyze] = useState([]);
  const [dataAnalyzeRank, setDataAnalyzeRank] = useState([]);
  const [dataSearch, setDataSearch] = useState('');
  const [rowToggleStatus, setRowToggleStatus] = useState({});
  const  isLogin  = useContext(IsLogin)
  const [spesificBusinessPlan, setSpesificBusinessPLan] =useState(0)

  const isProjectPath = location.pathname.includes('project') 
  const isActivityPath = location.pathname.includes('activity') 
  const isBusinessPlanPath = location.pathname.includes('business-plan') 

  const category =
  isBusinessPlanPath ? "Business plan" :
  isActivityPath ? "Activity" :
  isProjectPath ? "Project" :
  "";

  const projects = ['RPA', 'City Net', 'EUC', 'Pelatihan'];  

  const toggleRowStatus = (rowId) => {
    setRowToggleStatus(prevState => ({
      ...prevState,
      [rowId]: !prevState[rowId] // Toggle the status for the specified row
    }));
  };

  async function Search(){
    const res = await SearchData(dataSearch)

    if(res.status === '200'){
      setDataSearch('')
      setData(res.data)
    }
  }  
  
  async function getAnalyze() {
    const res = await GetAnalyze(isBusinessPlanPath? "3" : isActivityPath ? "2" : "1",isBusinessPlanPath ? (spesificBusinessPlan + 1) : '')
    if(res){
      if(res.status === '200'){
        setDataAnalyze(res.data.summary)
        setDataAnalyzeRank(res.data.summaryRank)
      }
    }
  }

  async function getAllData() {
    const res = await getData(isBusinessPlanPath? "3" : isActivityPath ? "2" : "1",isBusinessPlanPath ? (spesificBusinessPlan + 1) : '')
    if(res){
      if(res.status === '200'){
        setData(res.data)
      }
    }
  }

  useEffect(() => {
    if(!getCookie('isReload') && getCookie('token')){
      setCookie('isReload', 'true')
      window.location.reload();
    }

    getAnalyze();
    getAllData();

  }, [isBusinessPlanPath, isActivityPath, isProjectPath, spesificBusinessPlan])
  const integratedData = statisticsCardsData.map(card => {
    const statusCount = dataAnalyze[card.status];
    const statusRankCount = dataAnalyzeRank[card.status];
    return { ...card, count: statusCount ?? 0, rank: statusRankCount ?? {}  };
  });
  return (
    // <SearchBar.Provider value={{ searchData, setSearchData }}>
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {integratedData.map(({ icon, title, footer, color, label, count, rank }, key) => (
          <StatisticsCard
            key={key}
            // {...rest}
            color={color}
            status={label}
            title={title}
            count={count}
            rank= {rank}
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
            className="m-0 flex items-center gap-4 p-6"
          >
            <div className="flex items-center justify-between w-full gap-3 flex-wrap">
              <div className={` flex flex-wrap items-center gap-4 ${isBusinessPlanPath ? 'md:flex-1' : '' }`}>
                {
                  isBusinessPlanPath ? (
                    projects.map((project, index) => (
                      <div key={index} onClick={() => setSpesificBusinessPLan(index)}>
                        <Button 
                          color={index === spesificBusinessPlan ? 'dark' : 'white'}
                          className="flex items-center capitalize w-24 h-10 justify-center whitespace-nowrap cursor-pointer" 
                        >
                          <Typography variant="h6" color={index === spesificBusinessPlan ? 'white' : 'black'} className="mb-1 text-center">
                            {project} 
                          </Typography>
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div>
                    <Typography variant="h6" color="blue-gray" className="mb-1">
                      {category}
                    </Typography>
                    </div>
                  )
                }
              </div>
              {
                      isLogin &&
                      <>
                        <div className={`flex items-start md:flex-1`}>

                          <Link to={`./upload`}>
                              <IconButton size="sm" variant="text" color="blue-gray" onClick={() => console.log("tambah")}>
                                <PlusIcon
                                  strokeWidth={3}
                                  fill="currenColor"
                                  className="h-6 w-6"
                                  />
                              </IconButton>
                            </Link>                  
                        </div>
                        {/* <div className={`flex items-start md:flex-1`}> */}

                          <div onClick={() => downloadXls(isBusinessPlanPath? "3" : isActivityPath ? "2" : "1", getCookie('token'))} className="">
                              <IconButton size="sm" variant="text" color="blue-gray">
                                <DocumentArrowDownIcon
                                  strokeWidth={2}
                                  // fill="currenColor"
                                  className="h-6 w-6"
                                  />
                              </IconButton>
                            </div>                  
                        {/* </div> */}

                      </> 
                  // <Menu placement="left-start">
                  //   <MenuHandler>
                  //   </MenuHandler>
                  // </Menu>
              }  
              <div className="md:mr-4 md:w-56">
                <Input  
                  label="Search"
                  id="search"
                  name="search"
                  value={dataSearch}
                  onChange={(e) => setDataSearch(e.target.value)} 
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') Search();
                  }}
                  />
              </div>
            </div>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["Title", "PIC", "UIC","Description","CR No", "Status", 'Timeline'].map(
                    (el) => (
                      <th
                        key={el}
                        className="border-b border-blue-gray-50 py-3 px-6 text-center whitespace-nowrap"
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
                  ({ id, title, picOne, picTwo, UIC, description, crNumber, status, timeline, updatedAt }, key) => {
                    const className = `py-3 px-3 text-center ${
                      key === data.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;
                    const {labelStatus, colorStatus} = getStatusInfo(status)
                    const {labelTimeline, colorTimeline} = getTimelineInfo(timeline)
                    const dateUtc = new Date(updatedAt);
                    dateUtc.setHours(dateUtc.getHours());

                    return (
                      <tr key={key} className="even:bg-blue-gray-50/50">
                        <td className={`cursor-pointer w-60 ${className}`} onClick={() => {console.log('access profile ')}} >
                          <Link to={`./${id}`}>
                            <Typography
                              variant="small"
                              className="text-xs font-bold text-blue-gray-900 text-center "
                              >
                              {title.length > 65
                               ? `${title.slice(0, 65)} ...`
                               : title
                              }
                            </Typography>
                          </Link>
                        </td>
                        <td className={`${className}`}>
                          <div className="flex flex-col gap-4 ml-3">
                            {/* <Avatar src={img} alt={picOne} size="sm" /> */}
                            <Chip                            
                              icon={
                                <UserCircleIcon />
                              }
                              value={
                                <Typography
                                  variant="small"
                                  color="white"
                                  className="font-medium capitalize leading-none"
                                >
                                  {picOne}
                                </Typography>
                              }
                              className="rounded-full px-3 w-32 bg-orange-700"
                            />
                            {
                              (picTwo !== '' || picTwo.trim() !== '' )  ? 
                                <Chip
                                  icon={
                                    <UserCircleIcon />
                                  }
                                  value={
                                    <Typography
                                      variant="small"
                                      color='white'
                                      className="font-medium capitalize leading-none"
                                    >
                                      {picTwo}
                                    </Typography>
                                  }
                                  className="rounded-full py-1.5 w-32 bg-teal-700"
                                />
                              : <></>
                            }
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
                        <td className={` py-3 px-2 text-left `}>
                          <Typography
                            variant="small"
                            className="text-xs font-medium text-blue-gray-600 text-justify"
                          >
                             {description.length > 100
                              ? `${description.slice(0, 100)} ...`
                              : description}
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
                          {
                            rowToggleStatus[key] ? (
                            <Select
                              label="Sub Category"
                              value={labelStatus}
                              // onChange={(value) => handleChange({ target: { name: "subCategory", value } })}
                              name="subCategory"
                              disabled={id ? true : false}
                            >
                              <Option value="1">RPA</Option>
                              <Option value="2">City Net</Option>
                              <Option value="3">EUC</Option>
                              <Option value="4">Pelatihan</Option>
                            </Select>
                            ) : (

                              <div className="w-10/12 cursor-pointer" onClick={() => {
                                console.log('change status')
                                toggleRowStatus(key);
                              }
                              } >
                                  <Chip
                                    value={
                                      <Typography
                                      variant="small"
                                      color="white"
                                      className="font-medium capitalize leading-none items-center"
                                      >
                                      {labelStatus}        
                                      </Typography>
                                    } 
                                    className={`flex rounded-full flex-col items-center w-32 ${colorStatus}`}/>
                              </div>

                            )
                          }
                        </td>
                        <td className={className}>
                          <Chip
                            color={'blue-gray'} 
                            value={
                              <Typography
                              variant="small"
                              color="white"
                              className="font-medium capitalize leading-none"
                              >
                              {labelTimeline}        
                              </Typography>
                            } 
                            className={`flex rounded-full flex-col items-center w-32`}/>
                        </td>
                        {
                          // isLogin &&
                          // <td className={` flex flex-col gap-2 ${className}`}>
                          // <Typography
                          //       variant="small"
                          //       color='black'
                          //       className="font-medium capitalize leading-none"
                          //       >
                          //   {dateUtc.toDateString()}

                          //       {/* {dateUtc.toDateString()}         */}
                          //       </Typography>
                          // <Typography
                          //       variant="small"
                          //       color='black'
                          //       className="font-medium capitalize leading-none"
                          //       >
                          //   {dateUtc.toTimeString().slice(0,8)}
                          //       </Typography>
                          // </td>
                        }
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
    // </SearchBar.Provider>
  );
}

export default Home;
