import invalidChars from './regexp/invalidChars';

export default function (text) {
  return invalidChars.test(text);
}
