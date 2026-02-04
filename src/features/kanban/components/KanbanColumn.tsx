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
    <Droppable droppableId={column.id} direction="vertical">
      {(provided) => (
        <Paper
          ref={provided.innerRef}
          {...provided.droppableProps}
          sx={{
            width: {
              xs: 300,
              sm: 340,
              md: 380,
              lg: 420,
            },
            transition: "background-color 0.2s ease",
            "&:has(.dragging)": {
              bgcolor: "rgba(0,0,0,0.03)",
            },
            minWidth: 360,
            maxWidth: 420,
            p: 2,
            borderRadius: 3,
            bgcolor: columnColors[column.id] ?? "background.paper",
            border: "1px solid",
            borderColor: "divider",
            minHeight: 60,
            display: "flex",
            gap: 1.5,
            flexDirection: "column",
            maxHeight: "calc(100vh - 120px)",
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
          <div
            style={{
              minHeight: 60,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {column.taskIds.length === 0 && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textAlign: "center", py: 2 }}
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
          </div>

          {/* {column.taskIds.length === 0 && (
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

          {provided.placeholder} */}
        </Paper>
      )}
    </Droppable>
  );
}
