/*************************************************************************/
/*                                                                       */
/* puny                                                                  */
/*                                                                       */
/* Routines which handle encoding strings using punycode.                */
/*                                                                       */
/* (c) Verisign Inc., 2000-2002, All rights reserved                     */
/*                                                                       */
/*************************************************************************/

#ifndef _XCODE_PUNY_H_
#define _XCODE_PUNY_H_

#include "xcode_config.h"

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

/* punycode uses the xcode common error values only */

/*************************************************************************/
/*                                                                       */
/* <Function>                                                            */
/*                                                                       */
/*  Xcode_puny_encodeString                                              */
/*                                                                       */
/* <Description>                                                         */
/*                                                                       */
/*  Encode a label using Punycode encoding. Does basic codepoint check   */
/*  prior to encoding, also adds ACE tag to beginning of result where    */
/*  required.                                                            */
/*                                                                       */
/*  Returns XCODE_SUCCESS if call was successful. Sets piOutputSize      */
/*  to the width of the result.                                          */
/*                                                                       */
/* <Parameters>                                                          */
/*                                                                       */
/*  pdwzInputString - [in] 32-bit input string.                          */
/*                                                                       */
/*  iInputSize      - [in] Length of incoming 32-bit string.             */
/*                                                                       */
/*  pzOutputString  - [in,out] 8-bit output character string buffer.     */
/*                                                                       */
/*  piOutputSize    - [in,out] Length of incoming 8-bit buffer, and      */
/*                    contains length of resulting encoding string on    */
/*                    exit.                                              */
/*                                                                       */
XCODE_EXPORTEDAPI 
int Xcode_puny_encodeString( const DWORD *  pdwzInputString,
                             const int      iInputSize,
                             UCHAR8 *       pzOutputString,
                             int *          piOutputSize );
/*                                                                       */
/*************************************************************************/

/*************************************************************************/
/*                                                                       */
/* <Function>                                                            */
/*                                                                       */
/*  Xcode_puny_decodeString                                              */
/*                                                                       */
/* <Description>                                                         */
/*                                                                       */
/*  Decode a label using Punycode decoding. Checks for valid ACE label,  */
/*  and returns input string if not found. After decoding, returns       */
/*  result in UTF16.                                                     */
/*                                                                       */
/*  Returns XCODE_SUCCESS if call was successful. Sets piOutputSize to   */
/*  the width of the result.                                             */
/*                                                                       */
/* <Parameters>                                                          */
/*                                                                       */
/*  pzInputString   - [in] 8-bit input string.                           */
/*                                                                       */
/*  iInputSize      - [in] Length of incoming 8-bit string.              */
/*                                                                       */
/*  puzOutputString - [in,out] UTF16 output character string buffer.     */
/*                                                                       */
/*  piOutputSize    - [in,out] Length of incoming UTF16 buffer, and      */
/*                    contains length of resulting decoded string on     */
/*                    exit.                                              */
/*                                                                       */
XCODE_EXPORTEDAPI 
int Xcode_puny_decodeString( const UCHAR8 *     pzInputString,
                             const int          iInputSize,
                             UTF16CHAR *        puzOutputString,
                             int *              piOutputSize );
/*                                                                       */
/*************************************************************************/

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif
