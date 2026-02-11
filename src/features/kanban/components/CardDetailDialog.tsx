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
} from "@mui/material";
import Grid from "@mui/material/Grid";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import InputAdornment from "@mui/material/InputAdornment";
``;
import type {
  LineItem,
  CardFormState,
  CardFormRedux,
} from "../../../store/kanbanTypes";

const formatRupiah = (value?: number) => {
  if (!value) return "";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
};
// type Props = {
//   open: boolean;
//   form: CardFormState;
//   setForm: React.Dispatch<React.SetStateAction<CardFormState>>;
//   onClose: () => void;
//   onSave: () => void;
// };
export default function CardDetailDialog({
  open,
  form,
  setForm,
  onClose,
  onSave,
}: CardFormRedux) {
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography fontWeight={600}>
            {form.cardCode}
            {/* {form.cardCode
              ? `${form.cardCode} — ${form.title || "Untitled"}`
              : form.title || "Card Details"} */}
          </Typography>
          <TextField
            variant="standard"
            value={form.title || ""}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <EditOutlinedIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={onSave}>
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
                  sx={{ minWidth: 80 }}
                  value={form.customerGroup}
                  onChange={(e) =>
                    setForm({ ...form, customerGroup: e.target.value })
                  }
                  displayEmpty
                >
                  <MenuItem value="internal">INT</MenuItem>
                  <MenuItem value="eksternal">EXT</MenuItem>
                </Select>
                {/* <TextField
                  label="Group"
                  fullWidth
                  value={form.customerName || ""}
                  onChange={(e) =>
                    setForm({ ...form, customerName: e.target.value })
                  }
                /> */}
              </Grid>
              <Grid size={6}>
                <TextField
                  label="Deal Value (IDR)"
                  fullWidth
                  value={formatRupiah(Number(form.total))}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^\d]/g, "");
                    setForm({ ...form, value: Number(raw) });
                  }}
                />
              </Grid>

              <Grid size={6}>
                <TextField
                  label="Sales Responsible"
                  fullWidth
                  value={form.owner || ""}
                  onChange={(e) => setForm({ ...form, owner: e.target.value })}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />
            {/* Bottom Left */}
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Activities & Notes
            </Typography>
            <Accordion defaultExpanded sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body2">Meetings & MoMs</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  onChange={(e) =>
                    setForm({ ...form, activityEarly: e.target.value })
                  }
                ></TextField>
              </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body2">Negotiations & Offers</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  onChange={(e) =>
                    setForm({ ...form, activityMid: e.target.value })
                  }
                ></TextField>
              </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body2">Final Deal</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
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
                    <Grid size={7}>
                      <TextField
                        label="Item"
                        size="small"
                        fullWidth
                        value={row.item}
                        onChange={(e) => {
                          const next = form.items.map((row, i) =>
                            i === index
                              ? { ...row, item: e.target.value }
                              : row,
                          );

                          setForm({ ...form, items: next });
                        }}
                      />
                    </Grid>
                    <Grid size={2}>
                      <TextField
                        label="Qty"
                        size="small"
                        type="number"
                        fullWidth
                        value={row.quantity}
                        onChange={(e) => {
                          const next = [...form.items];
                          next[index].quantity = Number(e.target.value);
                          setForm({ ...form, items: next });
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
                          const next = [...form.items];
                          next[index].uom = e.target.value;
                          setForm({ ...form, items: next });
                        }}
                      />
                    </Grid>
                    <Grid size={6}>
                      <TextField
                        sx={{ mt: 1.5 }}
                        label="Unit price"
                        size="small"
                        fullWidth
                        value={row.pricePerUom}
                        onChange={(e) => {
                          const next = [...form.items];
                          next[index].pricePerUom = Number(e.target.value);
                          next[index].subtotal =
                            next[index].quantity * next[index].pricePerUom;
                          setForm({ ...form, items: next });
                        }}
                      />
                    </Grid>
                    <Grid size={6}>
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
