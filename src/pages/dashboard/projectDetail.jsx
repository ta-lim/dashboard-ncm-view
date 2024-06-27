import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Avatar,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
  Switch,
  Tooltip,
  Button,
} from "@material-tailwind/react";
import {
  HomeIcon,
  ChatBubbleLeftEllipsisIcon,
  Cog6ToothIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { useState, useEffect, useContext } from "react";
import { Link,useNavigate,useParams } from "react-router-dom";
import { ProfileInfoCard, MessageCard } from "@/widgets/cards";
import getDetail from "@/api/activity/getDetail";
import deleteData from "@/api/activity/deleteData";
import { getCookie } from "cookies-next";
import { Role } from "@/context";

export function ProjectDetail() {
  const [data, setData] = useState([]);
  const {id} = useParams();
  const navigate = useNavigate();
  const role = useContext(Role)
  
  const  deleteProject = async () => {
    const res = await deleteData( id , getCookie('token') )

    if(res) {
      if(res.status === '200'){
        navigate('./..')
      }
    }
  };
  
  
  useEffect(() => {
    async function getDetailData() {
      const res = await getDetail(id)
      if(res){
        if(res.status === '200'){
          setData(res.data)
        }
      }
    }
    getDetailData();
  }, [])

  const isProjectPath = location.pathname.includes('project') 
  const isActivityPath = location.pathname.includes('activity') 
  const isBusinessPlanPath = location.pathname.includes('business-plan') 

  const category =
  isBusinessPlanPath ? "business-plan" :
  isActivityPath ? "activity" :
  isProjectPath ? "project" :
  "";

  return (
    <>
      <div className="relative mt-8 h-24 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover	bg-center">
        <div className="absolute inset-0 w-full bg-gray-900/75" />
      </div>
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
        <CardBody className="p-4">
          <div className="mb-10 flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-6">
              <div>
                <Typography variant="h5" color="blue-gray" className="mb-1">
                  {data.title}
                </Typography>
              </div>
            </div>
          </div>
          <div className="gird-cols-1 mb-12 grid gap-12 px-4 lg:grid-cols-2 xl:grid-cols-1">
            <ProfileInfoCard
              title="Project Description"
              description={data.description}
              details={{
                "PIC 1": data.picOne,
                "PIC 2": data.picTwo,
                crNumber: data.crNumber,
                UIC: data.UIC,
                subCategory: data.subCategory,
                status: data.status,
                timeline: data.timeline,
              }}
              action={
                <>
                <Tooltip content="Edit Project" >
                  <PencilIcon className="h-4 w-4 cursor-pointer text-blue-gray-500" onClick={() => navigate(`../${category}/edit/${id}`)}/>
                </Tooltip>
                {
                  role === "super admin" &&
                  <Tooltip content="Delete Project" >
                    <TrashIcon className="h-4 w-4 cursor-pointer text-blue-gray-500" onClick={() => deleteProject() }/>
                  </Tooltip>
                }
                </>
              }
            />
          </div>
        </CardBody>
      </Card>
    </>
    // ) : navigate('/project')
  );
}

export default ProjectDetail;
