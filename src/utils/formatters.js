export function formatIndianDate(isoString) {
  if (!isoString) return "-";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    const day = d.getDate();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  } catch (e) {
    return isoString;
  }
}

export function formatSingleRupee(val) {
  const num = parseInt(val, 10);
  if (isNaN(num)) return val;
  return num.toLocaleString("en-IN");
}

export function formatIndianCurrency(amountStr) {
  if (!amountStr) return "";
  const trimmed = String(amountStr).trim();
  if (trimmed.includes("-")) {
    const parts = trimmed.split("-").map(p => formatSingleRupee(p.trim()));
    return `₹${parts.join(" - ₹")}`;
  }
  return `₹${formatSingleRupee(trimmed)}`;
}

export function generateId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}
