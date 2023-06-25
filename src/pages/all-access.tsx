import PageGradient from "@/components/PageGradient";
import { PriceCard } from "@/features/template/PricingSection";
import React from "react";

export default function AllAccess() {
  return (
    <PageGradient className="mt-10 lg:mt-16 flex flex-col items-center justify-center">
      <h1 className="text-primary font-semibold text-center">All-access</h1>
      <h2 className="text-5xl font-bold text-center my-3">
        Get everything, forever.
      </h2>

      <p className="text-gray-600 text-center max-w-xl">
        Get lifetime access to 500+ components and every template available
        today, plus any new content we add in the future for a simple one-time
        price.
      </p>
      <div className="grid lg:grid-cols-2 flex-col lg:flex-row gap-5 mt-14 mx-8">
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
              title: "Over 50+ apis",
              description: "everything you need to stay connected",
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
          buttonText="Get all-access for your teams"buttonIcon={null}
          features={[
            {
              title: "Get access for your entire team",
              description:
                "team licenses include access for up to 25 people to accommodate even the largest teams at your company.",
            },
          ]}
        />
      </div>
    </PageGradient>
  );
}
