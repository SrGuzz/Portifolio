import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import TaskPage from "./pages/TaskPage.jsx";
// import ListaTarefas from "./pages/ListaTarefas.jsx";
// import EnderecoPage from "./pages/EnderecoPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  // {
  //   path: "/ToDoList",
  //   element: <ListaTarefas />,
  // },
  // {
  //   path: "/task",
  //   element: <TaskPage />,
  // },
  // {
  //   path: "/Endereco",
  //   element: <EnderecoPage />,
  // },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
