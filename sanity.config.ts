import { buildLegacyTheme, defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import schemas from "./src/schemas";

const props = {
  "--my-white": "#ffffff",
  "--my-black": "#1a1a1a",
  "--my-blue": "#497d1a",
  "--my-red": "#db4437",
  "--my-yellow": "#f4b400",
  "--my-green": "#0f9d58",
  "--my-primary": "#2563eb",
};

const myTheme = buildLegacyTheme({
  
  /* Base theme colors */
  "--black": props["--my-black"],
  "--white": props["--my-white"],

  "--gray": "#666",
  "--gray-base": "#666",

  "--component-bg": "#f1f5f9",
  "--component-text-color": props["--my-black"],

  /* Brand */
  "--brand-primary": props["--my-primary"],

  // Default button
  "--default-button-color": "#666",
  "--default-button-primary-color": props["--my-primary"],
  "--default-button-success-color": props["--my-green"],
  "--default-button-warning-color": props["--my-yellow"],
  "--default-button-danger-color": props["--my-red"],

  /* State */
  "--state-info-color": props["--my-primary"],
  "--state-success-color": props["--my-green"],
  "--state-warning-color": props["--my-yellow"],
  "--state-danger-color": props["--my-red"],

  /* Navbar */
  "--main-navigation-color": props["--my-white"],
  "--main-navigation-color--inverted": props["--my-black"],

  "--focus-color": props["--my-primary"],
});

export const defaultConfig = {
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: "2023-05-21",
};

const config = defineConfig({
  ...defaultConfig,
  title: "Olamilekan Studio",
  basePath: "/admin",
  theme: myTheme,
  plugins: [deskTool()],
  schema: {
    types: schemas,
  },
});

export default config;
