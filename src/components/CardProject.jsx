import { ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

function CardProject({ projects, onDetails }) {
  const navigate = useNavigate();

  function verMais(caminho) {
    if (caminho.startsWith("http")) {
      window.open(caminho, "_blank"); // Abre link externo em nova aba
    } else {
      navigate(`/${caminho}`); // Navegação interna
    }
  }

  return (
    <div className="w-5/12 px-4 ">
      {projects.map((project) => (
        <div key={project.Id} className="mb-4">
          <div
            className={`flex items-center justify-between shadow-md bg-slate-500 py-4 px-2 ${
              project.isVisible ? "rounded-t-lg" : "rounded-lg"
            }`}
          >
            <h1 className="text-3xl text-slate-200 font-semibold">
              {project.Title}
            </h1>
            <button onClick={() => onDetails(project.Id)}>
              {project.isVisible ? (
                <ChevronUp className="font-bold text-slate-200" size={48} />
              ) : (
                <ChevronDown className="font-bold text-slate-200" size={48} />
              )}
            </button>
          </div>
          {project.isVisible && ( // Renderiza os detalhes somente se `isVisible` for true
            <div className=" p-2 border rounded-b-lg bg-gray-100">
              <p className="font-medium">{project.Content}</p>
              <button
                onClick={() => verMais(project.Url)}
                className="mt-2 active:bg-blue-800 bg-blue-900 px-2 p-1 text-slate-200 font-semibold rounded-lg"
              >
                Ver mais
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default CardProject;
