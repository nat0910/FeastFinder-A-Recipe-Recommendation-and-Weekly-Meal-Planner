import React, { useState, Fragment } from "react";
import { useAuth } from "../../../utils/context/AuthContext";
import { Dialog, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

export default function Header() {
  const { user, handleLogout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const navigation = [
    // Define your navigation items here
    { name: "Home", href: "/" },
    { name: "Your Preferences", href: "/user/nutritional-value" },
    // Add other navigation items
  ];

  return (
    <header className="flex justify-between items-center w-full px-4 sm:px-6 lg:px-8 py-4 bg-white">
      <h1
        className="text-2xl font-bold "
        style={{
          color: "#6639A6",
        }}
      >
        FeastFinder
      </h1>
      <img
        src={`https://ui-avatars.com/api/?name=${user?.email}&background=0D8ABC&color=fff&size=128`}
        alt="User Avatar"
        className="h-10 w-10 rounded-full"
        onClick={() => {
          setMobileMenuOpen(!mobileMenuOpen);
        }}
      />

      <Transition.Root show={mobileMenuOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-40 overflow-hidden"
          onClose={setMobileMenuOpen}
        >
          <div className="absolute inset-0 overflow-hidden">
            {/* Overlay */}
            <Transition.Child
              as={Fragment}
              enter="ease-in-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="absolute inset-0 bg-black bg-opacity-25 transition-opacity" />
            </Transition.Child>

            {/* Panel */}
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    {/* Close button */}
                    <div className="px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          Menu
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Navigation */}
                    <div className="border-t border-gray-200 py-6 px-4 space-y-6 sm:px-6">
                      {navigation.map((item) => (
                        <div key={item.name} className="flow-root">
                          <Link
                            to={item.href}
                            className="block p-2 -m-2 font-medium text-gray-900"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {item.name}
                          </Link>
                        </div>
                      ))}
                    </div>
                    {/* Sign-out option */}
                    {/* <div className="px-4 py-6 sm:px-6 pt-6 mt-6 border-t border-gray-200">
                      <a
                        href="#signout"
                        className="block p-3 -m-3 rounded-md text-base font-semibold text-red-600 hover:bg-gray-50"
                      >
                        Sign Out
                      </a>
                    </div> */}
                    <div className="px-4 py-6 sm:px-6 pt-6 mt-6 border-t border-gray-200">
                      <button
                        type="button"
                        className="block p-3 -m-3 rounded-md text-base font-semibold text-red-600 hover:bg-gray-50"
                        onClick={() => {
                          handleLogout();
                        }}
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </header>
  );
}
