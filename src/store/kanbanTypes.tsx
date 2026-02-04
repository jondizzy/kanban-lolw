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
  activity?: string;
};
export type CardFormState = {
  title: string;
  description?: string;
  cardCode?: string;
  customerName?: string;
  owner?: string;
  value?: number; //deal value
  activity?: string;

  items: LineItem[];
  total?: number; //sum(subtotal)
};
