  import {
    Timeline,
    TimelineItem,
    TimelineConnector,
    TimelineHeader,
    TimelineIcon,
    TimelineBody,
    Typography,
  } from "@material-tailwind/react";
  import { BellIcon, CurrencyDollarIcon } from "@heroicons/react/24/solid";
  import { Time_Line } from "../data/constants";

  export function TimelineWithIcon() {
    return (
      <div className="">
        <Timeline>
          {Time_Line.map((item, index) => (
            <TimelineItem key={index}>
              <TimelineConnector className="bg-transparent" />
              <TimelineHeader>
                <TimelineIcon className="p-2">{item.icon}</TimelineIcon>
                <Typography
                  variant="h5"
                  color="blue-gray"
                  className="font-ubuntu"
                >
                  {item.title}
                </Typography>
              </TimelineHeader>
              <TimelineBody className="pb-8">
                <Typography
                  color="gary"
                  className="font-normal text-gray-600 font-ubuntu"
                >
                  {item.text}
                </Typography>
              </TimelineBody>
            </TimelineItem>
          ))}
        </Timeline>
      </div>
    );
  }
