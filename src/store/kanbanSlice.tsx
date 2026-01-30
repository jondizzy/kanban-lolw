import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type Task = {
  id: string;
  title: string;
  description?: string;
  value?: number;
  owner?: string;
};

type Column = {
  id: string;
  title: string;
  taskIds: string[];
};

type KanbanState = {
  tasks: Record<string, Task>;
  columns: Record<string, Column>;
  columnOrder: string[];
};

const initialState: KanbanState = {
  tasks: {},
  columns: {
    new_leads: {
      id: "new_leads",
      title: "New Leads",
      taskIds: [],
    },
    progressing: {
      id: "progressing",
      title: "Progressing",
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
  columnOrder: ["new_leads", "progressing", "won", "lost"],
};

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
    addTask(state, action: PayloadAction<{ columnId: string; title: string }>) {
      const id = `task-${Date.now()}`;
      state.tasks[id] = {
        id,
        title: action.payload.title,
      };
      state.columns[action.payload.columnId].taskIds.push(id);
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
});

export const { moveTask, addTask, updateTask } = kanbanSlice.actions;

export default kanbanSlice.reducer;
