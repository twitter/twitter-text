/*
 * Copyright 2018 Twitter, Inc.
 * Licensed under the Apache License, Version 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 */
/*************************************************************************/
/*                                                                       */
/* util                                                                  */
/*                                                                       */
/* Various utility routines used throughout the library.                 */
/*                                                                       */
/* (c) Verisign Inc., 2000-2002, All rights reserved                     */
/*                                                                       */
/*************************************************************************/

#include "util.h"
#include <stdio.h>

/*
 * valid_dns_characterXX - Determine if the codepoint is valid dns char
 */

int valid_dns_character32(const DWORD c)
{
	if ( ( c == 0x002D ) ||
		( c >= 0x0030 && c <= 0x0039 ) ||
		( c >= 0x0041 && c <= 0x005A ) ||
	( c >= 0x0061 && c <= 0x007A ) )
	{
		return XCODE_TRUE;
	} else {
		return XCODE_FALSE;
	}
}

int valid_dns_character16(const UTF16CHAR c)
{
	if ( ( c == 0x002D ) ||
		( c >= 0x0030 && c <= 0x0039 ) ||
		( c >= 0x0041 && c <= 0x005A ) ||
	( c >= 0x0061 && c <= 0x007A ) )
	{
		return XCODE_TRUE;
	} else {
		return XCODE_FALSE;
	}
}

int valid_dns_character8(const UCHAR8 c)
{
	if ( ( c == 0x002D ) ||
		( c >= 0x0030 && c <= 0x0039 ) ||
		( c >= 0x0041 && c <= 0x005A ) ||
	( c >= 0x0061 && c <= 0x007A ) )
	{
		return XCODE_TRUE;
	} else {
		return XCODE_FALSE;
	}
}

/*
(a) Verify the absence of non-LDH ASCII code points; that is, the
absence of 0..2C, 2E..2F, 3A..40, 5B..60, and 7B..7F.
 */

int is_ldh_character32(const DWORD c)
{
	if ( ( c <= 0x002C ) ||
		( c == 0x002E || c == 0x002F ) ||
		( c >= 0x003A && c <= 0x0040 ) ||
		( c >= 0x005B && c <= 0x0060 ) ||
	( c >= 0x007B && c <= 0x007F ) )
	{
		return XCODE_TRUE;
	} else {
		return XCODE_FALSE;
	}
}


/*
http://www.ietf.org/rfc/rfc2781.txt

-  Characters with values less than 0x10000 are represented as a
single 16-bit integer with a value equal to that of the character
number.

-  Characters with values between 0x10000 and 0x10FFFF are
represented by a 16-bit integer with a value between 0xD800 and
0xDBFF (within the so-called high-half zone or high surrogate
area) followed by a 16-bit integer with a value between 0xDC00 and
0xDFFF (within the so-called low-half zone or low surrogate area).

-  Characters with values greater than 0x10FFFF cannot be encoded in
UTF-16.

2.1 Encoding UTF-16

Encoding of a single character from an ISO 10646 character value to
UTF-16 proceeds as follows. Let U be the character number, no greater
than 0x10FFFF.

1) If U < 0x10000, encode U as a 16-bit unsigned integer and
terminate.

2) Let U' = U - 0x10000. Because U is less than or equal to 0x10FFFF,
U' must be less than or equal to 0xFFFFF. That is, U' can be
represented in 20 bits.

3) Initialize two 16-bit unsigned integers, W1 and W2, to 0xD800 and
0xDC00, respectively. These integers each have 10 bits free to
encode the character value, for a total of 20 bits.

4) Assign the 10 high-order bits of the 20-bit U' to the 10 low-order
bits of W1 and the 10 low-order bits of U' to the 10 low-order
bits of W2. Terminate.
1111111111011011
Graphically, steps 2 through 4 look like:
U' = yyyyyyyyyyxxxxxxxxxx
W1 = 110110yyyyyyyyyy
W2 = 110111xxxxxxxxxx

2.2 Decoding UTF-16

Decoding of a single character from UTF-16 to an ISO 10646 character
value proceeds as follows. Let W1 be the next 16-bit integer in the
sequence of integers representing the text. Let W2 be the (eventual)
next integer following W1.

1) If W1 < 0xD800 or W1 > 0xDFFF, the character value U is the value
of W1. Terminate.

2) Determine if W1 is between 0xD800 and 0xDBFF. If not, the sequence
is in error and no valid character can be obtained using W1.
Terminate.

3) If there is no W2 (that is, the sequence ends with W1), or if W2
is not between 0xDC00 and 0xDFFF, the sequence is in error.
Terminate.

4) Construct a 20-bit unsigned integer U', taking the 10 low-order
bits of W1 as its 10 high-order bits and the 10 low-order bits of
W2 as its 10 low-order bits.

5) Add 0x10000 to U' to obtain the character value U. Terminate.

Note that steps 2 and 3 indicate errors. Error recovery is not
specified by this document. When terminating with an error in steps 2
and 3, it may be wise to set U to the value of W1 to help the caller
diagnose the error and not lose information. Also note that a string
decoding algorithm, as opposed to the single-character decoding
described above, need not terminate upon detection of an error, if
proper error reporting and/or recovery is provided.
 */

