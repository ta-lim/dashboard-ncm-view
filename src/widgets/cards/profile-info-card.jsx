import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Chip,
} from "@material-tailwind/react";
import getStatusInfo from "@/handlers/getStatusInfo";
import getTimelineInfo from "@/handlers/getTimelineInfo";
import { useContext } from "react";
import { IsLogin } from "@/context";

const getSubCategoryInfo = (subCategory) => {
  switch (subCategory) {
    case "1":
      return { labelSubCategory: 'RPA', colorSubCategory: 'green' };
    case "2":
      return { labelSubCategory: 'City Net', colorSubCategory: 'purple' };
    case "3":
      return { labelSubCategory: 'EUC', colorSubCategory: 'orange' };
    case "4":
      return { labelSubCategory: 'Pelatihan', colorSubCategory: 'blue' };
    default:
      return { labelSubCategory: 'Unknown Status', colorSubCategory: 'gray' };
  }
};

export function ProfileInfoCard({ title, description, details, action }) {
  const {labelStatus, colorStatus} = getStatusInfo(details['status'])
  const {labelTimeline, colorTimeline} = getTimelineInfo(details['timeline'])
  const {labelSubCategory, colorSubCategory} = getSubCategoryInfo(details['subCategory'])
  const isLogin = useContext(IsLogin)
   return (
    <Card color="transparent" shadow={false}>
      <CardHeader
        color="transparent"
        shadow={false}
        floated={false}
        className="mx-0 mt-0 mb-4 flex items-center justify-start gap-8"
      >
        <Typography variant="h6" color="blue-gray">
          {title}
        </Typography>
        {isLogin && action}
      </CardHeader>
      <CardBody className="p-0">
        { (description && details['subCategory'] !== '4') && (
          <Typography
            variant="small"
            className="font-normal text-blue-gray-500"
          >
            {description}
          </Typography>
        )}
        {description && details ? (
          <hr className="my-8 border-blue-gray-50" />
        ) : null}
        {details && (
          <ul className="flex flex-col gap-4 p-0 w-fit">
            {Object.keys(details).map((el, key) => {
              if(details[el] === null || details[el] === '') return <></>
              if(el === 'status' || el === 'timeline' || el === 'subCategory') {
                return (
              <li key={key} className="flex gap-4">
                <div className="w-24">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-semibold capitalize"
                    >
                    {el} 
                  </Typography>
                </div>
                :<Chip
                    color={el === 'subCategory' ? colorSubCategory : colorTimeline} 
                    size="sm" 
                    value={
                      <Typography
                      variant="small"
                      color="white"
                      className="font-medium capitalize leading-none items-center "
                      >
                      {el === 'status' ? labelStatus : el === 'subCategory' ? labelSubCategory : labelTimeline}        
                      </Typography>
                    } 
                    className={`flex rounded-full flex-col items-center w-28 ${el === 'status' ? colorStatus : el === 'subCategory' ? colorSubCategory : colorTimeline}`}/>
                  </li>
                )
              } 
            return(
              <li key={key} className="flex gap-4">
                <div className="w-24 ">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-semibold capitalize"
                  >
                    {el}
                  </Typography>
                </div>
                {typeof details[el] === "string" ? (
                    <div className="w-32">
                    
                        <Typography
                        variant="small"
                        className="font-normal text-blue-gray-500 whitespace-preline"
                      >
                        : {details[el]}
                      </Typography>
                    </div>  
                ) : (
                  details[el]
                )}
              </li>
            )})}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}

ProfileInfoCard.defaultProps = {
  action: null,
  description: null,
  details: {},
};

ProfileInfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.node,
  details: PropTypes.object,
};

ProfileInfoCard.displayName = "/src/widgets/cards/profile-info-card.jsx";

export default ProfileInfoCard;
