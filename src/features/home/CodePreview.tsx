import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";

type Props = {};

const CodePreview = (props: Props) => {
  const codeString = `
  import { cx } from "class-variance-authority";
  import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
  import React from "react";
  
  type Props = {};
  
  const Calendars = (props: Props) => {
    return (
      <div className="w-[400px] border-2 border-burnham-800 rounded-lg bg-dark h-[80%] glow p-5">
        <div className="flex items-center justify-between">
          <button className="flex items-center h-[30px] w-[30px] justify-center text-white hover:bg-neutral-800 rounded-lg click">
            <ArrowLeft2 />
          </button>
  
          <p className="text-white text-lg font-semibold">January</p>
  
          <button className="flex items-center h-[30px] w-[30px] justify-center text-white hover:bg-neutral-800 rounded-lg click">
            <ArrowRight2 />
          </button>
        </div>
  
        <div className="mt-5">
          <div className="w-full grid grid-cols-7 gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
              (value, index) => (
                <div
                  key={index}
                  className="h-[20px] flex items-center justify-center"
                >
                  <p className="text-white text-sm">{value}</p>
                </div>
              )
            )}
          </div>
          <div className="w-full h-[80%] rounded-lg  mt-3 grid grid-cols-7">
            {items.map((item, index) => (
              <div
                key={index}
                className={cx(
                  "h-[40px] cursor-pointer flex items-center justify-center",
                  item.fade ? "" : "hover:bg-neutral-700"
                )}
              >
                <p
                  className={cx(
                    " text-sm",
                    item.fade ? "text-gray-500" : "text-white"
                  )}
                >
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default Calendars;
`;
  return (
    <div className="w-[50%]">
      <SyntaxHighlighter language="javascript" style={atomOneDark}>
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodePreview;
