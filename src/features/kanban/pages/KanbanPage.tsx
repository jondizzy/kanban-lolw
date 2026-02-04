import { useState, useEffect } from "react";
import { useAppDispatch } from "../../../store/hooks";
import { updateTask } from "../../../store/kanbanSlice";
import KanbanBoard from "../components/KanbanBoard";
import AddCardDialog from "../components/AddCardDialog";
import CardDetailDialog from "../components/CardDetailDialog";
import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import type { LineItem, CardFormState } from "../../../store/kanbanTypes";

// type CardFormState = {
//   title: string;
//   description?: string;
//   cardCode?: string;

//   customerName?: string;
//   value?: number;
//   owner?: string;

//   items: LineItem[];
//   total?: number;
// };

export default function KanbanPage() {
  const dispatch = useAppDispatch();

  const [addOpen, setAddOpen] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState("");

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [form, setForm] = useState<CardFormState>({
    title: "",
    items: [],
    total: 0,
  });
  //roles
  type Role = "AG" | "FD" | "BM" | "MNG";
  const [role, setRole] = useState<Role>("MNG");
  const ROLE_COLUMN_ACCESS: Record<Role, string[]> = {
    AG: ["new_leads", "ag_qualify", "ag_interest", "ag_hot", "won", "lost"],
    FD: ["new_leads", "fd_food", "fd_long", "won", "lost"],
    BM: ["new_leads", "bm_bid", "won", "lost"],
    MNG: [
      "new_leads",
      "ag_qualify",
      "ag_interest",
      "ag_hot",
      "fd_food",
      "fd_long",
      "bm_bid",
      "won",
      "lost",
    ],
  };
  const visibleColumnIds = ROLE_COLUMN_ACCESS[role];
  //auto count total feature
  useEffect(() => {
    const total = form.items.reduce((sum, row) => sum + row.subtotal, 0);

    if (form.total !== total) {
      setForm((prev) => ({
        ...prev,
        total,
      }));
    }
  }, [form.items]);

  // const [form, setForm] = useState({
  //   title: "",
  //   description: "",
  //   value: "",
  //   owner: "",
  // });

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          px: 3,
          py: 1.5,
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="role-select-label">Division</InputLabel>
          <Select
            labelId="role-select-label"
            value={role}
            label="Division"
            onChange={(e) => setRole(e.target.value as Role)}
          >
            <MenuItem value="AG">AG</MenuItem>
            <MenuItem value="FD">FD</MenuItem>
            <MenuItem value="BM">BM</MenuItem>
            <MenuItem value="MNG">MNG</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <KanbanBoard
        visibleColumnIds={visibleColumnIds}
        onAddCard={(colId) => {
          setActiveColumnId(colId);
          setAddOpen(true);
        }}
        onCardClick={(task) => {
          setSelectedTaskId(task.id);
          setForm({
            title: task.title || "",
            description: task.description || "",
            value: task.value?.toString() || "",
            owner: task.owner || "",
            cardCode: task.cardCode || "",
            customerName: task.customerName || "",
            items: task.items && task.items.length > 0 ? task.items : [],
            total: task.total || 0,
          });
        }}
      />

      <AddCardDialog
        open={addOpen}
        columnId={activeColumnId}
        onClose={() => setAddOpen(false)}
      />

      <CardDetailDialog
        open={selectedTaskId !== null}
        form={form}
        setForm={setForm}
        onClose={() => setSelectedTaskId(null)}
        onSave={() => {
          if (!selectedTaskId) return;
          dispatch(
            updateTask({
              id: selectedTaskId,
              changes: {
                title: form.title,
                description: form.description,
                value: Number(form.value) || undefined,
                owner: form.owner,
                cardCode: form.cardCode || "",
                customerName: form.customerName || "",
                items: form.items && form.items.length > 0 ? form.items : [],
                total: form.total || 0,
              },
            }),
          );
          setSelectedTaskId(null);
        }}
      />
    </>
  );
}
