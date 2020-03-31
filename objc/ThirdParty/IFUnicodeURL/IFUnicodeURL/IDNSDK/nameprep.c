/*
 * Copyright 2018 Twitter, Inc.
 * Licensed under the Apache License, Version 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 */
/*************************************************************************/
/*                                                                       */
/* nameprep                                                              */
/*                                                                       */
/* Routines which handle nameprep 11                                     */
/*                                                                       */
/* (c) Verisign Inc., 2000-2003, All rights reserved                     */
/*                                                                       */
/*************************************************************************/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "xcode.h"
#include "nameprep.h"
#include "util.h"

#include "staticdata/nameprep_data.h"

/* Hangul composition and decomposition constants. */

static const int SBase  = 0xAC00; 
static const int LBase  = 0x1100; 
static const int VBase  = 0x1161; 
static const int TBase  = 0x11A7;
static const int LCount = 19; 
static const int VCount = 21; 
static const int TCount = 28;
static const int NCount = 588;    /* VCount * TCount */
static const int SCount = 11172;  /* LCount * NCount */

/*
  2. Preparation Overview

     The steps for preparing strings are:

     1) Map -- For each character in the input, check if it has a mapping
        and, if so, replace it with its mapping.  This is described in
        section 3.

     2) Normalize -- Possibly normalize the result of step 1 using Unicode
        normalization.  This is described in section 4.

     3) Prohibit -- Check for any characters that are not allowed in the
        output.  If any are found, return an error.  This is described in
        section 5.

     4) Check bidi -- Possibly check for right-to-left characters, and if
        any are found, make sure that the whole string satisfies the
        requirements for bidirectional strings.  If the string does not
        satisfy the requirements for bidirectional strings, return an
        error.  This is described in section 6.
*/

/********************************************************************************
 *                             C O M M O N                                      *
 ********************************************************************************/

/*********************************************************************************
*
* void insert( DWORD * target, size_t * length, size_t offset, DWORD ch ) 
* 
*  Perform string insert.
*
*  target - The string into which the character will be inserted
*  length - The length in characters of the target string
*  offset - The index at which the new character goes
*  ch     - The character to insert
*
**********************************************************************************/

static void insert( DWORD * target, size_t * length, size_t offset, DWORD ch ) 
{
  int i;
  if ((int)offset < 0 || offset > *length) {return;}

  for (i=(int)(*length); i>(int)offset; i--) {target[i] = target[i-1];}

  target[offset] = ch;

  (*length)++;
}

/*********************************************************************************
*
* int dwstrlen( const DWORD * pdwBuf )
* 
*  32 bit character version of strlen. 
*
*  Returns length of the string.
*
*  pdwBuf - Pointer to the 32-bit string.
*
**********************************************************************************/

static int dwstrlen( const DWORD * pdwBuf )
{
  int index = 0;
  while ( *(pdwBuf + index) != 0 )
  {
    index++;
    if ( index > 10000 ) return 0;
  }
  return index;
}

/*********************************************************************************
*
* int dwstrncat( DWORD * pdwBuf, DWORD * pdwAdd, int len )
* 
*  32 bit character version of strcat. 
*
*  Returns length of the string.
*
*  pdwBuf - Pointer to the 32-bit string.
*  pdwAdd - Pointer to the 32-bit string to concatinate.
*  len    - Length of pdwAdd.
*
**********************************************************************************/

static int dwstrncat( DWORD * pdwBuf, DWORD * pdwAdd, int len )
{
  int index = 0;
  while ( *(pdwBuf + index) != 0 )
  {
    index++;
    if ( index > 10000 ) return 0;
  }

  memcpy( pdwBuf + index, pdwAdd, len * sizeof( DWORD ) );

  return index;
}


/*********************************************************************************
 *                           N O R M A L I Z E                                   *
 *********************************************************************************/

/*********************************************************************************
*
* int composeHangul( DWORD lastCh, DWORD ch, DWORD * out )
* 
*  Perform hangul composition on hangul characters found in a string and return 
*  the result.
*
*  Returns 1 if a hangul LV or LVT set was found and converted, 0 otherwise.
*
*  dwLastCh - The previous character in the string.
*  ch       - The target character.
*  pdwOut   - Pointer to resulting LV or LVT compose set.
*
**********************************************************************************/

