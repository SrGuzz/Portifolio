import PdfViewer from "./PDF";
import Wave from "../assets/wave14.svg";

function Resume() {
  return (
    <>
      <div className=" bg-slate-300">
        <img src={Wave} alt="" />
      </div>
      <div id="resume" className=" bg-slate-700">
        <div className="px-10 lg:px-32">
          <div className="flex mb-4">
            <h1 className="text-gray-400 font-bold font-ubuntu text-3xl ">Resume</h1>
          </div>
        </div>
        <div className=""></div>
        <PdfViewer />
      </div>
    </>
  );
}

export default Resume;
