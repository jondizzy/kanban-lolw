import type { Role } from "../../../store/kanbanTypes";
export const roleVisibleColumns: Record<Role, string[]> = {
  AG: ["new_leads", "ag_qualify", "ag_interest", "ag_hot", "won", "lost"],
  CH: ["new_leads", "ag_qualify", "ag_interest", "ag_hot", "won", "lost"],
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
