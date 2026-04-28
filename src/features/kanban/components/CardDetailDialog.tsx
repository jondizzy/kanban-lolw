import { useState } from "react";
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
import {
  buildActivityEarlySummary,
  createMeetingNote,
  normalizeMeetings,
} from "../utils/meetingNotes";

// Avoid NaN when a numeric field is temporarily cleared during editing.
const parseNumericInput = (value: string) => {
  if (value.trim() === "") {
    return 0;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const calculateItemsTotal = (items: CardFormState["items"]) =>
  items.reduce((sum, item) => sum + item.subtotal, 0);

const toEditableCurrencyString = (value?: number) => {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return "";
  }

  return String(value).replace(".", ",");
};

const parseCurrencyInput = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return 0;
  }

  const normalized = trimmed
    .replace(/\s+/g, "")
    .replace(/^Rp\s?/i, "")
    .replace(/\.(?=\d{3}(?:\D|$))/g, "")
    .replace(",", ".");
  const parsed = Number(normalized);
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
  const [priceInputs, setPriceInputs] = useState<Record<number, string>>({});
  const [requiredCapitalInputs, setRequiredCapitalInputs] = useState<
    Record<number, string>
  >({});
  const [activeMeetingTab, setActiveMeetingTab] = useState(0);

  // Fire a warning if sales resp field is empty
  const handleSave = () => {
    if (!form.owner?.trim()) {
      setOwnerError(true);
      window.alert("Sales Responsible is required before saving.");
      return;
    }

    setOwnerError(false);
    onSave();
  };

  const handleClose = () => {
    setOwnerError(false);
    setPriceInputs({});
    setRequiredCapitalInputs({});
    setActiveMeetingTab(0);
    onClose();
  };

  const updateItems = (
    updater: (items: CardFormState["items"]) => CardFormState["items"],
  ) => {
    setForm((prev: CardFormState) => {
      const items = updater(prev.items);
      const total = calculateItemsTotal(items);

      return {
        ...prev,
        items,
        total,
        value: total,
      };
    });
  };

  const syncMeetingsToForm = (nextMeetingTabs: MeetingNote[]) => {
    setForm((prev) => ({
      ...prev,
      meetings: nextMeetingTabs,
      activityEarly: buildActivityEarlySummary(nextMeetingTabs),
    }));
  };

  const handleMeetingChange = (
    index: number,
    field: keyof MeetingNote,
    value: string,
  ) => {
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
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
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
          <Button onClick={handleClose}>Cancel</Button>
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
                  label="Customer's PO Number"
                  fullWidth
                  value={form.custPo || ""}
                  onChange={(e) => setForm({ ...form, custPo: e.target.value })}
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
                    ownerError ? "Sales Responsible is required." : undefined
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
              {/* <Grid size={6}></Grid> */}
              <Grid size={12}>
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
                        // label="Item"
                        variant="standard"
                        helperText="Item"
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
                        // label="Qty"
                        variant="standard"
                        helperText="Qty"
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
                          updateItems((items) =>
                            items.map((currentRow, i) =>
                              i === index
                                ? {
                                    ...currentRow,
                                    // Keep subtotal derived from qty x unit price.
                                    quantity,
                                    subtotal: quantity * currentRow.pricePerUom,
                                  }
                                : currentRow,
                            ),
                          );
                        }}
                      />
                    </Grid>
                    <Grid size={2}>
                      <TextField
                        // label="UOM"
                        variant="standard"
                        helperText="UOM"
                        size="small"
                        fullWidth
                        value={row.uom}
                        onChange={(e) => {
                          const uom = e.target.value;
                          updateItems((items) =>
                            items.map((currentRow, i) =>
                              i === index ? { ...currentRow, uom } : currentRow,
                            ),
                          );
                        }}
                      />
                    </Grid>
                    <Grid size={5}>
                      <TextField
                        sx={{ mt: 1.5 }}
                        // label="Unit price"
                        variant="standard"
                        helperText="Unit Price"
                        size="small"
                        fullWidth
                        slotProps={{
                          htmlInput: {
                            inputMode: "decimal",
                          },
                        }}
                        value={
                          Object.prototype.hasOwnProperty.call(
                            priceInputs,
                            index,
                          )
                            ? priceInputs[index]
                            : formatRupiah(Number(row.pricePerUom || 0))
                        }
                        onFocus={() => {
                          setPriceInputs((prev) => ({
                            ...prev,
                            [index]: toEditableCurrencyString(row.pricePerUom),
                          }));
                        }}
                        onBlur={() => {
                          setPriceInputs((prev) => {
                            const next = { ...prev };
                            delete next[index];
                            return next;
                          });
                        }}
                        onChange={(e) => {
                          const nextInput = e.target.value;
                          const pricePerUom = parseCurrencyInput(nextInput);
                          setPriceInputs((prev) => ({
                            ...prev,
                            [index]: nextInput,
                          }));
                          updateItems((items) =>
                            items.map((currentRow, i) =>
                              i === index
                                ? {
                                    ...currentRow,
                                    pricePerUom,
                                    subtotal: currentRow.quantity * pricePerUom,
                                  }
                                : currentRow,
                            ),
                          );
                        }}
                      />
                    </Grid>
                    <Grid size={2}>
                      <TextField
                        sx={{ mt: 1.5 }}
                        // label="% Margin"
                        variant="standard"
                        helperText="% Margin"
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
                          updateItems((items) =>
                            items.map((currentRow, i) =>
                              i === index
                                ? { ...currentRow, margin }
                                : currentRow,
                            ),
                          );
                        }}
                      />
                    </Grid>
                    <Grid size={5}>
                      <TextField
                        sx={{ mt: 1.5 }}
                        // label="Required Capital"
                        variant="standard"
                        helperText="Required Capital"
                        size="small"
                        fullWidth
                        value={
                          Object.prototype.hasOwnProperty.call(
                            requiredCapitalInputs,
                            index,
                          )
                            ? requiredCapitalInputs[index]
                            : formatRupiah(Number(row.requiredCapital || 0))
                        }
                        onFocus={() => {
                          setRequiredCapitalInputs((prev) => ({
                            ...prev,
                            [index]: toEditableCurrencyString(
                              row.requiredCapital,
                            ),
                          }));
                        }}
                        onBlur={() => {
                          setRequiredCapitalInputs((prev) => {
                            const next = { ...prev };
                            delete next[index];
                            return next;
                          });
                        }}
                        slotProps={{
                          htmlInput: {
                            inputMode: "decimal",
                          },
                        }}
                        onChange={(e) => {
                          const nextInput = e.target.value;
                          const requiredCapital = parseCurrencyInput(nextInput);
                          setRequiredCapitalInputs((prev) => ({
                            ...prev,
                            [index]: nextInput,
                          }));
                          updateItems((items) =>
                            items.map((currentRow, i) =>
                              i === index
                                ? { ...currentRow, requiredCapital }
                                : currentRow,
                            ),
                          );
                        }}
                      />
                    </Grid>
                    <Grid size={12}>
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
                  updateItems((items) => [
                    ...items,
                    {
                      item: "",
                      quantity: 0,
                      uom: "",
                      pricePerUom: 0,
                      margin: 0,
                      requiredCapital: 0,
                      subtotal: 0,
                    },
                  ])
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
