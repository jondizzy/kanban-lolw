import { Box } from "@mui/material";
import { DragDropContext } from "@hello-pangea/dnd";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { moveTask } from "../../../store/kanbanSlice";
import KanbanColumn from "./KanbanColumn";

type Props = {
  onAddCard: (columnId: string) => void;
  onCardClick: (task: any) => void;
};

export default function KanbanBoard({ onAddCard, onCardClick }: Props) {
  const dispatch = useAppDispatch();
  const { tasks, columns, columnOrder } = useAppSelector(
    (state) => state.kanban,
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

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          px: 3,
          py: 2,
          overflowX: "auto",
          minHeight: "100vh",
          backgroun: "linear-gradient(180def, #f7f9fc, #eef1f6",
        }}
      >
        {columnOrder.map((columnId) => (
          <KanbanColumn
            key={columnId}
            column={columns[columnId]}
            tasks={tasks}
            onAddCard={onAddCard}
            onCardClick={onCardClick}
          />
        ))}
      </Box>
    </DragDropContext>
  );
}
