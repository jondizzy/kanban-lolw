import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosApi";
import type {
  Task,
  KanbanState,
  ApiCard,
  ApiCardItem,
  Role,
} from "./kanbanTypes";
import { resolveDivisionFromCardCode } from "../features/kanban/utils/cardDivision";

const normalizeDepartmentCode = (
  departmentCode?: string | null,
): Role | undefined => {
  const normalizedDepartmentCode = departmentCode?.trim().toUpperCase();

  if (
    normalizedDepartmentCode === "AG" ||
    normalizedDepartmentCode === "CH" ||
    normalizedDepartmentCode === "FD" ||
    normalizedDepartmentCode === "BM" ||
    normalizedDepartmentCode === "MNG"
  ) {
    return normalizedDepartmentCode;
  }

  return undefined;
};

const columnOrder: string[] = [
  "new_leads",
  "ag_qualify",
  "ag_interest",
  "ag_hot",
  "fd_food",
  "fd_long",
  "bm_bid",
  "won",
  "lost",
];

const createEmptyColumns = (): KanbanState["columns"] => ({
  new_leads: {
    id: "new_leads",
    title: "New Leads",
    taskIds: [],
  },
  ag_qualify: {
    id: "ag_qualify",
    title: "Qualifying Prospect",
    taskIds: [],
  },
  ag_interest: {
    id: "ag_interest",
    title: "Interest Prospect",
    taskIds: [],
  },
  ag_hot: {
    id: "ag_hot",
    title: "Hot Prospect",
    taskIds: [],
  },
  fd_food: {
    id: "fd_food",
    title: "Food Trial",
    taskIds: [],
  },
  fd_long: {
    id: "fd_long",
    title: "Long Trial",
    taskIds: [],
  },
  bm_bid: {
    id: "bm_bid",
    title: "Bidding",
    taskIds: [],
  },
  won: {
    id: "won",
    title: "Won",
    taskIds: [],
  },
  lost: {
    id: "lost",
    title: "Lost",
    taskIds: [],
  },
});

const initialState: KanbanState = {
  tasks: {},
  columns: createEmptyColumns(),
  columnOrder,
};

export const createTask = createAsyncThunk(
  "kanban/createTask",
  async ({
    columnId,
    title,
    department,
    transactionType,
  }: {
    columnId: string;
    title: string;
    department: Role;
    transactionType: string;
  }) => {
    const res = await api.post("cards", {
      title,
      department_code: department,
      transaction_type: transactionType,
      status: columnId,
    });
    return { columnId, department, task: res.data };
  },
);

export const deleteTask = createAsyncThunk(
  "kanban/deleteTask",
  async (cardId: string) => {
    await api.delete(`cards/${cardId}`);
    return { cardId };
  },
);

export const saveCardData = createAsyncThunk(
  "kanban/saveCardData",
  async ({ cardId, taskData }: { cardId: string; taskData: Partial<Task> }) => {
    const res = await api.put(`cards/${cardId}`, taskData);
    return { cardId, task: res.data };
  },
);

export const updateCardStatus = createAsyncThunk(
  "kanban/updateCardStatus",
  async ({ cardId, status }: { cardId: string; status: string }) => {
    const res = await api.put(`cards/${cardId}`, { status });
    return { cardId, status, task: res.data };
  },
);

export const fetchCards = createAsyncThunk("kanban/fetchCards", async () => {
  const res = await api.get("cards");

  const tasks: Record<string, Task> = {};
  const columns = createEmptyColumns();

  (res.data as ApiCard[]).forEach((card, index) => {
    const rawId = card.id ?? card.ID ?? card.Id;
    let id = String(rawId ?? `fallback-${index}`);
    if (tasks[id]) {
      id = `${id}-${index}`;
    }
    const status =
      card.Status && columns[card.Status] ? card.Status : "new_leads";

    tasks[id] = {
      id,
      title: card.Title ?? "",
      status,
      cardCode: card.CardCode ?? "",
      departmentCode:
        normalizeDepartmentCode(card.DepartmentCode ?? null) ??
        resolveDivisionFromCardCode(card.CardCode ?? ""),
      description: card.Description ?? "",
      value: Number(card.Value ?? 0),
      owner: card.Owner ?? "",
      customerName: card.CustomerName ?? "",
      customerGroup: card.CustomerGroup ?? "",
      activityEarly: card.ActivityEarly ?? "",
      activityMid: card.ActivityMid ?? "",
      activityLate: card.ActivityLate ?? "",
      items: (card.Items ?? []).map((it) => ({
        item: it.item ?? "",
        quantity: Number(it.quantity ?? 0),
        uom: it.uom ?? "",
        pricePerUom: Number(it.pricePerUom ?? 0),
        subtotal: Number(it.subtotal ?? 0),
      })),
      total: Number(card.Value ?? 0),
    };

    columns[status].taskIds.push(id);
  });

  return { tasks, columns, columnOrder };
});

