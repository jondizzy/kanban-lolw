import type { Task } from "../../../store/kanbanTypes";

const startOfDay = (date: Date) => {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

const endOfDay = (date: Date) => {
  const copy = new Date(date);
  copy.setHours(23, 59, 59, 999);
  return copy;
};

const parseCreatedDate = (value?: string) => {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const matchesCreatedDateRange = (
  task: Task,
  createdDateStart?: string,
  createdDateEnd?: string,
) => {
  const createdDate = parseCreatedDate(task.createdAt);
  if (!createdDateStart && !createdDateEnd) {
    return true;
  }

  if (!createdDate) {
    return false;
  }

  if (createdDateStart) {
    const start = startOfDay(new Date(createdDateStart));
    if (Number.isNaN(start.getTime()) || createdDate < start) {
      return false;
    }
  }

  if (createdDateEnd) {
    const end = endOfDay(new Date(createdDateEnd));
    if (Number.isNaN(end.getTime()) || createdDate > end) {
      return false;
    }
  }

  return true;
};
