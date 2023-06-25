import Button from "@/components/Button";
import { ArrowRight, Check, Icon } from "iconsax-react";
import React from "react";
import { IoCheckmark } from "react-icons/io5";
import { twMerge } from "tailwind-merge";

type Props = {};

const PricingSection = (props: Props) => {
  return (
    <div className="mt-10 lg:mt-16 flex flex-col items-center justify-center">
      <h1 className="text-primary font-semibold text-center">Pricing</h1>
      <h2 className="text-5xl font-bold text-center my-3">
        Choose the right plan for you
      </h2>

      <p className="text-gray-600 text-center max-w-xl">
        Choose an affordable plan that’s packed with the best features for
        engaging your audience, creating customer loyalty, and driving sales.
      </p>

      <div className="grid lg:grid-cols-2 flex-col lg:flex-row gap-5 mt-14 mx-8">
        <PriceCard
          title="Spotlight"
          description="A personal website so nice you’ll actually be inspired to publish on it."
          price="$99"
          priceDetails="plus local taxes"
          features={[
            {
              title: "Unlimited projects",
              description:
                "buy once and use this template for as many projects as you need, both personal and commercial.",
            },
            {
              title: "Free updates",
              description:
                "any updates we make to the template are included with your original purchase.",
            },
            {
              title: "Simple .zip file",
              description:
                "templates are delivered as a simple archive you can unzip and start playing with right away.",
            },
          ]}
        />

        <PriceCard
          title="One time"
          description="Get lifetime access to all website templates with a single one-time purchase."
          price="$299"
          priceDetails={`one-time payment \nplus local taxes`}
          className=""
          features={[
            {
              title: "Every site template",
              description:
                "beautifully designed, expertly crafted website templates built with modern technologies like React and Next.js.",
            },
            // {
            //   title: "Over 50+ apis",
            //   description: "everything you need to stay connected",
            // },
            // {
            //   title: "Over 500+ components",
            //   description:
            //     "everything you need to build beautiful application UIs, marketing sites, ecommerce stores, and more.",
            // },
            {
              title: "Lifetime access",
              description:
                "get instant access to everything we have today, plus any new components and templates we add in the future.",
            },
          ]}
        />
      </div>
    </div>
  );
};

export default PricingSection;

type NewType = {
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

type PriceCardProps = NewType;
export const PriceCard = (props: PriceCardProps) => {
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
        "border-[1.5px] rounded-xl min-h-[400px] w-[100%] lg:w-[380px] px-5 py-8",
        className
      )}
    >
      <h1 className="text-xl font-medium">{title}</h1>

      <p className="mt-2 text-gray-600">{description}</p>

      <p className="text-4xl font-medium mt-5 flex items-end">
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
            <IoCheckmark size={20} className="text-primary shrink-0" />
            <p className="text-sm ml-1">
              <b>{feature.title}</b>— {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
