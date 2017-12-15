// Unencoded internationalized domains - this doesn't check for invalid UTF-8 sequences
const validateUrlUnicodeDomainTld = /(?:(?:[a-z]|[^\u0000-\u007f])(?:(?:[a-z0-9\-]|[^\u0000-\u007f])*(?:[a-z0-9]|[^\u0000-\u007f]))?)/i;
export default validateUrlUnicodeDomainTld;