static int composeHangul( DWORD dwLastCh, DWORD ch, DWORD * pdwOut ) 
{
  int SIndex;
  int LIndex;

  /* 1. check to see if two current characters are L and V */

  LIndex = (int)dwLastCh - LBase;

  if ( 0 <= LIndex && LIndex < LCount ) 
  {
    int VIndex = (int)ch - VBase;
    if ( 0 <= VIndex && VIndex < VCount ) 
    {

      /* make syllable of form LV */

      *pdwOut = (DWORD)(SBase + (LIndex * VCount + VIndex) * TCount);; 
      return 1;
    }
  }

  /* 2. check to see if two current characters are LV and T */

  SIndex = (int)dwLastCh - SBase;

  if ( 0 <= SIndex && SIndex < SCount && (SIndex % TCount) == 0 ) 
  {
    int TIndex = (int)ch - TBase;
    if (0 <= TIndex && TIndex <= TCount) 
    {

      /* make syllable of form LVT */

      *pdwOut = dwLastCh + TIndex;
      return 1;
    }
  }

  return 0;
}


/*********************************************************************************
*
* int decomposeHangul( DWORD ch, DWORD * pdwOut ) 
* 
*  Perform hangul decmposition on a character if it applies.
*
*  Returns 1 if a hangul LV or LVT set was found and converted, 0 otherwise.
*
*  ch -     The unicode character to be decomposed.
*  pdwOut - The resulting string buffer if decomposition was performed. Incoming 
*           buffer should be of length 5 characters or more.
*
**********************************************************************************/

static int decomposeHangul( DWORD ch, DWORD * pdwOut ) 
{
  int SIndex = (int)ch - SBase;
  int L;
  int V;
  int T;

  if ( SIndex < 0 || SIndex >= SCount ) 
  {
    return 0;
  }

  L = LBase + SIndex / NCount;
  V = VBase + (SIndex % NCount) / TCount;
  T = TBase + SIndex % TCount;
  
  *pdwOut = (DWORD)L; pdwOut++;
  *pdwOut = (DWORD)V; pdwOut++;

  *pdwOut = 0; 

  if (T != TBase)
  {
    *pdwOut = (DWORD)T;
  }
  else
  {
    /*
    * strictly speaking, this algorithm is correct without this else part.
    *
    * however, the one caller of this static function in this file uses an array
    * buffer of length 5, and the logic analyzer gets confused and emits a false
    * positive diagnostic that the 5th value in the buffer can end up being
    * uninitialized garbage if T == TBase.
    *
    * writing the NULL terminator here *unnecessarily* ... then continuing to
    * write "another" null terminator in position 5 below silences the analyzer
    * and is more efficient than pre-initializing the buffer with all NULLs.
    */
    *pdwOut = 0;
  }
  pdwOut++;

  *pdwOut = 0;

  return 1;
}


/*********************************************************************************
*
* void doDecomposition( int iRecursionCheck, int fCanonical, 
*                       DWORD ch, DWORD* outbuf )  
* 
*  Recursive decomposition for one character.
*
*  fCanonical - Boolean to indicate if only doing NFC (always 0)
*  ch         - The unicode character to be decomposed
*  outbuf     - The decomposed string
*
**********************************************************************************/

static void doDecomposition( int iRecursionCheck, int fCanonical, 
                             DWORD ch, DWORD * outbuf )  
{
  const DWORD* pDecomposeString;
  int i,len;
  int iDecompResult;
  DWORD /*iCompatValue,*/ iCompatResult;

  if (iRecursionCheck > 20)
    return;

  {
  
    /* Q: there will never be a compatible entry for hangul characters? 
       Q: Is recursion of resulting hangul string is needed?? We recurse to be sure anyway. */
  
    DWORD hangubuf[5];
  
    if ( decomposeHangul( ch, hangubuf ) )
    {
      len = dwstrlen( hangubuf );

      for (i=0; i < len; i++)
      {
        doDecomposition(iRecursionCheck+1, fCanonical, hangubuf[i], outbuf );
      }
      return;
    }
  }

  iDecompResult = lookup_decompose( ch, &pDecomposeString );

  iCompatResult = lookup_compatible(ch);
  //iCompatValue = ch;

  if (iDecompResult && !(fCanonical && iCompatResult))
  {
    len = dwstrlen( pDecomposeString );

    for (i=0; i < len; i++) 
    {
      doDecomposition(iRecursionCheck+1, fCanonical, pDecomposeString[i], outbuf);
    }

  } else { 
    dwstrncat(outbuf, &ch, 1); 
  }

}


