import { Fragment } from "react";
import Image from "next/image";
import { User } from "../types";
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, ArrowLeftOnRectangleIcon, Bars3CenterLeftIcon } from '@heroicons/react/20/solid';
import { signOut } from "next-auth/react";
import classNames from "classnames";

const AvatarMenu = ({
  user
}: {
  user: User;
}) => {
  return (
    <Menu as="div" className="z-50 relative inline-block text-right align-middle">
      <div>
        <Menu.Button className="inline-flex w-full">
        <div className="align-middle mt-1 inline-block sm:hidden py-3 px-1">
          <Bars3CenterLeftIcon className="h-6" />
        </div>
        <div className={classNames(
          "mr-5 align-top hidden sm:inline-block",
        )}>
            <div className="flex items-center">
              {
                user && user.image &&
                <Image
                  alt="Profile Picture"
                  src={user.image}
                  width={50}
                  height={50}
                  className="rounded-lg bg-slate-200 cursor-pointer"
                />
              }
              <div className="ml-3 text-left">
                <p className="text-base font-semibold text-white group-hover:text-gray-900">
                  {user.name || user.email}
                  <ChevronDownIcon className="text-gray-300 inline-block -mr-1 ml-1 -mt-0.5 h-5 w-5" aria-hidden="true" />
                </p>
                <p className="text-xs font-medium text-gray-200 group-hover:text-white">
                  Athlete
                </p>
              </div>
            </div>
          </div>
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="bg-white text-black absolute -ml-1 right-0 z-10 mt-2 w-56 origin-top-right rounded-md shadow-lg border-2 border-black ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
            {
                ({ active }: { active: boolean }) => (
                  <button
                    onClick={() => signOut()}
                    className="p-3 font-bold w-full text-left">
                    <ArrowLeftOnRectangleIcon className="h-5 w-5 inline-block mr-3" /> Sign Out
                  </button>
                )
              }
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default AvatarMenu;
