import Link from "next/link";
import { useRouter } from "next/router";

interface Props {
  categories: Category[];
}

export default function Banner({ categories }: Props) {
  const router = useRouter();

  const onCategory = (id: string) => {
    router.push({
      pathname: "/product",
      query: { ...router.query, cat: id },
    });
  };

  return (
    <article className="p-4 bg-white border border-gray-300 shadow-sm rounded-md">
      <div className="flex flex-col md:flex-row">
        <aside className="md:w-1/4 mb-4 md:mb-0">
          <ul>
            {categories?.map((category, index) => (
              <li key={index}>
                <button
                  onClick={() => onCategory(category._id)}
                  className="w-full flex px-3 py-2 rounded-md hover:bg-blue-50 hover:text-blue-600"
                >
                  {category.title}
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <main className="md:w-3/4 flex-auto">
          <article className="bg-blue-500 p-6 lg:p-16 rounded w-full h-full">
            <h1 className="text-3xl md:text-4xl text-white font-semibold">
              Best products &amp; brands in our store
            </h1>
            <p className="text-lg text-white font-normal mt-4 mb-6">
              Trendy Products, Factory Prices, Excellent Service
            </p>
            <div className="flex gap-2">
              <Link href="/product">
                <button className="px-4 py-2 inline-block font-semibold bg-yellow-500 text-white border border-transparent rounded-md hover:bg-yellow-600">
                  Shop Now
                </button>
              </Link>
            </div>
          </article>
        </main>
      </div>
    </article>
  );
}
