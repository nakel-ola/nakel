import {
  Document,
  Folder2,
  FolderAdd,
  Hashtag,
  SearchNormal,
  Tag,
} from "iconsax-react";
import React from "react";
type Props = {};

const SearchBoxList = (props: Props) => {
  return (
    <div className="w-[400px] border-2 border-burnham-800 rounded-lg bg-dark h-[80%] glow divide-y-[1px] divide-neutral-700">
      {/* searchbar */}

      <div className="flex items-center p-2 px-3">
        <SearchNormal className="text-white" />
        <input
          type="text"
          className="text-white bg-transparent ml-2 border-0 outline-none w-full"
          placeholder="Search project..."
        />
      </div>

      {/* recent searches */}

      <div className="p-2 px-3">
        <p className="text-white mb-2">Recent searches</p>

        <div className="text-white flex items-center p-1 hover:bg-burnham-800 rounded-md cursor-pointer my-2">
          <Folder2 />

          <p className="ml-2">Nakel Ui / website design</p>
        </div>
        <div className="text-white flex items-center p-1 hover:bg-burnham-800 rounded-md cursor-pointer my-1">
          <Folder2 />

          <p className="ml-2">Nakel Ui / website design</p>
        </div>
      </div>

      {/* actions */}

      <div className="py-2 px-3">
        {items.map(({ Icon, label }, index) => (
          <div
            key={index}
            className="text-white flex items-center p-1 hover:bg-burnham-800 rounded-md cursor-pointer my-2 transition-all duration-300"
          >
            <Icon />

            <p className="ml-2">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBoxList;

const items = [
  {
    Icon: Document,
    label: "Add new file...",
  },
  {
    Icon: FolderAdd,
    label: "Add new folder...",
  },
  {
    Icon: Hashtag,
    label: "Add hashtag...",
  },
  {
    Icon: Tag,
    label: "Add label...",
  },
];
