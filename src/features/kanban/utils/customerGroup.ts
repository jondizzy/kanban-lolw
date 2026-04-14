export const normalizeCustomerGroup = (value?: string | null) => {
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

  return value?.trim() ?? "";
};
