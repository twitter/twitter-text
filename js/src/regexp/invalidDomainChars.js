// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

import directionalMarkersGroup from './directionalMarkersGroup';
import invalidCharsGroup from './invalidCharsGroup';
import punct from './punct';
import spacesGroup from './spacesGroup';
import stringSupplant from '../lib/stringSupplant';

const invalidDomainChars = stringSupplant('#{punct}#{spacesGroup}#{invalidCharsGroup}#{directionalMarkersGroup}', {
  punct,
  spacesGroup,
  invalidCharsGroup,
  directionalMarkersGroup
});

export default invalidDomainChars;
