import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosApi";
import type { Task, KanbanState } from "./kanbanTypes";

// type Column = {
//   id: string;
//   title: string;
//   taskIds: string[];
// };

// type KanbanState = {
//   tasks: Record<string, Task>;
//   columns: Record<string, Column>;
//   columnOrder: string[];
// };

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

type ApiCard = {
  id?: number | string;
  ID?: number | string;
  Id?: number | string;
  Title?: string;
  CardCode?: string;
  Description?: string;
  Value?: number | null;
  Owner?: string | null;
  Status?: string | null;
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
    department: string;
    transactionType: string;
  }) => {
    const res = await api.post("cards", {
      title,
      department_code: department,
      transaction_type: transactionType,
      status: columnId,
    });
    return { columnId, task: res.data };
  },
);

export const saveCardData = createAsyncThunk(
  "kanban/saveCardData",
  async ({ cardId, taskData }: { cardId: string; taskData: Partial<Task> }) => {
    const res = await api.put(`cards/${cardId}`, taskData);
    return { cardId, task: res.data };
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
      cardCode: card.CardCode ?? "",
      description: card.Description ?? "",
      value: Number(card.Value ?? 0),
      owner: card.Owner ?? "",
      items: [],
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
      const { columnId, task } = action.payload;
      const id = String(task.id ?? task.ID ?? task.Id);
      state.tasks[id] = {
        id,
        title: task.Title,
        cardCode: task.CardCode,
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
      if (state.tasks[cardId]) {
        state.tasks[cardId] = {
          ...state.tasks[cardId],
          title: saved?.Title ?? state.tasks[cardId].title,
          description: saved?.Description ?? state.tasks[cardId].description,
          value: Number(saved?.Value ?? state.tasks[cardId].value ?? 0),
          owner: saved?.Owner ?? state.tasks[cardId].owner,
        };
      }
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
