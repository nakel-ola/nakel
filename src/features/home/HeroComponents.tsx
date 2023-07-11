import React from "react";

import Calendars from "./Calendars";
import SearchBoxList from "./SearchBoxList";

type Props = {};

const HeroComponents = (props: Props) => {
  return (
    <div className=" mt-10 flex flex-col justify-center items-center">
      <div className="flex flex-col lg:flex-row gap-10 min-h-[500px] w-[90%] lg:w-[85%]">
        <div className="polka-bg h-fit py-16 lg:w-[50%] flex items-center justify-center ">
          <Calendars />
        </div>
        <div className="polka-bg h-fit py-16 lg:w-[50%] flex items-center justify-center ">
          <SearchBoxList />
        </div>
      </div>
    </div>
  );
};

export default HeroComponents;
