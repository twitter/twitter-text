import regexSupplant from '../lib/regexSupplant';
import validateUrlPchar from './validateUrlPchar';

const validateUrlQuery = regexSupplant(
  /(#{validateUrlPchar}|\/|\?)*/i,
  { validateUrlPchar }
);

export default validateUrlQuery;
