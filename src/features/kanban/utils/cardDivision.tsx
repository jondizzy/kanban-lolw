import type { Role } from "../../../store/kanbanTypes";

const divisionCodes: Role[] = ["AG", "CH", "FD", "BM", "MNG"];

export const resolveDivisionFromCardCode = (
  cardCode?: string | null,
): Role | undefined => {
  const normalizedCardCode = cardCode?.trim().toUpperCase();

  if (!normalizedCardCode) {
    return undefined;
  }

  for (const divisionCode of divisionCodes) {
    if (
      normalizedCardCode === divisionCode ||
      normalizedCardCode.startsWith(divisionCode) ||
      normalizedCardCode.startsWith(`${divisionCode}-`) ||
      normalizedCardCode.startsWith(`${divisionCode}/`) ||
      normalizedCardCode.startsWith(`${divisionCode}_`)
    ) {
      return divisionCode;
    }
  }

  const matchedDivision = normalizedCardCode.match(/\b(AG|CH|FD|BM|MNG)\b/);
  return (matchedDivision?.[1] as Role | undefined) ?? undefined;
};
