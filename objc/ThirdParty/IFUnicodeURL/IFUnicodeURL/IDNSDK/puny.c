/*
 * Copyright 2018 Twitter, Inc.
 * Licensed under the Apache License, Version 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 */
/*************************************************************************/
/*                                                                       */
/* puny                                                                  */
/*                                                                       */
/* Routines which handle encoding strings using punycode.                */
/*                                                                       */
/* (c) Verisign Inc., 2000-2002, All rights reserved                     */
/*                                                                       */
/*************************************************************************/

#include "puny.h"
#include "race.h"
#include "xcode.h"
#include "util.h"

/* Prototypes */

int is_all_basic(DWORD input_length, const DWORD input[]);
int punycode_encode( unsigned int input_length,
                    const DWORD input[],
                    unsigned int *output_length,
                    char output[] );
int punycode_decode( unsigned int input_length,
                    const char input[],
                    unsigned int *output_length,
                    DWORD output[] );

/*** Bootstring parameters for AMC-ACE-Z ***/

enum { base = 36, tmin = 1, tmax = 26, skew = 38, damp = 700,
       initial_bias = 72, initial_n = 0x80, delimiter = 0x2D };

/*
** basic(cp) tests whether cp is a basic code point:
*/

#define basic(cp) ((DWORD)(cp) < 0x80)

/*
** delim(cp) tests whether cp is a delimiter:
*/

#define delim(cp) ((cp) == delimiter)

/*** Useful constants ***/

/*
** maxint is the maximum value of an DWORD variable:
*/

static const DWORD maxint = -1;

/*
** lobase and cutoff are used in the calculation of bias:
*/

enum { lobase = base - tmin, cutoff = lobase * tmax / 2 };

/*
** decode_digit(cp) returns the numeric value of a basic code
** point (for use in representing integers) in the range 0 to
** base-1, or base if cp is does not represent a value.
*/

static DWORD decode_digit(DWORD cp) 
{
  return  cp - 48 < 10 ? cp - 22 :  cp - 65 < 26 ? cp - 65 :
          cp - 97 < 26 ? cp - 97 :  base;
}

/*
** encode_digit(d,flag) returns the basic code point whose value
** (when used for representing integers) is d, which must be in the
** range 0 to base-1.  The lowercase form is used unless flag is
** nonzero, in which case the uppercase form is used.  The behavior
** is undefined if flag is nonzero and digit d has no uppercase form.
*/

static char encode_digit(DWORD d, int flag)
{
  return (char)(d + 22 + 75 * (d < 26) - ((flag != 0) << 5));
  /*  0..25 map to ASCII a..z or A..Z */
  /* 26..35 map to ASCII 0..9         */
}


/*
** Checks if the string contains all basic code points
** returns 1 if all basic otherwise 0
*/

int is_all_basic(DWORD input_length, const DWORD input[])
{
  int j;
  for(j = 0; j < (int)input_length; j++)
  {
    if (basic(input[j])) 
    {
      continue;
    } else {
      return 0;
    }
  }

  return 1;
}


/*** Main encode function ***/

