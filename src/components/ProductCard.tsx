import { urlFor } from "@/lib/client";
import { addCart } from "@/redux/slices/cartSlice";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import Currency from "react-currency-formatter";
import { useDispatch } from "react-redux";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const dispatch = useDispatch();

  const addItemCart = (item: Product) => {
    dispatch(addCart(item));
  };

  return (
    <div>
      <article className="shadow-sm rounded bg-white border border-gray-300">
        <Link href={`/product/${product.slug.current}`}>
          <button className="relative h-64 md:h-72 w-full block">
            <Image
              loader={() => urlFor(product.image[0]).url()}
              src={urlFor(product.image[0]).url()}
              fill
              priority
              unoptimized
              alt={product.title}
              className="md:object-contain object-cover md:scale-90"
            />
            {/*<span className="inline-block px-3 py-1 text-sm bg-red-100 text-red-600 rounded-full absolute left-3 top-3">
              20% desc
            </span>*/}
          </button>
        </Link>
        <div className="p-4 border-t border-t-gray-200">
          <button
            disabled={product.availableStock < 1 ? true : false}
            onClick={() => addItemCart(product)}
            className="float-right px-3 py-2 text-gray-400 border border-gray-300 rounded-md hover:border-blue-400 hover:text-blue-600"
          >
            <ShoppingCartIcon className="h-6 w-6" />
          </button>

          <Link href={`/product/${product.slug.current}`}>
            <p className="truncate text-gray-600 hover:text-blue-500">
              {product.title}
            </p>
          </Link>

          <span className="font-semibold">
            <Currency quantity={product.price / 100} currency="brl" />
          </span>
        </div>
      </article>
    </div>
  );
}
