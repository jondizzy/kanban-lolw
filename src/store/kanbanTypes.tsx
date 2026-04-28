// Shared domain types used across Redux, dialogs, and API mapping.

export type LineItem = {
  id?: number | string;
  item: string;
  quantity: number;
  uom: string;
  pricePerUom: number;
  margin?: number;
  requiredCapital?: number;
  subtotal: number; //PPU * QTY
};

export type FileItem = {
  id: string;
  name: string;
  url: string;
};

export type MeetingNote = {
  title: string;
  location: string;
  startedAt: string;
  notes: string;
};

export type Task = {
  id: string;
  title: string;
  createdAt?: string;
  description?: string;
  status?: string; // matches the column id used by the board and backend
  cardCode?: string;
  departmentCode?: Role;
  customerName?: string;
  customerPic?: string;
  phoneNumber?: string;
  customerGroup?: string;
  owner?: string;
  value?: number;
  capital?: number;
  custPo?: string;
  items: LineItem[];
  total?: number;
  activityEarly?: string;
  activityMid?: string;
  activityLate?: string;
  meetings?: MeetingNote[];
  files?: FileItem[];
};

export type CardFormState = {
  title: string;
  description?: string;
  cardCode?: string;
  customerName?: string;
  customerPic?: string;
  phoneNumber?: string;
  customerGroup?: string;
  owner?: string;
  value?: number; // deal value shown on the card
  custPo?: string;
  activityEarly?: string;
  activityMid?: string;
  activityLate?: string;
  meetings: MeetingNote[];

  items: LineItem[];
  total: number; // sum of all line-item subtotals
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
  createdDateStart?: string;
  createdDateEnd?: string;
  activeDivision: Role;
  visibleColumnIds: string[];
  onAddCard: (columnId: string) => void;
  onCardClick: (task: Task) => void;
  onDelete: (taskId: string) => void;
};

export type AddCardProps = {
  open: boolean;
  columnId: string;
  defaultDepartment: Role;
  allowDepartmentChange?: boolean;
  onClose: () => void;
  onCreate: (payload: {
    title: string;
    department: Role;
    transactionType: string;
  }) => void;
};

export type ApiCard = {
  // Backend payloads may not use one consistent casing for every field.
  id?: number | string;
  ID?: number | string;
  Id?: number | string;
  Title?: string;
  CreatedAt?: string | null;
  CardCode?: string;
  DepartmentCode?: Role | string | null;
  Description?: string;
  Value?: number | null;
  // Capital?: number | null;
  // capital?: number | null;
  RequiredCapital?: number | null;
  // requiredCapital?: number | null;
  Owner?: string | null;
  Status?: string | null;
  CustomerName?: string | null;
  CustomerPic?: string | null;
  PhoneNumber?: string | null;
  CustomerGroup?: string | null;
  // CustPO?: string | null;
  CustPo?: string | null;
  // CustomerPO?: string | null;
  // customerPO?: string | null;
  // customerPo?: string | null;
  // custPO?: string | null;
  ActivityEarly?: string | null;
  ActivityMid?: string | null;
  ActivityLate?: string | null;
  Meetings?: ApiCardMeeting[];
  Items?: ApiCardItem[];
  Files?: ApiCardFile[];
};

export type ApiCardMeeting = {
  id?: number | string;
  title?: string | null;
  location?: string | null;
  startedAt?: string | null;
  notes?: string | null;
  sortOrder?: number | null;
};

export type ApiCardFile = {
  id?: number | string;
  name?: string;
  fileName?: string;
  url?: string;
  mimeType?: string | null;
  fileSizeBytes?: number;
};

export type ApiCardItem = {
  id?: number | string;
  item?: string;
  quantity?: number;
  uom?: string;
  pricePerUom?: number;
  margin?: number;
  requiredCapital?: number;
  RequiredCapital?: number;
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

export type CardPreviewProps = {
  task: Task;
  index: number;
  onClick: (task: Task) => void;
  onDelete: (taskId: string) => void;
};
