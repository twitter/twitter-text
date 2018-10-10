// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

// Punting on real IPv6 validation for now
const validateUrlIpv6 = /(?:\[[a-f0-9:\.]+\])/i;
export default validateUrlIpv6;