int punycode_encode( unsigned int input_length,
                     const DWORD input[],
                     unsigned int *output_length,
                     char output[] )
{
  DWORD n, delta, h, b, out, max_out, bias, j, m, q, k, t;

  /* Initialize the state: */

  n = initial_n;
  delta = out = 0;
  max_out = *output_length;
  bias = initial_bias;

  /* Handle the basic code points: */

  for (j = 0;  j < input_length;  ++j) 
  {
    if ( basic( input[j] ) ) 
    {
      if (max_out - out < 2) return XCODE_BAD_ARGUMENT_ERROR;
      output[out++] = (char)input[j];
    }
    /* else if (input[j] < n) return XCODE_BAD_ARGUMENT_ERROR; */
    /* (not needed for AMC-ACE-Z with unsigned code points) */
  }

  h = b = out;

  /* h is the number of code points that have been handled, b is the  */
  /* number of basic code points, and out is the number of characters */
  /* that have been output.                                           */

  if (b > 0) output[out++] = delimiter;

  /* Main encoding loop: */

  while (h < input_length) {
    /* All non-basic code points < n have been     */
    /* handled already.  Find the next larger one: */

    for (m = maxint, j = 0;  j < input_length;  ++j) {
      /* if (basic(input[j])) continue; */
      /* (not needed for AMC-ACE-Z) */
      if (input[j] >= n && input[j] < m) m = input[j];
    }

    /* Increase delta enough to advance the decoder's    */
    /* <n,i> state to <m,0>, but guard against overflow: */

    if (m - n > (maxint - delta) / (h + 1)) return XCODE_BUFFER_OVERFLOW_ERROR;
    delta += (m - n) * (h + 1);
    n = m;

    for (j = 0;  j < input_length;  ++j) {
      #if 0
      if (input[j] < n || basic(input[j])) {
        if (++delta == 0) return XCODE_BUFFER_OVERFLOW_ERROR;
      }
      #endif
      /* AMC-ACE-Z can use this simplified version instead: */
      if (input[j] < n && ++delta == 0) return XCODE_BUFFER_OVERFLOW_ERROR;

      if (input[j] == n) {
        /* Represent delta as a generalized variable-length integer: */

        for (q = delta, k = base;  ;  k += base) {
          if (out >= max_out) return XCODE_BAD_ARGUMENT_ERROR;
          t = k <= bias ? tmin : k - bias >= tmax ? tmax : k - bias;
          if (q < t) break;
          output[out++] = encode_digit(t + (q - t) % (base - t), 0);
          q = (q - t) / (base - t);
        }

        output[out++] =
          encode_digit(q, 0);

        /* Adapt the bias: */
        delta = h == b ? delta / damp : delta >> 1;
        delta += delta / (h + 1);
        for (bias = 0;  delta > cutoff;  bias += base) delta /= lobase;
        bias += (lobase + 1) * delta / (delta + skew);

        delta = 0;
        ++h;
      }
    }

      ++delta;
      ++n;
  }

  *output_length = (unsigned int) out;
  return XCODE_SUCCESS;
}


/*** Main decode function ***/


int punycode_decode( unsigned int input_length,
                     const char input[],
                     unsigned int *output_length,
                     DWORD output[] )
{
  DWORD n, out, i, max_out, bias, b, j,
                 in, oldi, w, k, delta, digit, t;

  /* Initialize the state: */

  n = initial_n;
  out = i = 0;
  max_out = *output_length;
  bias = initial_bias;

  /* Handle the basic code points:  Let b be the number of input code */
  /* points before the last delimiter, or 0 if there is none, then    */
  /* copy the first b code points to the output.                      */

  for (b = j = 0;  j < input_length;  ++j) if (delim(input[j])) b = j;
  if (b > max_out) return XCODE_BAD_ARGUMENT_ERROR;

  for (j = 0;  j < b;  ++j) {
    if (!basic(input[j])) return XCODE_BAD_ARGUMENT_ERROR;
    output[out++] = input[j];
  }

  /* Main decoding loop:  Start just after the last delimiter if any  */
  /* basic code points were copied; start at the beginning otherwise. */

  for (in = b > 0 ? b + 1 : 0;  in < input_length;  ++out) {

    /* in is the index of the next character to be consumed, and */
    /* out is the number of code points in the output array.     */

    /* Decode a generalized variable-length integer into delta,  */
    /* which gets added to i.  The overflow checking is easier   */
    /* if we increase i as we go, then subtract off its starting */
    /* value at the end to obtain delta.                         */

    for (oldi = i, w = 1, k = base;  ;  k += base) {
      if (in >= input_length) return XCODE_BAD_ARGUMENT_ERROR;
      digit = decode_digit(input[in++]);
      if (digit >= base) return XCODE_BAD_ARGUMENT_ERROR;
      if (digit > (maxint - i) / w) return XCODE_BUFFER_OVERFLOW_ERROR;
      i += digit * w;
      t = k <= bias ? tmin : k - bias >= tmax ? tmax : k - bias;
      if (digit < t) break;
      if (w > maxint / (base - t)) return XCODE_BUFFER_OVERFLOW_ERROR;
      w *= (base - t);
    }

    /* Adapt the bias: */
    delta = oldi == 0 ? i / damp : (i - oldi) >> 1;
    delta += delta / (out + 1);
    for (bias = 0;  delta > cutoff;  bias += base) delta /= lobase;
    bias += (lobase + 1) * delta / (delta + skew);

    /* i was supposed to wrap around from out+1 to 0,   */
    /* incrementing n each time, so we'll fix that now: */

    if (i / (out + 1) > maxint - n) return XCODE_BUFFER_OVERFLOW_ERROR;
    n += i / (out + 1);
    i %= (out + 1);

    /* Insert n at position i of the output: */

    /* not needed for AMC-ACE-Z: */
    /* if (decode_digit(n) <= base) return amc_ace_invalid_input; */
    if (out >= max_out) return XCODE_BAD_ARGUMENT_ERROR;

    memmove(output + i + 1, output + i, (out - i) * sizeof *output);
    output[i++] = n;
  }

  *output_length = (unsigned int) out;
  return XCODE_SUCCESS;
}


