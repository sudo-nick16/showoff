export function formatDate(s: string): string {
  const date = new Date(s);
  const month = date.toLocaleString("default", { month: "long" });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month.slice(0,3)} ${day}, ${year}`;
}
