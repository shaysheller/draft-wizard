import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Link from "next/link";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

export const DepthDropDown = (props: {
  title: string;
  arr: string[];
  urlArray: string[];
}) => {
  let dropDownHeight;
  if (props.arr.length < 6) dropDownHeight = "h-fit";
  else dropDownHeight = "h-48";



  return (
    <div>
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="inline-flex  rounded-md bg-black bg-opacity-20 px-2 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
          <span>{props.title}</span>
          <ChevronDownIcon
            className="h-5 w-5 text-violet-400 hover:text-violet-100"
            aria-hidden="true"
          />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            className={`${dropDownHeight} absolute right-0 z-10 mt-2 w-fit origin-top-right divide-y divide-gray-100 overflow-y-auto rounded-md bg-white pr-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
          >
            <div className="px-1 py-1 ">
              {props.arr.map((item, i) => {
                return (
                  <Menu.Item key={item}>
                    {({ active }) => (
                      <a
                        href={props.urlArray[i]}
                        className={`${
                          active ? "bg-violet-500 text-white" : "text-gray-900"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        target="_blank"
                      >
                        {props.arr[i]}
                      </a>
                    )}
                  </Menu.Item>
                );
              })}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};
