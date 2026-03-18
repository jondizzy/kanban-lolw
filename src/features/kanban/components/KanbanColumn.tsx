import { Box, Paper, Typography, Button } from "@mui/material";
import { Droppable } from "@hello-pangea/dnd";
import CardPreview from "./CardPreview";
import { columnColors } from "../utils/columnColors";
import formatRupiah from "../utils/currencyFormatter";

export default function KanbanColumn({
  column,
  tasks,
  onAddCard,
  onCardClick,
  onDelete,
}: any) {
  const revenue = column.taskIds.reduce((sum: number, taskId: string) => {
    const task = tasks[taskId];
    return sum + (Number(task?.value) || 0);
  }, 0);

  // return (
  //   <Droppable droppableId={column.id} direction="vertical">
  //     {(provided) => (
  //       <Paper
  //         ref={provided.innerRef}
  //         {...provided.droppableProps}
  //         sx={{
  //           width: {
  //             xs: 300,
  //             sm: 340,
  //             md: 380,
  //             lg: 420,
  //           },
  //           transition: "background-color 0.2s ease",
  //           "&:has(.dragging)": {
  //             bgcolor: "rgba(0,0,0,0.03)",
  //           },
  //           minWidth: 360,
  //           maxWidth: 420,
  //           p: 2,
  //           // borderRadius: 3,
  //           bgcolor: columnColors[column.id] ?? "background.paper",
  //           border: "1px solid",
  //           borderColor: "divider",
  //           minHeight: 60,
  //           display: "flex",
  //           gap: 1.5,
  //           flexDirection: "column",
  //           maxHeight: "calc(100vh - 120px)",
  //         }}
  //       >
  //         <Typography
  //           variant="subtitle1"
  //           fontWeight={600}
  //           sx={{ mb: 1, textAlign: "center" }}
  //         >
  //           {column.title}
  //         </Typography>
  //         <Typography
  //           variant="subtitle2"
  //           fontWeight={400}
  //           sx={{ textAlign: "center" }}
  //         >
  //           Revenue accumulated:
  //         </Typography>
  //         <Typography
  //           variant="subtitle2"
  //           fontWeight={400}
  //           sx={{ mt: -1, mb: 1, textAlign: "center" }}
  //         >
  //           {formatRupiah(revenue)}
  //         </Typography>

  //         <Button
  //           size="small"
  //           sx={{ mb: 1, textTransform: "none", color: "text.secondary" }}
  //           onClick={() => onAddCard(column.id)}
  //         >
  //           + Add Card
  //         </Button>
  //         <div
  //           style={{
  //             minHeight: 60,
  //             display: "flex",
  //             flexDirection: "column",
  //             gap: 12,
  //           }}
  //         >
  //           {column.taskIds.length === 0 && (
  //             <Typography
  //               variant="caption"
  //               color="text.secondary"
  //               sx={{ textAlign: "center", py: 2 }}
  //             >
  //               No cards yet
  //             </Typography>
  //           )}

  //           {column.taskIds.map((taskId: string, index: number) => (
  //             <CardPreview
  //               key={taskId}
  //               task={tasks[taskId]}
  //               index={index}
  //               onClick={onCardClick}
  //             />
  //           ))}

  //           {provided.placeholder}
  //         </div>
  //       </Paper>
  //     )}
  //   </Droppable>
  // );
  return (
    <div style={{ width: 420, minWidth: 360, marginRight: 10 }}>
      {/* HEADER OUTSIDE PAPER */}
      <Box
        sx={{
          height: 80, // reserve space
          display: "flex",
          flexDirection: "column",
          alignItems: "justify-start",
          justifyContent: "center",
          mb: -2,
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight={600}
          sx={{
            mb: 0.5,
            textAlign: "justify-left",
            color: columnColors[column.id] ?? "background.paper",
          }}
        >
          {column.title}
        </Typography>

        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "justify-left",
            color: "text.secondary",
            mt: -0.5,
          }}
        >
          Revenue accumulated
        </Typography>
      </Box>
      <Box
        sx={{
          height: 10, // reserve space
          display: "flex",
          flexDirection: "column",
          alignItems: "justify-start",
          justifyContent: "center",
          mb: -2,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ textAlign: "justify-left", fontWeight: 600 }}
        >
          {formatRupiah(revenue)}
        </Typography>
      </Box>

      <Droppable droppableId={column.id} direction="vertical">
        {(provided) => (
          <Paper
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              mt: 5,
              width: "100%",
              transition: "background-color 0.2s ease",
              "&:has(.dragging)": {
                bgcolor: "rgba(0,0,0,0.03)",
              },
              p: 2,
              // bgcolor: columnColors[column.id] ?? "background.paper",
              bgcolor: "#f1f1f1",
              border: "1px solid",
              borderColor: "divider",
              minHeight: 60,
              display: "flex",
              gap: 1.5,
              flexDirection: "column",
              maxHeight: "calc(100vh - 160px)",
            }}
          >
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
                  onDelete={onDelete}
                />
              ))}

              {provided.placeholder}
            </div>
          </Paper>
        )}
      </Droppable>
    </div>
  );
}
