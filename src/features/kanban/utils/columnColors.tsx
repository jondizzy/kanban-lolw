const COLUMN_ACCENT_COLOR: Record<
  "new_leads" | "progressing" | "won" | "lost",
  string
> = {
  new_leads: "primary.main",
  progressing: "warning.main",
  won: "success.main",
  lost: "error.main",
};
export const columnColors: Record<string, string> = {
  new_leads: "#E3F2FD", // blue 50
  progressing: "#FFF8E1", // amber 50
  won: "#E8F5E9", // green 50
  lost: "#FDECEA", // red 50
};
