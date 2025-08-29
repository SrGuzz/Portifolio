import waveImage from "../assets/wave3.svg";
import { USER_INFO } from "../data/constants";

export default function Home() {
  const nameChars = USER_INFO.name.length; // p/ steps da 2ª linha

  return (
    <div id="home" className="bg-slate-700 flex flex-col justify-between pt-40">
      {/* CSS do typewriter */}
      <style>{`
        .tw {
          overflow: hidden;
          white-space: nowrap;
          border-right: .14em currentColor solid; /* cursor */
        }
        .tw1 {
          width: 0;
          animation: typing1 2.2s steps(16, end) forwards, blink .8s step-end infinite;
        }
        .tw2 {
          width: 0;
          animation: typing2 1.8s steps(${nameChars}, end) forwards 2.25s,
                     blink .8s step-end infinite 2.25s;
        }
        @keyframes typing1 { to { width: 16ch } }              /* "Hello World, I'm" = 16 */
        @keyframes typing2 { to { width: ${nameChars}ch } }    /* tamanho do nome */
        @keyframes blink { 50% { border-color: transparent } }
        @media (prefers-reduced-motion: reduce) {
          .tw, .tw1, .tw2 { animation: none; border-right: none; width: auto; }
        }
      `}</style>

      <div className="flex gap-8">
        <div className="mx-auto content-center">
          {/* Linha que digita */}
          <h1 className="tw tw1 font-mono font-bold text-3xl md:text-6xl text-gray-300">
            Hello World, I&apos;m
          </h1>
          {/* Nome digitando depois */}
          <p className="tw tw2 font-mono font-bold text-5xl md:text-8xl text-white/90">
            {USER_INFO.name}
          </p>
        </div>
      </div>

      <div className="flex items-end">
        <img src={waveImage} alt="Wave" />
      </div>
    </div>
  );
}
