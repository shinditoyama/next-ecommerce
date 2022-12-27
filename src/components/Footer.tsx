import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-10 border-t flex justify-center">
      <Link href="https://tailwind-ecommerce.com" target="_blank" passHref>
        <p className="hover:text-blue-500">Tailwind ecommerce</p>
      </Link>
    </footer>
  );
}
