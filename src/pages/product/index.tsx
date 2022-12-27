//import Breadcrumbs from "@/components/Breadcrumbs";
import ProductCard from "@/components/ProductCard";
import SEO from "@/components/SEO";
import { client } from "@/lib/client";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

interface Props {
  products: Product[];
  categories: Category[];
}

const sortItem = [
  {
    id: 1,
    value: "title_asc",
    title: "Alphabetical: A-Z",
  },
  {
    id: 2,
    value: "title_desc",
    title: "Alphabetical: Z-A",
  },
  {
    id: 3,
    value: "price_asc",
    title: "Lowest to highest",
  },
  {
    id: 4,
    value: "price_desc",
    title: "Highest to lowest",
  },
];

export default function Product({ products, categories }: Props) {
  const router = useRouter();
  const {
    query: { q, cat, sort },
  } = useRouter();

  const sortOrder = router.query.hasOwnProperty("sort") && sort;
  const filterCategory = router.query.hasOwnProperty("cat") && cat;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    router.push({
      pathname: "/product",
      query: { ...router.query, [name]: e.target.value },
    });
  };

  return (
    <>
      <SEO title="Produtos" description="Página de Produtos" />
      <section className="py-10">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="flex flex-col md:flex-row -mx-4">
            <aside className="md:w-1/3 lg:w-1/4 px-4">
              <button
                onClick={() => router.push("/product")}
                className="mb-5 w-full text-center px-4 py-2 inline-block text-lg text-gray-700 bg-white shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 hover:text-blue-600"
              >
                Clear Filter
              </button>
              <div className="md:block px-6 py-4 mb-5 border border-gray-200 bg-white rounded shadow-sm">
                <h3 className="font-semibold mb-2">Category</h3>
                <ul className="text-gray-500 space-y-1">
                  {categories?.map((category, index) => (
                    <li key={index}>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          value={category._id}
                          checked={filterCategory === category._id}
                          onChange={(e) => handleChange(e, "cat")}
                          className="h-4 w-4"
                        />
                        <span className="ml-2 text-gray-500">
                          {category.title}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
                <hr className="my-4" />

                <h3 className="font-semibold mb-2">Sort by</h3>
                <ul className="space-y-1">
                  {sortItem?.map((item, index) => (
                    <li key={index}>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="sort"
                          value={item.value}
                          checked={sortOrder === item.value}
                          onChange={(e) => handleChange(e, "sort")}
                          className="h-4 w-4"
                        />
                        <span className="ml-2 text-gray-500">{item.title}</span>
                      </label>
                    </li>
                  ))}
                </ul>
                <hr className="my-4" />
              </div>
            </aside>

            <main className="md:w-2/3 lg:w-3/4 px-3">
              <h3 className="text-lg ">Results: {products.length}</h3>
              <div className="mb-4 border-b border-gray-400" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((prod, index) => (
                  <ProductCard key={index} product={prod} />
                ))}
                {products?.length === 0 && "Produto não encontrado"}
              </div>
            </main>
          </div>
        </div>
      </section>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { q, cat, sort } = context.query;

  let gQuery = '*[_type == "product"';
  if (q !== undefined) {
    gQuery += ` && title match "*${q}*" `;
  }
  if (cat !== undefined) {
    gQuery += ` && references("${cat}") `;
  }

  let order = "";
  if (sort !== undefined) {
    if (sort === "price_asc") order = "| order(price asc)";
    if (sort === "price_desc") order = "| order(price desc)";
    if (sort === "title_asc") order = "| order(title asc)";
    if (sort === "title_desc") order = "| order(title desc)";
  }
  gQuery += `] ${order} {
    _id,
    slug,
    title,
    price,
    image,
    isActive,
    description,
    availableStock,
    category->{title},
    genres[]->{title}
  }`;

  const products = await client.fetch(gQuery);
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
