import { CallCalling, Sms } from "iconsax-react";
import React from "react";
import { NeuButton } from "./NeuButton";
type Props = {};

export const Footer = (props: Props) => {
  return (
    <div className="my-16 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-2xl desktop:text-4xl font-bold text-black text-center my-3">
          Take{" "}
          <span className="text-primary drop-shadow-[3px_3px_0px_black] translate-x-[3px] translate-y-[3px] rotate-6">
            A Coffee
          </span>{" "}
          &
       
          Chat{" "}
          <span className="text-primary drop-shadow-[3px_3px_0px_black] translate-x-[3px] translate-y-[3px] rotate-6">
          With Me
          </span>
        </h2>
        <div className="flex item-center space-x-5">
          <div className="flex items-center">
            <NeuButton
              variant="outline"
              className="rounded-full px-2 hover:shadow-[3px_3px_0px_black]"
            >
              <CallCalling variant="Broken" />
            </NeuButton>

            <p className="ml-2 text-lg font-semibold">+234 9152663635</p>
          </div>

          <div className="flex items-center">
            <NeuButton
              variant="outline"
              className="rounded-full px-2 hover:shadow-[3px_3px_0px_black]"
            >
              <Sms variant="Broken" />
            </NeuButton>

            <p className="ml-2 text-lg font-semibold">
              nunuolamilekan@gmail.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
