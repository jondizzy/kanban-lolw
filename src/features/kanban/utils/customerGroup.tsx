export type CustomerGroupValue = "" | "internal" | "eksternal";

export const normalizeCustomerGroup = (
  value?: string | null,
): CustomerGroupValue => {
  const normalized = value?.trim().toLowerCase();

  if (!normalized) {
    return "";
  }

  if (normalized === "internal" || normalized === "int") {
    return "internal";
  }

  if (
    normalized === "eksternal" ||
    normalized === "external" ||
    normalized === "ext"
  ) {
    return "eksternal";
  }

  return "";
};
