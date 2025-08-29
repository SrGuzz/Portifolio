import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Tooltip,
} from "@material-tailwind/react";
import { Github, Linkedin, Mail } from "lucide-react";
import { Links } from "../data/constants";

export function ProfileCard({ Img, Name, Url }) {
  return (
    <Card className="w-96 bg-gray-200">
      <CardHeader floated={false} className="h-80">
        <img src={Img} alt="profile-picture" />
      </CardHeader>
      <CardBody className="text-center">
        <Typography variant="h4" color="blue-gray" className="mb-2 font-ubuntu">
          {Name}
        </Typography>
        <Typography color="blue-gray" className="font-medium font-ubuntu" textGradient>
          Full Stack Developer
        </Typography>
      </CardBody>
      <CardFooter className="flex justify-center gap-7 pt-2">
        <Tooltip content="Github">
          <a href={Url}>
            <Github />
          </a>
        </Tooltip>
        <Tooltip content="Linkedin">
          <a href={Links.Linkedin}>
            <Linkedin />
          </a>
        </Tooltip>
        <Tooltip content="E-Mail">
          <a href={Links.Email}>
            <Mail />
          </a>
        </Tooltip>
      </CardFooter>
    </Card>
  );
}
