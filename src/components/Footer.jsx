import { Instagram, Github, Linkedin, Mail } from "lucide-react";
import { Links } from "../data/constants";
import Wave from "../assets/wave14.svg";

function footer() {
  return (
    <>
      <div id="footer">
        <div className=" bg-slate-300">
          <img src={Wave} alt="" />
        </div>
        <footer className="bg-slate-700 px-4 md:px-16 lg:px-28">
          <div className="flex text-center gap-8 py-4 lg:px-28 w-full justify-center">
            <div className="text-center">
              <h2 className="text-lg font-bold mb-4 text-slate-200 font-ubuntu">
                About Us
              </h2>
              <p className="text-gray-300 font-ubuntu text-center">
                This project was developed as part of the Software Development
                Laboratory course at PUC Minas. The technologies used in its
                implementation were Vite, React, and Tailwind CSS.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-600 p-4 text-gray-300 mt-2">
            <p className="text-center">
              © 2025 Code With Davi Benjamim All Rigths Reserved
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default footer;
