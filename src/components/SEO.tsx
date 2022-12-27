import { NextSeo } from "next-seo";
import { useRouter } from "next/router";

interface Props {
  title: string;
  description: string;
}

export default function SEO({ title, description }: Props) {
  const { asPath } = useRouter();
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";

  const url = `${origin}${asPath}`;

  return (
    <NextSeo
      title={title}
      description={description}
      canonical={url}
      openGraph={{
        url,
        title,
      }}
    />
  );
}
