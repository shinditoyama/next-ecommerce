import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef } from "react";
import Currency from "react-currency-formatter";

interface Props {
  isOpen: boolean;
  dialogHandler: () => void;
  items: OrderItem[];
}

export default function ModalItem({ isOpen, dialogHandler, items }: Props) {
  const completeButtonRef = useRef(null);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        initialFocus={completeButtonRef}
        as="div"
        className="relative z-10"
        onClose={dialogHandler}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Produto(s) Comprado(s)
                </Dialog.Title>
                <div className="mt-4" ref={completeButtonRef}>
                  <table className="table table-auto w-full bg-blue-300 rounded shadow-lg">
                    <thead>
                      <tr className="border-b-2 whitespace-nowrap">
                        <th className="px-3 py-3">#</th>
                        <th className="px-3 py-3">Nome</th>
                        <th className="px-3 py-3">Preço</th>
                        <th className="px-3 py-3">Qtde.</th>
                        <th className="px-3 py-3">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2">
                      {items?.map((item, index) => (
                        <tr key={index}>
                          <td className="px-3 py-3">{++index}</td>
                          <td className="px-3 py-3">{item.name}</td>
                          <td className="px-3 py-3">
                            <Currency quantity={item.price} currency="brl" />
                          </td>
                          <td className="px-3 py-3">x{item.quantity}</td>
                          <td className="px-3 py-3">
                            <Currency quantity={item.subtotal} currency="brl" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
