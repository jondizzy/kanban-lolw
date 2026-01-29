import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import type { RootState } from "../store/store";
import { moveTask, addTask } from "../store/kanbanSlice";

export default function Kanban() {
  const dispatch = useDispatch();
  const { tasks, columns, columnOrder } = useSelector(
    (state: RootState) => state.kanban,
  ); //end useSelector

  const [open, setOpen] = useState(false);
  const [columnId, setColumnId] = useState("");
  const [title, setTitle] = useState("");

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
      }), //end moveTask
    ); //end dispatch
  }; //end onDragEnd

  const openDialog = (colId: string) => {
    setColumnId(colId);
    setTitle("");
    setOpen(true);
  };

  const handleAdd = () => {
    if (!title.trim()) return;
    dispatch(addTask({ columnId, title }));
    setOpen(false);
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            padding: 2,
            //   height: "100vh",
          }}
        >
          {columnOrder.map((columnId) => {
            const column = columns[columnId];
            return (
              <Droppable droppableId={column.id} key={column.id}>
                {(provided) => (
                  <Paper
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      width: 320,
                      padding: 2,
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    <Button
                      fullWidth
                      size="small"
                      sx={{ marginTop: 1 }}
                      onClick={() => openDialog(column.id)}
                    >
                      + Add Card
                    </Button>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ textAlign: "center" }}
                    >
                      {column.title}
                    </Typography>

                    {column.taskIds.map((taskId, index) => {
                      const task = tasks[taskId];
                      return (
                        <Draggable
                          draggableId={task.id}
                          index={index}
                          key={task.id}
                        >
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{ marginBottom: 2 }}
                            >
                              <CardContent>
                                <Typography>{task.title}</Typography>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </Paper>
                )}
              </Droppable>
            );
          })}
        </Box>
      </DragDropContext>

      {/* Add Card Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Add Card</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Card title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  ); //end return
} //end export Kanban
