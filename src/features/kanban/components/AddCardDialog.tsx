import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { useState } from "react";
import { useAppDispatch } from "../../../store/hooks";
import { createTask } from "../../../store/kanbanSlice";

export default function AddCardDialog({ open, columnId, onClose }: any) {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [transactionType, setTransactionType] = useState("");

  const handleAdd = () => {
    if (!title.trim() || !department || !transactionType) return;
    dispatch(createTask({ columnId, title, department, transactionType }));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add Card</DialogTitle>
      <DialogContent>
        <TextField
          label="Department"
          fullWidth
          margin="dense"
          value={department}
          onChange={(e) => setDepartment(e.target.value.toUpperCase())}
        />
        <TextField
          label="Card title"
          fullWidth
          margin="dense"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Transaction Type"
          fullWidth
          margin="dense"
          value={transactionType}
          onChange={(e) => setTransactionType(e.target.value.toUpperCase())}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleAdd}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
