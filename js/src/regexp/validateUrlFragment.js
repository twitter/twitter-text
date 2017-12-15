import regexSupplant from '../lib/regexSupplant';
import validateUrlPchar from './validateUrlPchar';

const validateUrlFragment = regexSupplant(
  /(#{validateUrlPchar}|\/|\?)*/i,
  { validateUrlPchar }
);

export default validateUrlFragment;

