import Button from "@/components/Button";
import { Footer, Header } from "@/features/home";
import React from "react";

export default function Templates() {
  return (
    <main className="overflow-visible">
      <Header />
      <div className="mt-10 lg:mt-16 flex flex-col items-center justify-center ">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-burnham-800 font-bold text-lg text-center">
            Template
          </h1>
          <h2 className="text-4xl sm:text-6xl font-bold bg-gradient-to-br from-white from-30% to-white/30 bg-clip-text text-transparent text-center my-3">
            Coming Soon
          </h2>

          <p className="text-gray-400 text-center text-lg leading-8 max-w-2xl mx-2">
            Get ready, web adventurers! Our incredible website templates are
            coming soon. Subscribe now for a 50% discount on your first three
            templates. Don&lsquo;t miss out on this epic deal! 🚀💥
          </p>
          {/* <h2 className="text-4xl sm:text-6xl font-bold text-white text-center my-3">
          Ready-to-roll website templates. <br /> Your vision, our creation!
        </h2>

        <p className="text-gray-400 text-center text-lg leading-8 max-w-xl mx-2">
          Wow-worthy site templates! React, Next.js, and Tailwind CSS combine
          for a power-packed kickstart to your project. Learn from the masters,
          create like a pro! 🚀💫
        </p> */}
        </div>

        <div className="flex flex-col items-center justify-center w-full">
          <div className="bg-neutral-800 flex mt-10 p-1.5 rounded-lg w-[80%] lg:w-[40%]">
            <input
              type="text"
              className="bg-transparent w-full mx-2 outline-none text-white"
              placeholder="Enter your email address"
            />

            <Button>Subscribe</Button>
          </div>

          <p className="text-gray-400 mt-2">
            * Don&lsquo;t worry we will not spam you:)
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
