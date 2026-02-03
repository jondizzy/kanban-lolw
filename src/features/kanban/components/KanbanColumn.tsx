import { Paper, Typography, Button } from "@mui/material";
import { Droppable } from "@hello-pangea/dnd";
import CardPreview from "./CardPreview";
import { columnColors } from "../utils/columnColors";

export default function KanbanColumn({
  column,
  tasks,
  onAddCard,
  onCardClick,
}: any) {
  return (
    <Droppable droppableId={column.id}>
      {(provided) => (
        <Paper
          ref={provided.innerRef}
          {...provided.droppableProps}
          sx={{
            width: 320,
            p: 2,
            borderRadius: 3,
            bgcolor: columnColors[column.id] ?? "background.paper",
            border: "1px solid",
            borderColor: "divider",
            display: "flex",
            flexDirection: "column",
            maxHeight: "calc(100vh-120px)",
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight={600}
            sx={{ mb: 1, textAlign: "center" }}
          >
            {column.title}
          </Typography>

          <Button
            size="small"
            sx={{ mb: 1, textTransform: "none", color: "text.secondary" }}
            onClick={() => onAddCard(column.id)}
          >
            + Add Card
          </Button>

          {column.taskIds.length === 0 && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 2, textAlign: "center" }}
            >
              No cards yet
            </Typography>
          )}

          {column.taskIds.map((taskId: string, index: number) => (
            <CardPreview
              key={taskId}
              task={tasks[taskId]}
              index={index}
              onClick={onCardClick}
            />
          ))}

          {provided.placeholder}
        </Paper>
      )}
    </Droppable>
  );
}