#define UNI_SUR_HIGH_START	(UTF16CHAR)0xD800
#define UNI_SUR_HIGH_END	(UTF16CHAR)0xDBFF
#define UNI_SUR_LOW_START	(UTF16CHAR)0xDC00
#define UNI_SUR_LOW_END		(UTF16CHAR)0xDFFF

/* Some fundamental constants */
#define UNI_REPLACEMENT_CHAR  (DWORD)0x0000FFFD
#define UNI_MAX_BMP           (DWORD)0x0000FFFF
#define UNI_MAX_UTF16         (DWORD)0x0010FFFF
#define UNI_MAX_UTF32         (DWORD)0x7FFFFFFF

/*********************************************************************************
 *
 * int Xcode_convert32BitToUTF16( const DWORD * pdwzInput, int iInputLength,
 *                                UTF16CHAR * puzResult, int * piResultLength )
 *
 *  Converts incoming 32 bit string to UTF16 character string.
 *
 *  Returns XCODE_SUCCESS if successful, or an XCODE error constant on failure.
 *
 *  pdwzInput      - Pointer to the 32 bit input string
 *  iInputLength   - Length of the incoming string, not including terminating
 *                   null character.
 *  puzResult      - Pointer to the UTF16 result string
 *  piResultLength - Set to the result string length. Must contain the length
 *                   of the incoming buffer when called.
 *
 **********************************************************************************/

int Xcode_convert32BitToUTF16( const DWORD * pdwzInput, int iInputLength,
UTF16CHAR * puzResult, int * piResultLength )
{
	int i;
	int outlen = 0;
	const DWORD * source = pdwzInput;
	UTF16CHAR * target = puzResult;

	for ( i = 0; i < iInputLength; i++ )
	{
		DWORD ch;
		if ( target >= ( puzResult + *piResultLength ) )
		{
			/* not enough output buffer space */
			return XCODE_BUFFER_OVERFLOW_ERROR;
		}

		ch = *source++;

		/* Target is a character < 0x10000 */
		if ( ch <= UNI_MAX_BMP )
		{
			if ( ch >= UNI_SUR_HIGH_START && ch <= UNI_SUR_LOW_END )
			{
				return XCODE_UTIL_UTF16ENCODEERROR;
			} else {
				/* just copy it over */
				*target++ = (UTF16CHAR)ch;
				outlen++;
			}
		} else if ( ch > UNI_MAX_UTF16 )
		{
			return XCODE_UTIL_UTF16ENCODEERROR;
		} else {
			/* target is a character in range 0xFFFF - 0x10FFFF. */
			if ( target + 1 >= ( puzResult + *piResultLength ) )
			{
				return XCODE_BUFFER_OVERFLOW_ERROR;
			}
			ch -= 0x0010000UL;
			*target++ = ((UTF16CHAR)( ch >> 10 )) + (UTF16CHAR)0xD800;
			*target++ = ((UTF16CHAR)( ch & 0x3FF )) + (UTF16CHAR)0xDC00;
			outlen++;
			outlen++;
		}
	}

	*piResultLength = outlen;

	return XCODE_SUCCESS;
}

/*********************************************************************************
 *
 * int Xcode_convertUTF16To32Bit( const UTF16CHAR * puInput, int iInputLength,
 *                                DWORD * pdwResult, int * piResultLength )
 *
 *  Converts incoming UTF16 encoded string to internal, 32 bit character string
 *  used in applying namneprep 11. BOM characters are not detected,
 *
 *  Returns XCODE_SUCCESS if successful, or an XCODE error constant on failure.
 *
 *  pdwInput       - Pointer to the UTF16 input string
 *  iInputLength   - Length of the incoming string, not including terminating
 *                   null character.
 *  pdwResult      - Pointer to the 32 bit result string
 *  piResultLength - 32 bit output string result length. Must contain the length
 *                   of the incoming buffer.
 *
 **********************************************************************************/

