import React, { useState, useEffect } from "react";
import { Button, Select, Option, Textarea, Input } from "@material-tailwind/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import createData from "@/api/activity/createData";
import getDetail from "@/api/activity/getDetail";
import updateData from "@/api/activity/updateData";
import { useContext } from "react";
import { IsLogin } from "@/context";
import CheckToken from "@/api/auth/checkToken";
import { getCookie } from "cookies-next";

export function ProjectForm() {
  const { id } = useParams();
  const location = useLocation();
  const  navigate = useNavigate();
  const isLogin = useContext(IsLogin)
  const [isCategory, setCategory] = useState()

  const isProjectPath = location.pathname.includes('project');
  const isActivityPath = location.pathname.includes('activity');
  const isBusinessPlanPath = location.pathname.includes('business-plan');

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    picOne: "",
    picTwo: "",
    crNumber: "",
    UIC: "",
    timeline: "",
    status: "",
    category: "",
    subCategory: null,
  });

  const handleChange = (e) => {
    // console.log(formData.subCategory)
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setCategory(isBusinessPlanPath ? "3" : isActivityPath ? "2" : isProjectPath ? "1" : null)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isLogin = await CheckToken(getCookie('token'))
    if(isLogin){
      const res = id ? await updateData(formData, getCookie('token')) : await createData(formData, getCookie('token'))
      if(res){
        if(res.status === '200'){
          navigate(id ? `./../..` : './../')
        }
      }
    }
  };

  useEffect(() => {
    setFormData((prevData) => ({ ...prevData, ['category']:isCategory }));
  }, [isCategory])

  useEffect(() => {
    async function getDetailData() {
      const res = await getDetail(id)
      if(res){
        if(res.status === '200'){
          setFormData(res.data)
        }
      }
    }

    if (id){
      getDetailData();
    }
  }, [id]);

  return (
    isLogin ? (
    <form onSubmit={handleSubmit} className="your-form-classname">
      {
        isBusinessPlanPath &&
          <div className="flex mb-3 items-center w-1/5 md:w-3/5">
            <Select
                label="Sub Category"
                value={formData.subCategory}
                onChange={(value) => handleChange({ target: { name: "subCategory", value } })}
                name="subCategory"
                disabled={id ? true : false}
              >
                <Option value="1">RPA</Option>
                <Option value="2">City Net</Option>
                <Option value="3">EUC</Option>
                <Option value="4">Pelatihan</Option>
              </Select>
          </div>
      }
      <div className="flex mb-3 w-2/5">
        <div className="flex w-36 justify-start items-end">
          <label htmlFor="title" className="px-4">
            Title
          </label>
        </div>
        <Input
          placeholder="Title"
          rows={1}
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          variant="standard"
        />
      </div>
      <div className="flex mb-3">
        <div className="flex w-32 justify-start items-start mt-4">
          <label htmlFor="description" className=" px-4 ">
            Description
          </label>
        </div>
        <Textarea
          variant="standard"
          placeholder="Description"
          rows={10}
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          // className=" h-48 w-96"
        />
      </div>
      <div className=" flex mb-3 w-2/5">
        <div className="flex w-36 justify-start items-end">
          <label htmlFor="picOne" className="px-4">
            PIC 1 
          </label>
        </div>
        <Input
          placeholder="PIC 1"
          id="picOne"
          name="picOne"
          value={formData.picOne}
          onChange={handleChange}
          variant="standard"
        />
      </div>
      <div className="flex mb-3 w-2/5">
        <div className="flex w-36 justify-start items-end">
          <label htmlFor="picTwo" className="px-4">
            PIC 2
          </label>
        </div>
        <Input
          placeholder="PIC 2"
          rows={1}
          id="picTwo"
          name="picTwo"
          value={formData.picTwo}
          onChange={handleChange}
          variant="standard"
        />
      </div>
      <div className="flex mb-3 w-2/5">
        <div className="flex w-36 justify-start items-end">
          <label htmlFor="crNumber" className="px-4">
            CrNumber
          </label>
        </div>
        <Input
          placeholder="CR Number"
          id="crNumber"
          name="crNumber"
          value={formData.crNumber}
          onChange={handleChange}
          variant="standard"
        />
      </div>
      <div className="flex mb-3 w-2/5">
        <div className="flex w-36 justify-start items-end">
          <label htmlFor="UIC" className="px-4">
            UIC
          </label>
        </div>
      <Input
          placeholder="UIC"
          id="UIC"
          name="UIC"
          value={formData.UIC}
          onChange={handleChange}
          variant="standard"
        />
      </div>
      <div className={`flex mb-3 items-center w-2/5 md:w-3/5`}>
        {
          (formData.subCategory === '4' && isBusinessPlanPath) ? 
            <Select
            label="Progress"
            value={formData.status}
            onChange={(value) => handleChange({ target: { name: "status", value } })}
            name="status"
          >
            
              <Option value="8">Pending</Option>
              <Option value="9">On Progress</Option>
              <Option value="10">Done</Option>
              
            </Select>
           :
            <Select
            label="Progress"
            value={formData.status}
            onChange={(value) => handleChange({ target: { name: "status", value } })}
            name="status"
          >
            
              <Option value="7">Requirement</Option>
              <Option value="1">Design</Option>
              <Option value="2">Development</Option>
              <Option value="3">Testing</Option>
              <Option value="4">Promote</Option>
              <Option value="5">PIR</Option>
              <Option value="6">Go Live</Option>
            
        </Select>
        }
      </div>
      <div className="flex mb-3 w-2/5 md:w-3/5">
        <Select
          label="Timeline"
          value={formData.timeline}
          onChange={(value) => handleChange({ target: { name: "timeline", value } })}
          name="timeline"
        >
          <Option value="1">Q1 - 2024</Option>
          <Option value="2">Q2 - 2024</Option>
          <Option value="3">Q3 - 2024</Option>
          <Option value="4">Q4 - 2024</Option>
        </Select>
      </div>     
      <Button type="submit" className="your-button-classname" >
        Submit
      </Button>
    </form>
    ) : id ?  navigate('./../..') : navigate('./..')
  );
};

export default ProjectForm;
