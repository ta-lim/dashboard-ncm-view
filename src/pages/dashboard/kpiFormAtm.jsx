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
import getDataKPI from "@/api/activity/getDataKPI";
import createDataKpiATM from "@/api/activity/createDataKpiATM";
import getDataKPIbyDate from "@/api/activity/getDataKPIbyDate";



export function KpiFormAtm() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = useContext(IsLogin)
  const isRole = useContext(Role);
  const [percentageItem, setPercentageItem] = useState("");


  // const [isCategory, setCategory] = useState()
  const [masterdataCategory, setMasterDataCategory] = useState([])

  // const isRekonPath = location.pathname.includes('rekon');
  // const isRetailPath = location.pathname.includes('retail');
  // const isWholesalePath = location.pathname.includes('wholesale');
  const isPaguKasPath = location.pathname.includes('pagu-kas');
  const isSLAKasPath = location.pathname.includes('sla-kas');
  const isKPIATMPath = location.pathname.includes('kpi-atm');
  // const isUptimeATMPath = location.pathname.includes('uptime-atm');

  const [formData, setFormData] = useState([]);
  const [dateTrx, setDateTrx] = useState("");
  const today = dayjs()
  const thisYear = dayjs().startOf('year')
  let minDate, maxDate

  const [percentage, setPercentage] = useState(0);
  // const categoryKpi = isRekonPath ? "categoryJaringan" : isRetailPath ? "categoryOpsRetail" : isWholesalePath ? "categoryTrxDefect" : null;
  // const [masterdataCategory, setMasterdataCategory] = useState([]);

  if (isRole === "super admin" || isRole === "admin") {
    minDate = thisYear;
    maxDate = today;
  } else if (isRole === "staff") {
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

  const handleField = (idx) => {
    for (const [key, value] of Object.entries(keyForm)) {
      if (eval(key)) {
        return value[idx];
      }
    }
    return null;
  }

  const formTitles = {
    isPaguKasPath: "Pagu Kas ATM",
    isSLAKasPath: "Pengisian Kas ATM/CRM",
  };

  const keyForm = {
    isPaguKasPath: ["realisasi", "paguKas"],
    isSLAKasPath: ["cashRetrieval", "cashFilling"],
  };

  const handleLabel = (path, label1, label2) => (path ? label1 : label2);

  const handleChange = (e, field) => {
    const { value } = e.target;

    if (!isNaN(value)) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [field]: value,
      }))

      // Calculate the percentage
      // const newValue = parseFloat(value);
      // const 
      // const newPercentage = ((newValue / totalValue) * 100).toFixed(2);
      // setPercentage(newPercentage);

    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    // const payload = formData.map(item => ({
    //   dateTrx: dateTrx,// Assuming current date, adjust as necessary
    //   itemTrx: item.itemTrx.trim() ? item.itemTrx.replace(/,/g, '') : null,
    //   itemTrxSLA: item.itemTrxSLA.trim() ? item.itemTrx.replace(/,/g, '') : null,
    //   [categoryKpi]: item[categoryKpi]
    // }));
    console.log(formData)
    const payload = {
      dateTrx: dayjs(dateTrx).format('YYYY-MM-DD'),
      realisasi: formData.realisasi,
      paguKas: formData.paguKas,
    }

    try {
      const res = await createDataKpiATM(payload, getCookie('token'), isPaguKasPath ? "0" : isSLAKasPath ? "1" : "-1")

      if (res) {
        if (res.status === "200") {
          navigate(id ? `./../..` : './../')
        }
      }

    } catch (err) {
      console.error('Error: ', err)
    }
  }
  const checkDatabyDate = async () => {
    const field1 = handleField(0);
    const field2 = handleField(1);
    try {
      const res = await getDataKPIbyDate(
        dayjs(dateTrx).format("YYYY-MM"),
        isPaguKasPath ? "0" : isSLAKasPath ? "1" : "-1",
        isKPIATMPath && "2",
        getCookie('token')
      );

      // Assuming res.data is an array and we want to use the first object in the array
      const firstItem = res.data[0];
      if (firstItem === undefined) setFormData([]);
      else {
        setPercentageItem((firstItem[field1] / firstItem[field2]) * 100)
        setFormData({
          dateTrx: '',
          [field1]: firstItem[field1],
          [field2]: firstItem[field2],
          // [categoryKpi]: firstItem.categoryMachine
        });
      }
      // const itemTrx = item.itemTrx;
      //   const itemTrxSLA = item.itemTrxSLA;

      //   if (itemTrx && itemTrxSLA && !isNaN(itemTrx) && !isNaN(itemTrxSLA)) {
      //     percentageItem[idx] = (itemTrxSLA / itemTrx) * 100;
      //   } else {
      //     percentageItem[idx] = 0; // Reset to 0 if calculation is not possible
      //   }

    } catch (err) {
      console.error('Error fetching data:', err);
    }
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

  // useEffect(() => {
  //   setFormData(masterdataCategory.map(item => ({
  //     dateTrx: '',
  //     itemTrx: '',
  //     itemTrxSLA: '',
  //     [categoryKpi]: item.id
  //   })));
  // }, [masterdataCategory]);

  useEffect(() => {
    checkDatabyDate()
  }, [dateTrx])

  // const dataKPI = async (date) => {
  //   const res = getDataKPI(date)

  //   console.log(res)
  // }
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

  // const MasterdataCategory = async () => {
  //   if(isPaguKasPath || isSLAKasPath) return;
  //   const res = await getMasterdataCategory(isRekonPath ? "0" : isRetailPath ? "1" : isWholesalePath ? "2" : isUptimeATMPath ? "3" : null)
  //   if (res) {
  //     if (res.status === '200') {
  //       setMasterDataCategory(res.data)
  //     }
  //   }
  // }

  // useEffect(() => {
  //   setFormData((prevData) => ({ ...prevData, ['category']: isCategory }));
  //   // MasterdataCategory()
  // }, [])

  useEffect(() => {
    async function getDetailData() {
      const res = await getDetail(id)
      if (res) {
        if (res.status === '200') {
          setFormData(res.data)
        }
      }
    }

    if (id) {
      getDetailData();
    }
  }, [id]);

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
            views={['month']}
            minDate={minDate}
            maxDate={maxDate}
            // disablePast
            onChange={(e) => setDateTrx(e)}
          />
        </LocalizationProvider>
        {(isPaguKasPath || isSLAKasPath) && (
          <Card className="mt-6 w-3/5">
            <CardBody>
              <div className="flex mb-3 w-3/5">
                <div className="flex w-96 justify-start items-end">
                  <label htmlFor={handleLabel(isPaguKasPath, "Realisasi", "Pengambilan Kas")} className="px-4">
                    {handleLabel(isPaguKasPath, "Realisasi", "Pengambilan Kas")}
                  </label>
                </div>
                <Input
                  disabled={dateTrx ? false : true}
                  placeholder={handleLabel(isPaguKasPath, "Realisasi", "Pengambilan Kas")}
                  id={handleLabel(isPaguKasPath, "Realisasi", "Pengambilan Kas")}
                  name="realisasi"
                  value={formData[handleField(0)] || ''}
                  onChange={(e) => handleChange(e, handleField(0))}
                  variant="standard"
                />
              </div>
              <div className="flex mb-3 w-3/5">
                <div className="flex w-96 justify-start items-end">
                  <label htmlFor={handleLabel(isPaguKasPath, "Pagu Kas", "Pengisian Kas")} className="px-4">
                    {handleLabel(isPaguKasPath, "Pagu Kas", "Pengisian Kas")}
                  </label>
                </div>
                <Input
                  disabled={dateTrx ? false : true}
                  placeholder={handleLabel(isPaguKasPath, "Pagu Kas", "Pengisian Kas")}
                  id={handleLabel(isPaguKasPath, "Pagu Kas", "Pengisian Kas")}
                  name="paguKas"
                  value={formData[handleField(1)] || ''}
                  onChange={(e) => handleChange(e, handleField(1))}
                  variant="standard"
                />
              </div>
              {formData.length !== 0 &&
                  <div className={`text-center pl-12 ${percentageItem < 95 ? 'text-red-500' : 'text-green-700'}`}>
                    {formatPercentage(percentageItem)}
                  </div>
                }
            </CardBody>
          </Card>
        )}
        <Button type="submit" className="w-fit">
          Submit
        </Button>
      </form>
    ) : id ? navigate('./../..') : navigate('./..')
  );
};

export default KpiFormAtm;