/********************************************************************************
 *                              Entry Point                                     *
 ********************************************************************************/

/*********************************************************************************
*
* int Xcode_puny_encodeString( const DWORD *  pdwzInputString,
*                              const int      iInputSize,
*                              UCHAR8 *       pzOutputString,
*                              int *          piOutputSize )
* 
*  Encode a label using Punycode encoding. Does basic codepoint check prior to 
*  encoding, also adds ACE tag to beginning of result where required.
*
*  Returns XCODE_SUCCESS if call was successful. Sets piOutputSize to the width
*  of the result.                                          
*
*  pdwzInputString - [in] 32-bit input string.
*  iInputSize      - [in] Length of incoming 32-bit string.
*  pzOutputString  - [in,out] 8-bit output character string buffer.
*  piOutputSize    - [in,out] Length of incoming 8-bit buffer, and contains
*                    length of resulting encoded string on exit.
*
**********************************************************************************/

int Xcode_puny_encodeString( const DWORD *  pdwzInputString,
                             const int      iInputSize,
                             UCHAR8 *       pzOutputString,
                             int *          piOutputSize )
{
  int status;
  int offset        = 0;
  int output_offset = 0;

  unsigned int punycode_input_length;
  DWORD punycode_input[MAX_LABEL_SIZE_32];

  unsigned int encoded_string_length;
  char encoded_string[MAX_LABEL_SIZE_8];

  if ( iInputSize < 1 || pzOutputString == 0 ) 
  {
    return XCODE_BAD_ARGUMENT_ERROR;
  }

  memset( pzOutputString, 0, *piOutputSize );

  if (iInputSize > MAX_LABEL_SIZE_32) 
  {
    return XCODE_BUFFER_OVERFLOW_ERROR;
  }

  /* copy the input to punycode input */

  punycode_input_length = 0;

  for( offset = 0; offset < iInputSize; offset++ ) 
  {
    punycode_input[offset] = pdwzInputString[offset];
    punycode_input_length++;
  }

  /* check if the input contains all basic code points
  if so just copy the input to output. no need to encode
  otherwise try to encode it */

  if( is_all_basic(punycode_input_length, punycode_input) == 1 ) 
  {
    /* copy the input to output */
    for (offset = 0; offset < (int)punycode_input_length; offset++)
    {
	    *(pzOutputString + offset) = (char)*(punycode_input + offset);
    }
    *piOutputSize = punycode_input_length;
    return XCODE_SUCCESS;
  }

  /* encode the input */

  encoded_string_length = MAX_LABEL_SIZE_8;

  status = punycode_encode(
    punycode_input_length,
    punycode_input,
    &encoded_string_length,
    encoded_string );

  /* check the status */

  if (status != XCODE_SUCCESS) 
  {
    return status;
  }

  /* copy the prefix and the encoded string to the output */

  if( ( strlen( ACE_PREFIX ) + encoded_string_length ) > MAX_LABEL_SIZE_8 ) 
  {
    return XCODE_BUFFER_OVERFLOW_ERROR;
  }

  output_offset = strlen(ACE_PREFIX);

  strncat( (char*)pzOutputString, ACE_PREFIX, strlen(ACE_PREFIX) );

  for ( offset = 0; offset < (int)encoded_string_length; offset++ )
  {
    *(pzOutputString + output_offset++) = *(encoded_string + offset);
  }

  *piOutputSize = strlen(ACE_PREFIX) + encoded_string_length;

  /* terminate the string */

  *(pzOutputString + output_offset) = '\0';

  return XCODE_SUCCESS;
}


