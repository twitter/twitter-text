/*************************************************************************/
/*                                                                       */
/* race                                                                  */
/*                                                                       */
/* Routines which handle race encoding and decoding.                     */
/*                                                                       */
/* (c) Verisign Inc., 2000-2002, All rights reserved                     */
/*                                                                       */
/*************************************************************************/

#ifndef _XCODE_RACE_H_
#define _XCODE_RACE_H_

#include "xcode_config.h"

#ifdef __cplusplus
extern "C" 
{
#endif /* __cplusplus */

#ifdef SUPPORT_RACE /* compile switch in xcode_config.h */

/*************************************************************************/
/*************************************************************************/
/*************************************************************************/
/*                                                                       */
/* NOTE: These routines are not part of the IDNA RFC. Prior to the       */
/* publishing of the IDNA RFC Draft, various test bed implementations    */
/* of IDNA made use of Race encoding. The final IDNA RFC supports        */
/* Punycode encoding. These routines are primarily for use in testbed    */
/* migration. IDNA compliant applications should not use these routines  */
/* for IDNA. By default, these routines are turned off via the compile   */
/* switch SUPPORT_RACE in xcode_config.h                                 */
/*                                                                       */
/*************************************************************************/
/*************************************************************************/
/*************************************************************************/

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

/* race specific */

#define XCODE_ENRACE_INVALID_SURROGATE_STREAM          0+ACE_SPECIFIC 
#define XCODE_ENRACE_DOUBLE_ESCAPE_PRESENT             1+ACE_SPECIFIC 
#define XCODE_ENRACE_COMPRESSION_TOO_LONG              2+ACE_SPECIFIC 
#define XCODE_ENRACE_INTERNAL_DELIMITER_PRESENT        3+ACE_SPECIFIC 
#define XCODE_DERACE_ODD_OCTET_COUNT                   10+ACE_SPECIFIC
#define XCODE_DERACE_INVALID_SURROGATES_DECOMPRESSED   11+ACE_SPECIFIC
#define XCODE_DERACE_IMPROPER_NULL_COMPRESSION         12+ACE_SPECIFIC
#define XCODE_DERACE_INTERNAL_DELIMITER_PRESENT        13+ACE_SPECIFIC
#define XCODE_DERACE_DOUBLE_ESCAPE_PRESENT             14+ACE_SPECIFIC
#define XCODE_DERACE_UNNEEDED_ESCAPE_PRESENT           15+ACE_SPECIFIC
#define XCODE_DERACE_TRAILING_ESCAPE_PRESENT           16+ACE_SPECIFIC
#define XCODE_DERACE_UNESCAPED_OCTETS_ABSENT           17+ACE_SPECIFIC
#define XCODE_DERACE_DNS_COMPATIBLE_ENCODING_PRESENT   18+ACE_SPECIFIC
#define XCODE_ENBASE32_INVALID_5BIT_CHARACTER          40+ACE_SPECIFIC
#define XCODE_DEBASE32_5BIT_OVERFLOW                   50+ACE_SPECIFIC
#define XCODE_DEBASE32_5BIT_UNDERFLOW                  51+ACE_SPECIFIC
#define XCODE_DEBASE32_INVALID_ACE_CHARACTERS          52+ACE_SPECIFIC

/*************************************************************************/
/*                                                                       */
/* <Function>                                                            */
/*                                                                       */
/*  Xcode_race_encodeString                                              */
/*                                                                       */
/* <Description>                                                         */
/*                                                                       */
/*  Encodes a normalized string. output buffer should be at least        */
/*  MAX_LABEL_SIZE_8 in length, and output_length should be set to the   */
/*  length of output buffer before call.                                 */
/*                                                                       */
/*  Returns XCODE_SUCCESS if call was successful. Sets output_size       */
/*  to the width of the result.                                          */
/*                                                                       */
/* <Parameters>                                                          */
/*                                                                       */
/*  input         - [in] Pointer to input string in UTF16.               */
/*                                                                       */
/*  input_size    - [in] Length of input string.                         */
/*                                                                       */
/*  output        - [in,out] Pointer to the ASCII output buffer.         */
/*                                                                       */
/*  output_size   - [in,out] Length of the ASCII output buffer.          */
/*                                                                       */
/*  prefix        - [in] ASCII prefix to use. (ex: 'bq--')               */
/*                                                                       */
/*  prefix_size   - [in] Length of prefix string.                        */
/*                                                                       */
XCODE_EXPORTEDAPI 
int Xcode_race_encodeString( const UTF16CHAR * input,
                             const size_t      input_size,
                             UCHAR8 *          output,
                             size_t *          output_size,
                             const UCHAR8 *    prefix,
                             const size_t      prefix_size );
/*                                                                       */
/*************************************************************************/

/*************************************************************************/
/*                                                                       */
/* <Function>                                                            */
/*                                                                       */
/*  Xcode_race_decodeString                                              */
/*                                                                       */
/* <Description>                                                         */
/*                                                                       */
/*  Decodes an encoded string. output buffer should be at least          */
/*  MAX_LABEL_SIZE_16 in length, and output_length should be set to the  */
/*  length of output buffer before call.                                 */
/*                                                                       */
/*  Returns XCODE_SUCCESS if call was successful. Sets output_size       */
/*  to the width of the result.                                          */
/*                                                                       */
/* <Parameters>                                                          */
/*                                                                       */
/*  input         - [in] Pointer to input string in ASCII.               */
/*                                                                       */
/*  input_size    - [in] Length of input string.                         */
/*                                                                       */
/*  output        - [in,out] Pointer to the UTF16 output buffer.         */
/*                                                                       */
/*  output_size   - [in,out] Length of the output buffer.                */
/*                                                                       */
/*  prefix        - [in] ASCII prefix to check. (ex: 'bq--')             */
/*                                                                       */
/*  prefix_size   - [in] Length of prefix string.                        */
/*                                                                       */
XCODE_EXPORTEDAPI 
int Xcode_race_decodeString( UCHAR8 *          input,
                             const size_t      input_size,
                             UTF16CHAR *       output,
                             size_t *          output_size,
                             const UCHAR8 *    prefix,
                             const size_t      prefix_size );
/*                                                                       */
/*************************************************************************/

#endif /* SUPPORT_RACE */

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif
