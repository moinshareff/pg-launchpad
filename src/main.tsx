import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
// Also load SCSS styles
import "./styles/dashboard.scss";

createRoot(document.getElementById("root")!).render(<App />);
