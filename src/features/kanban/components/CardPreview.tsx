import { Card, CardContent, Typography } from "@mui/material";
import { Draggable } from "@hello-pangea/dnd";

export default function CardPreview({ task, index, onClick }: any) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick(task)}
          sx={{
            mb: 2,
            borderRadius: 2,
            cursor: "pointer",
            transition: "all 0.2s ease",
            "&:hover": {
              boxShadow: 4,
              transform: "translateY(-2px)",
            },
          }}
        >
          <CardContent sx={{ pb: "12px !important" }}>
            <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
              {task.title}
            </Typography>
            {task.cardCode && (
              <Typography variant="caption" color="text.secondary">
                {task.cardCode}
              </Typography>
            )}
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
}