/*********************************************************************************
*
* int doKCDecompose( const DWORD* input, size_t input_size, 
*                    DWORD* output, size_t* output_size ) 
* 
*  Applies form KC decompositionon a string.
*
*  input               - Input utf16 to be decomposed
*  input_size          - allocated size for input
*  output              - Already decomposed utf16 to be recomposed
*  output_size         - allocated size for output
*
**********************************************************************************/

static int doKCDecompose( const DWORD * input, int input_size, 
                          DWORD * output, int * output_size ) 
{

  int i, j;
  size_t cursor;
  DWORD buf[80];
  int buflen;
  DWORD ch;
  int cClass;
  size_t output_offset = 0;
  int nCanonicalItem;
 
  for (i=0; i < input_size; i++) 
  {

    if (input[i] == 0x0000) {return XCODE_NAMEPREP_NULL_CHARACTER_PRESENT;}

    memset(buf, '\0', sizeof(buf));

    doDecomposition(0, 0, input[i], buf);

    buflen = dwstrlen( buf );

    for (j = 0; j < buflen; j++) 
    {
      ch = buf[j];

      cClass = (int)lookup_canonical(ch);

      cursor = output_offset;

      if (cClass != 0) 
      {
        for (; cursor > 0; --cursor) 
        {
          nCanonicalItem = (int)lookup_canonical(output[cursor-1]);
          if (nCanonicalItem <= cClass) {break;}
        }
      }
      insert(output, &output_offset, cursor, ch);
    }
  }
  
  if ((int)output_offset > *output_size) {return XCODE_NAMEPREP_BUFFER_OVERFLOW_ERROR;}
  
  *output_size = (int)output_offset;
  
  return XCODE_SUCCESS; 
}

   
/*********************************************************************************
*
* int doKCCompose( DWORD* output, size_t* output_size ) 
* 
*  Applies form KC recomposition on a string.
*
*  output              - Already decomposed utf16 to be recomposed
*  output_size         - allocated size for output
*
**********************************************************************************/

static int doKCCompose( DWORD * output, int * output_size ) 
{
  DWORD startCh;
  QWORD qwPair;
  int lastClass;
  int decompPos;
  int startPos = 0;
  int compPos = 1;
  DWORD nComposeResult, nComposeItem;

  startCh = output[0];

  lastClass = (int)lookup_canonical(startCh);

  if ( lastClass != 0 ) 
  {
    lastClass = 256;
  }

  /* walk across the string */

  for (decompPos=1; decompPos < *output_size; decompPos++) 
  {
    int chClass;
    int composite;

    DWORD ch = output[decompPos];

    chClass = (int)lookup_canonical(ch);

    nComposeResult = composeHangul( startCh, ch, &nComposeItem );

    /* if not Hangul, check our lookup table */
    if ( !nComposeResult ) 
    {
      qwPair = startCh;
      qwPair = qwPair << 32;
      qwPair = qwPair | ch;
      nComposeResult = lookup_composite(qwPair, &nComposeItem);
    }

    if ( !nComposeResult ) 
    { 
      composite = 0xffff; /* 65535 */
    } else 
    {
      composite = (int)nComposeItem;
    }

    if (composite != 0xffff && (lastClass < chClass || lastClass == 0)) 
    {

      output[startPos] = (DWORD)composite;
      startCh = (DWORD)composite;

    } else {

      if (chClass == 0) 
      {
        startPos = compPos;
        startCh = ch;
      }

      lastClass = chClass;
      output[compPos++] = ch;
    }
  }

  if (compPos > *output_size) 
  {
    return XCODE_NAMEPREP_BUFFER_OVERFLOW_ERROR;
  }

  *output_size = compPos;

  return XCODE_SUCCESS;
}


