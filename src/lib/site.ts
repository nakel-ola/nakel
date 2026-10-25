import { IconType } from "react-icons";
import { FaGithub, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export const EMAIL = "nunuolamilekan@gmail.com";

export const sections = [
  { id: "work", label: "Work" },
  { id: "skills", label: "Tools" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export const socials: { label: string; href: string; Icon: IconType }[] = [
  { label: "GitHub", href: "https://github.com/nakel-ola", Icon: FaGithub },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/olamilekan-nunu/", Icon: FaLinkedinIn },
  { label: "Instagram", href: "https://www.instagram.com/nakel.ola", Icon: FaInstagram },
];
