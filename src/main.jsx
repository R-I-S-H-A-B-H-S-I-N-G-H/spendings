import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<Theme accentColor="violet" appearance="dark" radius="large" scaling="100%">
			<App />
		</Theme>
	</StrictMode>,
);
