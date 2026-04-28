import { useState, useEffect } from "react";
import { useAppDispatch } from "../../../store/hooks";
import {
  saveCardData,
  fetchCards,
  createTask,
  deleteTask,
} from "../../../store/kanbanSlice";
import KanbanBoard from "../components/KanbanBoard";
import AddCardDialog from "../components/AddCardDialog";
import CardDetailDialog from "../components/CardDetailDialog";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TableRowsIcon from "@mui/icons-material/TableRows";
import api from "../../../api/axiosApi";
import type {
  AuthSession,
  CardFormState,
  Role,
} from "../../../store/kanbanTypes";
import TableView from "../components/TableView";
import { roleVisibleColumns } from "../utils/roleColumn";
import { normalizeCustomerGroup } from "../utils/customerGroup";
import { normalizeMeetings } from "../utils/meetingNotes";

// Fallback role resolution used before `auth/me` finishes loading.
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

// Persist session hints so reloads can still choose a sensible default role.
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

// Backend role strings are matched loosely because they may include extra text.
const resolveDivisionFromUserRole = (userRole: string): Role => {
  const normalizedRole = userRole.trim().toUpperCase();

  if (normalizedRole === "AG" || normalizedRole.includes("AG")) {
    return "AG";
  }

  if (normalizedRole === "CH" || normalizedRole.includes("CH")) {
    return "CH";
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
  return normalizedRole === "kanban_admin" || normalizedRole === "admin";
};

export default function KanbanPage() {
  const dispatch = useAppDispatch();
  const [userRole, setUserRole] = useState(resolveStoredUserRole());

  const [addOpen, setAddOpen] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState("");
  const [search, setSearch] = useState("");
  const [createdDateStart, setCreatedDateStart] = useState("");
  const [createdDateEnd, setCreatedDateEnd] = useState("");
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const handleDelete = async (taskId: string) => {
    try {
      await dispatch(deleteTask(taskId)).unwrap();
      if (selectedTaskId === taskId) {
        setSelectedTaskId(null);
      }
    } catch (err) {
      console.error("Failed to delete card:", err);
    }
  };

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [form, setForm] = useState<CardFormState>({
    title: "",
    meetings: normalizeMeetings(),
    items: [],
    total: 0,
    value: 0,
  });
  const isKanbanAdmin = isKanbanAdminRole(userRole);
  const defaultDivisionRole = resolveDivisionFromUserRole(userRole);
  const [role, setRole] = useState<Role>(defaultDivisionRole);
  const activeDivision = isKanbanAdmin ? role : defaultDivisionRole;
  const visibleColumnIds = roleVisibleColumns[activeDivision];
  const isTableView = viewMode === "table";

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

  // Initial board load.
  useEffect(() => {
    dispatch(fetchCards());
  }, [dispatch]);

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
        <TextField
          size="small"
          label="From"
          type="date"
          value={createdDateStart}
          onChange={(e) => setCreatedDateStart(e.target.value)}
          slotProps={{
            inputLabel: { shrink: true },
          }}
          sx={{ width: 160 }}
        />
        <TextField
          size="small"
          label="To"
          type="date"
          value={createdDateEnd}
          onChange={(e) => setCreatedDateEnd(e.target.value)}
          slotProps={{
            inputLabel: { shrink: true },
          }}
          sx={{ width: 160 }}
        />
        <Button
          variant="outlined"
          startIcon={isTableView ? <DashboardIcon /> : <TableRowsIcon />}
          onClick={() =>
            setViewMode((current) =>
              current === "kanban" ? "table" : "kanban",
            )
          }
          sx={{ whiteSpace: "nowrap" }}
        >
          {isTableView ? "Kanban View" : "Table View"}
        </Button>

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
              value={activeDivision}
              label="Segment"
              disabled={!isKanbanAdmin}
              onChange={(e) => setRole(e.target.value as Role)}
            >
              <MenuItem value="AG">AG (Agrochemical)</MenuItem>
              <MenuItem value="CH">CH (Paper Chemical)</MenuItem>
              <MenuItem value="FD">FD (Food & Other Chemical)</MenuItem>
              <MenuItem value="BM">BM (Building Material)</MenuItem>
              <MenuItem value="MNG">ADMIN (All)</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {isTableView ? (
        <TableView
          activeDivision={activeDivision}
          createdDateStart={createdDateStart}
          createdDateEnd={createdDateEnd}
          search={search}
          visibleColumnIds={visibleColumnIds}
          onAddCard={(colId) => {
            setActiveColumnId(colId);
            setAddOpen(true);
          }}
          onCardClick={(task) => {
            setSelectedTaskId(task.id);
            // Seed the detail dialog from the normalized Redux task shape.
            setForm({
              title: task.title || "",
              description: task.description || "",
              value: Number(task.value || 0),
              owner: task.owner || "",
              cardCode: task.cardCode || "",
              customerName: task.customerName || "",
              customerPic: task.customerPic || "",
              phoneNumber: task.phoneNumber || "",
              customerGroup: normalizeCustomerGroup(task.customerGroup),
              custPo: task.custPo || "",
              activityEarly: task.activityEarly || "",
              activityMid: task.activityMid || "",
              activityLate: task.activityLate || "",
              meetings: normalizeMeetings(task.meetings, task.activityEarly),
              items: task.items && task.items.length > 0 ? task.items : [],
              total: task.total || 0,
            });
          }}
          onDelete={handleDelete}
        />
      ) : (
        <KanbanBoard
          activeDivision={activeDivision}
          createdDateStart={createdDateStart}
          createdDateEnd={createdDateEnd}
          search={search}
          visibleColumnIds={visibleColumnIds}
          onAddCard={(colId) => {
            setActiveColumnId(colId);
            setAddOpen(true);
          }}
          onCardClick={(task) => {
            setSelectedTaskId(task.id);
            // Seed the detail dialog from the normalized Redux task shape.
            setForm({
              title: task.title || "",
              description: task.description || "",
              value: Number(task.value || 0),
              owner: task.owner || "",
              cardCode: task.cardCode || "",
              customerName: task.customerName || "",
              customerPic: task.customerPic || "",
              phoneNumber: task.phoneNumber || "",
              customerGroup: normalizeCustomerGroup(task.customerGroup),
              custPo: task.custPo || "",
              activityEarly: task.activityEarly || "",
              activityMid: task.activityMid || "",
              activityLate: task.activityLate || "",
              meetings: normalizeMeetings(task.meetings, task.activityEarly),
              items: task.items && task.items.length > 0 ? task.items : [],
              total: task.total || 0,
            });
          }}
          onDelete={handleDelete}
        />
      )}

      <AddCardDialog
        open={addOpen}
        columnId={activeColumnId}
        defaultDepartment={
          activeDivision === "MNG" ? defaultDivisionRole : activeDivision
        }
        allowDepartmentChange={isKanbanAdmin}
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
        key={selectedTaskId ?? "no-selection"}
        open={selectedTaskId !== null}
        form={form}
        setForm={setForm}
        onClose={() => setSelectedTaskId(null)}
        onSave={async () => {
          if (!selectedTaskId) return;
          const total = form.items.reduce(
            (sum, item) => sum + item.subtotal,
            0,
          );
          try {
            await dispatch(
              saveCardData({
                cardId: selectedTaskId,
                taskData: {
                  title: form.title,
                  description: form.description,
                  value: Number(total) || 0,
                  owner: form.owner,
                  cardCode: form.cardCode || "",
                  customerName: form.customerName || "",
                  customerPic: form.customerPic || "",
                  phoneNumber: form.phoneNumber || "",
                  customerGroup: normalizeCustomerGroup(form.customerGroup),
                  custPo: form.custPo || "",
                  items: form.items,
                  total,
                  activityEarly: form.activityEarly || "",
                  activityMid: form.activityMid || "",
                  activityLate: form.activityLate || "",
                  meetings: form.meetings,
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
