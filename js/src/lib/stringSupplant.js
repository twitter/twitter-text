  // simple string interpolation
export default function (str, map) {
  return str.replace(/#\{(\w+)\}/g, function (match, name) {
    return map[name] || '';
  });
}
