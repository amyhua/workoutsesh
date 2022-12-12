import { Fragment } from "react";
import Image from "next/image";
import { Menu, Transition } from '@headlessui/react';
import { EllipsisHorizontalIcon, PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

const MoreMenu = ({ workoutId }: { workoutId: string }) => {
  return (
    <Menu
      onClick={(e: any) => e.stopPropagation()}
      as="div" className="z-50 relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full">
          <div className="inline-block py-2 align-top">
            <EllipsisHorizontalIcon className="h-5" />
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
        <Menu.Items className="absolute mr-0 sm:right-0 z-10 mt-2 origin-top-right rounded-md bg-white shadow-lg border-2 border-black ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Menu.Item>
            {
              ({ active }: { active: boolean }) => (
                <Link href={`/workout/${workoutId}/edit`}>
                  <div className="py-2 px-3 whitespace-nowrap">
                    <PencilIcon className="inline-block h-4 align-top mt-0.5 mr-1" /> Edit
                  </div>
                </Link>
              )
            }
          </Menu.Item>
          <Menu.Item>
          {
              ({ active }: { active: boolean }) => (
                <div className="py-2 px-3 whitespace-nowrap">
                    <TrashIcon className="inline-block h-4 align-top mt-0.5 mr-1" /> Delete
                </div>
              )
          }
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default MoreMenu;
