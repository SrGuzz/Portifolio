import { useState } from "react";
import CV from "../assets/CVDaviGuimaraes.pdf";
import CV2 from "../assets/CV-PT.pdf";

export default function PdfViewer() {
  // 'pt' ou 'en' — ajuste o default que você quer
  const [lang, setLang] = useState("pt");

  // mapeia a língua para o arquivo
  const currentCV = lang === "pt" ? CV2 : CV; // troque se estiver invertido no seu projeto

  return (
    <div className="flex justify-center items-center h-screen flex-col gap-2">
      <div className="flex gap-5 p-5">
        <button
          type="button"
          onClick={() => setLang("pt")}
          className={`font-ubuntu btn btn-accent btn-soft btn-xl w-52 flex items-center gap-2 ${
            lang === "pt" ? "btn-active" : ""
          }`}
          aria-pressed={lang === "pt"}
        >
          {/* 🇧🇷 SVG (JSX: use className / strokeWidth / strokeLinecap) */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 448" className="size-[1.2em] rounded-[2px]">
            <rect width="640" height="448" fill="#009b3a" />
            <path fill="#ffdf00" d="M320 48L592 224 320 400 48 224 320 48Z" />
            <circle cx="320" cy="224" r="96" fill="#002776" />
            <g transform="rotate(-15 320 224)">
              <path d="M224 224c0-30 43-56 96-56s96 26 96 56" fill="none" stroke="#ffffff" strokeWidth="20" strokeLinecap="round" />
              <path d="M224 236c0-30 43-56 96-56s96 26 96 56" fill="none" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" opacity=".9" />
            </g>
          </svg>
          <p>Portuguese</p>
        </button>

        <button
          type="button"
          onClick={() => setLang("en")}
          className={`font-ubuntu btn btn-info btn-soft btn-xl w-52 flex items-center gap-2 ${
            lang === "en" ? "btn-active" : ""
          }`}
          aria-pressed={lang === "en"}
        >
          {/* 🇺🇸 SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7410 3900" className="size-[1.2em]">
            <path fill="#b22234" d="M0 0h7410v3900H0z" />
            <path stroke="#fff" strokeWidth="300" d="M0 450h7410M0 1050h7410M0 1650h7410M0 2250h7410M0 2850h7410M0 3450h7410" />
            <path fill="#3c3b6e" d="M0 0h2964v2100H0z" />
          </svg>
          <p>English</p>
        </button>
      </div>

      <div className="w-full max-w-4xl h-full shadow-lg rounded-lg overflow-hidden">
        <iframe
          key={currentCV}                // re-monta o iframe ao trocar a src
          src={currentCV}
          title={`Visualizador de PDF (${lang.toUpperCase()})`}
          className="w-full h-full"
          style={{ border: "none" }}
        >
          Este navegador não suporta a incorporação de PDF. Você pode{" "}
          <a href={currentCV} download>baixar o arquivo</a>.
        </iframe>
      </div>
    </div>
  );
}
