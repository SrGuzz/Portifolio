import { Instagram, Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { Links } from "../data/constants";
import { USER_INFO } from "../data/constants";
import waveImage from "../assets/wave3.svg";

export function Contact() {
  // Certifique-se de que essa função esteja dentro do seu componente React
  const enviarMensagem = async () => {
    const endpoint = "https://formspree.io/f/mandnrvo"; // Substitua pelo seu endpoint Formspree

    // 1. Pegue os valores dos inputs usando os IDs
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const assunto = document.getElementById("assunto").value;
    const mensagem = document.getElementById("mensagem").value;

    // 2. Monte o objeto com os dados
    const dadosDoFormulario = {
      nome: nome,
      email: email,
      assunto: assunto,
      mensagem: mensagem,
    };

    // 3. Validação básica (opcional, mas recomendado)
    if (!nome || !email || !mensagem) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return; // Interrompe a função se a validação falhar
    }

    // 4. Faça a requisição para o Formspree
    try {
      const resposta = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(dadosDoFormulario),
      });

      if (resposta.ok) {
        // Opcional: Limpar o formulário após o envio
        document.getElementById("nome").value = "";
        document.getElementById("email").value = "";
        document.getElementById("assunto").value = "";
        document.getElementById("mensagem").value = "";
      } else {
        const erro = await resposta.json();
        console.error("Falha ao enviar a mensagem:", erro);
        alert("Ocorreu um erro ao enviar a mensagem. Tente novamente.");
      }
    } catch (error) {
      console.error("Ocorreu um erro na requisição:", error);
      alert("Ocorreu um erro de conexão. Verifique sua internet.");
    }
  };

  return (
    <>
      <div id="contact" className=" bg-slate-700 pt-8">
        <div className="px-6 lg:px-32 pb-6">
          <div className="flex mb-4">
            <h1 className="text-gray-400 font-bold text-3xl font-ubuntu">
              Contact
            </h1>
          </div>

          <div className="flex gap-4 m-auto flex-col lg:flex-row">
            <div className="flex flex-col gap-6 lg:w-1/2 justify-center">
              <div className="flex flex-col items-center gap-[20px]">
                <div className="border-2 lg:w-[80%] w-full p-2 bg-gray-300 flex gap-1 shadow-md rounded-xl">
                  <div className="p-3 rounded-xl">
                    <Mail color="#334155" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-700 font-bold font-ubuntu text-sm">
                      Email
                    </span>
                    <span className="font-ubuntu ">{USER_INFO.email}</span>
                  </div>
                </div>

                <div className="border-2 lg:w-[80%] w-full   p-2 bg-gray-300 flex gap-1 shadow-md rounded-xl">
                  <div className="p-3">
                    <MapPin color="#334155" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-700 font-bold font-ubuntu text-sm">
                      Location
                    </span>
                    <span className="font-ubuntu">Belo Horizonte, Brasil</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between lg:gap-4 mx-auto lg:w-[80%]">
                <div className=" py-5 px-10 rounded-xl bg-neutral">
                  <a href={Links.Github}>
                    {" "}
                    <Github color="#fff" />
                  </a>
                </div>
                <div className=" py-5 px-10 rounded-xl bg-gradient-to-br from-[#b60fcf]  to-[#fd7601]">
                  <a href={Links.Instagram}>
                    <Instagram color="#fff" />
                  </a>
                </div>
                <div className=" py-5 px-10 rounded-xl bg-[#0967C2]">
                  <a href={Links.Linkedin}>
                    {" "}
                    <Linkedin color="#fff" />
                  </a>
                </div>
                <div className=" py-5 px-10 rounded-xl bg-[#FF9900]">
                  <a href={Links.Email}>
                    <Mail color="#fff" />
                  </a>
                </div>
              </div>
              <span className="font-ubuntu text-Neutral-300  text-center">
                You're welcome to write in English or Portuguese. <br />I
                usually reply within a day!
              </span>
            </div>

            <div className="card card-dash bg-neutral-content text-neutral w-full lg:w-1/2 font-ubuntu">
              <div className="card-body justify-between gap-5">
                <div className="grid gap-5">
                  <div className="flex gap-5 justify-between">
                    <fieldset className="fieldset w-1/2">
                      <legend className="fieldset-legend">Name</legend>
                      <input type="text" className="input w-full" placeholder="Your full name" />
                    </fieldset>

                    <fieldset className="fieldset w-1/2">
                      <legend className="fieldset-legend">Email</legend>
                      <input type="text" className="input w-full" placeholder="your.email@example.com" />
                    </fieldset>
                  </div>

                  <div className="grid gap-5">
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend">Subject</legend>
                      <input
                        id="assunto"
                        type="text"
                        className="input w-full"
                        placeholder="What is this about?"
                      />
                    </fieldset>
                    <textarea
                      id="mensagem"
                      placeholder="Your message..."
                      className="textarea h-36 w-full"
                    ></textarea>
                  </div>
                </div>
                <div className="card-actions justify-end">
                  <button
                    className="btn bg-slate-700 text-neutral-content w-full"
                    onClick={enviarMensagem}
                  >
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=" flex items-end">
          <img className="" src={waveImage} alt="Wave" />
        </div>
      </div>
    </>
  );
}
