import { Box } from "@mui/material";
import { DragDropContext } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { moveTask, updateCardStatus } from "../../../store/kanbanSlice";
import KanbanColumn from "./KanbanColumn";
import type { KanbanProps } from "../../../store/kanbanTypes";
import { matchesCreatedDateRange } from "../utils/createdDateFilter";

export default function KanbanBoard({
  activeDivision,
  createdDateStart,
  createdDateEnd,
  visibleColumnIds,
  onAddCard,
  onCardClick,
  search,
  onDelete,
}: KanbanProps) {
  const dispatch = useAppDispatch();
  const { tasks, columns, columnOrder } = useAppSelector(
    (state) => state.kanban,
  );
  const filteredColumnOrder = columnOrder.filter((columnId) =>
    visibleColumnIds.includes(columnId),
  );

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;
    if (!visibleColumnIds.includes(destination.droppableId)) {
      return;
    }

    // Update the UI first so drag/drop feels immediate.
    dispatch(
      moveTask({
        sourceCol: source.droppableId,
        destCol: destination.droppableId,
        sourceIndex: source.index,
        destIndex: destination.index,
        taskId: draggableId,
      }),
    );

    try {
      await dispatch(
        updateCardStatus({
          cardId: draggableId,
          status: destination.droppableId,
        }),
      ).unwrap();
    } catch (err) {
      console.error("Failed to persist card status:", err);
      // Roll back the local move if the backend update fails.
      dispatch(
        moveTask({
          sourceCol: destination.droppableId,
          destCol: source.droppableId,
          sourceIndex: destination.index,
          destIndex: source.index,
          taskId: draggableId,
        }),
      );
    }
  };
  const normalizedSearch = search.toLowerCase();

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          px: 3,
          py: 2,
          overflowX: "auto",
          alignItems: "flex-start",
          minHeight: "100vh",
          background: "linear-gradient(180def, #f7f9fc, #eef1f6",
        }}
      >
        {filteredColumnOrder.map((columnId) => {
          const column = columns[columnId];
          const filteredTaskIds = column.taskIds.filter((taskId) => {
            const task = tasks[taskId];
            // Managers can view every division; others only see matching cards.
            const matchesDivision =
              activeDivision === "MNG" ||
              task.departmentCode === activeDivision;

            if (!matchesDivision) {
              return false;
            }

            if (
              !matchesCreatedDateRange(task, createdDateStart, createdDateEnd)
            ) {
              return false;
            }

            if (!search) return true;
            // Search focuses on the fields users most often recognize quickly.
            return (
              task.title?.toLowerCase().includes(normalizedSearch) ||
              task.cardCode?.toLowerCase().includes(normalizedSearch) ||
              task.customerName?.toLowerCase().includes(normalizedSearch) ||
              task.customerPic?.toLowerCase().includes(normalizedSearch) ||
              task.phoneNumber?.toLowerCase().includes(normalizedSearch) ||
              task.customerGroup?.toLowerCase().includes(normalizedSearch) ||
              task.description?.toLowerCase().includes(normalizedSearch) ||
              task.owner?.toLowerCase().includes(normalizedSearch) ||
              task.items?.some((item) =>
                item.item.toLowerCase().includes(normalizedSearch),
              )
            );
          });
          return (
            <KanbanColumn
              key={columnId}
              column={{
                ...column,
                taskIds: filteredTaskIds,
              }}
              tasks={tasks}
              onAddCard={onAddCard}
              onCardClick={onCardClick}
              onDelete={onDelete}
            />
          );
        })}
      </Box>
    </DragDropContext>
  );
}
