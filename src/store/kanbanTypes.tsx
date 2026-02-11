//sets of variables grouped as a single entity

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
  customerGroup?: string;
  owner?: string;
  value?: number;
  items: LineItem[];
  total?: number;
  activityEarly?: string;
  activityMid?: string;
  activityLate?: string;
};

export type CardFormState = {
  title: string;
  description?: string;
  cardCode?: string;
  customerName?: string;
  customerGroup?: string;
  owner?: string;
  value?: number; //deal value
  activityEarly?: string;
  activityMid?: string;
  activityLate?: string;

  items: LineItem[];
  total: number; //sum(subtotal)
};

export type CardFormRedux = {
  open: boolean;
  form: CardFormState;
  setForm: React.Dispatch<React.SetStateAction<CardFormState>>;
  onClose: () => void;
  onSave: () => void;
};

export type Column = {
  id: string;
  title: string;
  taskIds: string[];
};

export type KanbanState = {
  tasks: Record<string, Task>;
  columns: Record<string, Column>;
  columnOrder: string[];
};