/*********************************************************************************
*
* int Xcode_puny_decodeString( const UCHAR8 *     pzInputString,
*                              const int          iInputSize,
*                              UTF16CHAR *        puzOutputString,
*                              int *              piOutputSize )
* 
*  Decode a label using Punycode decoding. Checks for valid ACE label, 
*  and returns input string if not found. After decoding, returns result
*  in UTF16. 
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

int Xcode_puny_decodeString( const UCHAR8 *     pzInputString,
                             const int          iInputSize,
                             UTF16CHAR *        puzOutputString,
                             int *              piOutputSize )
{
  int status;
  int offset          = 0;
  int input_offset    = 0;
  int output_offset   = 0;

  unsigned int punycode_input_length, punycode_output_length;
  char punycode_input[MAX_LABEL_SIZE_8];
  DWORD punycode_output[MAX_LABEL_SIZE_32];

  if ( iInputSize < 1 ) {return XCODE_BAD_ARGUMENT_ERROR;}

  /* Make sure we have a punycode encoded label here, otherwise, just
  return the string untouched. */

  if ( !starts_with_ignore_case( pzInputString, iInputSize, (const unsigned char *)ACE_PREFIX, strlen(ACE_PREFIX) ) )
  {
    //punycode_input_length = 0;

    for( offset = 0; offset < iInputSize; offset++ ) 
    {
      if ( offset >= *piOutputSize ) return XCODE_BUFFER_OVERFLOW_ERROR;
      *(puzOutputString + offset) = (UTF16CHAR)pzInputString[offset];
    }
    *piOutputSize = iInputSize;
    return XCODE_SUCCESS;
  }

  /* copy the input to punycode input ignoring the prefix */

  input_offset = strlen(ACE_PREFIX);
  punycode_input_length = 0;

  for(offset = 0; input_offset < iInputSize; offset++, input_offset++) 
  {
    punycode_input[offset] = (char)pzInputString[input_offset];
    punycode_input_length++;
  }

  /* lowercase it */

  lower_case( (unsigned char *)punycode_input, punycode_input_length );

  punycode_output_length = MAX_LABEL_SIZE_32;

  /* decode the input */

  status = punycode_decode(punycode_input_length, punycode_input,
                            &punycode_output_length, punycode_output);

  /* check the status */

  if (status != XCODE_SUCCESS) { return status; }

  /* copy the punycode output to the output if there is room */

  output_offset = 0;

  if ((int)output_offset > *piOutputSize - (int)punycode_output_length)
  {
    return XCODE_BUFFER_OVERFLOW_ERROR;
  }

  /* Convert result to UTF16 */

  status = Xcode_convert32BitToUTF16( punycode_output, punycode_output_length, 
                                      puzOutputString, piOutputSize );

  if ( status != XCODE_SUCCESS ) return status;

  /* terminate the string */

  *(puzOutputString + *piOutputSize) = 0;

  return XCODE_SUCCESS;
}


