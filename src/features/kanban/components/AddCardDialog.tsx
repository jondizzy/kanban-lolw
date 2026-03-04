import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import type { AddCardProps } from "../../../store/kanbanTypes";

export default function AddCardDialog({
  open,
  columnId: _columnId,
  onClose,
  onCreate,
}: AddCardProps) {
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [transactionType, setTransactionType] = useState("");

  const handleAdd = () => {
    if (!title || !department || !transactionType) return;

    onCreate({
      title,
      department,
      transactionType,
    });

    // reset
    setTitle("");
    setDepartment("");
    setTransactionType("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Add Leads</DialogTitle>
      <DialogContent sx={{ display: "flex" }}>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <Select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            displayEmpty
          >
            <MenuItem value="AG">AG</MenuItem>
            <MenuItem value="FD">FD</MenuItem>
            <MenuItem value="BM">BM</MenuItem>
          </Select>
        </FormControl>
        <TextField disabled fullWidth margin="dense" />
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <Select
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
            displayEmpty
          >
            <MenuItem value="N">N (new)</MenuItem>
            <MenuItem value="R">R (recurring)</MenuItem>
          </Select>
        </FormControl>
        <TextField
          sx={{ minWidth: 400 }}
          label="Leads Name"
          fullWidth
          margin="dense"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