int Xcode_convertUTF16To32Bit( const UTF16CHAR * puInput, int iInputLength,
DWORD * pdwResult, int * piResultLength )
{
	int i;
	int outlen = 0;
	DWORD ch, ch2;

	if ( puInput == 0 ) return XCODE_BAD_ARGUMENT_ERROR;
	if ( pdwResult == 0 ) return XCODE_BAD_ARGUMENT_ERROR;
	if ( piResultLength == 0 ) return XCODE_BAD_ARGUMENT_ERROR;

	for ( i = 0; i < iInputLength; i++ )
	{
		ch = *(puInput+i);

		if ( ch >= UNI_SUR_HIGH_START && ch <= UNI_SUR_HIGH_END && (puInput+i) < (puInput+iInputLength) )
		{
			ch2 = *(puInput+i+1);

			if ( ch2 >= UNI_SUR_LOW_START && ch2 <= UNI_SUR_LOW_END )
			{
				ch = ( ( ch - (UTF16CHAR)0xD800 ) << 10 );
				ch = ch + ( ch2 - (UTF16CHAR)0xDC00 ) + 0x0010000UL;
				++i;
			} else {
				/* it's an unpaired high surrogate */
				return XCODE_UTIL_UTF16DECODEERROR;
			}
		} else if ( ch >= UNI_SUR_LOW_START && ch <= UNI_SUR_LOW_END )
		{
			/* an unpaired low surrogate */
			return XCODE_UTIL_UTF16DECODEERROR;
		}

		if ( pdwResult >= ( pdwResult + *piResultLength ) )
		{
			/* not enough output buffer space */
			return XCODE_BUFFER_OVERFLOW_ERROR;
		}

		*pdwResult++ = ch;
		outlen++;

	}

	*piResultLength = outlen;
	return XCODE_SUCCESS;
}

/*

http://www.ietf.org/rfc/rfc2279.txt

2.  UTF-8 definition

In UTF-8, characters are encoded using sequences of 1 to 6 octets.
The only octet of a "sequence" of one has the higher-order bit set to
0, the remaining 7 bits being used to encode the character value. In
a sequence of n octets, n>1, the initial octet has the n higher-order
bits set to 1, followed by a bit set to 0.  The remaining bit(s) of
that octet contain bits from the value of the character to be
encoded.  The following octet(s) all have the higher-order bit set to
1 and the following bit set to 0, leaving 6 bits in each to contain
bits from the character to be encoded.

The table below summarizes the format of these different octet types.
The letter x indicates bits available for encoding bits of the UCS-4
character value.

UCS-4 range (hex.)           UTF-8 octet sequence (binary)
0000 0000-0000 007F   0xxxxxxx
0000 0080-0000 07FF   110xxxxx 10xxxxxx
0000 0800-0000 FFFF   1110xxxx 10xxxxxx 10xxxxxx

0001 0000-001F FFFF   11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
0020 0000-03FF FFFF   111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
0400 0000-7FFF FFFF   1111110x 10xxxxxx ... 10xxxxxx

Encoding from UCS-4 to UTF-8 proceeds as follows:

1) Determine the number of octets required from the character value
and the first column of the table above.  It is important to note
that the rows of the table are mutually exclusive, i.e. there is
only one valid way to encode a given UCS-4 character.

2) Prepare the high-order bits of the octets as per the second column
of the table.

3) Fill in the bits marked x from the bits of the character value,
starting from the lower-order bits of the character value and
putting them first in the last octet of the sequence, then the
next to last, etc. until all x bits are filled in.

The algorithm for encoding UCS-2 (or Unicode) to UTF-8 can be
obtained from the above, in principle, by simply extending each
UCS-2 character with two zero-valued octets.  However, pairs of
UCS-2 values between D800 and DFFF (surrogate pairs in Unicode
parlance), being actually UCS-4 characters transformed through
UTF-16, need special treatment: the UTF-16 transformation must be
undone, yielding a UCS-4 character that is then transformed as
above.

Decoding from UTF-8 to UCS-4 proceeds as follows:

1) Initialize the 4 octets of the UCS-4 character with all bits set
to 0.

2) Determine which bits encode the character value from the number of
octets in the sequence and the second column of the table above
(the bits marked x).

3) Distribute the bits from the sequence to the UCS-4 character,
first the lower-order bits from the last octet of the sequence and
proceeding to the left until no x bits are left.

If the UTF-8 sequence is no more than three octets long, decoding
can proceed directly to UCS-2.

NOTE -- actual implementations of the decoding algorithm above
should protect against decoding invalid sequences.  For
instance, a naive implementation may (wrongly) decode the
invalid UTF-8 sequence C0 80 into the character U+0000, which
may have security consequences and/or cause other problems.  See
the Security Considerations section below.

A more detailed algorithm and formulae can be found in [FSS_UTF],
[UNICODE] or Annex R to [ISO-10646].

 */