/*********************************************************************************
*
* int Xcode_normalizeString( DWORD *  pdwInputString, int iInputSize,
*                            DWORD *  pdwOutputString, int * piOutputSize )
* 
*  Applies Normalization Form KC (NFKC) to an input string. Called by 
*  Xcode_nameprepString below.
*
*  Returns XCODE_SUCCESS if successful, or an XCODE error constant on failure.
*
*  pdwInputString  - 32-bit input string
*  iInputSize      - length of input string
*  pdwOutputString - 32 bit character mapped output string
*  piOutputSize    - length of output string
*
**********************************************************************************/

int Xcode_normalizeString( DWORD *  pdwInputString, int iInputSize,
                           DWORD *  pdwOutputString, int * piOutputSize )
{
  int return_code;
  int i;
  DWORD dwzTemp[256];
  int iTempSize = 256;

  memset( dwzTemp, 0, sizeof( dwzTemp ) );

  if ( iInputSize < 1 ) return XCODE_NAMEPREP_BAD_ARGUMENT_ERROR;

  /* decompose */
  
  return_code = doKCDecompose( pdwInputString, iInputSize, dwzTemp, &iTempSize );

  if ( return_code != XCODE_SUCCESS ) return return_code;

  /* compose */

  return_code = doKCCompose( dwzTemp, &iTempSize );

  if ( return_code != XCODE_SUCCESS ) return return_code;

  /* copy output */

  for ( i = 0; i < iTempSize; i++ ) 
  {
    pdwOutputString[i] = dwzTemp[i];
  }

  /* terminate the string */

  pdwOutputString[i] = 0;
  *piOutputSize = i;

  return XCODE_SUCCESS;
}

/*********************************************************************************
 *                               C H A R M A P                                   *
 *********************************************************************************/


/*********************************************************************************
*
* int Xcode_charmapString( DWORD *  pdwInputString, int iInputSize,
*                          DWORD *  pdwOutputString, int * piOutputSize ) 
* 
*  Applies character mapping to a string.
*
*  Returns XCODE_SUCCESS if successful, or an XCODE error constant on failure.
*
*  pdwInputString  - 32-bit input string
*  iInputSize      - length of input string
*  pdwOutputString - 32 bit character mapped output string
*  piOutputSize    - length of output string
*
**********************************************************************************/

int Xcode_charmapString( DWORD *  pdwInputString, int iInputSize,
                         DWORD *  pdwOutputString, int * piOutputSize ) 
{
  DWORD * pdwBlock;
  int len, i;
  int outputIndex = 0;

  *piOutputSize = 0;

  for ( i = 0; i < iInputSize; i++ )
  {
    len = lookup_charmap( *(pdwInputString+i), (const DWORD **)&pdwBlock );
    if ( len == -1 )
    {
      *(pdwOutputString + outputIndex) = *(pdwInputString+i);
      len = 1;
    } else {
      memcpy( pdwOutputString + outputIndex, pdwBlock, len * sizeof(DWORD) );
    }
    outputIndex += len;
  }

  *piOutputSize = outputIndex;

  if ( outputIndex == 0 ) return XCODE_NAMEPREP_MAPPEDOUT;

  return XCODE_SUCCESS;
}


/********************************************************************************
 *                              P R O H I B I T                                 *
 ********************************************************************************/


/*********************************************************************************
*
* int Xcode_prohibitString( DWORD * pdwInputString, int iInputSize,
*                           DWORD * pdwProhibitedChar, int * pbProhibitedFlag ) 
* 
*  Evaluates the codepoints in the input and determines if any are part of the 
*  nameprep prohibited list.
*
*  Returns XCODE_SUCCESS if no characters were prohibited. Returns 
*  XCODE_NAMEPREP_PROHIBITEDCHAR if a prohibited character was found and returns
*  the first prohibited character in pdwProhibitedChar.
*
*   pdwInputString    - The 32-bit input string.
*   iInputSize        - The size of the input string.
*   pdwProhibitedChar - Populated with the first prohibited codepoint.
*
**********************************************************************************/

