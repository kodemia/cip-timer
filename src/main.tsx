import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ReactDOM from "react-dom/client";
import Timer from "./timer.tsx";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Timer />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