/*********************************************************************************
 *
 * int Xcode_convertUTF16ToUTF8( const UTF16CHAR * puzInput, int iInputLength,
 *                               UCHAR8 * pszResult, int * piResultLength )
 *
 *  Converts incoming UTF16 string to UTF8 string.
 *
 *  Returns XCODE_SUCCESS if successful, or an XCODE error constant on
 *  failure.
 *
 *  puzInput       - [in] UTF16 input string.
 *  iInputLength   - [in] Length of input string.
 *  pszResult      - [in,out] UTF8 output string.
 *  piResultLength - [in,out] On input, contains length of UTF16 input
 *                   buffer. On output, set to length of output string.
 *
 **********************************************************************************/

int Xcode_convertUTF16ToUTF8( const UTF16CHAR * puzInput, int iInputLength,
UCHAR8 * pszResult, int * piResultLength )
{
	int input_offset = 0;
	int output_offset = 0;
	UTF16CHAR uchar, high = 0x0000;
	UCHAR8 temp, u;

	if (iInputLength < 1) {return XCODE_BAD_ARGUMENT_ERROR;}

	while ((int)input_offset < iInputLength)
	{
		uchar = *(puzInput+input_offset++);

		/* Low surrogate */
		if (uchar >= 0xdc00 && uchar <= 0xdfff)
		{
			if (high)
			{
				if (output_offset > (*piResultLength) - 4) {return XCODE_BUFFER_OVERFLOW_ERROR;}
				u = ((high & 0x03c0) >> 6) + 1;
				temp = 0xf0 | (u >> 2);
				*(pszResult+output_offset++) = temp;
				temp = 0x80 | (UCHAR8)((u & 0x03) << 4) | (UCHAR8)((high & 0x003c) >> 2);
				*(pszResult+output_offset++) = temp;
				temp = 0x80 | (UCHAR8)((high & 0x0003) << 4) | (UCHAR8)((uchar & 0x03c0) >> 6);
				*(pszResult+output_offset++) = temp;
				temp = 0x80 | (uchar & 0x003f);
				*(pszResult+output_offset++) = temp;
				high = 0x0000;
				continue;
			} else {
				return XCODE_UTIL_LONELY_LOW_SURROGATE;
			}
		}

		if (high) {return XCODE_UTIL_LONELY_HIGH_SURROGATE;}

		/* High surrogate */
		if (uchar >= 0xd800 && uchar <= 0xdbff)
		{
			high = uchar;
			continue;
		}

		if (uchar < 0x0080)
		{
			if (output_offset > (*piResultLength) - 1) {return XCODE_BUFFER_OVERFLOW_ERROR;}
			*(pszResult+output_offset++) = (UCHAR8)uchar;
			continue;
		}

		if (uchar < 0x0800)
		{
			if (output_offset > (*piResultLength) - 2) {return XCODE_BUFFER_OVERFLOW_ERROR;}
			temp = 0xc0 | ((uchar & 0x07c0) >> 6);
			*(pszResult+output_offset++) = temp;
			temp = 0x80 | (uchar & 0x003f);
			*(pszResult+output_offset++) = temp;
			continue;
		}

		if (uchar <= 0xfffd)
		{
			if (output_offset > (*piResultLength) - 3) {return XCODE_BUFFER_OVERFLOW_ERROR;}
			temp = 0xe0 | ((uchar & 0xf000) >> 12);
			*(pszResult+output_offset++) = temp;
			temp = 0x80 | ((uchar & 0x0fc0) >> 6);
			*(pszResult+output_offset++) = temp;
			temp = 0x80 | (uchar & 0x003f);
			*(pszResult+output_offset++) = temp;
			continue;
		}

		/* fffe and ffff are prohibited for some reason? */
		//if (uchar <= 0xffff) { return XCODE_UTIL_INVALID_INPUT_VALUE; }

		return XCODE_UTIL_INVALID_16BIT_INPUT;
	}

	if (high) {return XCODE_UTIL_LONELY_HIGH_SURROGATE;}

	*piResultLength = output_offset;

	return XCODE_SUCCESS;
}

