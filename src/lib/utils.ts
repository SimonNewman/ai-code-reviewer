import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getIssuesByCategory = (category: Category, issues: Issue[]) => {
  return issues.filter((issue) => issue.category === category.name);
};

export const categoryCount = (category: Category, issues: Issue[]) => {
  return getIssuesByCategory(category, issues).length;
};
