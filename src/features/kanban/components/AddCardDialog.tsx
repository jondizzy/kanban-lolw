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
import { useEffect, useState } from "react";
import type { AddCardProps } from "../../../store/kanbanTypes";
import api from "../../../api/axiosApi";

export default function AddCardDialog({
  open,
  defaultDepartment,
  allowDepartmentChange = true,
  onClose,
  onCreate,
}: AddCardProps) {
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState(defaultDepartment);
  const [transactionType, setTransactionType] = useState("");
  const [nextNumber, setNextNumber] = useState<string>("");
  const [loadingNumber, setLoadingNumber] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadNextNumber = async () => {
      if (!open || !department || !transactionType) {
        setNextNumber("");
        return;
      }

      // Preview the next running number for the selected card pattern.
      setLoadingNumber(true);
      try {
        const res = await api.get("cards/next-number", {
          params: { department, transactionType },
        });
        if (!cancelled) {
          setNextNumber(String(res.data?.nextNumber ?? ""));
        }
      } catch (err) {
        if (!cancelled) {
          setNextNumber("");
          console.error("Failed to load next running number:", err);
        }
      } finally {
        if (!cancelled) {
          setLoadingNumber(false);
        }
      }
    };

    loadNextNumber();
    return () => {
      cancelled = true;
    };
  }, [open, department, transactionType]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setDepartment(defaultDepartment);
  }, [defaultDepartment, open]);

  const handleAdd = () => {
    if (!title || !department || !transactionType) return;

    onCreate({
      title,
      department,
      transactionType,
    });

    // Reset local dialog state after handing the payload to the page.
    setTitle("");
    setDepartment(defaultDepartment);
    setTransactionType("");
    setNextNumber("");
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
            disabled={!allowDepartmentChange}
          >
            <MenuItem value="AG">AG</MenuItem>
            <MenuItem value="CH">CH</MenuItem>
            <MenuItem value="FD">FD</MenuItem>
            <MenuItem value="BM">BM</MenuItem>
          </Select>
        </FormControl>
        <TextField
          disabled
          fullWidth
          margin="dense"
          label="Card Number"
          value={
            loadingNumber
              ? "Loading..."
              : nextNumber.toString().padStart(5, "0")
          }
        />
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
