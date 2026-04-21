import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Divider,
  Typography,
  Tooltip,
  IconButton,
  Select,
  MenuItem,
  Tabs,
  Tab,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Addicon from "@mui/icons-material/Add";
import InputAdornment from "@mui/material/InputAdornment";
import type {
  CardFormState,
  CardFormRedux,
  MeetingNote,
} from "../../../store/kanbanTypes";
import formatRupiah from "../utils/currencyFormatter";
import { normalizeCustomerGroup } from "../utils/customerGroup";
// import { current } from "@reduxjs/toolkit";
import {
  buildActivityEarlySummary,
  createMeetingNote,
  normalizeMeetings,
} from "../utils/meetingNotes";

// const DEFAULT_MEETING_TITLE = "Meeting 1";
// const createMeetingNote = (overrides?: Partial<MeetingNote>): MeetingNote => ({
//   title: DEFAULT_MEETING_TITLE,
//   location: "",
//   startedAt: "",
//   notes: "",
//   ...overrides,
// });

// const parseMeetingNotes = (value?: string): MeetingNote[] => {
//   if (!value?.trim()) {
//     return [createMeetingNote()];
//   }

//   try {
//     const parsed = JSON.parse(value) as {
//       meetings?: Array<Partial<MeetingNote>>;
//     };

//     if (Array.isArray(parsed.meetings) && parsed.meetings.length > 0) {
//       return parsed.meetings.map((meeting, index) =>
//         createMeetingNote({
//           title: meeting.title?.trim() || `Meeting ${index + 1}`,
//           location: meeting.location ?? "",
//           startedAt: meeting.startedAt ?? "",
//           notes: meeting.notes ?? "",
//         }),
//       );
//     }
//   } catch {}
//   return [createMeetingNote({ notes: value })];
// };

