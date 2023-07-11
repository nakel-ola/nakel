import Logo from "@/components/Logo";
import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";

export default function AdminPage() {
  return (
    <NextStudio
      config={{
        ...config,
        studio: {
          components: {
            logo: Logo,
          },
        },
      }}
    />
  );
}
