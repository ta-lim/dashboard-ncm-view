import React, { useState, useEffect } from "react";
import { Button, Select, Option, Textarea, Input, Card, CardBody, Typography } from "@material-tailwind/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
// import createDataKpiATM from "@/api/activity/createDataKpiATM";
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
import createDataKpiEDC from "@/api/activity/createDataKpiEDC";
import getDataKPIbyDate from "@/api/activity/getDataKPIbyDate";


export function KpiFormEDC() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = useContext(IsLogin);
  const isRole = useContext(Role);
  const [isCategory, setCategory] = useState()
  const [masterdataCategory, setMasterDataCategory] = useState([])

  const isAvailibilityEdcPath = location.pathname.includes('availibility-edc');
  const isImplementationEDCPath = location.pathname.includes('implementation-edc');
  const isKPIEDCPath = location.pathname.includes("kpi-edc");

  const [formData, setFormData] = useState([]);
  const categoryKpi = isImplementationEDCPath ? "categoryWilayahOperasional" : null;
  const [dateTrx, setDateTrx] = useState("");
  const today = dayjs()
  const thisYear = dayjs().startOf('year')
  let minDate, maxDate

  
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

  const formTitles = {
    isAvailibilityEdcPath: "Avilibility EDC",
    isImplementationEDCPath: "Implementation EDC",
  };

  const handleDateChange = (date) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    setDateTrx(formattedDate);
  };

  const handleChange = (e, idx, field) => {
    const { value } = e.target;
    // console.log(e)
    if (!isNaN(value)) {
      setFormData(prevState => {
        const newState = [...prevState];
        if (!newState[idx]) {
          newState[idx] = {
            dateTrx: '',
            itemEdc: '',
            upTimeCRM: '',
            [categoryKpi]: ''
          };
        }

        newState[idx][field] = value;
        return newState;
      });
    }
  };

  const handleChangeSingle = (e, field) => {
    const { value } = e.target;
    if (!isNaN(value)) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [field]: value,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = formData.map(item => ({
      dateTrx: dateTrx,// Assuming current date, adjust as necessary
      itemEdc: item.itemEdc,
      targetItemEdc: item.targetItemEdc,
      [categoryKpi]: item[categoryKpi]
    }));

    console.log(payload)
    try {
      const res = await createDataKpiEDC(payload, getCookie('token'), isImplementationEDCPath ? "1" : "0")

      if (res) {
        if (res.status === "200") {
          navigate(id ? `./../..` : './../..')
        }
      }

    } catch (err) {
      console.error('Error: ', err)
    }
  }

  const checkDatabyDate = async () => {
    try {
      const res = await getDataKPIbyDate(dayjs(dateTrx).format("YYYY-MM"), isAvailibilityEdcPath ? "0" : isImplementationEDCPath ? "1" : "-1", isKPIEDCPath && "3", getCookie('token'))
      // console.log(res)
      // setFormData(res)
      if(!isAvailibilityEdcPath) {
        setFormData(res.data.map(item => ({
          // dateTrx: '',
          itemEdc: item.itemEdc,
          // itemTrxSLA: item.itemTrxSLA,
          [categoryKpi]: item[categoryKpi]
        })));

      } else {
        const firstItem = res.data[0];
        if (firstItem === undefined) setFormData([]);
        else {
          setFormData({
            // dateTrx: '',
            totalActiveTID: firstItem.totalActiveTID,
            totalTID: firstItem.totalTID
            // [categoryKpi]: firstItem.categoryMachine
          })
        }
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  }

  useEffect(() => {
    setFormData(masterdataCategory.map(item => ({
      dateTrx: '',
      itemEdc: '',
      upTimeATM: '',
      [categoryKpi]: item.id
    })));
  }, [masterdataCategory]);

  const MasterdataCategory = async () => {
    // if(isPaguKasPath || isSLAKasPath) return;
    const res = await getMasterdataCategory(isImplementationEDCPath ? "3" : null)
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
        {/* <Typography variant="h6" color="blue-gray" className="mb-2">
                    {item[categoryKey]}
                  </Typography>
                  <div className="flex pb-3 w-3/5">
                    <div className="flex w-96 justify-start items-end">
                      <label htmlFor={`itemEdc-${idx}`} className="px-4">Item EDC</label>
                    </div>
                    <Input
                      placeholder="Item EDC"
                      id={`itemEdc-${idx}`}
                      name="itemEdc"
                      value={formData[idx]?.itemEDC || ''}
                      onChange={(e) => handleChange(e, idx, 'itemEdc')}
                      variant="standard"
                    />
                  </div> */}
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
                      <label htmlFor={`itemEdc-${idx}`} className="px-4">Item EDC</label>
                    </div>
                    <Input
                      disabled={dateTrx ? false : true}
                      placeholder="Item EDC"
                      id={`itemEdc-${idx}`}
                      name="itemEdc"
                      value={formData[idx]?.itemEdc || ''}
                      onChange={(e) => handleChange(e, idx, 'itemEdc')}
                      variant="standard"
                    />
                  </div>
                  {/* <div className="flex mb-3 w-3/5">
                    <div className="flex w-96 justify-start items-end">
                      <label htmlFor={`itemTrxOnSLA-${idx}`} className="px-4">CRM</label>
                    </div>
                    <Input
                      placeholder="percentage Uptime CRM"
                      id={`upTimeCRM-${idx}`}
                      name="upTimeCRM"
                      value={formData[idx]?.upTimeCRM || ''}
                      onChange={(e) => handleChange(e, idx, 'upTimeCRM')}
                      variant="standard"
                    />
                  </div> */}
                </CardBody>
              </Card>
            );
          })}

        </div>
        {isAvailibilityEdcPath && <Card className="mt-6 w-3/5">
          <CardBody>
            <div className="flex mb-3 w-3/5">
              <div className="flex w-96 justify-start items-end">
                <label htmlFor="totalTID" className="px-4">
                  {/* {handleLabel(isPaguKasPath, "Realisasi", "Pengambilan Kas")} */}
                  Total Active TID
                </label>
              </div>
              <Input
                disabled={dateTrx ? false : true}
                placeholder="total Active TID"
                id="totalActiveTID"
                name="totalActiveTID"
                value={formData?.totalActiveTID || ''}
                onChange={(e) => handleChangeSingle(e, 'totalActiveTID')}
                variant="standard"
              />
            </div>
            <div className="flex mb-3 w-3/5">
              <div className="flex w-96 justify-start items-end">
                <label htmlFor="totalTID" className="px-4">
                  Total TID
                </label>
              </div>
              <Input
                disabled={dateTrx ? false : true}
                placeholder="total TID"
                id="totalTID"
                name="totalTID"
                value={formData?.totalTID || ''}
                onChange={(e) => handleChangeSingle(e, 'totalTID')}
                variant="standard"
              />
            </div>
          </CardBody>
        </Card>}


        <Button type="submit" className="w-fit">
          Submit
        </Button>
      </form>
    ) : navigate('./../..')
  );
};

export default KpiFormEDC;
