import { Tab, TabGroup, TabList, TabPanels } from "@headlessui/react";
import { ReactElement, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PostsGrid from "./PostsGrid";
import { PostFeedType } from "../types";
import { FaGlobe, FaUsers, FaUser } from "react-icons/fa";

const feedOptions: {
  type: PostFeedType;
  label: string;
  icon: ReactElement;
}[] = [
  { type: "public", label: "Public", icon: <FaGlobe className="w-5 h-5" /> },
  {
    type: "communities",
    label: "Communities",
    icon: <FaUsers className="w-5 h-5" />,
  },
  { type: "my", label: "My Posts", icon: <FaUser className="w-5 h-5" /> },
];

const PostsFeed = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="max-w-3xl mx-auto">
      <TabGroup
        selectedIndex={selectedIndex}
        onChange={setSelectedIndex}>
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-pink-500 opacity-10 rounded-xl blur-lg"></div>
          <TabList className="relative flex flex-col sm:flex-row p-2 gap-2 bg-white/80 backdrop-blur-md rounded-xl shadow-xl border border-gray-100">
            {feedOptions.map((option) => (
              <Tab
                key={option.type}
                className={({ selected }) =>
                  `flex items-center justify-center gap-3 w-full rounded-lg py-3 px-4 text-sm font-medium
                   relative transition-all duration-300 ease-in-out focus:outline-none ${
                     selected
                       ? "bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-lg"
                       : "text-gray-700 hover:bg-gray-100/80"
                   }`
                }>
                {({ selected }) => (
                  <>
                    <span
                      className={`${
                        selected ? "transform scale-110" : ""
                      } transition-transform duration-300`}>
                      {option.icon}
                    </span>
                    <span className="font-semibold">{option.label}</span>
                  </>
                )}
              </Tab>
            ))}
          </TabList>
        </div>

        <TabPanels>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}>
              <PostsGrid type={feedOptions[selectedIndex].type} />
            </motion.div>
          </AnimatePresence>
        </TabPanels>
      </TabGroup>
    </div>
  );
};

export default PostsFeed;
