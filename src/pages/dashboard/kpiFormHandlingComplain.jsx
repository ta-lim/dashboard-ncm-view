import React, { useState, useEffect } from "react";
import { Button, Select, Option, Textarea, Input, Card, CardBody, Typography } from "@material-tailwind/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
// import createDataKpi from "@/api/activity/createDataKpi";
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
import createDataKpiHandlingComplain from "@/api/activity/createDataKpiHandlingComplain";
import getDataKPIbyDate from "@/api/activity/getDataKPIbyDate";


export function KpiFormHandlingComplain() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = useContext(IsLogin);
  const isRole = useContext(Role);
  const [isCategory, setCategory] = useState()
  const [masterdataCategory, setMasterDataCategory] = useState([])

  const isHandlingComplain = location.pathname.includes('handling-complain');
  const isDisputeResolution = location.pathname.includes('dispute-resolution');
  const isKPIHandlinPath = location.pathname.includes('kpi-complain');


  const [formData, setFormData] = useState([]);
  const categoryKpi = isHandlingComplain ? "categoryMachine" : null;
  const [dateTrx, setDateTrx] = useState("");
  const today = dayjs();
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
  // console.log(previousMonth, today)
  // const [masterdataCategory, setMasterdataCategory] = useState([]);

  const handleTitle = () => {
    for (const [key, value] of Object.entries(formTitles)) {
      if (eval(key)) {
        return value;
      }
    }
    return null;
  };

  const formTitles = {
    isHandlingComplain: "Komplain Handling",
    isDisputeResolution: "Feedback"
  };

  const handleLabel = (path, label1, label2) => (path ? label1 : label2);

  const handleChange = (e, idx, field) => {
    const { value } = e.target;
    // console.log(e)
    if (!isNaN(value)) {
      setFormData(prevState => {
        const newState = [...prevState];
        if (!newState[idx]) {
          newState[idx] = {
            dateTrx: '',
            itemTrx: '',
            itemTrxSLA: '',
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

  const checkDatabyDate = async () => {
    try{
      const res = await getDataKPIbyDate(dayjs(dateTrx).format("YYYY-MM"), isDisputeResolution ? "1" : isHandlingComplain ? "0"  : "-1", isKPIHandlinPath && "4", getCookie('token'))
      // console.log(res)
      // setFormData(res)
      if(isHandlingComplain){
        setFormData(res.data.map(item => ({
          dateTrx: '',
          itemTrx: item.itemTrx,
          itemTrxSLA: item.itemTrxSLA,
          [categoryKpi]: item[categoryKpi]
        })));
        
      } else {
        const firstItem = res.data[0];
        if (firstItem === undefined) setFormData([]);
        else {
          setFormData({
            // dateTrx: '',
            itemTrx: firstItem.itemTrx,
            itemTrxSLA: firstItem.itemTrxSLA
            // [categoryKpi]: firstItem.categoryMachine
          })
        }
      }
    }catch (err) {
      console.error('Error fetching data:', err);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = formData.map(item => ({
      dateTrx: dayjs(dateTrx).format('YYYY-MM'),// Assuming current date, adjust as necessary
      itemTrx: item.itemTrx.trim() ? item.itemTrx.replace(/,/g, '') : null,
      itemTrxSLA: item.itemTrxSLA.trim() ? item.itemTrxSLA.replace(/,/g, '') : null,
      [categoryKpi]: item[categoryKpi]
    }));

    try {
      const res = await createDataKpiHandlingComplain(payload, getCookie('token'), isDisputeResolution ? "1" : isHandlingComplain ? "0"  : "-1" )

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
    setFormData(masterdataCategory.map(item => ({
      dateTrx: '',
      itemTrx: '',
      itemTrxSLA: '',
      [categoryKpi]: item.id
    })));
  }, [masterdataCategory]);


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

  const MasterdataCategory = async () => {
    if (isDisputeResolution) return;
    const res = await getMasterdataCategory(isHandlingComplain ? "4" : null)
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
            views={['year', 'month']}
            minDate={minDate}
            maxDate={maxDate}
            // disablePast
            onChange={(e) => setDateTrx(e)}
          />
        </LocalizationProvider>
        {masterdataCategory.map((item, idx) => {
          const categoryKey = Object.keys(item).find(key => key.startsWith('category'));

          return (
            <Card className="mt-6 w-3/5" key={idx}>
              <CardBody>
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  {item[categoryKey]}
                </Typography>
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
                    disabled={dateTrx != "" ? false : true}
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
        {(isDisputeResolution) && (
          <Card className="mt-6 w-3/5">
            <CardBody>
              <div className="flex mb-3 w-3/5">
                <div className="flex w-96 justify-start items-end">
                  <label htmlFor={handleLabel(isDisputeResolution, "Item Transaction", "Pengambilan Kas")} className="px-4">
                    {handleLabel(isDisputeResolution, "Item Transaction", "Pengambilan Kas")}
                  </label>
                </div>
                <Input
                  disabled={dateTrx != ""? false : true}
                  placeholder={handleLabel(isDisputeResolution, "Item Transaction", "Pengambilan Kas")}
                  id={handleLabel(isDisputeResolution, "Item Transaction", "Pengambilan Kas")}
                  name="itemTrx"
                  value={formData?.itemTrx || ''}
                  onChange={(e) => handleChangeSingle(e, 'itemTrx')}
                  variant="standard"
                />
              </div>
              <div className="flex mb-3 w-3/5">
                <div className="flex w-96 justify-start items-end">
                  <label htmlFor={handleLabel(isDisputeResolution, "Item Transaction on SLA", "Pengisian Kas")} className="px-4">
                    {handleLabel(isDisputeResolution, "Item Transaction on SLA", "Pengisian Kas")}
                  </label>
                </div>
                <Input
                  disabled={dateTrx != "" ? false : true}
                  placeholder={handleLabel(isDisputeResolution, "Item Transaction on SLA", "Pengisian Kas")}
                  id={handleLabel(isDisputeResolution, "Item Transaction on SLA", "Pengisian Kas")}
                  name="itemTrxSLA"
                  value={formData?.itemTrxSLA || ''}
                  onChange={(e) => handleChangeSingle(e, 'itemTrxSLA')}
                  variant="standard"
                />
              </div>
            </CardBody>
          </Card>
        )}
        <Button type="submit" className="w-fit" 
                  disabled={dateTrx != "" ? false : true}>
          Submit
        </Button>
      </form>
    ) : id ? navigate('./../..') : navigate('./..')
  );
};

export default KpiFormHandlingComplain;
