import getStripe from "@/lib/getStripe";
import {
  calculateTotals,
  cartSelector,
  totalAmountSelector,
  totalQuantitySelector,
} from "@/redux/slices/cartSlice";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Checkout() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const cart = useSelector(cartSelector);
  const totalAmount = useSelector(totalAmountSelector);
  const totalQuantity = useSelector(totalQuantitySelector);

  useEffect(() => {
    dispatch(calculateTotals());
  }, [cart, dispatch]);

  const createCheckoutSession = async () => {
    setLoading(true);

    const checkoutSession = await axios.post("/api/create-stripe-session", {
      items: cart,
      email: session?.user?.email,
    });

    // Redirect to checkout
    const stripe = await getStripe();
    const result = await stripe!.redirectToCheckout({
      sessionId: checkoutSession.data.id,
    });

    if (result.error) {
      console.warn(result.error.message);
    }

    setLoading(false);
  };

  const checkoutHandler = () => {
    if (session) {
      createCheckoutSession();
    } else {
      signIn();
    }
  };

  return (
    <article className="border border-gray-200 bg-white shadow-sm rounded mb-5 p-3 lg:p-5">
      <ul className="mb-5">
        <li className="flex justify-between text-gray-600  mb-1">
          <span>Subtotal:</span>
          <span>
            {(totalAmount / 100).toLocaleString("pt-br", {
              style: "currency",
              currency: "BRL",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </li>
        <li className="flex justify-between text-gray-600  mb-1">
          <span>Desconto:</span>
          <span className="text-green-500">R$ 0.00</span>
        </li>
        <li className="text-lg font-bold border-t flex justify-between mt-3 pt-3">
          <span>Qtde:</span>
          <span>x {totalQuantity}</span>
        </li>
        <li className="text-lg font-bold flex justify-between mt-3">
          <span>Total:</span>
          <span>
            {(totalAmount / 100).toLocaleString("pt-br", {
              style: "currency",
              currency: "BRL",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </li>
      </ul>

      <button
        disabled={cart.length === 0 || loading}
        onClick={checkoutHandler}
        className="w-full py-3 inline-block rounded-md text-white text-lg font-medium bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed border border-transparent hover:bg-green-700"
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
          "Comprar"
        )}
      </button>
    </article>
  );
}
