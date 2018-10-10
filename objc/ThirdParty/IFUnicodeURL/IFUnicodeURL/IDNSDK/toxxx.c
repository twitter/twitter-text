/*
 * Copyright 2018 Twitter, Inc.
 * Licensed under the Apache License, Version 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 */
/*************************************************************************/
/*                                                                       */
/* toxxx                                                                 */
/*                                                                       */
/* IDNA spec entry points ToUnicode & ToASCII along with some IDNA spec  */
/* domain label splitting utility routines.                              */
/*                                                                       */
/* (c) Verisign Inc., 2000-2002, All rights reserved                     */
/*                                                                       */
/*************************************************************************/
#include "toxxx.h"
#include "nameprep.h"
#include "puny.h"
#include "util.h"
XcodeBool Xcode_IsIDNADomainDelimiter( const UTF16CHAR * wp )
{
  if ( wp == 0 ) return 0;
    if ( *wp == ULABEL_DELIMITER_LIST[0] ||
         *wp == ULABEL_DELIMITER_LIST[1] ||
         *wp == ULABEL_DELIMITER_LIST[2] ||
         *wp == ULABEL_DELIMITER_LIST[3] )
    return 1;
  return 0;
}
/*********************************************************************************
  From: RFC 3490 - Internationalizing Domain Names in Applications (IDNA)
  4. Conversion operations
     An application converts a domain name put into an IDN-unaware slot or
     displayed to a user.  This section specifies the steps to perform in
     the conversion, and the ToASCII and ToUnicode operations.
     The input to ToASCII or ToUnicode is a single label that is a
     sequence of Unicode code points (remember that all ASCII code points
     are also Unicode code points).  If a domain name is represented using
     a character set other than Unicode or US-ASCII, it will first need to
     be transcoded to Unicode.
     Starting from a whole domain name, the steps that an application
     takes to do the conversions are:
     1) Decide whether the domain name is a "stored string" or a "query
        string" as described in [STRINGPREP].  If this conversion follows
        the "queries" rule from [STRINGPREP], set the flag called
        "AllowUnassigned".

     * This c library supports both through a compile switch. See xcode_config.h
       for more information.

     2) Split the domain name into individual labels as described in
        section 3.1.  The labels do not include the separator.
     3) For each label, decide whether or not to enforce the restrictions
        on ASCII characters in host names [STD3].  (Applications already
        faced this choice before the introduction of IDNA, and can
        continue to make the decision the same way they always have; IDNA
        makes no new recommendations regarding this choice.)  If the
        restrictions are to be enforced, set the flag called
        "UseSTD3ASCIIRules" for that label.
     4) Process each label with either the ToASCII or the ToUnicode
        operation as appropriate.  Typically, you use the ToASCII
        operation if you are about to put the name into an IDN-unaware
        slot, and you use the ToUnicode operation if you are displaying
        the name to a user; section 3.1 gives greater detail on the
        applicable requirements.
     5) If ToASCII was applied in step 4 and dots are used as label
        separators, change all the label separators to U+002E (full stop).
**********************************************************************************/
/*********************************************************************************
*
* int ToASCII( const UTF16CHAR * puzInputString, int iInputSize,
*              UCHAR8 * pzOutputString, int * piOutputSize )
*
*  Applies IDNA spec ToASCII operation on a domain label.
*
*  Returns XCODE_SUCCESS if successful, or an XCODE error constant on failure.
*
*  puzInputString  - [in] UTF16 input string.
*  iInputSize      - [in] Length of incoming UTF16 string.
*  pzOutputString  - [in,out] 8-bit output character string buffer.
*  piOutputSize    - [in,out] Length of incoming 8-bit buffer, and contains
*                    length of resulting encoded string on exit.
*
**********************************************************************************/
/*********************************************************************************
  The ToASCII operation takes a sequence of Unicode code points that
  make up one label and transforms it into a sequence of code points in
  the ASCII range (0..7F).  If ToASCII succeeds, the original sequence
  and the resulting sequence are equivalent labels.
  It is important to note that the ToASCII operation can fail.  ToASCII
  fails if any step of it fails.  If any step of the ToASCII operation
  fails on any label in a domain name, that domain name MUST NOT be
  used as an internationalized domain name.  The method for dealing
  with this failure is application-specific.
  The inputs to ToASCII are a sequence of code points, the
  AllowUnassigned flag, and the UseSTD3ASCIIRules flag.  The output of
  ToASCII is either a sequence of ASCII code points or a failure
  condition.
  ToASCII never alters a sequence of code points that are all in the
  ASCII range to begin with (although it could fail).  Applying the
  ToASCII operation multiple times has exactly the same effect as
  applying it just once.
  ToASCII consists of the following steps:
  1. If the sequence contains any code points outside the ASCII range
    (0..7F) then proceed to step 2, otherwise skip to step 3.
  2. Perform the steps specified in [NAMEPREP] and fail if there is an
    error.  The AllowUnassigned flag is used in [NAMEPREP].
  3. If the UseSTD3ASCIIRules flag is set, then perform these checks:
   (a) Verify the absence of non-LDH ASCII code points; that is, the
       absence of 0..2C, 2E..2F, 3A..40, 5B..60, and 7B..7F.
   (b) Verify the absence of leading and trailing hyphen-minus; that
       is, the absence of U+002D at the beginning and end of the
       sequence.
  4. If the sequence contains any code points outside the ASCII range
    (0..7F) then proceed to step 5, otherwise skip to step 8.
  5. Verify that the sequence does NOT begin with the ACE prefix.
  6. Encode the sequence using the encoding algorithm in [PUNYCODE] and
    fail if there is an error.
  7. Prepend the ACE prefix.
  8. Verify that the number of code points is in the range 1 to 63
    inclusive.
**********************************************************************************/
int Xcode_ToASCII( const UTF16CHAR *  puzInputString,
                   int                iInputSize,
                   UCHAR8 *           pzOutputString,
                   int *              piOutputSize )
{
  int i;
  int np, en;
  int iOutputSize = MAX_LABEL_SIZE_32;
  DWORD dwzOutputString[MAX_LABEL_SIZE_32];
  /* Basic input validity checks and buffer length checks */
  if ( puzInputString == 0 || iInputSize <= 0 ) return XCODE_BAD_ARGUMENT_ERROR;
  if ( pzOutputString == 0 || *piOutputSize <= 0 ) return XCODE_BAD_ARGUMENT_ERROR;
  if ( iInputSize > MAX_LABEL_SIZE_16 ) return XCODE_BUFFER_OVERFLOW_ERROR;
  if ( *piOutputSize < MAX_LABEL_SIZE_8 ) return XCODE_BUFFER_OVERFLOW_ERROR;
  /* 1. If the sequence contains any code points outside the ASCII range
        (0..7F) then proceed to step 2, otherwise skip to step 3. */
  np = 0;
  for ( i = 0; i < iInputSize; i++ )
  {
    if ( *(puzInputString+i) > 0x7F )
    {
      int res;
      DWORD dwProhibitedChar = 0;
      /* 2. Perform the steps specified in [NAMEPREP] and fail if there is an
            error. The AllowUnassigned flag is used in [NAMEPREP]. */
      /* Author: AllowUnassigned is a compile switch and is defined via xcode_config.h.
         It effects the static nameprep data headers used in this call. */
      res = Xcode_nameprepString( puzInputString, iInputSize,
                                  dwzOutputString, &iOutputSize, &dwProhibitedChar );
      if ( res != XCODE_SUCCESS )
      {
        return res;
      }
      np = 1;
      break;
    }
  }
  /* Copy non-nameprepped input strings over to output buffer */
  if ( np == 0 )
  {
    for ( i = 0; i < iInputSize; i++ )
    {
      dwzOutputString[i] = (DWORD)*(puzInputString+i);
    }
    iOutputSize = iInputSize;
  }
  /* 3. If the UseSTD3ASCIIRules flag is set, then perform these checks:
     (a) Verify the absence of non-LDH ASCII code points; that is, the
         absence of 0..2C, 2E..2F, 3A..40, 5B..60, and 7B..7F.

     (b) Verify the absence of leading and trailing hyphen-minus; that
         is, the absence of U+002D at the beginning and end of the
         sequence. */
  /* UseSTD3ASCIIRules is a compile switch and is defined via xcode_config.h */

  #ifdef UseSTD3ASCIIRules
  for ( i = 0; i < iOutputSize; i++ )
  {
    if ( is_ldh_character32( *(dwzOutputString+i) ) == XCODE_TRUE )
    {
      return XCODE_TOXXX_STD3_NONLDH;
    }
    if ( ( i == 0 && *(dwzOutputString+i) == LABEL_HYPHEN ) ||
         ( i == (iOutputSize - 1) && *(dwzOutputString+i) == LABEL_HYPHEN ) )
    {
      return XCODE_TOXXX_STD3_HYPHENERROR;
    }
  }
  #endif
  /* 4. If the sequence contains any code points outside the ASCII range
        (0..7F) then proceed to step 5, otherwise skip to step 8. */
  en = 0;
  for ( i = 0; i < iOutputSize; i++ )
  {
    if ( *(dwzOutputString+i) > 0x7F )
    {
      int res;
      /* 5. Verify that the sequence does NOT begin with the ACE prefix. */
      if ( ( ACE_PREFIX32[0] == *(dwzOutputString+0) ) &&
           ( ACE_PREFIX32[1] == *(dwzOutputString+1) ) &&
           ( ACE_PREFIX32[2] == *(dwzOutputString+2) ) &&
           ( ACE_PREFIX32[3] == *(dwzOutputString+3) ) )
      {
        return XCODE_TOXXX_ALREADYENCODED;
      }
      /* 6. Encode the sequence using the encoding algorithm in [PUNYCODE] and
            fail if there is an error. */
      /* 7. Prepend the ACE prefix. */
      res = Xcode_puny_encodeString( dwzOutputString, iOutputSize,
                                     pzOutputString, piOutputSize );
      if ( res != XCODE_SUCCESS ) return res;
      en = 1;
      break;
    }
  }
  if ( en == 0 )
  {
    for ( i = 0; i < iOutputSize; i++ )
    {
      pzOutputString[i] = (UCHAR8)*(dwzOutputString+i);
    }
    *piOutputSize = iOutputSize;
  }
  /* 8. Verify that the number of code points is in the range 1 to 63
        inclusive. */

  if ( *piOutputSize < 1 || *piOutputSize > 63 ) return XCODE_TOXXX_INVALIDDNSLEN;
  return XCODE_SUCCESS;
}
/*********************************************************************************
*
* int ToUnicode( const UCHAR8 * pzInputString, int iInputSize,
*                UTF16CHAR * puzOutputString, int * piOutputSize )
*
*  Applies IDNA spec ToUnicode operation on a domain label. Includes a
*  good amount of commenting detail in .c on operation.
*
*  Returns XCODE_SUCCESS if call was successful. Sets piOutputSize to the width
*  of the result.
*
*  pzInputString   - [in] 8-bit input string.
*  iInputSize      - [in] Length of incoming 8-bit string.
*  puzOutputString - [in,out] UTF16 output character string buffer.
*  piOutputSize    - [in,out] Length of incoming UTF16 buffer, and contains
*                    length of resulting decoded string on exit.
*
**********************************************************************************/
/*********************************************************************************
  The ToUnicode operation takes a sequence of Unicode code points that
  make up one label and returns a sequence of Unicode code points.  If
  the input sequence is a label in ACE form, then the result is an
  equivalent internationalized label that is not in ACE form, otherwise
  the original sequence is returned unaltered.
  ToUnicode never fails.  If any step fails, then the original input
  sequence is returned immediately in that step.
  The ToUnicode output never contains more code points than its input.
  Note that the number of octets needed to represent a sequence of code
  points depends on the particular character encoding used.
  The inputs to ToUnicode are a sequence of code points, the
  AllowUnassigned flag, and the UseSTD3ASCIIRules flag.  The output of
  ToUnicode is always a sequence of Unicode code points.
  1. If all code points in the sequence are in the ASCII range (0..7F)
     then skip to step 3.
  2. Perform the steps specified in [NAMEPREP] and fail if there is an
     error. (If step 3 of ToAscii is also performed here, it will not
     affect the overall behavior of ToUnicode, but it is not
     necessary.) The AllowUnassigned flag is used in [NAMEPREP].
  3. Verify that the sequence begins with the ACE prefix, and save a
     copy of the sequence.
  4. Remove the ACE prefix.
  5. Decode the sequence using the decoding algorithm in [PUNYCODE]
     and fail if there is an error. Save a copy of the result of
     this step.
  6. Apply ToAscii.
  7. Verify that the result of step 6 matches the saved copy from
     step 3, using a case-insensitive ASCII comparison.
  8. Return the saved copy from step 5.
**********************************************************************************/
int Xcode_ToUnicode8( const UCHAR8 *     pzInputString,
                      int                iInputSize,
                      UTF16CHAR *        puzOutputString,
                      int *              piOutputSize )
{
  int res, i;
  XcodeBool bHigh = 0;
  int iConfirmSize = MAX_LABEL_SIZE_8;
  int iPrepOutputSize = MAX_LABEL_SIZE_32;
  int iCopySize;
  UCHAR8 pzConfirmString[MAX_LABEL_SIZE_8];
  DWORD dwzPrepInputString[MAX_LABEL_SIZE_32];
  DWORD dwzPrepOutputString[MAX_LABEL_SIZE_32];
  UCHAR8 pzCopyString[MAX_LABEL_SIZE_8];
  DWORD dwProhibitedChar = 0;
  UTF16CHAR suzDecoded[MAX_LABEL_SIZE_16];
  int iDecodedSize = MAX_LABEL_SIZE_16;
  /* Basic input validity checks and buffer length checks */
  if ( pzInputString == 0 || iInputSize <= 0 ) return XCODE_BAD_ARGUMENT_ERROR;
  if ( puzOutputString == 0 || *piOutputSize <= 0 ) return XCODE_BAD_ARGUMENT_ERROR;
  if ( iInputSize > MAX_LABEL_SIZE_8 ) return XCODE_BUFFER_OVERFLOW_ERROR;
  if ( *piOutputSize < MAX_LABEL_SIZE_16 ) return XCODE_BUFFER_OVERFLOW_ERROR;
  /* ToUnicode never fails.  If any step fails, then the original input
     sequence is returned immediately in that step. */
  for ( i = 0; i < iInputSize; i++ ) *(puzOutputString+i) = (UTF16CHAR)*(pzInputString+i);
  *piOutputSize = iInputSize;
  /* 1. If all code points in the sequence are in the ASCII range (0..7F)
        then skip to step 3. */
  for ( i = 0; i < iInputSize; i++ )
  {
    if ( *(pzInputString+i) > 0x7F )
    {
      bHigh = 1;
      break;
    }
  }
  if ( bHigh == 1 )
  {
    /* 2. Perform the steps specified in [NAMEPREP] and fail if there
          is an error. (If step 3 of ToAscii is also performed here,
          it will not affect the overall behavior of ToUnicode, but it
          is not necessary.) The AllowUnassigned flag is used in
          [NAMEPREP]. */

    /* Author: This step maps some unicode codepoints to ascii, which is        useful where in some languages "ascii" characters are emulated in
       higher unicode codepoints. (for example, Japanese half width and
       full width codepoints) Here in the 8-bit input routine, ASCII values
       greater that 7F are also mapped, so we convert over to 32-bit and        run the input through nameprep. */
    for ( i = 0; i < iInputSize; i++ ) dwzPrepInputString[i] = (DWORD)*(pzInputString+i);
    res = Xcode_nameprepString32( dwzPrepInputString, iInputSize,
                                dwzPrepOutputString, &iPrepOutputSize, &dwProhibitedChar );
    if (res != XCODE_SUCCESS) { return res; }

    for ( i = 0; i < iPrepOutputSize; i++ ) pzCopyString[i] = (UCHAR8)(dwzPrepOutputString[i]);
    iCopySize = iPrepOutputSize;
  } else {
    memcpy( pzCopyString, pzInputString, iInputSize );
    iCopySize = iInputSize;
  }

  /* 3. Verify that the sequence begins with the ACE prefix, and save a
        copy of the sequence. */

  /* 4. Remove the ACE prefix. */
  /* 5. Decode the sequence using the decoding algorithm in [PUNYCODE]
        and fail if there is an error. Save a copy of the result of
        this step. */
  res = Xcode_puny_decodeString( pzCopyString, iCopySize, suzDecoded, &iDecodedSize );
  if (res != XCODE_SUCCESS) { return res; }
  /* 6. Apply ToAscii. */
  res = Xcode_ToASCII( suzDecoded, iDecodedSize, pzConfirmString, &iConfirmSize );
  if (res != XCODE_SUCCESS) { return res; }

  /* 7. Verify that the result of step 6 matches the saved copy from
        step 3, using a case-insensitive ASCII comparison. */
  if ( memcmp( pzCopyString, pzConfirmString, iConfirmSize ) != 0 )
  {
    return XCODE_TOXXX_CIRCLECHECKFAILED;
  }
  /* 8. Return the saved copy from step 5. */
  memcpy( puzOutputString, suzDecoded, iCopySize*2 );
  *piOutputSize = iDecodedSize;
  return XCODE_SUCCESS;
}
int Xcode_ToUnicode16( const UTF16CHAR * puzInputString,
                       int               iInputSize,
                       UTF16CHAR *       puzOutputString,
                       int *             piOutputSize )
{
  int res, i;
  XcodeBool bHigh = 0;
  int iConfirmSize = MAX_LABEL_SIZE_8;
  int iPrepInputSize = MAX_LABEL_SIZE_32;
  int iPrepOutputSize = MAX_LABEL_SIZE_32;
  int iCopySize;
  UCHAR8 pzConfirmString[MAX_LABEL_SIZE_8];
  DWORD dwzPrepInputString[MAX_LABEL_SIZE_32];
  DWORD dwzPrepOutputString[MAX_LABEL_SIZE_32];
  UCHAR8 pzCopyString[MAX_LABEL_SIZE_8];
  DWORD dwProhibitedChar = 0;
  UTF16CHAR suzDecoded[MAX_LABEL_SIZE_16];
  int iDecodedSize = MAX_LABEL_SIZE_16;
  /* Basic input validity checks and buffer length checks */
  if ( puzInputString == 0 || iInputSize <= 0 ) return XCODE_BAD_ARGUMENT_ERROR;
  if ( puzOutputString == 0 || *piOutputSize <= 0 ) return XCODE_BAD_ARGUMENT_ERROR;
  if ( iInputSize > MAX_LABEL_SIZE_16 ) return XCODE_BUFFER_OVERFLOW_ERROR;
  if ( *piOutputSize < MAX_LABEL_SIZE_16 ) return XCODE_BUFFER_OVERFLOW_ERROR;
  /* ToUnicode never fails.  If any step fails, then the original input
     sequence is returned immediately in that step. */
  for ( i = 0; i < iInputSize; i++ ) *(puzOutputString+i) = *(puzInputString+i);
  *piOutputSize = iInputSize;
  /* 1. If all code points in the sequence are in the ASCII range (0..7F)
        then skip to step 3. */
  for ( i = 0; i < iInputSize; i++ )
  {
    if ( *(puzInputString+i) > 0x7F )
    {
      bHigh = 1;
      break;
    }
  }
  if ( bHigh == 1 )
  {
    /* 2. Perform the steps specified in [NAMEPREP] and fail if there
          is an error. (If step 3 of ToAscii is also performed here,
          it will not affect the overall behavior of ToUnicode, but it
          is not necessary.) The AllowUnassigned flag is used in
          [NAMEPREP]. */

    /* Author: This step maps some unicode codepoints to ascii, which is        useful where in some languages "ascii" characters are emulated in
       higher unicode codepoints. (for example, Japanese half width and
       full width codepoints) Here in the 8-bit input routine, ASCII values
       greater that 7F are also mapped, so we convert over to 32-bit and        run the input through nameprep. */
    /* convert UTF16 to 32-bit */
    res = Xcode_convertUTF16To32Bit( puzInputString, iInputSize, dwzPrepInputString, &iPrepInputSize );
    if (res != XCODE_SUCCESS) { return res; }
    res = Xcode_nameprepString32( dwzPrepInputString, iPrepInputSize,
                                dwzPrepOutputString, &iPrepOutputSize, &dwProhibitedChar );
    if (res != XCODE_SUCCESS) { return res; }

    /* If we still have non ascii characters, we should not cast to UCHAR8. */
    for ( i = 0; i < iPrepOutputSize; i++ ) {
        if (dwzPrepOutputString[i] > 0x7f) {
            return XCODE_SUCCESS;
        }
    }

    for ( i = 0; i < iPrepOutputSize; i++ ) pzCopyString[i] = (UCHAR8)(dwzPrepOutputString[i]);
    iCopySize = iPrepOutputSize;
  } else {
    for ( i = 0; i < iInputSize; i++ ) pzCopyString[i] = (UCHAR8)*(puzInputString+i);
    iCopySize = iInputSize;
  }

  /* 3. Verify that the sequence begins with the ACE prefix, and save a
        copy of the sequence. */

  /* 4. Remove the ACE prefix. */
  /* 5. Decode the sequence using the decoding algorithm in [PUNYCODE]
        and fail if there is an error. Save a copy of the result of
        this step. */
  res = Xcode_puny_decodeString( pzCopyString, iCopySize, suzDecoded, &iDecodedSize );
  if (res != XCODE_SUCCESS) { return res; }
  /* 6. Apply ToAscii. */
  res = Xcode_ToASCII( suzDecoded, iDecodedSize, pzConfirmString, &iConfirmSize );
  if (res != XCODE_SUCCESS) { return res; }

  /* 7. Verify that the result of step 6 matches the saved copy from
        step 3, using a case-insensitive ASCII comparison. */
  if ( memcmp( pzCopyString, pzConfirmString, iConfirmSize ) != 0 )
  {
    return XCODE_TOXXX_CIRCLECHECKFAILED;
  }
  /* 8. Return the saved copy from step 5. */
  memcpy( puzOutputString, suzDecoded, iDecodedSize*2 );
  *piOutputSize = iDecodedSize;
  return XCODE_SUCCESS;
}
/*********************************************************************************
*
* int Xcode_DomainToASCII( const UTF16CHAR * puzInputString, int iInputSize,
*              UCHAR8 * pzOutputString, int * piOutputSize )
*
*  Applies IDNA spec ToASCII operation on a domain.
*
*  Returns XCODE_SUCCESS if successful, or an XCODE error constant on failure.
*
*  puzInputString  - [in] UTF16 input string.
*  iInputSize      - [in] Length of incoming UTF16 string.
*  pzOutputString  - [in,out] 8-bit output character string buffer.
*  piOutputSize    - [in,out] Length of incoming 8-bit buffer, and contains
*                    length of resulting encoded string on exit.
*
**********************************************************************************/
int Xcode_DomainToASCII( const UTF16CHAR *  puzInputString,
                         int                iInputSize,
                         UCHAR8 *           pzOutputString,
                         int *              piOutputSize )
{
  int i;
  UTF16CHAR suzLabel[MAX_LABEL_SIZE_16];
  UCHAR8 szDomain[MAX_DOMAIN_SIZE_8];
  UCHAR8 szLabel[MAX_LABEL_SIZE_8];
  int lindex = 0;
  int dindex = 0;
  int iOutputSize;
  int delimiterPresent;
  int res;
  /* Basic input validity checks */
  if ( puzInputString == 0 || iInputSize <= 0 ) return XCODE_BAD_ARGUMENT_ERROR;
  if ( pzOutputString == 0 || *piOutputSize <= 0 ) return XCODE_BAD_ARGUMENT_ERROR;
  if ( iInputSize > MAX_DOMAIN_SIZE_16 ) return XCODE_BUFFER_OVERFLOW_ERROR;
  if ( *piOutputSize < MAX_DOMAIN_SIZE_8 ) return XCODE_BUFFER_OVERFLOW_ERROR;
  for ( i = 0; i < iInputSize; i++ )
  {
    delimiterPresent = 0;

    /* www.ml.ml.com */

    if ( Xcode_IsIDNADomainDelimiter( puzInputString+i ) )
    {
      delimiterPresent = 1;
    } else {
      if (lindex >= MAX_LABEL_SIZE_16) {
          return XCODE_BUFFER_OVERFLOW_ERROR;
      }
      suzLabel[lindex] = *(puzInputString+i);
      lindex++;
    }

    if ( i == iInputSize - 1 || delimiterPresent == 1 )
    {
      /* encode the label and save the result in domain */
      suzLabel[lindex] = 0;

      if ( lindex == 0 ) goto skip;

      iOutputSize = MAX_LABEL_SIZE_8;
      if ( ( res = Xcode_ToASCII( suzLabel, lindex, szLabel, &iOutputSize ) ) != XCODE_SUCCESS ) return res;
      if ( dindex + iOutputSize > MAX_DOMAIN_SIZE_8 ) return XCODE_BUFFER_OVERFLOW_ERROR;
      memcpy( &szDomain[dindex], szLabel, iOutputSize );
      dindex = dindex + iOutputSize;
      lindex = 0;
      skip:
      if ( delimiterPresent == 1 )
      {
        szDomain[dindex] = LABEL_DELIMITER;
        dindex++;
      }
      continue;
    }
  }

  memcpy( pzOutputString, szDomain, dindex );
  *piOutputSize = dindex;
  return XCODE_SUCCESS;
}
/*********************************************************************************
*
* int DomainToUnicode( const UCHAR8 * pzInputString, int iInputSize,
*                UTF16CHAR * puzOutputString, int * piOutputSize )
*
*  Applies IDNA spec ToUnicode operation on a domain.
*
*  Returns XCODE_SUCCESS if call was successful. Sets piOutputSize to the width
*  of the result.
*
*  pzInputString   - [in] 8-bit input string.
*  iInputSize      - [in] Length of incoming 8-bit string.
*  puzOutputString - [in,out] UTF16 output character string buffer.
*  piOutputSize    - [in,out] Length of incoming UTF16 buffer, and contains
*                    length of resulting decoded string on exit.
*
**********************************************************************************/
int Xcode_DomainToUnicode8( const UCHAR8 *     pzInputString,
                            int                iInputSize,
                            UTF16CHAR *        puzOutputString,
                            int *              piOutputSize )
{
  int i;
  UTF16CHAR suzDomain[MAX_DOMAIN_SIZE_16];
  UCHAR8    szInLabel[MAX_LABEL_SIZE_8];
  UTF16CHAR suzOutLabel[MAX_LABEL_SIZE_16];
  int lindex = 0;
  int dindex = 0;
  int iOutputSize;
  int delimiterPresent;
  /* Basic input validity checks and buffer length checks */
  if ( pzInputString == 0 || iInputSize <= 0 ) return XCODE_BAD_ARGUMENT_ERROR;
  if ( puzOutputString == 0 || *piOutputSize <= 0 ) return XCODE_BAD_ARGUMENT_ERROR;
  if ( iInputSize > MAX_DOMAIN_SIZE_8 ) return XCODE_BUFFER_OVERFLOW_ERROR;
  if ( *piOutputSize < MAX_DOMAIN_SIZE_16 ) return XCODE_BUFFER_OVERFLOW_ERROR;
  for ( i = 0; i < iInputSize; i++ )
  {
    delimiterPresent = 0;
    /* www.encoded.com */
    if ( *(pzInputString+i) == LABEL_DELIMITER )
    {
      delimiterPresent = 1;
    } else {
      szInLabel[lindex] = *(pzInputString+i);
      lindex++;
    }
    if ( i == iInputSize - 1 || delimiterPresent == 1 )
    {
      /* encode the label and save the result in domain */
      szInLabel[lindex] = 0;

      iOutputSize = MAX_LABEL_SIZE_16;
      if ( Xcode_ToUnicode8( szInLabel, lindex, suzOutLabel, &iOutputSize ) == XCODE_SUCCESS )
      {
        if ( dindex + iOutputSize > MAX_DOMAIN_SIZE_16 ) return XCODE_BUFFER_OVERFLOW_ERROR;
        memcpy( &suzDomain[dindex], suzOutLabel, iOutputSize*2 );
        dindex = dindex + iOutputSize;
      }
      lindex = 0;
      if ( delimiterPresent == 1 )
      {
        suzDomain[dindex] = LABEL_DELIMITER;
        dindex++;
      }
      continue;
    }
  }

  memcpy( puzOutputString, suzDomain, dindex*2 );
  *piOutputSize = dindex;
  puzOutputString[dindex] = 0;
  return XCODE_SUCCESS;
}
int Xcode_DomainToUnicode16( const UTF16CHAR *  puzInputString,
                             int                iInputSize,
                             UTF16CHAR *        puzOutputString,
                             int *              piOutputSize )
{
  int i;
  UTF16CHAR suzDomain[MAX_DOMAIN_SIZE_16];
  UTF16CHAR suzInLabel[MAX_LABEL_SIZE_8];
  UTF16CHAR suzOutLabel[MAX_LABEL_SIZE_16];
  int lindex = 0;
  int dindex = 0;
  int iOutputSize;
  int delimiterPresent;
  /* Basic input validity checks and buffer length checks */
  if ( puzInputString == 0 || iInputSize <= 0 ) return XCODE_BAD_ARGUMENT_ERROR;
  if ( puzOutputString == 0 || *piOutputSize <= 0 ) return XCODE_BAD_ARGUMENT_ERROR;
  if ( iInputSize > MAX_DOMAIN_SIZE_16 ) return XCODE_BUFFER_OVERFLOW_ERROR;
  if ( *piOutputSize < MAX_DOMAIN_SIZE_16 ) return XCODE_BUFFER_OVERFLOW_ERROR;
  for ( i = 0; i < iInputSize; i++ )
  {
    delimiterPresent = 0;
    if ( Xcode_IsIDNADomainDelimiter( puzInputString+i ) )
    {
      delimiterPresent = 1;
    } else {
      suzInLabel[lindex] = *(puzInputString+i);
      lindex++;
    }
    if ( i == iInputSize - 1 || delimiterPresent == 1 )
    {
      /* encode the label and save the result in domain */
      suzInLabel[lindex] = 0;

      iOutputSize = MAX_LABEL_SIZE_16;
      if ( Xcode_ToUnicode16( suzInLabel, lindex, suzOutLabel, &iOutputSize ) == XCODE_SUCCESS )
      {
        if ( dindex + iOutputSize > MAX_DOMAIN_SIZE_16 ) return XCODE_BUFFER_OVERFLOW_ERROR;
        memcpy( &suzDomain[dindex], suzOutLabel, iOutputSize*2 );
        dindex = dindex + iOutputSize;
      }
      lindex = 0;
      if ( delimiterPresent == 1 )
      {
        suzDomain[dindex] = LABEL_DELIMITER;
        dindex++;
      }
      continue;
    }
  }

  memcpy( puzOutputString, suzDomain, dindex*2 );
  *piOutputSize = dindex;
  puzOutputString[dindex] = 0;
  return XCODE_SUCCESS;
}