/*********************************************************************************
 *
 * int Xcode_convertUTF8ToUTF16( const UTF16CHAR * puzInput, int iInputLength,
 *                               UCHAR8 * pszResult, int * piResultLength )
 *
 *  Converts incoming UTF16 string to UTF8 string.
 *
 *  Returns XCODE_SUCCESS if successful, or an XCODE error constant on
 *  failure.
 *
 *  pszInput       - [in] UTF8 input string.
 *  iInputLength   - [in] Length of input string.
 *  puzResult      - [in,out] UTF16 output string.
 *  piResultLength - [in,out] On input, contains length of UTF16 input
 *                   buffer. On output, set to length of output string.
 *
 **********************************************************************************/

int Xcode_convertUTF8ToUTF16( const UCHAR8 *    pszInput,
	int               iInputLength,
	UTF16CHAR *       puzResult,
int *             piResultLength )
{
	int input_offset = 0;
	int output_offset = 0;
	UCHAR8 o1,o2,o3,o4,u;
	UTF16CHAR temp;

	if (iInputLength < 1) {return XCODE_BAD_ARGUMENT_ERROR;}

	while (input_offset < iInputLength)
	{
		o1 = *(pszInput+input_offset++);

		if (o1 <= 0x7f)
		{
			if (output_offset > (*piResultLength) - 1) {return XCODE_BUFFER_OVERFLOW_ERROR;}
			*(puzResult+output_offset++) = (UTF16CHAR)o1;
			continue;
		}

		if (o1 <= 0xbf) {return XCODE_UTIL_INVALID_BYTE_ORDER;}

		if (o1 <= 0xdf)
		{
			if (output_offset > (*piResultLength) - 1) {return XCODE_BUFFER_OVERFLOW_ERROR;}
			if ((input_offset + 1) > iInputLength) {return XCODE_UTIL_INPUT_UNDERFLOW;}

			o2 = *(pszInput+input_offset++);
			if (o2 < 0x80 || o2 > 0xbf) {return XCODE_UTIL_INVALID_BYTE_ORDER;}

			temp = (UTF16CHAR)((o1 & 0x1f) << 6) | (o2 & 0x3f);
			if (temp < 0x0080) {return XCODE_UTIL_INVALID_CONVERTED_VALUE;}

			*(puzResult+output_offset++) = temp;

			continue;
		}

		if (o1 <= 0xef)
		{
			if (output_offset > (*piResultLength) - 1) {return XCODE_BUFFER_OVERFLOW_ERROR;}
			if ((input_offset + 2) > iInputLength) {return XCODE_UTIL_INPUT_UNDERFLOW;}

			o2 = *(pszInput+input_offset++);
			if (o2 < 0x80 || o2 > 0xbf) {return XCODE_UTIL_INVALID_BYTE_ORDER;}
			o3 = *(pszInput+input_offset++);
			if (o3 < 0x80 || o3 > 0xbf) {return XCODE_UTIL_INVALID_BYTE_ORDER;}

			temp = (UTF16CHAR)((o1 & 0x0f) << 12) | (UTF16CHAR)((o2 & 0x3f) << 6) | (o3 & 0x3f);
			if (temp < 0x0800) {return XCODE_UTIL_INVALID_CONVERTED_VALUE;}

			/*
			 *	if (temp >= 0xd800 && temp <= 0xdfff) {
				*   return XCODE_UTIL_INVALID_CONVERTED_SURROGATE;
			 * }
			 *
			 * We used to throw an exception when decoding ANY surrogate using this
			 * method.  In order to match the java implementation, this has changed so
			 * that now we only throw an exception for a high surrogate [d800-dbff].  Low
			 * surrogates are just as invalid in this case, but java has chosen to be
			 * permissive in these cases, so we will follow suit.
			 */

			if (temp >= 0xd800 && temp <= 0xdbff) {
				return XCODE_UTIL_INVALID_CONVERTED_SURROGATE;
			}

			*(puzResult+output_offset++) = temp;

			continue;
		}

		if (o1 <= 0xf7)
		{
			if (output_offset > (*piResultLength) - 2) {return XCODE_BUFFER_OVERFLOW_ERROR;}
			if ((input_offset + 3) > iInputLength) {return XCODE_UTIL_INPUT_UNDERFLOW;}

			o2 = *(pszInput+input_offset++);
			if (o2 < 0x80 || o2 > 0xbf) {return XCODE_UTIL_INVALID_BYTE_ORDER;}
			o3 = *(pszInput+input_offset++);
			if (o3 < 0x80 || o3 > 0xbf) {return XCODE_UTIL_INVALID_BYTE_ORDER;}
			o4 = *(pszInput+input_offset++);
			if (o4 < 0x80 || o4 > 0xbf) {return XCODE_UTIL_INVALID_BYTE_ORDER;}

			u = (UCHAR8)((o1 & 0x07) << 2) | (UCHAR8)((o2 & 0x30) >> 4);
			if (u > 0x10 || u == 0x00) {return XCODE_UTIL_INVALID_U_VALUE;}

			temp = 0xd800 | (UTF16CHAR)((u-1) << 6) | (UTF16CHAR)((o2 & 0x0f) << 2) | (UTF16CHAR)((o3 & 0x30) >> 4);
			*(puzResult+output_offset++) = temp;

			temp = 0xdc00 | (UTF16CHAR)((o3 & 0x0f) << 6) | (o4 & 0x3f);
			*(puzResult+output_offset++) = temp;

			continue;
		}

		return XCODE_UTIL_INVALID_8BIT_INPUT;
	}

	*piResultLength = output_offset;

	return XCODE_SUCCESS;
}