int Xcode_prohibitString( DWORD * pdwInputString, int iInputSize,
                          DWORD * pdwProhibitedChar ) 
{
  int i;
	
  for ( i = 0; i <= iInputSize; i++ )
  {
	DWORD c = *(pdwInputString+i);
    /* outside the unicode range check */
    if ( c > 0x10FFFF ) return XCODE_NAMEPREP_OUTOFRANGEERROR;
    /* prohibit unicode list */
    if ( lookup_prohbited( c ) )
    {
      *pdwProhibitedChar = c;
      return XCODE_NAMEPREP_PROHIBITEDCHAR;
    }
  }
  return XCODE_SUCCESS;
}


/********************************************************************************
 *                                   B I D I                                    *
 ********************************************************************************/

/*
   From NAMEPREP:

   6. Bidirectional characters

      This profile specifies checking bidirectional strings as described in
      [STRINGPREP] section 6.

  From STRINGPREP:

  6. Bidirectional Characters

     Most characters are displayed from left to right, but some are
     displayed from right to left.  This feature of Unicode is called
     "bidirectional text", or "bidi" for short.  The Unicode standard has
     an extensive discussion of how to reorder glyphs for display when
     dealing with bidirectional text such as Arabic or Hebrew.  See [UAX9]
     for more information.  In particular, all Unicode text is stored in
     logical order.

     A profile MAY choose to ignore bidirectional text.  However, ignoring
     bidirectional text can cause display ambiguities.  For example, it is
     quite easy to create two different strings with the same characters
     (but in different order) that are correctly displayed identically.
     Therefore, in order to avoid most problems with ambiguous
     bidirectional text display, profile creators should strongly consider
     including the bidirectional character handling described in this
     section in their profile.

     The stringprep process never emits both an error and a string.  If an
     error is detected during the checking of bidirectional strings, only
     an error is returned.

     [Unicode3.2] defines several bidirectional categories; each character
     has one bidirectional category assigned to it.  For the purposes of
     the requirements below, an "RandALCat character" is a character that
     has Unicode bidirectional categories "R" or "AL"; an "LCat character"
     is a character that has Unicode bidirectional category "L".  Note
     that there are many characters which fall in neither of the above
     definitions; Latin digits (<U+0030> through <U+0039>) are examples of
     this because they have bidirectional category "EN".

     In any profile that specifies bidirectional character handling, all
     three of the following requirements MUST be met:

     1) The characters in section 5.8 MUST be prohibited.

     2) If a string contains any RandALCat character, the string MUST NOT
        contain any LCat character.

     3) If a string contains any RandALCat character, a RandALCat
        character MUST be the first character of the string, and a
        RandALCat character MUST be the last character of the string.

*/

/*********************************************************************************
*
* int Xcode_bidifilterString( DWORD * pdwInputString, int iInputSize )
* 
*  Apply bidi filtering to the input string.
*
*  Returns XCODE_SUCCESS if no characters were prohibited. Returns 
*  XCODE_NAMEPREP_BIDIERROR if a bidi filter failed.
*
*   pdwInputString    - The 32-bit input string.
*   iInputSize        - The size of the input string.
*
**********************************************************************************/

int Xcode_bidifilterString( DWORD * pdwInputString, int iInputSize )
{
  int i;
  int RandALCat = 0, intro = 0, exit = 0;

  /* look for RandALCat */

  for ( i = 0; i < iInputSize; i++ )
  {
    if ( lookup_bidi_randalcat( *(pdwInputString+i) ) )
    {
      RandALCat = 1;
      if ( i == 0 ) intro = 1;
      if ( i == iInputSize-1 ) exit = 1;
    }
  }

  /* if RandALCat, error on LCat or intro/exit compliance */

  if ( RandALCat )
  {
    if ( !intro || !exit ) return XCODE_NAMEPREP_FIRSTLAST_BIDIERROR;

    for ( i = 0; i <= iInputSize; i++ )
    {
      if ( lookup_bidi_lcat( *(pdwInputString+i) ) )
      {
        return XCODE_NAMEPREP_MIXED_BIDIERROR;
      }
    }
  }

  return XCODE_SUCCESS;
}


/********************************************************************************
 *                           N A M E P R E P   1 1                              *
 ********************************************************************************/

