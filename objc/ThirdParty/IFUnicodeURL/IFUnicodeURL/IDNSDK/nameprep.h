/*************************************************************************/
/*                                                                       */
/* nameprep                                                              */
/*                                                                       */
/* Routines which handle nameprep 11                                     */
/*                                                                       */
/* (c) Verisign Inc., 2000-2003, All rights reserved                     */
/*                                                                       */
/*************************************************************************/

#ifndef __nameprep_h__
#define __nameprep_h__

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

/* nameprep specific */

#define XCODE_NAMEPREP_EXPANSIONERROR              0+NAMEPREP_SPECIFIC
#define XCODE_NAMEPREP_PROHIBITEDCHAR              1+NAMEPREP_SPECIFIC
#define XCODE_NAMEPREP_NULL_CHARACTER_PRESENT      2+NAMEPREP_SPECIFIC
#define XCODE_NAMEPREP_FIRSTLAST_BIDIERROR         3+NAMEPREP_SPECIFIC
#define XCODE_NAMEPREP_MIXED_BIDIERROR             4+NAMEPREP_SPECIFIC
#define XCODE_NAMEPREP_BAD_ARGUMENT_ERROR          5+NAMEPREP_SPECIFIC
#define XCODE_NAMEPREP_MEMORY_ALLOCATION_ERROR     6+NAMEPREP_SPECIFIC
#define XCODE_NAMEPREP_BUFFER_OVERFLOW_ERROR       7+NAMEPREP_SPECIFIC
#define XCODE_NAMEPREP_MAPPEDOUT                   8+NAMEPREP_SPECIFIC
#define XCODE_NAMEPREP_OUTOFRANGEERROR             9+NAMEPREP_SPECIFIC

/*************************************************************************/
/*                                                                       */
/* <Function>                                                            */
/*                                                                       */
/*  Xcode_nameprepString, Xcode_nameprepString32                         */
/*                                                                       */
/* <Description>                                                         */
/*                                                                       */
/*  Applies Nameprep 11 to a UTF16 & 32-bit strings. Returns a 32-bit    */
/*  prepped string suitable for encoding.                                */
/*                                                                       */
/*  Returns XCODE_SUCCESS if successful, or an XCODE error constant      */
/*  on failure.                                                          */
/*                                                                       */
/* <Parameters>                                                          */
/*                                                                       */
/*  puzInputString    - [in] UTF16 input string.                         */
/*                                                                       */
/*  iInputSize        - [in] Length of input string.                     */
/*                                                                       */
/*  pdwzOutputString  - [in,out] 32-bit output string.                   */
/*                                                                       */
/*  piOutputSize      - [in,out] On input, contains length of 32 bit     */
/*                      buffer. On output. set to length of output       */
/*                      string.                                          */
/*                                                                       */
/*  pdwProhibitedChar - [out] Populated with the first prohibited        */
/*                      codepoint when found.                            */
/*                                                                       */
XCODE_EXPORTEDAPI 
int Xcode_nameprepString(   const UTF16CHAR *   puzInputString,
                            int                 iInputSize,
                            DWORD *             pdwzOutputString,
                            int *               piOutputSize,
                            DWORD *             pdwProhibitedChar );
XCODE_EXPORTEDAPI 
int Xcode_nameprepString32( const DWORD *       pdwzInputString,
                            int                 iInputSize,
                            DWORD *             pdwzOutputString,
                            int *               piOutputSize,
                            DWORD *             pdwProhibitedChar );
/*                                                                       */
/*************************************************************************/

