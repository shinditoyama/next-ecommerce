import Banner from "@/components/Banner";
import ProductCard from "@/components/ProductCard";
import { GetServerSideProps } from "next";
import Link from "next/link";

interface Props {
  products: Product[];
  categories: Category[];
}

export default function Home({ products, categories }: Props) {
  return (
    <main>
      <section className="pt-5">
        <div className="container max-w-screen-xl mx-auto px-4">
          <Banner categories={categories} />
        </div>
      </section>
      <section className="py-10">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">New products</h2>
            <Link href="/product">
              <h4 className="text-base text-blue-600 hover:text-blue-500 font-bold mt-2">
                View
              </h4>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products?.map((prod, index) => (
              <ProductCard key={index} product={prod} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const products = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/product`
  )
    .then((res) => res.json())
    .then((data) => data.products);

  const categories = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/category`
  )
    .then((res) => res.json())
    .then((data) => data.categories);

  return {
    props: {
      products,
      categories,
    },
  };
};
