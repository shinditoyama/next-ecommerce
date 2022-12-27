import { cartSelector } from "@/redux/slices/cartSlice";
import { Menu, Transition } from "@headlessui/react";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { useSelector } from "react-redux";

export default function Header() {
  const router = useRouter();
  const { data: session } = useSession();
  const [search, setSearch] = useState("");
  const cart = useSelector(cartSelector);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(
      {
        pathname: "/product",
        query: search ? { ...router.query, q: search } : {},
      }
      // undefined,
      // { shallow: true }
    );
  };

  return (
    <header className="py-5 border-b">
      <div className="container max-w-screen-xl mx-auto px-4">
        <div className="flex flex-wrap items-center">
          <div className="flex-shrink-0 mr-5 ">
            <Link href="/">
              <img src="/next.svg" width={80} alt="Logo" />
            </Link>
          </div>
          {/* Search */}
          <div className="flex flex-nowrap items-center w-full order-last md:order-none mt-5 md:mt-0 md:w-2/4 lg:w-2/4">
            <form onSubmit={onSubmit} className="flex w-full">
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-grow appearance-none border border-gray-200 bg-gray-100 rounded-tl-md rounded-bl-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400"
              />
              <button
                type="submit"
                className="px-4 py-2 inline-block text-blue-600 border border-gray-200 bg-gray-100 rounded-tr-md rounded-br-md hover:bg-blue-100"
              >
                <MagnifyingGlassIcon className="text-gray-400 h-6 w-6" />
              </button>
            </form>
          </div>
          {/* Search .//end */}
          <div className="flex items-center space-x-2 ml-auto">
            <Link href="/cart">
              <button className="px-3 py-2 flex text-center text-gray-700 bg-white shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 hover:border-gray-300">
                <ShoppingCartIcon className="text-gray-400 h-6 w-6" />
                <div className="relative">
                  <span className="lg:hidden absolute -right-2 -top-2 h-4 w-4 rounded-full text-white bg-gray-700 text-xs">
                    {cart.length}
                  </span>
                  <span className="hidden lg:inline ml-1">
                    My cart ({cart.length})
                  </span>
                </div>
              </button>
            </Link>
            {session ? (
              <Menu as="div" className="relative inline-block text-left z-50">
                <div className="hover:text-violet-300">
                  <Menu.Button className="px-3 py-2 flex items-center justify-center rounded-md text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                    <img
                      className="mr-2 w-8 h-8 rounded-full"
                      src={session.user?.image!}
                      alt="user photo"
                    />
                    {session.user?.name}
                    <ChevronDownIcon className="ml-2 h-4 w-4" />
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
                  <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-1 py-1">
                      <Menu.Item>
                        <div className="flex w-full items-center rounded-md px-2 py-2 text-sm font-medium">
                          {session.user?.email}
                        </div>
                      </Menu.Item>
                    </div>
                    <div className="px-1 py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <Link href="/order">
                            <button
                              className={`${
                                active
                                  ? "bg-violet-500 text-white"
                                  : "text-gray-900"
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            >
                              Pedidos
                            </button>
                          </Link>
                        )}
                      </Menu.Item>
                    </div>
                    <div className="px-1 py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? "bg-violet-500 text-white"
                                : "text-gray-900"
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            onClick={() => signOut()}
                          >
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <button
                onClick={() => signIn()}
                className="px-3 py-2 flex text-center text-gray-700 bg-white shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 hover:border-gray-300"
              >
                <UserIcon className="text-gray-400 h-6 w-6" />
                <span className="hidden lg:inline ml-1">Sign in</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
