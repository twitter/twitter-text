import regexSupplant from '../lib/regexSupplant';
import validateUrlUserinfo from './validateUrlUserinfo';
import validateUrlHost from './validateUrlHost';
import validateUrlPort from './validateUrlPort';

const validateUrlAuthority = regexSupplant(
  // $1 userinfo
  '(?:(#{validateUrlUserinfo})@)?' +
  // $2 host
  '(#{validateUrlHost})' +
  // $3 port
  '(?::(#{validateUrlPort}))?',
  { validateUrlUserinfo, validateUrlHost, validateUrlPort },
  'i'
);

export default validateUrlAuthority;
