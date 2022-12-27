interface Category {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  _type: "category";
  slug: {
    _type: "slug";
    current: string;
  };
  title: string;
}

interface Image {
  _key: string;
  _type: "image";
  asset: {
    _ref: string;
  };
}

interface Banner {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  _type: "banner";
  image: Image[];
  link: string;
  product: string;
  midText: string;
  smallText: string;
}

interface Product {
  _id: string;
  _rev: string;
  _createdAt: string;
  _updatedAt: string;
  _type: "product";
  slug: {
    _type: "slug";
    current: string;
  };
  category: {
    title: string;
  };
  genres: [
    {
      title: string;
    }
  ];
  title: string;
  price: number;
  description: string;
  image: Image[];
  quantity: number;
  availableStock: number;
  isActive: boolean;
}

interface StripeProduct {
  id: string;
  object: string;
  amount_discount: number;
  amount_subtotal: number;
  amount_tax: number;
  amount_total: number;
  currency: string;
  description: string;
  price: {
    unit_amount: number;
  };
  quantity: number;
}

interface Order {
  _id: string;
  _createdAt: Date;
  quantity: number;
  total: number;
  orderItem: OrderItem[];
}

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

// declare module "react-sanity-pagination";
