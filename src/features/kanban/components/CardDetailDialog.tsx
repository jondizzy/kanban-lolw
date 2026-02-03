import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Divider,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";

const formatRupiah = (value?: number) => {
  if (!value) return "";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
};

export default function CardDetailDialog({
  open,
  form,
  setForm,
  onClose,
  onSave,
}: any) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: 600, pb: 2 }}>
        {form.cardCode
          ? `${form.cardCode} — ${form.title || "Untitled"}`
          : form.title || "Card Details"}
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        {/* Before divider */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
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
          <Grid size={12}>
            <TextField
              label="Customer Name"
              fullWidth
              value={form.customerName || ""}
              onChange={(e) =>
                setForm({ ...form, customerName: e.target.value })
              }
            />
          </Grid>

          <Grid size={6}>
            <TextField
              label="Deal Value (IDR)"
              fullWidth
              value={formatRupiah(Number(form.value))}
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

        {/* Item section */}
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          Deal Details
        </Typography>

        <Grid container spacing={2}>
          <Grid size={3}>
            <TextField
              label="Item"
              fullWidth
              value={form.item || ""}
              onChange={(e) => setForm({ ...form, item: e.target.value })}
            />
          </Grid>
          <Grid size={3}>
            <TextField
              label="Quantity"
              type="number"
              fullWidth
              value={form.quantity || ""}
              onChange={(e) =>
                setForm({ ...form, quantity: Number(e.target.value) })
              }
            />
          </Grid>
          <Grid size={3}>
            <TextField
              label="UOM"
              fullWidth
              value={form.uom || ""}
              onChange={(e) => setForm({ ...form, uom: e.target.value })}
            />
          </Grid>
          <Grid size={3}>
            <TextField
              label="Price / UOM"
              fullWidth
              value={
                form.pricePerUom
                  ? new Intl.NumberFormat("id-ID").format(form.pricePerUom)
                  : ""
              }
              onChange={(e) => {
                const raw = e.target.value.replace(/[^\d]/g, "");
                setForm({ ...form, pricePerUom: Number(raw) });
              }}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              sx={{
                bgcolor: "grey.50",
              }}
              label="Total (IDR)"
              fullWidth
              value={
                form.total
                  ? new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    }).format(form.total)
                  : ""
              }
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