/*************************************************************************/
/*                                                                       */
/* <Function>                                                            */
/*                                                                       */
/*  Xcode_normalizeString                                                */
/*                                                                       */
/* <Description>                                                         */
/*                                                                       */
/*  Applies Normalization Form KC (NFKC) to an input string. Called by   */
/*  Xcode_nameprepString.                                                */
/*                                                                       */
/*  Returns XCODE_SUCCESS if successful, or an XCODE error constant      */
/*  on failure.                                                          */
/*                                                                       */
/* <Parameters>                                                          */
/*                                                                       */
/*  pdwzInputString  - [in] 32-bit input string.                         */
/*                                                                       */
/*  iInputSize       - [in] Length of input string.                      */
/*                                                                       */
/*  pdwzOutputString - [in,out] 32-bit normalized output string.         */
/*                                                                       */
/*  piOutputSize     - [in,out] On input, contains length of 32 bit      */
/*                     buffer. On output. set to length of output string.*/
/*                                                                       */
XCODE_EXPORTEDAPI
int Xcode_normalizeString( DWORD *  pdwzInputString,
                           int      iInputSize,
                           DWORD *  pdwzOutputString,
                           int *    piOutputSize );
/*                                                                       */
/*************************************************************************/

/*************************************************************************/
/*                                                                       */
/* <Function>                                                            */
/*                                                                       */
/*  Xcode_charmapString                                                  */
/*                                                                       */
/* <Description>                                                         */
/*                                                                       */
/*  Applies character mapping to a string. Called by                     */
/*  Xcode_nameprepString.                                                */
/*                                                                       */
/*  Returns XCODE_SUCCESS if successful, or an XCODE error constant      */
/*  on failure.                                                          */
/*                                                                       */
/* <Parameters>                                                          */
/*                                                                       */
/*  pdwzInputString  - [in] 32-bit input string.                         */
/*                                                                       */
/*  iInputSize       - [in] Length of input string.                      */
/*                                                                       */
/*  pdwzOutputString - [in,out] 32-bit character mapped output string.   */
/*                                                                       */
/*  piOutputSize     - [in,out] On input, contains length of 32 bit      */
/*                     buffer. On output. set to length of output string.*/
/*                                                                       */
XCODE_EXPORTEDAPI
int Xcode_charmapString( DWORD *  pdwzInputString, 
                         int      iInputSize,
                         DWORD *  pdwzOutputString, 
                         int *    piOutputSize );
/*                                                                       */
/*************************************************************************/

/*************************************************************************/
/*                                                                       */
/* <Function>                                                            */
/*                                                                       */
/*  Xcode_prohibitString                                                 */
/*                                                                       */
/* <Description>                                                         */
/*                                                                       */
/*  Evaluates the codepoints in the input and determines if any are part */ 
/*  of the nameprep prohibited list. Called by Xcode_nameprepString.     */
/*                                                                       */
/*  Returns XCODE_SUCCESS if no characters were prohibited. Returns      */
/*  XCODE_NAMEPREP_PROHIBITEDCHAR if a prohibited character was found    */
/*  and returns the first prohibited character in pdwProhibitedChar.     */
/*                                                                       */
/* <Parameters>                                                          */
/*                                                                       */
/*  pdwzInputString   - [in] 32-bit input string.                        */
/*                                                                       */
/*  iInputSize        - [in] Length of input string.                     */
/*                                                                       */
/*  pdwProhibitedChar - [out] Populated with the first prohibited        */
/*                      codepoint when found.                            */
/*                                                                       */
XCODE_EXPORTEDAPI
int Xcode_prohibitString( DWORD * pdwzInputString, 
                          int     iInputSize,
                          DWORD * pdwzProhibitedChar ); 
/*                                                                       */
/*************************************************************************/

/*************************************************************************/
/*                                                                       */
/* <Function>                                                            */
/*                                                                       */
/*  Xcode_bidifilterString                                               */
/*                                                                       */
/* <Description>                                                         */
/*                                                                       */
/*  Apply bidi filtering to the input string. Called by                  */ 
/*  Xcode_nameprepString.                                                */
/*                                                                       */
/*  Returns XCODE_SUCCESS if successful, or an XCODE error constant      */
/*  on failure.                                                          */
/*                                                                       */
/* <Parameters>                                                          */
/*                                                                       */
/*  pdwzInputString   - [in] 32-bit input string.                        */
/*                                                                       */
/*  iInputSize        - [in] Length of input string.                     */
/*                                                                       */
XCODE_EXPORTEDAPI
int Xcode_bidifilterString( DWORD * pdwzInputString, 
                            int     iInputSize );
/*                                                                       */
/*************************************************************************/

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif	/* __nameprep_h__ */

