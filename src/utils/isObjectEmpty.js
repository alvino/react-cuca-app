
export default function isObjectEmpty(value) {
  if(value === null || typeof value === "undefined") return true
  return (
    Object.prototype.toString.call(value) === "[object Object]" &&
    JSON.stringify(value) === "{}"
  );
}