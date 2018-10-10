// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

const nonBmpCodePairs = /[\uD800-\uDBFF][\uDC00-\uDFFF]/gm;
export default nonBmpCodePairs;
