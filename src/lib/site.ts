import { IconType } from "react-icons";
import { FaGithub, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export const EMAIL = "nunuolamilekan@gmail.com";

export const sections = [
  { id: "work", label: "Highlights" },
  { id: "about", label: "Profile" },
  { id: "skills", label: "Drills" },
  { id: "contact", label: "Serve" },
];

export const socials: { label: string; href: string; Icon: IconType }[] = [
  { label: "GitHub", href: "https://github.com/nakel-ola", Icon: FaGithub },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/olamilekan-nunu/", Icon: FaLinkedinIn },
  { label: "Instagram", href: "https://www.instagram.com/nakel.ola", Icon: FaInstagram },
];
