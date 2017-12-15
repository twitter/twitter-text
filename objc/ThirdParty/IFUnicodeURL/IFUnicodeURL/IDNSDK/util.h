/*************************************************************************/
/*                                                                       */
/* util                                                                  */
/*                                                                       */
/* Various utility routines used within the library.                     */
/*                                                                       */
/* (c) Verisign Inc., 2000-2002, All rights reserved                     */
/*                                                                       */
/*************************************************************************/

#ifndef _XCODE_UTIL_H_
#define _XCODE_UTIL_H_

#include "xcode.h"

#ifdef __cplusplus
extern "C" 
{
#endif /* __cplusplus */

/*************************************************************************/
/*                                                                       */
/* <Error Codes>                                                         */
/*                                                                       */
/*  Library return constants. Return codes are within the interval       */
/*  0 - 999. Error values returned indicate the type of logic associated */
/*  with a particular error. Each component of the library has it's own  */
/*  block of error constants defined in the following header files:      */
/*                                                                       */
/*  Errors <= 20 - Indicates common library error.                       */
/*  Errors > 20  - Indicates a module specific error.                    */
/*                                                                       */
/*************************************************************************/

/* util specific */

#define XCODE_UTIL_UTF16DECODEERROR              0+UTIL_SPECIFIC
#define XCODE_UTIL_UTF16ENCODEERROR              1+UTIL_SPECIFIC
#define XCODE_UTIL_LONELY_LOW_SURROGATE          2+UTIL_SPECIFIC
#define XCODE_UTIL_LONELY_HIGH_SURROGATE         3+UTIL_SPECIFIC
#define XCODE_UTIL_INVALID_INPUT_VALUE           4+UTIL_SPECIFIC
#define XCODE_UTIL_INVALID_16BIT_INPUT           5+UTIL_SPECIFIC
#define XCODE_UTIL_INVALID_BYTE_ORDER            6+UTIL_SPECIFIC
#define XCODE_UTIL_INVALID_CONVERTED_VALUE       7+UTIL_SPECIFIC
#define XCODE_UTIL_INVALID_CONVERTED_SURROGATE   8+UTIL_SPECIFIC
#define XCODE_UTIL_INVALID_U_VALUE               9+UTIL_SPECIFIC
#define XCODE_UTIL_INVALID_8BIT_INPUT            10+UTIL_SPECIFIC
#define XCODE_UTIL_INPUT_UNDERFLOW               11+UTIL_SPECIFIC

/*************************************************************************/
/*                                                                       */
/* <Function>                                                            */
/*                                                                       */
/*  Xcode_convert32BitToUTF16                                            */
/*                                                                       */
/* <Description>                                                         */
/*                                                                       */
/*  Converts incoming UTF16 string to 32-bit character string.           */
/*                                                                       */
/*  Returns XCODE_SUCCESS if successful, or an XCODE error constant on   */
/*  failure.                                                             */
/*                                                                       */
/* <Parameters>                                                          */
/*                                                                       */
/*  puInput        - [in] UTF16 input string.                            */
/*                                                                       */
/*  iInputLength   - [in] Length of input string.                        */
/*                                                                       */
/*  pdwResult      - [in,out] 32-bit output string.                      */
/*                                                                       */
/*  piResultLength - [in,out] On input, contains length of UTF16 input   */
/*                   buffer. On output, set to length of output string.  */
/*                                                                       */
XCODE_EXPORTEDAPI 
int Xcode_convertUTF16To32Bit( const UTF16CHAR *  puInput, 
                               int                iInputLength, 
                               DWORD *            pdwResult, 
                               int *              piResultLength );
/*                                                                       */
/*************************************************************************/

/*************************************************************************/
/*                                                                       */
/* <Function>                                                            */
/*                                                                       */
/*  Xcode_convert32BitToUTF16                                            */
/*                                                                       */
/* <Description>                                                         */
/*                                                                       */
/*  Converts incoming 32 bit string to UTF16 character string.           */
/*                                                                       */
/*  Returns XCODE_SUCCESS if successful, or an XCODE error constant on   */
/*  failure.                                                             */
/*                                                                       */
/* <Parameters>                                                          */
/*                                                                       */
/*  pdwzInput      - [in] 32-bit input string.                           */
/*                                                                       */
/*  iInputLength   - [in] Length of input string.                        */
/*                                                                       */
/*  puzResult      - [in,out] UTF16 output string.                       */
/*                                                                       */
/*  piResultLength - [in,out] On input, contains length of 32-bit input  */
/*                   buffer. On output, set to length of output string.  */
/*                                                                       */
XCODE_EXPORTEDAPI 
int Xcode_convert32BitToUTF16( const DWORD *  pdwzInput, 
                               int            iInputLength, 
                               UTF16CHAR *    puzResult, 
                               int *          piResultLength );
/*                                                                       */
/*************************************************************************/

/*************************************************************************/
/*                                                                       */
/* <Function>                                                            */
/*                                                                       */
/*  Xcode_convertUTF16ToUTF8                                             */
/*                                                                       */
/* <Description>                                                         */
/*                                                                       */
/*  Converts incoming UTF16 string to UTF8 string.                       */
/*                                                                       */
/*  Returns XCODE_SUCCESS if successful, or an XCODE error constant on   */
/*  failure.                                                             */
/*                                                                       */
/* <Parameters>                                                          */
/*                                                                       */
/*  puzInput       - [in] UTF16 input string.                            */
/*                                                                       */
/*  iInputLength   - [in] Length of input string.                        */
/*                                                                       */
/*  pszResult      - [in,out] UTF8 output string.                        */
/*                                                                       */
/*  piResultLength - [in,out] On input, contains length of UTF16 input   */
/*                   buffer. On output, set to length of output string.  */
/*                                                                       */
XCODE_EXPORTEDAPI 
int Xcode_convertUTF16ToUTF8( const UTF16CHAR * puzInput,
                              int               iInputLength,
                              UCHAR8 *          pszResult,
                              int *             piResultLength );
/*                                                                       */
/*************************************************************************/

/*************************************************************************/
/*                                                                       */
/* <Function>                                                            */
/*                                                                       */
/*  Xcode_convertUTF8ToUTF16                                             */
/*                                                                       */
/* <Description>                                                         */
/*                                                                       */
/*  Converts incoming UTF8 string to UTF16 string.                       */
/*                                                                       */
/*  Returns XCODE_SUCCESS if successful, or an XCODE error constant on   */
/*  failure.                                                             */
/*                                                                       */
/* <Parameters>                                                          */
/*                                                                       */
/*  pszInput       - [in] UTF8 input string.                             */
/*                                                                       */
/*  iInputLength   - [in] Length of input string.                        */
/*                                                                       */
/*  puzResult      - [in,out] UTF16 output string.                       */
/*                                                                       */
/*  piResultLength - [in,out] On input, contains length of UTF8 input    */
/*                   buffer. On output, set to length of output string.  */
/*                                                                       */
XCODE_EXPORTEDAPI 
int Xcode_convertUTF8ToUTF16( const UCHAR8 *    pszInput,
                              int               iInputLength,
                              UTF16CHAR *       puzResult,
                              int *             piResultLength );
/*                                                                       */
/*************************************************************************/

/*** Internal Library Use ***/

/* toxxx */
int is_ldh_character32(const DWORD c) ;

/* toxxx */
int valid_dns_character32( const DWORD c );

/* race */
int valid_dns_character16( const UTF16CHAR c );

/* race */
int valid_dns_character8( const UCHAR8 c );

/* race/puny */
void lower_case( UCHAR8 *     string,
                 const size_t string_size );

/* race/puny */
XcodeBool starts_with_ignore_case( const UCHAR8 *    string,
                                   const size_t      string_size,
                                   const UCHAR8 *    prefix,
                                   const size_t      prefix_size );

/* race/puny */
XcodeBool starts_with( const UCHAR8  *   string,
                       const size_t      string_size,
                       const UCHAR8  *   prefix,
                       const size_t      prefix_size );

/* race */
int shrink_UChar_to_Octet( const UTF16CHAR *   unicode,
                           const size_t        unicode_size,
                           UCHAR8 *            ace,
                           size_t *            ace_size );

/* race */
int expand_Octet_to_UChar( const UCHAR8 *  ace,
                           const size_t    ace_size,
                           UTF16CHAR *     unicode,
                           size_t *        unicode_size );

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif
