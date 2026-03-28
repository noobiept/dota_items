import { defineConfig } from "vite";
import { resolve } from "path";
import { name, version } from "./package.json";

export default defineConfig({
    root: ".",
    build: {
        outDir: resolve(__dirname, "release", `${name}_${version}`),
        emptyOutDir: true,
    },
});
