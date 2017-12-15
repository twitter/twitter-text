import regexSupplant from '../lib/regexSupplant';
import validateUrlPchar from './validateUrlPchar';

const validateUrlPath = regexSupplant(
  /(\/#{validateUrlPchar}*)*/i,
  { validateUrlPchar }
);

export default validateUrlPath;