const kanbanSlice = createSlice({
  name: "kanban",
  initialState,
  reducers: {
    //move
    moveTask: (
      state,
      action: PayloadAction<{
        sourceCol: string;
        destCol: string;
        sourceIndex: number;
        destIndex: number;
        taskId: string;
      }>,
    ) => {
      const { sourceCol, destCol, sourceIndex, destIndex, taskId } =
        action.payload;
      state.columns[sourceCol].taskIds.splice(sourceIndex, 1);
      state.columns[destCol].taskIds.splice(destIndex, 0, taskId);
    },

    //update
    updateTask(
      state,
      action: PayloadAction<{
        id: string;
        changes: Partial<Task>;
      }>,
    ) {
      const { id, changes } = action.payload;
      state.tasks[id] = {
        ...state.tasks[id],
        ...changes,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createTask.fulfilled, (state, action) => {
      const { columnId, department, task } = action.payload;
      const id = String(task.id ?? task.ID ?? task.Id);
      state.tasks[id] = {
        id,
        title: task.Title,
        status: columnId,
        cardCode: task.CardCode,
        departmentCode:
          normalizeDepartmentCode(task.DepartmentCode ?? null) ??
          resolveDivisionFromCardCode(task.CardCode ?? "") ??
          department,
        description: task.Description,
        value: task.Value,
        owner: task.Owner,
        items: [],
        total: 0,
      };
      state.columns[columnId].taskIds.push(id);
    });
    builder.addCase(saveCardData.fulfilled, (state, action) => {
      const { cardId, task } = action.payload;
      const saved = task?.card;
      const savedItems = Array.isArray(task?.items) ? task.items : undefined;
      if (state.tasks[cardId]) {
        state.tasks[cardId] = {
          ...state.tasks[cardId],
          title: saved?.Title ?? state.tasks[cardId].title,
          status: saved?.Status ?? state.tasks[cardId].status,
          cardCode: saved?.CardCode ?? state.tasks[cardId].cardCode,
          departmentCode:
            normalizeDepartmentCode(saved?.DepartmentCode ?? null) ??
            resolveDivisionFromCardCode(
              saved?.CardCode ?? state.tasks[cardId].cardCode ?? "",
            ) ??
            state.tasks[cardId].departmentCode,
          description: saved?.Description ?? state.tasks[cardId].description,
          value: Number(saved?.Value ?? state.tasks[cardId].value ?? 0),
          owner: saved?.Owner ?? state.tasks[cardId].owner,
          customerName:
            saved?.CustomerName ?? state.tasks[cardId].customerName ?? "",
          customerGroup:
            saved?.CustomerGroup ?? state.tasks[cardId].customerGroup ?? "",
          activityEarly:
            saved?.ActivityEarly ?? state.tasks[cardId].activityEarly ?? "",
          activityMid:
            saved?.ActivityMid ?? state.tasks[cardId].activityMid ?? "",
          activityLate:
            saved?.ActivityLate ?? state.tasks[cardId].activityLate ?? "",
          items:
            savedItems?.map((it: ApiCardItem) => ({
              item: it.item ?? "",
              quantity: Number(it.quantity ?? 0),
              uom: it.uom ?? "",
              pricePerUom: Number(it.pricePerUom ?? 0),
              subtotal: Number(it.subtotal ?? 0),
            })) ?? state.tasks[cardId].items,
        };
      }
    });
    builder.addCase(updateCardStatus.fulfilled, (state, action) => {
      const { cardId, status } = action.payload;
      if (state.tasks[cardId]) {
        state.tasks[cardId].status = status;
      }
    });
    builder.addCase(deleteTask.fulfilled, (state, action) => {
      const { cardId } = action.payload;
      const task = state.tasks[cardId];

      if (!task) {
        return;
      }

      const columnId = task.status;
      if (columnId && state.columns[columnId]) {
        state.columns[columnId].taskIds = state.columns[
          columnId
        ].taskIds.filter((id) => id !== cardId);
      }

      delete state.tasks[cardId];
    });

    builder.addCase(fetchCards.fulfilled, (state, action) => {
      const { tasks, columns, columnOrder } = action.payload;
      state.tasks = tasks;
      state.columns = columns;
      state.columnOrder = columnOrder;
    });
  },
});

export const { moveTask, updateTask } = kanbanSlice.actions;
export default kanbanSlice.reducer;
