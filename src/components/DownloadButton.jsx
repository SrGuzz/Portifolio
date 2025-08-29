const DownloadButton = () => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "../assets/CV-Davi-Benjamim-2025.pdf"; // caminho para o arquivo PDF na pasta public
    link.download = "CV-Davi-Benjamim-2025.pdf"; // nome do arquivo que será baixado
    link.click();
  };

  // href=""
  // download=""

  return (
    <button
      className="shadow-sm active:bg-blue-800 bg-blue-900 px-4 w-52 h-16 py-4 font-bold text-xl text-slate-100 rounded"
      onClick={handleDownload}
    >
      Download CV
    </button>
  );
};

export default DownloadButton;
