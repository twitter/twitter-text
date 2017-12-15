export default function (o) {
  const r = {};
  for (const k in o) {
    if (o.hasOwnProperty(k)) {
      r[k] = o[k];
    }
  }

  return r;
}
