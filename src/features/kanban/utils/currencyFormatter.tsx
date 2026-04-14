//IDR Currency Formatter
export default function formatRupiah(value?: number) {
  if (value === undefined || value === null || Number.isNaN(value)) return "";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}
