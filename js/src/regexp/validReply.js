// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

import atSigns from './atSigns';
import regexSupplant from '../lib/regexSupplant';
import spaces from './spaces';

const validReply = regexSupplant(/^(?:#{spaces})*#{atSigns}([a-zA-Z0-9_]{1,20})/, { atSigns, spaces });

export default validReply;
