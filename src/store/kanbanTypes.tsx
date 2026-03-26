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
  status?: string;
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

export type Role = "AG" | "CH" | "FD" | "BM" | "MNG";

export type KanbanProps = {
  search: string;
  visibleColumnIds: string[];
  onAddCard: (columnId: string) => void;
  onCardClick: (task: any) => void;
  onDelete: (taskId: string) => void;
};

export type AddCardProps = {
  open: boolean;
  columnId: string;
  onClose: () => void;
  onCreate: (payload: {
    title: string;
    department: string;
    transactionType: string;
  }) => void;
};

export type ApiCard = {
  id?: number | string;
  ID?: number | string;
  Id?: number | string;
  Title?: string;
  CardCode?: string;
  Description?: string;
  Value?: number | null;
  Owner?: string | null;
  Status?: string | null;
  CustomerName?: string | null;
  CustomerGroup?: string | null;
  ActivityEarly?: string | null;
  ActivityMid?: string | null;
  ActivityLate?: string | null;
  Items?: ApiCardItem[];
};

export type ApiCardItem = {
  item?: string;
  quantity?: number;
  uom?: string;
  pricePerUom?: number;
  subtotal?: number;
};

export type AuthSession = {
  user_id?: number | string | null;
  userId?: number | string | null;
  UserID?: number | string | null;
  username?: string | null;
  userName?: string | null;
  Username?: string | null;
  role?: string | null;
  userRole?: string | null;
  Role?: string | null;
  isLoggedIn?: boolean;
};
