import { useMemo, useState } from "react";
import {
  Box,
  Chip,
  Collapse,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useAppSelector } from "../../../store/hooks";
import type { KanbanProps, LineItem, Task } from "../../../store/kanbanTypes";
import formatRupiah from "../utils/currencyFormatter";
import { matchesCreatedDateRange } from "../utils/createdDateFilter";

const createdAtFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const formatDate = (value?: string) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return createdAtFormatter.format(date);
};

const getRequiredCapitalTotal = (items: LineItem[]) =>
  items.reduce((sum, item) => sum + Number(item.requiredCapital ?? 0), 0);

const matchesSearch = (task: Task, normalizedSearch: string) => {
  if (!normalizedSearch) {
    return true;
  }

  return (
    task.id?.toLowerCase().includes(normalizedSearch) ||
    task.title?.toLowerCase().includes(normalizedSearch) ||
    task.cardCode?.toLowerCase().includes(normalizedSearch) ||
    task.customerName?.toLowerCase().includes(normalizedSearch) ||
    task.customerPic?.toLowerCase().includes(normalizedSearch) ||
    task.phoneNumber?.toLowerCase().includes(normalizedSearch) ||
    task.customerGroup?.toLowerCase().includes(normalizedSearch) ||
    task.custPo?.toLowerCase().includes(normalizedSearch) ||
    task.description?.toLowerCase().includes(normalizedSearch) ||
    task.owner?.toLowerCase().includes(normalizedSearch) ||
    String(getRequiredCapitalTotal(task.items ?? []))
      .toLowerCase()
      .includes(normalizedSearch) ||
    String(task.value ?? "")
      .toLowerCase()
      .includes(normalizedSearch) ||
    String(task.total ?? "")
      .toLowerCase()
      .includes(normalizedSearch) ||
    task.activityEarly?.toLowerCase().includes(normalizedSearch) ||
    task.activityMid?.toLowerCase().includes(normalizedSearch) ||
    task.activityLate?.toLowerCase().includes(normalizedSearch) ||
    task.items?.some((item) =>
      item.item.toLowerCase().includes(normalizedSearch),
    ) ||
    task.meetings?.some(
      (meeting) =>
        meeting.title.toLowerCase().includes(normalizedSearch) ||
        meeting.location.toLowerCase().includes(normalizedSearch) ||
        meeting.notes.toLowerCase().includes(normalizedSearch),
    ) ||
    task.files?.some((file) =>
      file.name.toLowerCase().includes(normalizedSearch),
    )
  );
};

const renderItemPreview = (items: LineItem[]) => {
  if (items.length === 0) {
    return "-";
  }

  if (items.length === 1) {
    return items[0].item || "Unnamed item";
  }

  return `${items[0].item || "Unnamed item"} +${items.length - 1} more`;
};

