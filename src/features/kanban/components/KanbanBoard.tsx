import { Box } from "@mui/material";
import { DragDropContext } from "@hello-pangea/dnd";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { moveTask } from "../../../store/kanbanSlice";
import KanbanColumn from "./KanbanColumn";

type Props = {
  search: string;
  visibleColumnIds: string[];
  onAddCard: (columnId: string) => void;
  onCardClick: (task: any) => void;
};

export default function KanbanBoard({
  visibleColumnIds,
  onAddCard,
  onCardClick,
  search,
}: Props) {
  const dispatch = useAppDispatch();
  const { tasks, columns, columnOrder } = useAppSelector(
    (state) => state.kanban,
  );
  const filteredColumnOrder = columnOrder.filter((columnId) =>
    visibleColumnIds.includes(columnId),
  );

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    dispatch(
      moveTask({
        sourceCol: source.droppableId,
        destCol: destination.droppableId,
        sourceIndex: source.index,
        destIndex: destination.index,
        taskId: draggableId,
      }),
    );
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
            if (!search) return true;
            //search criteria defined here
            return (
              task.title?.toLowerCase().includes(normalizedSearch) ||
              task.cardCode?.toLowerCase().includes(normalizedSearch) ||
              task.customerName?.toLowerCase().includes(normalizedSearch) ||
              task.owner?.toLowerCase().includes(normalizedSearch)
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
            />
          );
        })}
      </Box>
    </DragDropContext>
  );
}