/*
 * lower_case - Convert the char string to lowercase
 */

void lower_case(UCHAR8* string, const size_t string_size)
{
	int i;
	UCHAR8 o;
	for (i=0; i<(int)string_size; i++) {
		o = *(string+i);
		if (o >= 0x41 && o <= 0x5A) {*(string+i) += 0x20;}
	}
}


/*
 * starts_with_ignore_case - Determine whether the char string starts with the specified chars
 */

XcodeBoolean starts_with_ignore_case(const UCHAR8* string, const size_t string_size, const UCHAR8* prefix, const size_t prefix_size)
{
	int i;
	UCHAR8 string_octet, prefix_octet;
	short case_offset;

	if (string_size < prefix_size) {return XCODE_FALSE;}

	for (i=0; i<(int)prefix_size; i++)
	{
		case_offset = 0x00;
		string_octet = *(string+i);
		prefix_octet = *(prefix+i);
		if (prefix_octet >= 0x41 && prefix_octet <= 0x5A) { case_offset += 0x20; }
		if (prefix_octet >= 0x61 && prefix_octet <= 0x7A) { case_offset -= 0x20; }
		if ( string_octet!=prefix_octet && string_octet!=(prefix_octet+case_offset) ) {return XCODE_FALSE;}
	}
	return XCODE_TRUE;
}


/*
 * starts_with - Determine whether the char string starts with the specified chars
 */

XcodeBoolean starts_with(const UCHAR8* string, const size_t string_size, const UCHAR8* prefix, const size_t prefix_size)
{
	int i;
	if (string_size < prefix_size) {return XCODE_FALSE;}
	for (i=0; i<(int)prefix_size; i++) {
		if ( *(string+i) != *(prefix+i) ) {return XCODE_FALSE;}
	}
	return XCODE_TRUE;
}


/*
 * shrink_UChar_to_Octet - Copy a UChar string to a char string losing the high octets
 */

int shrink_UChar_to_Octet(const UTF16CHAR* unicode, const size_t unicode_size, UCHAR8* ace, size_t* ace_size)
{
	int i;
	for (i=0; i<(int)unicode_size; i++) {
		if ((UCHAR8)i == *ace_size) {return XCODE_BUFFER_OVERFLOW_ERROR;}
		*(ace+i) = (UCHAR8 )*(unicode+i);
	}
	*ace_size = unicode_size;
	return XCODE_SUCCESS;
}


/*
 * expand_Octet_to_UChar - Copy a char string to a UChar string adding the high octets
 */

int expand_Octet_to_UChar(const UCHAR8* ace, const size_t ace_size, UTF16CHAR* unicode, size_t* unicode_size)
{
	int i;
	for (i=0; i<(int)ace_size; i++) {
		if ((UTF16CHAR)i == *unicode_size) {return XCODE_BUFFER_OVERFLOW_ERROR;}
		*(unicode+i) = (UTF16CHAR)*(ace+i);
	}
	*unicode_size = ace_size;
	return XCODE_SUCCESS;
}

