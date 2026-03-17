import { useState, useEffect } from "react";
import { useAppDispatch } from "../../../store/hooks";
import {
  saveCardData,
  fetchCards,
  createTask,
} from "../../../store/kanbanSlice";
import KanbanBoard from "../components/KanbanBoard";
import AddCardDialog from "../components/AddCardDialog";
import CardDetailDialog from "../components/CardDetailDialog";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import api from "../../../api/axiosApi";
import type {
  AuthSession,
  CardFormState,
  Role,
} from "../../../store/kanbanTypes";
import { roleVisibleColumns } from "../utils/roleColumn";

const resolveStoredUserRole = () => {
  if (typeof window === "undefined") {
    return "";
  }

  return (
    localStorage.getItem("userRole") ??
    localStorage.getItem("role") ??
    sessionStorage.getItem("userRole") ??
    sessionStorage.getItem("role") ??
    ""
  );
};

const persistUserSession = (session: AuthSession) => {
  if (typeof window === "undefined") {
    return;
  }

  const role =
    session.role?.trim() ??
    session.userRole?.trim() ??
    session.Role?.trim() ??
    "";
  const username =
    session.username?.trim() ??
    session.userName?.trim() ??
    session.Username?.trim() ??
    "";

  if (role) {
    localStorage.setItem("role", role);
    localStorage.setItem("userRole", role);
    sessionStorage.setItem("role", role);
    sessionStorage.setItem("userRole", role);
  }

  if (username) {
    localStorage.setItem("username", username);
    sessionStorage.setItem("username", username);
  }
};

const resolveDivisionFromUserRole = (userRole: string): Role => {
  const normalizedRole = userRole.trim().toUpperCase();

  if (normalizedRole === "AG" || normalizedRole.includes("AG")) {
    return "AG";
  }

  if (normalizedRole === "FD" || normalizedRole.includes("FD")) {
    return "FD";
  }

  if (normalizedRole === "BM" || normalizedRole.includes("BM")) {
    return "BM";
  }

  return "MNG";
};

const isKanbanAdminRole = (userRole: string) => {
  const normalizedRole = userRole
    .trim()
    .replace(/^["']+|["']+$/g, "")
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
  return normalizedRole === "kanban_admin";
};

export default function KanbanPage() {
  const dispatch = useAppDispatch();
  const [userRole, setUserRole] = useState(resolveStoredUserRole());

  const [addOpen, setAddOpen] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState("");
  const [search, setSearch] = useState("");

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [form, setForm] = useState<CardFormState>({
    title: "",
    items: [],
    total: 0,
    value: 0,
  });
  const isKanbanAdmin = isKanbanAdminRole(userRole);
  const defaultDivisionRole = resolveDivisionFromUserRole(userRole);
  const [role, setRole] = useState<Role>(defaultDivisionRole);
  const visibleColumnIds = roleVisibleColumns[role];

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      try {
        const res = await api.get<AuthSession>("auth/me");
        const nextRole =
          res.data?.role?.trim() ??
          res.data?.userRole?.trim() ??
          res.data?.Role?.trim() ??
          "";

        if (!isMounted || !nextRole) {
          return;
        }

        persistUserSession(res.data);
        setUserRole(nextRole);
      } catch (err) {
        console.error("Failed to load auth session:", err);
      }
    };

    void loadSession();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isKanbanAdmin && role !== defaultDivisionRole) {
      setRole(defaultDivisionRole);
    }
  }, [defaultDivisionRole, isKanbanAdmin, role]);

  //auto count total feature
  useEffect(() => {
    const nextTotal = form.items.reduce((sum, row) => sum + row.subtotal, 0);

    if (form.total !== nextTotal) {
      setForm((prev) => ({
        ...prev,
        total: nextTotal,
        value: prev.value || nextTotal,
      }));
    }
  }, [form.items]);

  // Fetch cards from API on mount
  useEffect(() => {
    dispatch(fetchCards());
  }, [dispatch]);

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
          alignItems: "center",
          gap: 2,
          px: 3,
          py: 1.5,
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <TextField
          size="small"
          placeholder="Search cards…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 260 }}
        />

        {/* keep your role selector on the right */}
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
            marginLeft: "auto",
          }}
        >
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="role-select-label">Division</InputLabel>
            <Select
              labelId="role-select-label"
              value={role}
              label="Division"
              disabled={!isKanbanAdmin}
              onChange={(e) => setRole(e.target.value as Role)}
            >
              <MenuItem value="AG">AG</MenuItem>
              <MenuItem value="FD">FD</MenuItem>
              <MenuItem value="BM">BM</MenuItem>
              <MenuItem value="MNG">MNG</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <KanbanBoard
        search={search}
        // visibleColumnIds={visibleColumnIds}
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
            value: Number(task.value || 0),
            owner: task.owner || "",
            cardCode: task.cardCode || "",
            customerName: task.customerName || "",
            customerGroup: task.customerGroup || "",
            activityEarly: task.activityEarly || "",
            activityMid: task.activityMid || "",
            activityLate: task.activityLate || "",
            items: task.items && task.items.length > 0 ? task.items : [],
            total: task.total || 0,
          });
        }}
      />

      <AddCardDialog
        open={addOpen}
        columnId={activeColumnId}
        onClose={() => setAddOpen(false)}
        onCreate={(payload) => {
          dispatch(
            createTask({
              columnId: activeColumnId,
              title: payload.title,
              department: payload.department,
              transactionType: payload.transactionType,
            }),
          );
          setAddOpen(false);
        }}
      />
      <CardDetailDialog
        open={selectedTaskId !== null}
        form={form}
        setForm={setForm}
        onClose={() => setSelectedTaskId(null)}
        onSave={async () => {
          if (!selectedTaskId) return;
          try {
            await dispatch(
              saveCardData({
                cardId: selectedTaskId,
                taskData: {
                  title: form.title,
                  description: form.description,
                  value: Number(form.total) || 0,
                  owner: form.owner,
                  cardCode: form.cardCode || "",
                  customerName: form.customerName || "",
                  customerGroup: form.customerGroup || "",
                  items: form.items,
                  total: form.total || 0,
                  activityEarly: form.activityEarly || "",
                  activityMid: form.activityMid || "",
                  activityLate: form.activityLate || "",
                },
              }),
            ).unwrap();
            setSelectedTaskId(null);
          } catch (err) {
            console.error("Failed to save card:", err);
          }
        }}
      />
    </>
  );
}
