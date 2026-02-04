export type LineItem = {
  item: string;
  quantity: number;
  uom: string;
  pricePerUom: number;
  subtotal: number; //PPU * QTY
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  cardCode?: string;
  customerName?: string;
  owner?: string;
  value?: number;
  items: LineItem[];
  total?: number;
};
export type CardFormState = {
  title: string;
  description?: string;
  cardCode?: string;
  customerName?: string;
  owner?: string;
  value?: number; //deal value

  items: LineItem[];
  total?: number; //sum(subtotal)
};
