/* eslint-disable @next/next/no-img-element */
import Button from "@/components/Button";
import slugify from "@/utils/slugify ";
import { useRouter } from "next/router";
import React from "react";

type Props = {};

const Content = (props: Props) => {
  const router = useRouter();
  return (
    <div
      id="templates"
      className="grid lg:grid-cols-2 place-items-center mt-10 lg:mt-20 px-5 lg:px-8"
    >
      {items.map((item, index) => (
        <div
          key={index}
          className="mb-5 cursor-pointer"
          onClick={() => router.push(`/template/${slugify(item.name)}`)}
        >
          <div className="group relative h-[287px] w-[521px]">
            <img
              src={item.image}
              alt=""
              className="relative rounded-lg w-full h-full object-cover"
            />

            <Button className="group-hover:opacity-100 opacity-0 transition-all duration-300 absolute bottom-5 right-5 ">
              Live Preview
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <h1 className="text-lg font-medium mt-2">{item.name}</h1>

            <h1 className="">{item.price}</h1>
          </div>

          <p className="text-sm mt-1">{item.label}</p>
        </div>
      ))}
    </div>
  );
};

const items = [
  {
    name: "Minimal - Client and Admin Dashboard",
    image: "/images/minimal-preview.jpg",
    label: "Admin & Dashboard",
    price: "$69",
  },
  {
    name: "Devias Kit Pro - Client and Admin Dashboard",
    image: "/images/Thumbnail-1.png",
    label: "Admin & Dashboard",
    price: "$69",
  },
  {
    name: "theFront - Multipurpose Template + UI Kit",
    image: "/images/cover.png",
    label: "Landing & Corporate",
    price: "$49",
  },
  {
    name: "Berry - React Material UI Dashboard Template",
    image: "/images/berry-mui-store-preview.png",
    label: "Admin & Dashboard",
    price: "$69",
  },
  {
    name: "Mantis - React Material UI Dashboard Template",
    image: "/images/mantis-mui-v1.2.0.jpg",
    label: "Admin & Dashboard",
    price: "$69",
  },

  {
    name: "Mira Pro - React Material Admin Dashboard",
    image: "/images/mira-pro-1400-770.png",
    label: "Admin & Dashboard",
    price: "$69",
  },
  {
    name: "Materio - Next.js Admin Template",
    image: "/images/materio-mui-banner-new.png",
    label: "Admin & Dashboard",
    price: "$69",
  },
  {
    name: "Bazaar Pro - Multipurpose Next.js Ecommerce Template",
    image: "/images/bazar-banner-mui.png",
    label: "Landing & Corporate",
    price: "$49",
  },
  {
    name: "Zone - Multipurpose Landing Page + UI Kit",
    image: "/images/zone-preview-2-scaled.jpg",
    label: "Admin & Dashboard",
    price: "$69",
  },
  {
    name: "Tokyo - React Admin Dashboard UI Kit (Next.js & CRA)",
    image: "/images/tokyo-react-admin-dashboard.png",
    label: "Admin & Dashboard",
    price: "$69",
  },
];

export default Content;
