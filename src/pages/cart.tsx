import CartItem from "@/components/CartItem";
import Checkout from "@/components/Checkout";
import SEO from "@/components/SEO";
import { cartSelector } from "@/redux/slices/cartSlice";
import { useSelector } from "react-redux";

export default function Cart() {
  const cart = useSelector(cartSelector);

  return (
    <>
      <SEO title="Carrinho" description="Carrinho de Compra" />
      <section className="container px-4 py-10">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-3/4">
            <article className="border border-gray-200 bg-white shadow-sm rounded mb-5 p-3 lg:p-5">
              {cart.map((item, index) => (
                <CartItem key={index} data={item} />
              ))}
              {cart.length === 0 && "Carrinho vazio"}
            </article>
          </div>
          <aside className="md:w-1/4">
            <Checkout />
          </aside>
        </div>
      </section>
    </>
  );
}
