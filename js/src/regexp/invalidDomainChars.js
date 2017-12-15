import invalidCharsGroup from './invalidCharsGroup';
import punct from './punct';
import spacesGroup from './spacesGroup';
import stringSupplant from '../lib/stringSupplant';

const invalidDomainChars = stringSupplant(
  '#{punct}#{spacesGroup}#{invalidCharsGroup}',
  { punct, spacesGroup, invalidCharsGroup }
);

export default invalidDomainChars;
