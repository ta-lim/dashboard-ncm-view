import React, { useState, useEffect } from "react";
import { Button, Select, Option, Textarea, Input, Card, CardBody, Typography } from "@material-tailwind/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import createDataKpiATM from "@/api/activity/createDataKpiATM";
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


export function KpiFormUpTimeATM() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = useContext(IsLogin);
  const isRole = useContext(Role);
  const [isCategory, setCategory] = useState()
  const [masterdataCategory, setMasterDataCategory] = useState([])

  const isUptimeATMPath = location.pathname.includes('uptime-atm');
  // const isImplementationEDCPath =  location.pathname.includes('implementation-edc');
  const isKPIATMPath = location.pathname.includes('kpi-atm');


  const [formData, setFormData] = useState([]);
  const categoryKpi =  isUptimeATMPath ? "categoryWilayahOperasional": null;
  const [dateTrx, setDateTrx] = useState("");
  const today = dayjs()
  const thisYear = dayjs().startOf('year')
  let minDate, maxDate
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
    isUptimeATMPath: "Uptime ATM/CRM",
    isImplementationEDCPath: "Implementation EDC",
  };

  const handleDateChange = (date) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    setDateTrx(formattedDate);
  };

  const checkDatabyDate = async () => {
    try{
      const res = await getDataKPIbyDate(dayjs(dateTrx).format("YYYY-MM"), isUptimeATMPath ? "2"  : "-1", isKPIATMPath && "2", getCookie('token'))
      // console.log(res)
      // setFormData(res)
      setFormData(res.data.map(item => ({
        dateTrx: '',
        upTimeATM: item.upTimeATM,
        upTimeCRM: item.upTimeCRM,
        [categoryKpi]: item[categoryKpi]
      })));
    }catch (err) {
      console.error('Error fetching data:', err);
    }
  }

  const handleChange = (e, idx, field) => {
    const { value } = e.target;
    // console.log(e)
    setFormData(prevState => {
      const newState = [...prevState];
      if (!newState[idx]) {
        newState[idx] = {
          dateTrx: '',
          upTimeATM: '',
          upTimeCRM: '',
          [categoryKpi]: ''
        };
      }

      newState[idx][field] = value;
      return newState;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = formData.map(item => ({
      dateTrx: dateTrx,// Assuming current date, adjust as necessary
      upTimeATM: item.upTimeATM,
      upTimeCRM: item.upTimeCRM,
      [categoryKpi]: item[categoryKpi]
    }));
    
    console.log(payload)
    try {
      const res = await createDataKpiATM(payload, getCookie('token'), (isUptimeATMPath || isImplementationEDCPath) ? "2" : null)

      if (res) {
        if (res.status === "200") {
          navigate(id ? `./../..` : './../..')
        }
      }

    } catch (err) {
      console.error('Error: ', err)
    }
  }

  useEffect(() => {
    setFormData(masterdataCategory.map(item => ({
      dateTrx: '',
      upTimeCRM: '',
      upTimeATM: '',
      [categoryKpi]: item.id
    })));
  }, [masterdataCategory]);

  const MasterdataCategory = async () => {
    // if(isPaguKasPath || isSLAKasPath) return;
    const res = await getMasterdataCategory(isUptimeATMPath  ? "3" : null)
    if (res) {
      if (res.status === '200') {
        setMasterDataCategory(res.data)
      }
    }
  }

  useEffect(() => {
    setFormData((prevData) => ({ ...prevData, ['category']: isCategory }));
    MasterdataCategory()
  }, [])

  useEffect(() => {
    checkDatabyDate()
  }, [dateTrx]);

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

  return (
    isLogin ? (
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 justify-between items-center">
        <Typography variant="h5" color="blue-gray">
          {handleTitle()}
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
          <DatePicker
            label="Month"
            format="MMMM YYYY"
            views={['month', 'year']}
            minDate={minDate}
            maxDate={maxDate}
            // disablePast
            onChange={handleDateChange}
          />
        </LocalizationProvider>
        <div className="grid grid-cols-2 justify-items-center">
          {masterdataCategory.map((item, idx) => {
            const categoryKey = Object.keys(item).find(key => key.startsWith('category'));

            return (
              <Card className="mt-6 w-4/5" key={idx}>
                <CardBody>
                  <Typography variant="h6" color="blue-gray" className="mb-2">
                    {item[categoryKey]}
                  </Typography>
                  <div className="flex pb-3 w-3/5">
                    <div className="flex w-96 justify-start items-end">
                      <label htmlFor={`itemTrx-${idx}`} className="px-4">ATM</label>
                    </div>
                    <Input
                      disabled={dateTrx? false : true}
                      placeholder="percentage Uptime ATM"
                      id={`upTimeATM-${idx}`}
                      name="upTimeATM"
                      value={formData[idx]?.upTimeATM || ''}
                      onChange={(e) => handleChange(e, idx, 'upTimeATM')}
                      variant="standard"
                    />
                  </div>
                  <div className="flex mb-3 w-3/5">
                    <div className="flex w-96 justify-start items-end">
                      <label htmlFor={`itemTrxOnSLA-${idx}`} className="px-4">CRM</label>
                    </div>
                    <Input
                      disabled={dateTrx? false : true}
                      placeholder="percentage Uptime CRM"
                      id={`upTimeCRM-${idx}`}
                      name="upTimeCRM"
                      value={formData[idx]?.upTimeCRM || ''}
                      onChange={(e) => handleChange(e, idx, 'upTimeCRM')}
                      variant="standard"
                    />
                  </div>
                </CardBody>
              </Card>
            );
          })}

        </div>
        <Button type="submit" className="w-fit">
          Submit
        </Button>
      </form>
    ) :  navigate('./../..')
  );
};

export default KpiFormUpTimeATM;
