import Button from "@/components/Button";
import { Header } from "@/features/home";
import { ArrowRight } from "iconsax-react";
import React from "react";
import { IoCheckmark } from "react-icons/io5";
import { twMerge } from "tailwind-merge";

export default function Pricing() {
  return (
    <main className="overflow-visible">
      <Header />

      <div className="mt-10 lg:mt-16 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center mb-10">
          <h1 className="text-burnham-800 font-bold text-lg text-center">
            Pricing
          </h1>
          <h2 className="text-4xl sm:text-6xl font-bold bg-gradient-to-br from-white from-30% to-white/30 bg-clip-text text-transparent text-center my-3">
            Get everything, forever.
          </h2>

          <p className="text-gray-400 text-center text-lg leading-8 max-w-xl mx-2">
            Get lifetime access to all components and every template available
            today, plus any new content we add in the future for a simple
            one-time price.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 flex-col lg:flex-row gap-5 my-14 mx-8">
          <PriceCard
            title="Personal"
            description="For individuals working on their next big idea"
            price="$299"
            priceDetails={`one-time payment \nplus local taxes`}
            className=""
            buttonIcon={null}
            buttonText="Get all-access"
            features={[
              {
                title: "Every site template",
                description:
                  "beautifully designed, expertly crafted website templates built with modern technologies like React and Next.js.",
              },
              {
                title: "Over 500+ components",
                description:
                  "everything you need to build beautiful application UIs, marketing sites, ecommerce stores, and more.",
              },
              {
                title: "Lifetime access",
                description:
                  "get instant access to everything we have today, plus any new components and templates we add in the future.",
              },
            ]}
          />
          <PriceCard
            title="Teams"
            description="For product teams and agencies."
            price="$799"
            priceDetails={`one-time payment \nplus local taxes`}
            className=""
            buttonText="Get all-access for your teams"
            buttonIcon={null}
            features={[
              {
                title: "Get access for your entire team",
                description:
                  "team licenses include access for up to 25 people to accommodate even the largest teams at your company.",
              },
            ]}
          />
        </div>
      </div>
    </main>
  );
}


type PriceCardProps = {
  className?: string;
  title: string;
  description: string;
  price: string;
  priceDetails?: string;
  features: {
    title: string;
    description: string;
  }[];
  onButtonClick?(): void;
  buttonText?: string;
  buttonIcon?: React.ReactNode;
};

const PriceCard = (props: PriceCardProps) => {
  const {
    className,
    description,
    features,
    title,
    price,
    priceDetails,
    buttonIcon = <ArrowRight className="ml-1" />,
    buttonText = "Get template",
    onButtonClick,
  } = props;

  return (
    <div
      className={twMerge(
        "border-[1.5px] border-burnham-600 hover:glow rounded-xl min-h-[400px] w-[100%] lg:w-[380px] px-5 py-8 ",
        className
      )}
    >
      <h1 className="text-3xl font-medium text-white">{title}</h1>

      <p className="mt-2 text-gray-300">{description}</p>

      <p className="text-4xl font-medium mt-5 flex items-end text-white">
        {price}{" "}
        <span className="text-sm text-gray-600 ml-1 break-words break-all whitespace-pre">
          {priceDetails}
        </span>
      </p>

      <Button
        className="mt-5 w-full flex justify-center"
        onClick={onButtonClick}
      >
        {buttonText} {buttonIcon}
      </Button>

      <div className="mt-5 space-y-2">
        {features.map((feature, index) => (
          <div key={index} className="flex">
            <IoCheckmark size={20} className="text-burnham-800 shrink-0" />
            <p className="text-sm ml-1 text-white">
              <b>{feature.title}</b>— {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
