import { Box, Card, CardContent, Typography } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import IconButton from "@mui/material/IconButton";
import { Draggable } from "@hello-pangea/dnd";
import formatRupiah from "../utils/currencyFormatter";

export default function CardPreview({ task, index, onClick, onDelete }: any) {
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                {task.cardCode} — {task.title}
              </Typography>
              <IconButton
                size="small"
                sx={{
                  color: "error",
                  opacity: 0.7,
                  "&:hover": { opacity: 1 },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm("Delete this card?")) {
                    onDelete(task.id);
                  }
                }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                {formatRupiah(Number(task.value))}
              </Typography>

              <Typography variant="caption" color="text.secondary">
                {task.owner}
              </Typography>
            </Box>
            <Box sx={{ m: 1 }}></Box>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
}
