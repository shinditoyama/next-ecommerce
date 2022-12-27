//import Breadcrumbs from "@/components/Breadcrumbs";
import SEO from "@/components/SEO";
import { urlFor } from "@/lib/client";
import { addCart } from "@/redux/slices/cartSlice";
import { ShoppingBagIcon } from "@heroicons/react/24/solid";
import { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";

interface Props {
  product: Product;
}

export default function ProductId({ product }: Props) {
  const dispatch = useDispatch();

  const addItemCart = (item: Product) => {
    dispatch(addCart(item));
  };

  return (
    <>
      <SEO title={product.title} description={product.title} />
      <section className="py-10">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 mb-4">
            <aside>
              <div className="relative h-[75vh] w-full bg-white border border-gray-300 shadow-md rounded">
                <Image
                  loader={() => urlFor(product.image[0]).url()}
                  src={urlFor(product.image[0]).url()}
                  fill
                  priority
                  unoptimized
                  alt={product.title}
                  className="object-contain scale-95"
                />
              </div>
            </aside>
            <div>
              <h2 className="font-semibold text-2xl mb-4">{product.title}</h2>
              <div className="flex flex-wrap items-center space-x-2 mb-2 divide-x">
                <span className="text-gray-400 flex items-center">
                  <ShoppingBagIcon className="h-5 w-5 mr-2" />
                  {product.availableStock} estoque(s)
                </span>
                {product.availableStock >= 1 ? (
                  <span className="text-green-500 pl-2">disponíveis</span>
                ) : (
                  <span className="text-red-500 pl-2">indisponíveis</span>
                )}
              </div>

              <p className="mb-4 font-semibold text-xl">
                {(product.price / 100).toLocaleString("pt-br", {
                  style: "currency",
                  currency: "BRL",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>

              <p className="mb-4 text-gray-500 text-justify">
                {product.description}
              </p>

              <ul className="mb-5">
                <li className="mb-1">
                  <b className="font-medium w-36 inline-block">Categoria:</b>
                  <span className="text-gray-500">
                    {product.category.title}
                  </span>
                </li>
                {product.genres && (
                  <li className="mb-1">
                    <b className="font-medium w-36 inline-block">Gênero(s):</b>
                    <span className="text-gray-500">
                      {product?.genres?.map((item) => item.title).join(", ")}
                    </span>
                  </li>
                )}
              </ul>

              <div className="flex flex-wrap gap-2">
                <button
                  disabled={product.availableStock < 1 ? true : false}
                  onClick={() => addItemCart(product)}
                  className="px-4 py-2 inline-block text-white bg-yellow-500 border border-transparent rounded-md hover:bg-yellow-600"
                >
                  ADD TO CART
                </button>
                <Link href="/cart">
                  <button className="px-4 py-2 text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
                    BUY NOW
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { slug } = query;
  const product = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/product/slug?slug=${slug}`
  )
    .then((res) => res.json())
    .then((data) => data.product);

  return {
    props: {
      product,
    },
  };
};
