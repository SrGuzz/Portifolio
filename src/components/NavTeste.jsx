import { FaBars, FaTimes } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom"; // 1. Importado do react-router-dom
import { useEffect, useState } from "react";
import Logo from "../assets/Logo.png";

// 2. Dados de exemplo (antes vinham de "@/lib/constants")
const ROUTES = {
  HOME: "/",
};

const links = [
  { id: 1, name: "Home", url: "#home" },
  { id: 2, name: "About Me", url: "#about" },
  { id: 3, name: "Resume", url: "#resume" },
  { id: 4, name: "Contact", url: "#contact" },
  { id: 5, name: "Projects", url: "#projects" },
];

const Nav = () => {
  const [nav, setNav] = useState(false);
  const { pathname } = useLocation(); // 3. Usando o useLocation para pegar o caminho da URL

  // Fecha o menu mobile se a tela for redimensionada para desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // md: 768px
        setNav(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <header className="absolute w-full">
      <div className="hidden md:flex justify-center">
        <div className="container py-5 px-10 lg:px-4 max-w-screen-xl flex justify-between">
          <img src={Logo} alt="" className=" w-32 h-16  flex justify-center" />
          <ul className="flex items-center gap-4">
            {links.map((item) => (
              <a href={item.url} className="btn text-lg btn-ghost hover:text-neutral text-neutral-content font-ubuntu">{item.name}</a>
            ))}
          </ul>
        </div>
      </div>

      {/* Header para Mobile */}
      <div className="md:hidden bg-slate-300 absolute py-5 w-full justify-center border-b">
        <div className="container pl-10 pr-7 lg:px-0 flex justify-between items-center">
          <img src={Logo} alt="" className=" h-8 flex justify-center" />
          <div
            onClick={() => setNav((prev) => !prev)}
            className="flex cursor-pointer focus:ring md:hidden"
          >
            {nav ? <FaTimes size={30} /> : <FaBars size={30} />}
          </div>
        </div>
      </div>

      {/* Menu Dropdown Mobile */}
      {nav && (
        <ul className="md:hidden transition duration-200 bg-slate-300 border p-2 flex flex-col rounded-b items-left absolute z-30 top-[72px] right-0 w-[200px] bg-background">
          {links.map(({ id, url, name }) => (
            <li
              key={id}
              className={`px-4 cursor-pointer font-ubuntu capitalize py-3 text-base duration-200 text-muted-foreground hover:[transform:translateY(-0.25rem)] ${
                pathname === url
                  ? "font-semibold text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <Link onClick={() => setNav(false)} to={url}>
                {" "}
                {/* 4. "href" trocado por "to" */}
                {name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
};

export default Nav;