// const serializeMeetingNotes = (meetings: MeetingNote[]) =>
//   JSON.stringify({ meetings });
// Avoid NaN when a numeric field is temporarily cleared during editing.
const parseNumericInput = (value: string) => {
  if (value.trim() === "") {
    return 0;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export default function CardDetailDialog({
  open,
  form,
  setForm,
  onClose,
  onSave,
}: CardFormRedux) {
  const [ownerError, setOwnerError] = useState(false);
  // const [meetingTabs, setMeetingTabs] = useState<MeetingNote[]>(() =>
  //   parseMeetingNotes(form.activityEarly),
  // );
  const [activeMeetingTab, setActiveMeetingTab] = useState(0);

  useEffect(() => {
    if (!open) {
      setOwnerError(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }
    // const nextMeetingTabs = parseMeetingNotes(form.activityEarly);
    // setMeetingTabs(nextMeetingTabs);
    // setActiveMeetingTab(0);
    const nextMeetingTabs = normalizeMeetings(
      form.meetings,
      form.activityEarly,
    );
    setForm((prev) => ({
      ...prev,
      meetings: nextMeetingTabs,
      activityEarly: buildActivityEarlySummary(nextMeetingTabs),
    }));
    setActiveMeetingTab(0);
  }, [open, form.cardCode, setForm]);

  const handleSave = () => {
    if (!form.owner?.trim()) {
      setOwnerError(true);
      window.alert("Sales Responsible is required before saving.");
      return;
    }

    setOwnerError(false);
    onSave();
  };

  const syncMeetingsToForm = (nextMeetingTabs: MeetingNote[]) => {
    setForm({
      ...form,
      meetings: nextMeetingTabs,
      activityEarly: buildActivityEarlySummary(nextMeetingTabs),
    });
  };

  const handleMeetingChange = (
    index: number,
    field: keyof MeetingNote,
    value: string,
  ) => {
    // const nextMeetingTabs = meetingTabs.map((meeting, meetingIndex) =>
    //   meetingIndex === index ? { ...meeting, [field]: value } : meeting,
    // );
    // syncMeetingsToForm(nextMeetingTabs);
    const nextMeetingTabs = form.meetings.map((meeting, meetingIndex) =>
      meetingIndex === index ? { ...meeting, [field]: value } : meeting,
    );
    syncMeetingsToForm(nextMeetingTabs);
  };

  const handleAddMeetingTab = () => {
    const nextMeetingTabs = [
      ...form.meetings,
      createMeetingNote({
        title: `Meeting ${form.meetings.length + 1}`,
      }),
    ];
    syncMeetingsToForm(nextMeetingTabs);
    setActiveMeetingTab(nextMeetingTabs.length - 1);
  };

  const handleRemoveMeetingTab = (index: number) => {
    const nextMeetingTabs = form.meetings.filter(
      (_, meetingIndex) => meetingIndex !== index,
    );
    const normalizedMeetingTabs =
      nextMeetingTabs.length > 0 ? nextMeetingTabs : [createMeetingNote()];
    syncMeetingsToForm(normalizedMeetingTabs);
    setActiveMeetingTab((currentTab) =>
      Math.min(currentTab, normalizedMeetingTabs.length - 1),
    );
  };

  const meetingTabs = normalizeMeetings(form.meetings, form.activityEarly);
  const currentMeeting = meetingTabs[activeMeetingTab] ?? createMeetingNote();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "2",
          pb: "2",
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 2, width: "49%" }}
        >
          <Typography fontWeight={600}>{form.cardCode}</Typography>
          <TextField
            fullWidth
            variant="standard"
            value={form.title || ""}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <EditOutlinedIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        {/* Upper Left */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid size={6}>
            <Grid container spacing={2}>
              <Grid size={12}>
                <TextField
                  label="Description"
                  fullWidth
                  value={form.description || ""}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </Grid>
              <Grid size={10}>
                <TextField
                  label="Customer"
                  fullWidth
                  value={form.customerName || ""}
                  onChange={(e) =>
                    setForm({ ...form, customerName: e.target.value })
                  }
                />
              </Grid>
              <Grid size={2}>
                <Select
                  fullWidth
                  value={normalizeCustomerGroup(form.customerGroup)}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      customerGroup: normalizeCustomerGroup(
                        String(e.target.value),
                      ),
                    })
                  }
                  displayEmpty
                >
                  <MenuItem value="">-</MenuItem>
                  <MenuItem value="internal">INT</MenuItem>
                  <MenuItem value="eksternal">EXT</MenuItem>
                </Select>
              </Grid>
              <Grid size={6}>
                <TextField
                  label="Customer PIC"
                  fullWidth
                  value={form.customerPic || ""}
                  onChange={(e) =>
                    setForm({ ...form, customerPic: e.target.value })
                  }
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  label="Phone Number"
                  fullWidth
                  value={form.phoneNumber || ""}
                  onChange={(e) =>
                    setForm({ ...form, phoneNumber: e.target.value })
                  }
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  label="Deal Value (IDR)"
                  disabled
                  fullWidth
                  value={formatRupiah(Number(form.total))}
                  slotProps={{
                    htmlInput: {
                      step: "0.01",
                    },
                  }}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^\d]/g, "");
                    setForm({ ...form, value: Number(raw) });
                  }}
                />
              </Grid>

              <Grid size={6}>
                <TextField
                  label="Sales Responsible"
                  required
                  fullWidth
                  value={form.owner || ""}
                  error={ownerError}
                  helperText={
                    ownerError ? "Sales Responsible is required." : " "
                  }
                  onChange={(e) => {
                    const nextOwner = e.target.value;
                    setForm({ ...form, owner: nextOwner });

                    if (ownerError && nextOwner.trim()) {
                      setOwnerError(false);
                    }
                  }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />
            {/* Bottom Left */}
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Additional Information
            </Typography>
            <Accordion sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body2">Activities</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Tabs
                    value={activeMeetingTab}
                    onChange={(_, nextValue) => setActiveMeetingTab(nextValue)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ minHeight: 40 }}
                  >
                    {meetingTabs.map((meeting, index) => (
                      <Tab
                        key={`${meeting.title}-${index}`}
                        label={meeting.title.trim() || `Meeting ${index + 1}`}
                        sx={{ minHeight: 40 }}
                      />
                    ))}
                  </Tabs>
                  <Button
                    size="small"
                    startIcon={<Addicon />}
                    onClick={handleAddMeetingTab}
                  >
                    Add New
                  </Button>
                </Box>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid size={8}>
                    <TextField
                      label="Activity Title"
                      fullWidth
                      variant="standard"
                      value={currentMeeting.title}
                      onChange={(e) =>
                        handleMeetingChange(
                          activeMeetingTab,
                          "title",
                          e.target.value,
                        )
                      }
                    />
                  </Grid>
                  <Grid
                    size={4}
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      color="error"
                      onClick={() => handleRemoveMeetingTab(activeMeetingTab)}
                    >
                      Remove
                    </Button>
                  </Grid>
                  <Grid size={6}>
                    <TextField
                      label="Location"
                      fullWidth
                      variant="standard"
                      value={currentMeeting.location}
                      onChange={(e) =>
                        handleMeetingChange(
                          activeMeetingTab,
                          "location",
                          e.target.value,
                        )
                      }
                    />
                  </Grid>
                  <Grid size={6}>
                    <TextField
                      label="Schedule"
                      type="date"
                      fullWidth
                      variant="standard"
                      value={currentMeeting.startedAt}
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                      onChange={(e) =>
                        handleMeetingChange(
                          activeMeetingTab,
                          "startedAt",
                          e.target.value,
                        )
                      }
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      label="Notes"
                      fullWidth
                      multiline
                      rows={6}
                      value={currentMeeting.notes}
                      onChange={(e) =>
                        handleMeetingChange(
                          activeMeetingTab,
                          "notes",
                          e.target.value,
                        )
                      }
                    />
                  </Grid>
                </Grid>
                {/* <TextField
                  fullWidth
                  multiline
                  rows={6}
                  value={form.activityEarly || ""}
                  onChange={(e) =>
                    setForm({ ...form, activityEarly: e.target.value })
                  }
                ></TextField> */}
              </AccordionDetails>
            </Accordion>
            <Accordion sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body2">Negotiations & Offers</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  value={form.activityMid || ""}
                  onChange={(e) =>
                    setForm({ ...form, activityMid: e.target.value })
                  }
                ></TextField>
              </AccordionDetails>
            </Accordion>
            <Accordion sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body2">Final Deal</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  value={form.activityLate || ""}
                  onChange={(e) =>
                    setForm({ ...form, activityLate: e.target.value })
                  }
                ></TextField>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid size={6}>
            <Box
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Details
              </Typography>
              {form.items.length === 0 && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  No items added yet
                </Typography>
              )}
              {/* Right Side */}
              <Grid container spacing={1}>
                {form.items.map((row, index) => (
                  <Grid container spacing={1} key={index}>
                    <Grid size={1}>
                      <Tooltip title="Remove Item">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            setForm((prev: CardFormState) => ({
                              ...prev,
                              items: prev.items.filter((_, i) => i !== index),
                            }));
                          }}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                    <Grid size={6}>
                      <TextField
                        label="Item"
                        size="small"
                        fullWidth
                        value={row.item}
                        onChange={(e) => {
                          const item = e.target.value;
                          setForm((prev: CardFormState) => ({
                            ...prev,
                            items: prev.items.map((currentRow, i) =>
                              i === index
                                ? { ...currentRow, item }
                                : currentRow,
                            ),
                          }));
                        }}
                      />
                    </Grid>
                    <Grid size={3}>
                      <TextField
                        label="Qty"
                        size="small"
                        type="number"
                        fullWidth
                        slotProps={{
                          htmlInput: {
                            step: "0.01",
                          },
                        }}
                        value={row.quantity}
                        onChange={(e) => {
                          const quantity = parseNumericInput(e.target.value);
                          setForm((prev: CardFormState) => ({
                            ...prev,
                            items: prev.items.map((currentRow, i) =>
                              i === index
                                ? {
                                    ...currentRow,
                                    // Keep subtotal derived from qty x unit price.
                                    quantity,
                                    subtotal: quantity * currentRow.pricePerUom,
                                  }
                                : currentRow,
                            ),
                          }));
                        }}
                      />
                    </Grid>
                    <Grid size={2}>
                      <TextField
                        label="UOM"
                        size="small"
                        fullWidth
                        value={row.uom}
                        onChange={(e) => {
                          const uom = e.target.value;
                          setForm((prev: CardFormState) => ({
                            ...prev,
                            items: prev.items.map((currentRow, i) =>
                              i === index ? { ...currentRow, uom } : currentRow,
                            ),
                          }));
                        }}
                      />
                    </Grid>
                    <Grid size={5}>
                      <TextField
                        sx={{ mt: 1.5 }}
                        label="Unit price"
                        size="small"
                        type="number"
                        fullWidth
                        slotProps={{
                          htmlInput: {
                            step: "0.01",
                          },
                        }}
                        value={row.pricePerUom}
                        onChange={(e) => {
                          const pricePerUom = parseNumericInput(e.target.value);
                          setForm((prev: CardFormState) => ({
                            ...prev,
                            items: prev.items.map((currentRow, i) =>
                              i === index
                                ? {
                                    ...currentRow,
                                    pricePerUom,
                                    subtotal: currentRow.quantity * pricePerUom,
                                  }
                                : currentRow,
                            ),
                          }));
                        }}
                      />
                    </Grid>
                    <Grid size={2}>
                      <TextField
                        sx={{ mt: 1.5 }}
                        label="% Margin"
                        size="small"
                        type="number"
                        fullWidth
                        value={row.margin ?? ""}
                        slotProps={{
                          htmlInput: {
                            step: "0.01",
                            placeholder: "%",
                          },
                        }}
                        onChange={(e) => {
                          const margin = parseNumericInput(e.target.value);
                          setForm((prev: CardFormState) => ({
                            ...prev,
                            items: prev.items.map((currentRow, i) =>
                              i === index
                                ? { ...currentRow, margin }
                                : currentRow,
                            ),
                          }));
                        }}
                      />
                    </Grid>
                    <Grid size={5}>
                      <TextField
                        sx={{ mt: 1.5 }}
                        label="Subtotal"
                        size="small"
                        fullWidth
                        value={formatRupiah(row.subtotal)}
                        slotProps={{ input: { readOnly: true } }}
                      ></TextField>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
              <Button
                sx={{ mt: 2 }}
                size="small"
                onClick={() =>
                  setForm((prev: CardFormState) => ({
                    ...prev,
                    items: [
                      ...(prev.items ?? []),
                      {
                        item: "",
                        quantity: 0,
                        uom: "",
                        pricePerUom: 0,
                        margin: 0,
                        subtotal: 0,
                      },
                    ],
                  }))
                }
              >
                + Add more items
              </Button>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
