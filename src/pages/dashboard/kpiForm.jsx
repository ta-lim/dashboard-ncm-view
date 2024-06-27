import React, { useState, useEffect } from "react";
import { Button, Select, Option, Textarea, Input, Card, CardBody, Typography } from "@material-tailwind/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import createDataKpi from "@/api/activity/createDataKpi";
import getDetail from "@/api/activity/getDetail";
import updateData from "@/api/activity/updateData";
import { useContext } from "react";
import { IsLogin, Role } from "@/context";
import CheckToken from "@/api/auth/checkToken";
import { getCookie } from "cookies-next";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import getMasterdataCategory from "@/api/activity/getMasteraDataCategory";
import getDataKPIbyDate from "@/api/activity/getDataKPIbyDate";



export function KpiForm() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = useContext(IsLogin);
  const isRole = useContext(Role);
  const [isCategory, setCategory] = useState()
  const [masterdataCategory, setMasterDataCategory] = useState([])
  const [percentageItem, setPercentageItem] = useState([]);

  const isRekonPath = location.pathname.includes('rekon');
  const isRetailPath = location.pathname.includes('retail');
  const isWholesalePath = location.pathname.includes('wholesale');
  const isKPIRekon = location.pathname.includes('kpi-rekon');
  // const isPaguKasPath = location.pathname.includes('pagu-kas');
  // const isSLAKasPath = location.pathname.includes('sla-kas');
  // const isUptimeATMPath = location.pathname.includes('uptime-atm');

  const [formData, setFormData] = useState([]);
  const [dateTrx, setDateTrx] = useState("");
  const today = dayjs()
  const thisYear = dayjs().startOf('year')
  let minDate, maxDate
  const categoryKpi = isRekonPath ? "categoryJaringan" : isRetailPath ? "categoryOpsRetail" : isWholesalePath ? "categoryTrxDefect" : null;
  // const [masterdataCategory, setMasterdataCategory] = useState([]);
  if(isRole === "super admin" || isRole === "admin") {
    minDate = thisYear;
    maxDate = today;
  }else if (isRole === "staff") {
    minDate = today.subtract(1, 'month'); // Example: users can select dates from the past month
    maxDate = today;
  } else {
    minDate = null;
    maxDate = null;
  }
  const handleTitle = () => {
    for (const [key, value] of Object.entries(formTitles)) {
      if (eval(key)) {
        return value;
      }
    }
    return null;
  };

  const formTitles = {
    isRekonPath: "Rekonsiliasi",
    isRetailPath: "Operasional Retail",
    isWholesalePath: "Operasional Wholesale",
    // isPaguKasPath: "Pagu Kas ATM",
    // isSLAKasPath: "Pengisian Kas ATM/CRM",
    // isUptimeATMPath: "Uptime ATM/CRM",
  };

  const handleLabel = (path, label1, label2) => (path ? label1 : label2);
  
  // const handleChange = (e, idx, field) => {
  //   const { value } = e.target;
  //   // console.log(e)
  //   setFormData(prevState => {
  //     const newState = [...prevState];
  //     if (!newState[idx]) {
  //       newState[idx] = {
  //         dateTrx: '',
  //         itemTrx: '',
  //         itemTrxSLA: '',
  //         [categoryKpi]: '',
  //         calculate: 0
  //       };
  //     }

  //     newState[idx][field] = value;
  //     return newState;
  //   });
  // };

  const handleChange = (e, idx, field) => {
    const { value } = e.target;
    if (!isNaN(value)) {
      setFormData(prevState => {
        const newState = [...prevState];

        if (!newState[idx]) {
          newState[idx] = {
            dateTrx: '',
            itemTrx: '',
            itemTrxSLA: '',
            [categoryKpi]: '',
          };
        }

        // Update the specific field with the new value
        newState[idx][field] = value;

        // Retrieve itemTrx and itemTrxSLA for the current index
        const itemTrx = newState[idx].itemTrx;
        const itemTrxSLA = newState[idx].itemTrxSLA;

        // Calculate the percentage if both values are present and numeric
        if (itemTrx && itemTrxSLA && !isNaN(itemTrx) && !isNaN(itemTrxSLA)) {
          percentageItem[idx] = (itemTrxSLA / itemTrx) * 100;
        } else {
          percentageItem[idx] = 0; // Reset to 0 if calculation is not possible
        }

        return newState;
      });
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = formData.map(item => ({
      dateTrx: dayjs(dateTrx).format('YYYY-MM'),// Assuming current date, adjust as necessary
      itemTrx: item.itemTrx.trim() ? item.itemTrx.replace(/,/g, '') : null,
      itemTrxSLA: item.itemTrxSLA.trim() ? item.itemTrxSLA.replace(/,/g, '') : null,
      [categoryKpi]: item[categoryKpi]
    }));

    try {
      const res = await createDataKpi(payload, getCookie('token'), isRekonPath ? "0" : isRetailPath ? "1" : isWholesalePath ? "2" : null)

      if (res) {
        if (res.status === "200") {
          navigate(id ? `./../..` : './../')
        }
      }

    } catch (err) {
      console.error('Error: ', err)
    }
  }

  useEffect(() => {
    const updatedFormData = masterdataCategory.map(item => ({
      dateTrx: '',
      itemTrx: '',
      itemTrxSLA: '',
      [categoryKpi]: item.id,
      // calculatePercentage: 0
    }));
    setFormData(updatedFormData);
  }, [masterdataCategory, categoryKpi]);


  const checkDatabyDate = async () => {
    try {
      const res = await getDataKPIbyDate(dayjs(dateTrx).format("YYYY-MM"), isWholesalePath ? "2" : isRetailPath ? "1" : isRekonPath ? "0" : "-1", isKPIRekon && "1", getCookie('token'))
      if (res.data.length !== 0) {
        setFormData(res.data.map((item, idx) => {
          const itemTrx = item.itemTrx;
          const itemTrxSLA = item.itemTrxSLA;
          
          if (itemTrx && itemTrxSLA && !isNaN(itemTrx) && !isNaN(itemTrxSLA)) {
            percentageItem[idx] = (itemTrxSLA / itemTrx) * 100;
          } else {
            percentageItem[idx] = 0; // Reset to 0 if calculation is not possible
          }
          return (
            {
              dateTrx: '',
              itemTrx: item.itemTrx,
              itemTrxSLA: item.itemTrxSLA,
              [categoryKpi]: item[categoryKpi]
            }
          )
        }));

      }
      else {
        fetchMasterdataCategory();
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  }
  // const handleChange = (e) => {
  //   // console.log(formData.subCategory)
  //   const { name, value } = e.target;
  //   setFormData((prevData) => ({ ...prevData, [name]: value }));
  //   setCategory(isBusinessPlanPath ? "3" : isActivityPath ? "2" : isProjectPath ? "1" : null)
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const isLogin = await CheckToken(getCookie('token'))
  //   if (isLogin) {
  //     const res = id ? await updateData(formData, getCookie('token')) : await createData(formData, getCookie('token'))
  //     if (res) {
  //       if (res.status === '200') {
  //         navigate(id ? `./../..` : './../')
  //       }
  //     }
  //   }
  // };

  const fetchMasterdataCategory = async () => {
    // if (isPaguKasPath || isSLAKasPath) return;

    const categoryType = getCategoryType();
    const res = await getMasterdataCategory(categoryType);

    if (res && res.status === '200') {
      setMasterDataCategory(res.data);
      setPercentageItem([]);
    }
  };

  const getCategoryType = () => {
    if (isRekonPath) return "0";
    if (isRetailPath) return "1";
    if (isWholesalePath) return "2";
    if (isUptimeATMPath) return "3";
    return null;
  };
  function formatPercentage(percentage) {
    // Convert the percentage to a string and split it at the decimal point
    if (percentage === undefined) return;
    let percentageString = percentage.toString();
    let parts = percentageString.split('.');

    // Check if the decimal part has more than 2 digits
    if (parts.length > 1 && parts[1].length > 2) {
      return `${parseFloat(percentage).toFixed(2)} %`;
    } else {
      return `${percentageString} %`;
    }
  }

  useEffect(() => {
    console.log(dateTrx)
    checkDatabyDate()
  }, [dateTrx]);

  useEffect(() => {
    setFormData(prevData => ({ ...prevData, category: isCategory }));
    fetchMasterdataCategory();
  }, []);

  // useEffect(() => {
  //   async function getDetailData() {
  //     const res = await getDetail(id)
  //     if (res) {
  //       if (res.status === '200') {
  //         setFormData(res.data)
  //       }
  //     }
  //   }

  //   if (id) {
  //     getDetailData();
  //   }
  // }, [id]);
  // console.log(formData)
  return (
    isLogin ? (
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 justify-between items-center">
        <Typography variant="h5" color="blue-gray">
          {handleTitle()}
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
          <DatePicker
            label="Month"
            value={id ? dayjs(formData.timeline) : null}
            format="MMMM YYYY"
            views={['month', 'year']}
            minDate={minDate}
            maxDate={maxDate}
            // disablePast
            onChange={(e) => setDateTrx(e)}
          />
        </LocalizationProvider>
        {masterdataCategory.map((item, idx) => {
          const categoryKey = Object.keys(item).find(key => key.startsWith('category'));
          console.log(formData)
          return (
            <Card className="mt-6 w-3/5" key={idx}>
              <CardBody>
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  {item[categoryKey]}
                </Typography>
                {formData.length !== 0 &&
                  <div className={`text-center pl-12 ${percentageItem[idx] < 95 ? 'text-red-500' : 'text-green-700'}`}>
                    {formatPercentage(percentageItem[idx])}
                  </div>
                }
                <div className="flex mb-3 w-3/5">
                  <div className="flex w-96 justify-start items-end">
                    <label htmlFor={`itemTrx-${idx}`} className="px-4">Item Transaction</label>
                  </div>
                  <Input
                    disabled={dateTrx? false : true}
                    placeholder="Item Transaction"
                    id={`itemTrx-${idx}`}
                    name="itemTrx"
                    value={formData[idx]?.itemTrx || ''}
                    onChange={(e) => handleChange(e, idx, 'itemTrx')}
                    variant="standard"
                  />
                </div>
                <div className="flex mb-3 w-3/5">
                  <div className="flex w-96 justify-start items-end">
                    <label htmlFor={`itemTrxOnSLA-${idx}`} className="px-4">Item Transaction On SLA</label>
                  </div>
                  <Input
                    disabled={dateTrx? false : true}
                    placeholder="Item Transaction On SLA"
                    id={`itemTrxOnSLA-${idx}`}
                    name="itemTrxSLA"
                    value={formData[idx]?.itemTrxSLA || ''}
                    onChange={(e) => handleChange(e, idx, 'itemTrxSLA')}
                    variant="standard"
                  />
                </div>

              </CardBody>
            </Card>
          );
        })}

        <Button type="submit" className="w-fit">
          Submit
        </Button>
      </form>
    ) : id ? navigate('./../..') : navigate('./..')
  );
};

export default KpiForm;
