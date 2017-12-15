import htmlEscape from './htmlEscape';

const BOOLEAN_ATTRIBUTES = {
  'disabled': true,
  'readonly': true,
  'multiple': true,
  'checked': true
};

export default function (attributes) {
  let htmlAttrs = '';
  for (const k in attributes) {
    let v = attributes[k];
    if (BOOLEAN_ATTRIBUTES[k]) {
      v = v ? k : null;
    }
    if (v == null) { continue; }
    htmlAttrs += ` ${htmlEscape(k)}="${htmlEscape(v.toString())}"`;
  }
  return htmlAttrs;
}
