export function getA1Notation(row, col) {
  let letter = (col + 1 + 9).toString(36).toUpperCase();
  let number = row + 1;
  return (letter + number);
}