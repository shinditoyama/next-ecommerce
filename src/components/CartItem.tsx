import { urlFor } from "@/lib/client";
import {
  decrementQuantity,
  incrementQuantity,
  removeCart,
} from "@/redux/slices/cartSlice";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import Currency from "react-currency-formatter";
import { useDispatch } from "react-redux";

interface Props {
  data: Product;
}

export default function CartItem({ data }: Props) {
  const dispatch = useDispatch();

  const removeItemCart = (item: Product) => {
    dispatch(removeCart(item));
  };

  function increment(item: Product) {
    dispatch(incrementQuantity(item));
  }

  function decrement(item: Product) {
    dispatch(decrementQuantity(item));
  }

  return (
    <>
      <div className="flex flex-wrap lg:flex-row gap-4">
        <div className="w-full lg:w-2/5 xl:w-2/4">
          <figure className="flex leading-5">
            <div>
              <div className="block relative w-16 h-16 rounded border border-gray-200 overflow-hidden">
                <Image
                  loader={() => urlFor(data.image[0]).url()}
                  src={urlFor(data.image[0]).url()}
                  fill
                  priority
                  unoptimized
                  alt={data.title}
                  className="object-scale-down"
                />
              </div>
            </div>
            <figcaption className="ml-3">
              <Link href={`/product/${data.slug.current}`}>
                <p className="hover:text-blue-600">{data.title}</p>
              </Link>
              <p className="mt-1 text-gray-400">{data.category.title}</p>
            </figcaption>
          </figure>
        </div>
        <div>
          <div className="w-36 flex relative">
            <div className="flex">
              <button
                onClick={() => decrement(data)}
                className="inline-flex items-center px-2 text-sm text-gray-900 bg-gray-200 hover:bg-gray-300 border border-r-0 border-gray-300 rounded-l-md"
              >
                <MinusIcon className="h-4 w-4" />
              </button>
              <input
                type="text"
                value={data.quantity}
                readOnly
                className="block appearance-none border border-gray-300 bg-gray-100 py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
              />
              <button
                disabled={data.quantity >= data.availableStock}
                onClick={() => increment(data)}
                className="inline-flex items-center px-2  text-gray-900 bg-gray-200 hover:bg-gray-300 border border-l-0 border-gray-300 rounded-r-md"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        <div>
          <div className="leading-5">
            <p className="font-semibold">
              <Currency
                quantity={(data.price * data.quantity) / 100}
                currency="brl"
              />
            </p>
            <small className="text-gray-400">
              <Currency quantity={data.price / 100} currency="brl" /> / por item
            </small>
          </div>
        </div>
        <div className="flex-auto">
          <div className="float-right">
            <button
              onClick={() => removeItemCart(data)}
              className="px-4 py-2 inline-block text-red-600 bg-white shadow-sm border border-gray-200 rounded-md hover:bg-gray-100"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
      <hr className="my-4" />
    </>
  );
}
