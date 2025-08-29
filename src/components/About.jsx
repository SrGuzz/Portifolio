import PageTitle from "./PageTitle";
import FotoPerfil from "../assets/albert.jpg";
import { TimelineWithIcon } from "./TimeLine";

function About() {
  return (
    <div id="about" className=" w-full bg-slate-300">
      <div className="px-10 lg:px-32">
        <div className="flex flex-row ">
          <PageTitle title="About me" />
        </div>
        <div className="flex flex-col lg:flex-row lg:pb-4 gap-4">
          <img
            src={FotoPerfil}
            alt=""
            className=" w-[400px] h-[500px] rounded-xl"
          />
          <div className="flex  flex-col justify-center gap-4">
            <span className="font-ubuntu font-bold text-slate-700  text-center">
              Software Engineering undergraduate (6th semester) at PUC Minas. 
              Currently a full-stack intern at CGE-MG, developing and maintaining web systems with PHP/Laravel, Livewire, Tailwind, Git, and MySQL in an agile environment (code reviews, testing, documentation).  
              Academic projects include GLET—a logistics web platform with real-time performance indicators—and Barber Flow—a finance and operations system for barbershops.  
              I value quality, collaboration, and clean code.
            </span>
            <TimelineWithIcon />
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