export default function TableView({
  activeDivision,
  createdDateStart,
  createdDateEnd,
  visibleColumnIds,
  onCardClick,
  onDelete,
  search,
}: KanbanProps) {
  const { tasks, columns, columnOrder } = useAppSelector(
    (state) => state.kanban,
  );
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const normalizedSearch = search.toLowerCase();

  const rows = useMemo(() => {
    return columnOrder
      .filter((columnId) => visibleColumnIds.includes(columnId))
      .flatMap((columnId) => {
        const column = columns[columnId];

        return column.taskIds
          .map((taskId) => tasks[taskId])
          .filter((task): task is Task => Boolean(task))
          .filter((task) => {
            const matchesDivision =
              activeDivision === "MNG" ||
              task.departmentCode === activeDivision;

            if (!matchesDivision) {
              return false;
            }

            if (
              !matchesCreatedDateRange(task, createdDateStart, createdDateEnd)
            ) {
              return false;
            }

            return matchesSearch(task, normalizedSearch);
          })
          .map((task) => ({
            ...task,
            columnTitle: column.title,
          }));
      });
  }, [
    activeDivision,
    createdDateEnd,
    columnOrder,
    columns,
    createdDateStart,
    normalizedSearch,
    tasks,
    visibleColumnIds,
  ]);

  const toggleItems = (taskId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        mx: 3,
        my: 2,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        maxHeight: "calc(100vh - 132px)",
      }}
    >
      <Table stickyHeader size="small" sx={{ minWidth: 2600 }}>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Card Code</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Division</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>PIC</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Group</TableCell>
            <TableCell>Owner</TableCell>
            <TableCell align="right">Value</TableCell>
            <TableCell align="right">Required Capital</TableCell>
            <TableCell align="right">Total</TableCell>
            <TableCell>Customer PO</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Activity Early</TableCell>
            <TableCell>Activity Mid</TableCell>
            <TableCell>Activity Late</TableCell>
            <TableCell>Meetings</TableCell>
            <TableCell>Files</TableCell>
            <TableCell sx={{ minWidth: 360 }}>Items</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((task) => {
            const isExpanded = Boolean(expandedRows[task.id]);
            const items = task.items ?? [];
            const files = task.files ?? [];
            const meetings = task.meetings ?? [];

            return (
              <TableRow
                hover
                key={task.id}
                onClick={() => onCardClick(task)}
                sx={{
                  cursor: "pointer",
                  "& td": {
                    verticalAlign: "top",
                  },
                }}
              >
                <TableCell>{task.id || "-"}</TableCell>
                <TableCell>
                  <Chip
                    label={task.columnTitle}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell>{formatDate(task.createdAt)}</TableCell>
                <TableCell>{task.cardCode || "-"}</TableCell>
                <TableCell>{task.title || "-"}</TableCell>
                <TableCell>{task.departmentCode || "-"}</TableCell>
                <TableCell>{task.customerName || "-"}</TableCell>
                <TableCell>{task.customerPic || "-"}</TableCell>
                <TableCell>{task.phoneNumber || "-"}</TableCell>
                <TableCell>{task.customerGroup || "-"}</TableCell>
                <TableCell>{task.owner || "-"}</TableCell>
                <TableCell align="right">
                  {formatRupiah(Number(task.value || 0))}
                </TableCell>
                <TableCell align="right">
                  {formatRupiah(getRequiredCapitalTotal(items))}
                </TableCell>
                <TableCell align="right">
                  {formatRupiah(Number(task.total || 0))}
                </TableCell>
                <TableCell>{task.custPo || "-"}</TableCell>
                <TableCell sx={{ minWidth: 220 }}>
                  <Typography variant="body2" color="text.secondary">
                    {task.description || "-"}
                  </Typography>
                </TableCell>
                <TableCell>{task.activityEarly || "-"}</TableCell>
                <TableCell>{task.activityMid || "-"}</TableCell>
                <TableCell>{task.activityLate || "-"}</TableCell>
                <TableCell sx={{ minWidth: 220 }}>
                  {meetings.length === 0 ? (
                    "-"
                  ) : (
                    <Stack spacing={0.75}>
                      {meetings.map((meeting, index) => (
                        <Box key={`${task.id}-meeting-${index}`}>
                          <Typography variant="body2" fontWeight={600}>
                            {meeting.title || "Meeting"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {[meeting.location, formatDate(meeting.startedAt)]
                              .filter(Boolean)
                              .join(" • ") || "-"}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </TableCell>
                <TableCell sx={{ minWidth: 180 }}>
                  {files.length === 0 ? (
                    "-"
                  ) : (
                    <Stack spacing={0.75}>
                      {files.map((file) => (
                        <Typography
                          key={file.id}
                          component="a"
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="body2"
                          sx={{
                            color: "primary.main",
                            textDecoration: "none",
                            "&:hover": { textDecoration: "underline" },
                          }}
                          onClick={(event) => event.stopPropagation()}
                        >
                          {file.name}
                        </Typography>
                      ))}
                    </Stack>
                  )}
                </TableCell>
                <TableCell sx={{ minWidth: 360 }}>
                  {items.length === 0 ? (
                    "-"
                  ) : (
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 1,
                        }}
                      >
                        <Typography variant="body2">
                          {renderItemPreview(items)}
                        </Typography>
                        {items.length > 1 && (
                          <Tooltip
                            title={
                              isExpanded
                                ? "Hide item details"
                                : "Show all items"
                            }
                          >
                            <IconButton
                              size="small"
                              onClick={(event) => {
                                event.stopPropagation();
                                toggleItems(task.id);
                              }}
                            >
                              {isExpanded ? (
                                <ExpandLessIcon />
                              ) : (
                                <ExpandMoreIcon />
                              )}
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                      <Collapse
                        in={isExpanded || items.length === 1}
                        timeout="auto"
                      >
                        <Stack spacing={1} sx={{ mt: 1 }}>
                          {items.map((item, index) => (
                            <Box
                              key={`${task.id}-item-${index}`}
                              sx={{
                                p: 1,
                                borderRadius: 2,
                                bgcolor: "grey.50",
                                border: "1px solid",
                                borderColor: "divider",
                              }}
                            >
                              <Typography variant="body2" fontWeight={600}>
                                {item.item || "Unnamed item"}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {`${item.quantity || 0} ${item.uom || ""}`.trim() ||
                                  "-"}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                display="block"
                              >
                                {`Price: ${formatRupiah(Number(item.pricePerUom || 0))}`}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                display="block"
                              >
                                {`Subtotal: ${formatRupiah(Number(item.subtotal || 0))}`}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                display="block"
                              >
                                {`Margin: ${Number(item.margin || 0)}%`}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                display="block"
                              >
                                {`Required Capital: ${formatRupiah(Number(item.requiredCapital || 0))}`}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>
                      </Collapse>
                    </Box>
                  )}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Delete card">
                    <IconButton
                      color="error"
                      onClick={(event) => {
                        event.stopPropagation();
                        if (confirm("Delete this card?")) {
                          onDelete(task.id);
                        }
                      }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            );
          })}
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={23} align="center" sx={{ py: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  No cards match the current filters.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
