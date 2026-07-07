export const formatAddress = (address) => {
  if (!address) return "-";
  const { lane, city, state, pin_code } = address;
  return [lane, city, state, pin_code].filter(Boolean).join(", ") || "-";
};
