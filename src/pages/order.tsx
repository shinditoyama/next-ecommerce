import ModalItem from "@/components/ModalItem";
import SEO from "@/components/SEO";
import { fetchUserId } from "@/lib/fetch";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import ptBr from "date-fns/locale/pt-BR";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useState } from "react";
import Currency from "react-currency-formatter";

interface Props {
  orders: Order[];
}

export default function Order({ orders }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<OrderItem[]>([]);

  const dialogHandler = () => {
    setIsOpen(!isOpen);
  };

  const openModal = (item: OrderItem[]) => {
    setData(item);
    dialogHandler();
  };

  return (
    <>
      <SEO title="Meus Pedidos" description="Página de Pedidos" />
      <section className="container p-6 mx-auto">
        <h1 className="mb-4 text-xl md:text-2xl font-semibold text-black">
          Meus Pedidos
        </h1>

        {isOpen && (
          <ModalItem
            isOpen={isOpen}
            dialogHandler={dialogHandler}
            items={data}
          />
        )}

        {orders.length > 0 ? (
          <div className="overflow-x-auto shadow">
            <table className="w-full whitespace-no-wrap border border-gray-300">
              <thead>
                <tr className="text-xs font-semibold tracking-wide text-left uppercase bg-gray-300">
                  <th className="px-3 py-3">ID</th>
                  <th className="px-3 py-3">Amount</th>
                  <th className="px-3 py-3">Qtde.</th>
                  <th className="px-3 py-3">Date</th>
                  <th className="px-3 py-3">Items</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y">
                {orders?.map((order, index) => (
                  <tr key={index} className="text-gray-700 dark:text-gray-400">
                    <td className="px-3 py-3">
                      <div className="flex items-center leading-tight">
                        <div className="mr-3 hidden md:block flex-shrink-0"></div>
                        <div>
                          <p className="font-semibold"># {++index}</p>
                          <p className="text-sm text-gray-500">{order._id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 font-medium">
                      <Currency quantity={order.total} currency="brl" />
                    </td>
                    <td className="px-3 py-3 font-medium">x{order.quantity}</td>
                    <td className="px-3 py-3">
                      {format(
                        new Date(order._createdAt),
                        "dd 'de' MMMM 'de' yyyy 'às' HH:mm'h'",
                        {
                          locale: ptBr,
                        }
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <button
                        onClick={() => openModal(order.orderItem)}
                        className="p-1 inline-block text-gray-500 bg-white shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 hover:text-blue-600"
                      >
                        <EllipsisVerticalIcon className="h-7 w-7" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <article className="border border-gray-200 bg-white shadow-sm rounded mb-5 p-3 lg:p-5">
            Nenhum Pedido foi realizado.
          </article>
        )}
      </section>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (session == null) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }

  const userId = await fetchUserId(session?.user?.email as string);

  const orders = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/order?user_id=${userId._id}`
  )
    .then((res) => res.json())
    .then((data) => data.orders);

  return {
    props: {
      orders,
    },
  };
};
