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

const initialState: KanbanState = {
  //tasks should be empty. if there's something inside { } then it's for demo purposes
  tasks: {
    "task-1": {
      id: "task-1",
      title: "Prepare demo flow",
      description: "Show board, drag card, open dialog",
      owner: "Jonas",
      value: 1000,
      cardCode: "DEMO-001",
      items: [
        {
          item: "Sample Product",
          quantity: 2,
          uom: "pcs",
          pricePerUom: 500,
          subtotal: 1000,
        },
      ],
    },
    "task-2": {
      id: "task-2",
      title: "Style Kanban UI",
      description: "Make it look like a real product",
      owner: "David",
      value: 0,
      cardCode: "DEMO-002",
      items: [
        {
          item: "Sample Product",
          quantity: 2,
          uom: "pcs",
          pricePerUom: 500,
          subtotal: 1000,
        },
      ],
    },
    "task-3": {
      id: "task-3",
      title: "Creating page routes",
      description: "Pop-ups, notification badges",
      owner: "David",
      value: 1000,
      cardCode: "DEMO-003",
      items: [],
    },
    "task-4": {
      id: "task-4",
      title: "Fixing 'title' fields",
      description: "",
      owner: "",
      value: 0,
      cardCode: "AG202600001N",
      items: [],
    },
    "task-5": {
      id: "task-5",
      title: "Smoothen onDrop card animation",
      description: "",
      owner: "",
      value: 0,
      cardCode: "DEMO-004",
      items: [],
    },
    "task-6": {
      id: "task-6",
      title: "API payload opmitization",
      description: "",
      owner: "",
      value: 0,
      cardCode: "DEMO-005",
      items: [],
    },
    "task-7": {
      id: "task-7",
      title: "Pembelian furnitur untuk kantor",
      description: "",
      owner: "",
      value: 0,
      cardCode: "BM2026010001N",
      items: [],
    },
  },
  //the comment above goes for taskIds too
  columns: {
    new_leads: {
      id: "new_leads",
      title: "New Leads",
      taskIds: [
        "task-1",
        "task-2",
        "task-3",
        "task-4",
        "task-5",
        "task-6",
        "task-7",
      ],
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
  },
  columnOrder: [
    "new_leads",
    "ag_qualify",
    "ag_interest",
    "ag_hot",
    "fd_food",
    "fd_long",
    "bm_bid",
    "won",
    "lost",
  ],
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
    //add
    // addTask(state, action: PayloadAction<{ columnId: string; title: string }>) {
    //   const id = `task-${Date.now()}`;
    //   state.tasks[id] = {
    //     id,
    //     title: action.payload.title,
    //   };
    //   state.columns[action.payload.columnId].taskIds.push(id);
    // },
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
      const id = task.id.toString();
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
  },
});

export const { moveTask, updateTask } = kanbanSlice.actions;
export default kanbanSlice.reducer;
