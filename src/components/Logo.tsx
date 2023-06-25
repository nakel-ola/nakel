/* eslint-disable @next/next/no-img-element */
import React from "react";

const Logo = () => {
  return (
    <div className="flex items-center">
      <img src="/logo.png" alt="" className="h-8 w-auto" />
      <img src="/logos/text-logo.png" alt="" className="h-7 w-auto ml-1" />
    </div>
  );
};

export default Logo;
