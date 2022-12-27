import SEO from "@/components/SEO";
import { fetchLineItems, fetchUserId } from "@/lib/fetch";
import { clearCart } from "@/redux/slices/cartSlice";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Currency from "react-currency-formatter";
import { useDispatch } from "react-redux";
import { useMediaQuery } from "react-responsive";

interface Props {
  products: StripeProduct[];
  userId: any;
}

export default function Success({ products, userId }: Props) {
  const router = useRouter();
  const { session_id } = router.query;
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      dispatch(clearCart());
    }, 1000);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = products.reduce(
    (acc, product) =>
      acc + (product.price.unit_amount / 100) * product.quantity,
    0
  );

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1024px)" });
  const showOrderSummaryCondition = isTabletOrMobile ? showOrderSummary : true;

  const handleShowOrderSummary = () => {
    setShowOrderSummary(!showOrderSummary);
  };

  const placeOrderHandler = async () => {
    setLoading(true);

    await axios.post("/api/order/create", {
      sessionId: session_id,
      user: {
        _type: "reference",
        _ref: userId._id,
      },
      quantity: products.length,
      total: subtotal,
      orderItem: products.map((x) => ({
        name: x.description,
        quantity: x.quantity,
        price: x.price.unit_amount / 100,
        subtotal: x.amount_subtotal / 100,
      })),
    });

    router.replace("/");
    setLoading(false);
  };

  return (
    <main className="grid grid-cols-1 lg:grid-cols-9">
      <SEO title="Success" description="Página de sucesso" />
      <section className="order-2 mx-auto max-w-xl pb-12 lg:col-span-5 lg:mx-0 lg:max-w-none lg:px-16 lg:pt-16 2xl:pl-44">
        <div className="my-8 ml-4 flex space-x-4 lg:ml-14 xl:ml-0">
          <div className="flex items-center justify-center">
            <CheckCircleIcon className="h-8 w-8" />
          </div>
          <div>
            <h4 className="text-lg">
              Obrigado, pela sua preferência{" "}
              <span className="text-xl font-bold">{session?.user?.name}</span>
            </h4>
          </div>
        </div>

        <div className="my-4 mx-4 divide-y divide-gray-300 border border-gray-300 rounded-md p-4 lg:ml-14">
          <div className="space-y-2 pb-3">
            <p>Seu pedido foi confirmado</p>
            <p className="text-sm text-gray-600">
              Aceitamos seu pedido e estamos preparando-o. Confira em seu e-mail
              as informações do pedido ou acesse o Centro de mensagens para ver
              suas notificações.
            </p>
          </div>
          <div className="pt-3 text-sm">
            <p className="font-medium text-gray-600">Seu código de pedido:</p>
            <p>#{session_id}</p>
          </div>
        </div>

        <div className="mx-4 flex flex-col items-center justify-between text-sm lg:ml-14 lg:flex-row">
          {mounted && (
            <button
              disabled={loading}
              onClick={placeOrderHandler}
              className="w-full py-4 rounded-md text-white bg-blue-600 disabled:bg-blue-400 hover:bg-blue-700"
            >
              {loading ? (
                <svg
                  aria-hidden="true"
                  role="status"
                  className="inline mr-3 w-4 h-4 text-white animate-spin"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                  />
                </svg>
              ) : (
                "Continue Shopping"
              )}
            </button>
          )}
        </div>
      </section>

      {mounted && (
        <section className="overflow-y-scroll border-y border-l border-gray-300 bg-[#FAFAFA] lg:order-2 lg:col-span-4 lg:h-screen lg:border-y-0">
          <div
            className={`w-full border-gray-300 text-sm lg:hidden ${
              showOrderSummaryCondition && "border-b"
            }`}
          >
            <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-6">
              <button
                onClick={handleShowOrderSummary}
                className="flex items-center space-x-2"
              >
                <ShoppingCartIcon className="h-6 w-6" />
                <p>Show order summary</p>
                {showOrderSummaryCondition ? (
                  <ChevronUpIcon className="h-4 w-4" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4" />
                )}
              </button>

              <p className="text-xl font-medium text-black">
                <Currency quantity={subtotal} currency="brl" />
              </p>
            </div>
          </div>

          {showOrderSummaryCondition && (
            <div className="mx-auto max-w-xl divide-y border-gray-300 p-4 lg:mx-0 lg:max-w-lg lg:px-10 lg:py-16">
              <div className="space-y-4 pb-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center space-x-4 text-sm font-medium"
                  >
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-md border border-gray-300 bg-[#F1F1F1] text-white text-xs">
                      <div className="relative h-8 w-8 animate-bounce">
                        <ShoppingBagIcon className="text-black" />
                      </div>
                      <div className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-700 text-xs">
                        {product.quantity}
                      </div>
                    </div>
                    <p className="flex-1">{product.description}</p>
                    <p>
                      <Currency
                        quantity={product.price.unit_amount / 100}
                        currency={product.currency}
                      />
                    </p>
                  </div>
                ))}
              </div>
              <div>
                <div className="space-y-1 py-4">
                  <div className="flex justify-between text-sm">
                    <p className="text-gray-600">Subtotal</p>
                    <p className="font-medium">
                      <Currency quantity={subtotal} currency="brl" />
                    </p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p className="text-gray-600">Desconto</p>
                    <p className="font-medium">
                      <Currency quantity={0} currency="brl" />
                    </p>
                  </div>
                </div>
                <div className="flex justify-between pt-4">
                  <p>Total</p>
                  <p className="flex items-center gap-x-2 text-xs text-gray-500">
                    <span className="text-xl font-medium text-black">
                      <Currency quantity={subtotal} currency="brl" />
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const sessionId = context.query.session_id as string;
  const products = await fetchLineItems(sessionId);
  const session = await getSession(context);
  const userId = await fetchUserId(session?.user?.email as string);

  return {
    props: {
      products,
      userId,
    },
  };
};
