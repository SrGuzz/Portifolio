import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";
import { AlignJustify } from "lucide-react";

export function MenuDefault() {
  return (
    <Menu className="">
      <MenuHandler className="bg-slate-700 ">
        <Button>
          <AlignJustify color="#cbd5e1" />
        </Button>
      </MenuHandler>
      <MenuList>
        <MenuItem>Home</MenuItem>
        <MenuItem>About</MenuItem>
        <MenuItem>Projects</MenuItem>
        <MenuItem>Portfolio</MenuItem>
        <MenuItem>Contact</MenuItem>
      </MenuList>
    </Menu>
  );
}
