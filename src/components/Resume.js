import { useState } from "react";
import CV from "../assets/CV-EN.pdf";
import CV2 from "../assets/CV-PT.pdf";

export default function Resume() {
  // 'pt' ou 'en'
  const [lang, setLang] = useState("pt");
  const currentCV = lang === "pt" ? CV2 : CV;

  return (
    <div className="container py-4 d-flex flex-column align-items-center gap-3">
      {/* Botões de idioma */}
      <div className="d-flex gap-3 p-3 flex-wrap">
        <button
          type="button"
          onClick={() => setLang("pt")}
          className={`btn btn-lg d-flex align-items-center gap-2 px-4 ${
            lang === "pt" ? "btn-dark active" : "btn-outline-dark"
          }`}
          aria-pressed={lang === "pt"}
          style={{ width: "13rem" }} // ~ w-52
        >
          {/* 🇧🇷 */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 448"
            style={{ width: "1.2em", height: "1.2em", borderRadius: 2 }}
          >
            <rect width="640" height="448" fill="#009b3a" />
            <path fill="#ffdf00" d="M320 48L592 224 320 400 48 224 320 48Z" />
            <circle cx="320" cy="224" r="96" fill="#002776" />
            <g transform="rotate(-15 320 224)">
              <path
                d="M224 224c0-30 43-56 96-56s96 26 96 56"
                fill="none"
                stroke="#ffffff"
                strokeWidth="20"
                strokeLinecap="round"
              />
              <path
                d="M224 236c0-30 43-56 96-56s96 26 96 56"
                fill="none"
                stroke="#ffffff"
                strokeWidth="12"
                strokeLinecap="round"
                opacity=".9"
              />
            </g>
          </svg>
          <span>Portuguese</span>
        </button>

        <button
          type="button"
          onClick={() => setLang("en")}
          className={`btn btn-lg d-flex align-items-center gap-2 px-4 ${
            lang === "en" ? "btn-dark active" : "btn-outline-dark"
          }`}
          aria-pressed={lang === "en"}
          style={{ width: "13rem" }}
        >
          {/* 🇺🇸 */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 7410 3900"
            style={{ width: "1.2em", height: "1.2em", borderRadius: 2 }}
          >
            <path fill="#b22234" d="M0 0h7410v3900H0z" />
            <path
              stroke="#fff"
              strokeWidth="300"
              d="M0 450h7410M0 1050h7410M0 1650h7410M0 2250h7410M0 2850h7410M0 3450h7410"
            />
            <path fill="#3c3b6e" d="M0 0h2964v2100H0z" />
          </svg>
          <span>English</span>
        </button>
      </div>

      {/* Visualizador do PDF */}
      <div className="w-100" style={{ maxWidth: 1024 }}>
        <div className="shadow-lg rounded-3 overflow-hidden">
          <iframe
            key={currentCV} // força recarregamento ao trocar idioma
            src={currentCV}
            title={`PDF Viewer (${lang.toUpperCase()})`}
            className="w-100"
            style={{ border: "none", height: "80vh" }}
          />
        </div>
      </div>
    </div>
  );
}
