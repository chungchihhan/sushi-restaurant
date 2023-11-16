import react from "@vitejs/plugin-react";
import "dotenv/config";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// VITE_API_URL should defined in .env file
// run $ cp .env.example .env to copy the example file to .env
// change the value of VITE_API_URL to match that of your api endpoint
if (process.env.VITE_API_URL === undefined) {
  throw new Error("the environment variable VITE_API_URL is not defined");
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
});