/*********************************************************************************
*
* int Xcode_nameprepString( const UTF16CHAR * puInputString, int iInputSize,
*                           DWORD * pdwOutputString, int * piOutputSize,
*                           DWORD * pdwProhibitedChar ) 
* 
*  Applies Nameprep 11 to a UTF16 encoded string. Returns a 32-bit prepped
*  string suitable for encoding.
*
*  Returns XCODE_SUCCESS if successful, or an XCODE error constant on failure.
*
*  puzInputString    - UTF16 input string
*  iInputSize        - length of input string
*  pdwOutputString   - 32 bit character mapped output string
*  piOutputSize      - length of output string
*  pdwProhibitedChar - Populated with the first prohibited codepoint.
*
**********************************************************************************/

int Xcode_nameprepString( const UTF16CHAR * puInputString, int iInputSize,
                          DWORD * pdwOutputString, int * piOutputSize,
                          DWORD * pdwProhibitedChar ) 
{
  int return_code;
  DWORD dwTemp[256];
  DWORD dwMapped[256];
  int iTempSize = 256;
  int iMappedSize = 256;

  memset( dwTemp, 0, sizeof( dwTemp ) );
  memset( dwMapped, 0, sizeof( dwMapped ) );

  *pdwProhibitedChar = 0;

  /* Input character string is UTF16, each character is 16 bits, type UTF16CHAR */

  return_code = Xcode_convertUTF16To32Bit( puInputString, iInputSize, dwTemp, &iTempSize );
  if ( return_code != XCODE_SUCCESS ) {return return_code;}

  return_code = Xcode_charmapString( dwTemp, iTempSize, dwMapped, &iMappedSize );
  if ( return_code != XCODE_SUCCESS ) {return return_code;}

  return_code = Xcode_normalizeString( dwMapped, iMappedSize, pdwOutputString, piOutputSize );
  if ( return_code != XCODE_SUCCESS ) {return return_code;}

  return_code = Xcode_prohibitString( pdwOutputString, *piOutputSize, pdwProhibitedChar );
  if ( return_code != XCODE_SUCCESS ) {return return_code;}

  return_code = Xcode_bidifilterString( pdwOutputString, *piOutputSize );
  if ( return_code != XCODE_SUCCESS ) {return return_code;}
	
  return XCODE_SUCCESS;
}

/*********************************************************************************
*
* int Xcode_nameprepString32( const DWORD * pdwzInputString, int iInputSize,
*                             DWORD * pdwOutputString, int * piOutputSize,
*                             DWORD * pdwProhibitedChar ) 
* 
*  Applies Nameprep 11 to a 32-bit expanded string. Returns a 32-bit prepped
*  string suitable for encoding. Primarily for testing the library with 32-bit
*  input datasets.
*
*  Returns XCODE_SUCCESS if successful, or an XCODE error constant on failure.
*
*  pdwzInputString   - 32-bit input string
*  iInputSize        - length of input string
*  pdwOutputString   - 32 bit character mapped output string
*  piOutputSize      - length of output string
*  pdwProhibitedChar - Populated with the first prohibited codepoint.
*
**********************************************************************************/

int Xcode_nameprepString32( const DWORD *       pdwInputString,
                            int                 iInputSize,
                            DWORD *             pdwOutputString,
                            int *               piOutputSize,
                            DWORD *             pdwProhibitedChar ) 
{
  int return_code;
  DWORD dwTemp[256];
  DWORD dwMapped[256];
  //int iTempSize = 256;
  int iMappedSize = 256;

  memset( dwTemp, 0, sizeof( dwTemp ) );
  memset( dwMapped, 0, sizeof( dwMapped ) );

  *pdwProhibitedChar = 0;

  return_code = Xcode_charmapString( (DWORD*)pdwInputString, iInputSize, dwMapped, &iMappedSize );

  if ( return_code != XCODE_SUCCESS ) {return return_code;}

  return_code = Xcode_normalizeString( dwMapped, iMappedSize, pdwOutputString, piOutputSize );

  if ( return_code != XCODE_SUCCESS ) {return return_code;}

  return_code = Xcode_prohibitString( pdwOutputString, *piOutputSize, pdwProhibitedChar );

  if ( return_code != XCODE_SUCCESS ) {return return_code;}

  return_code = Xcode_bidifilterString( pdwOutputString, *piOutputSize );

  if ( return_code != XCODE_SUCCESS ) {return return_code;}
  
  return XCODE_SUCCESS;
}
