import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import Chart from "react-apexcharts";
import PropTypes from "prop-types";

const chartConfig = (rank) => {
  const summaryRank = rank
  const categories = summaryRank.map(item => item.name); 
  const countArray = Object.values(summaryRank).map(obj => obj.count);
  return {
    type: "bar",
    height: 200,
    series: [{
      data: countArray
    }],
    options: {
      chart: {
        stacked: true,
        toolbar: {
          show: false,
        },
      },
      title: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      // colors: ["#020617", "#ff8f00", "#00897b", "#1e88e5", "#d81b60"],
      // colors: ["#ff8f00", "#ff6600", "#ffaa33", "#ff8000"],
      colors: ["#009c8f", "#00afa3", "#00c2b7", "#00e8df", "#00897b"],
      plotOptions: {
        bar: {
          columnWidth: "40%",
          distributed: true,
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
          show: false,
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
        categories: categories,
      },
      yaxis: {
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
      },
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
      fill: {
        opacity: 0.8,
      },
      tooltip: {
        theme: "dark",
        y:{
          title: {
            formatter: function (val, opt) {
              return opt.w.globals.labels[opt.dataPointIndex]
            }
          }
        },
      },
    },
  };
};



// const chartConfig = (rank) => {
//   const names = Object.keys(rank);
//   const counts = Object.values(rank).map(item => item.count);
  
//   return ({
//     type: "donut",
//     width: 200,
//     height: 220,
//     series: counts,
//     // labels: ['name1','name2', 'name2','name3','name4'],
    

//     options: {
//       chart: {
//         toolbar: {
//           show: false,
//         },
//       },
//       labels: names,
//       title: {
//         show: "",
//       },
//       dataLabels: {
//         enabled: true,
//         formatter: function (val, opts) {
//           const index = opts.seriesIndex;
//           return counts[index];
//         }
//       },
//       colors: ["#020617", "#ff8f00", "#00897b", "#1e88e5", "#d81b60"],
//       legend: {
//         position: 'bottom',
//       },
//     },
//   })
// };

export function StatisticsCard({ color, icon, title, status, footer, count, rank }) {
  return (
    <Card className="border border-blue-gray-100 shadow-sm">
      <CardHeader
        variant="gradient"
        color={color}
        floated={false}
        shadow={false}
        className="absolute grid h-12 w-12 place-items-center"
      >
        {icon}
      </CardHeader>
      <CardBody className="p-4 text-right">
        <Typography variant="small" className="font-normal text-blue-gray-600">
          {title}
        </Typography>
        <Typography variant="h4" color="blue-gray">
          {count}{status}
        </Typography>
        {
          Object.keys(rank).length !== 0 && <Chart {...chartConfig(rank)} />      
        }
      </CardBody>
      {footer && (
        <CardFooter className="border-t border-blue-gray-50 p-4">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}

StatisticsCard.defaultProps = {
  color: "blue",
  footer: null,
};

StatisticsCard.propTypes = {
  color: PropTypes.oneOf([
    "white",
    "blue-gray",
    "gray",
    "brown",
    "deep-orange",
    "orange",
    "amber",
    "yellow",
    "lime",
    "light-green",
    "green",
    "teal",
    "cyan",
    "light-blue",
    "blue",
    "indigo",
    "deep-purple",
    "purple",
    "pink",
    "red",
  ]),
  icon: PropTypes.node.isRequired,
  title: PropTypes.node.isRequired,
  status: PropTypes.node.isRequired,
  footer: PropTypes.node,
};

StatisticsCard.displayName = "/src/widgets/cards/statistics-card.jsx";

export default StatisticsCard;
