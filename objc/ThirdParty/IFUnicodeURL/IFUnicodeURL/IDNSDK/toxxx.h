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

#ifndef __toxxx_h__
#define __toxxx_h__

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

/* toxxx specific */

#define XCODE_TOXXX_STD3_NONLDH                       0+TOXXX_SPECIFIC
#define XCODE_TOXXX_STD3_HYPHENERROR                  1+TOXXX_SPECIFIC
#define XCODE_TOXXX_ALREADYENCODED                    2+TOXXX_SPECIFIC
#define XCODE_TOXXX_INVALIDDNSLEN                     3+TOXXX_SPECIFIC
#define XCODE_TOXXX_CIRCLECHECKFAILED                 4+TOXXX_SPECIFIC

/*************************************************************************/
/*                                                                       */
/* <Function>                                                            */
/*                                                                       */
/*  Xcode_ToASCII                                                        */
/*                                                                       */
/* <Description>                                                         */
/*                                                                       */
/*  Applies IDNA spec ToASCII operation on a domain label. Includes a    */
/*  good amount of commenting detail in .c on operation.                 */
/*                                                                       */
/*  Returns XCODE_SUCCESS if successful, or an XCODE error constant      */
/*  on failure.                                                          */
/*                                                                       */
/* <Parameters>                                                          */
/*                                                                       */
/*  puzInputString  - [in] UTF16 input string.                           */
/*                                                                       */
/*  iInputSize      - [in] Length of incoming UTF16 string.              */
/*                                                                       */
/*  pzOutputString  - [in,out] 8-bit output character string buffer.     */
/*                    Must be at least MAX_LABEL_SIZE_8 in length.       */
/*                                                                       */
/*  piOutputSize    - [in,out] Length of incoming 8-bit buffer, and      */
/*                    contains length of resulting encoding string on    */
/*                    exit.                                              */
/*                                                                       */
XCODE_EXPORTEDAPI
int Xcode_ToASCII( const UTF16CHAR *  puzInputString, 
                   int                iInputSize,
                   UCHAR8 *           pzOutputString, 
                   int *              piOutputSize );
/*                                                                       */
/*************************************************************************/

/*************************************************************************/
/*                                                                       */
/* <Function>                                                            */
/*                                                                       */
/*  Xcode_ToUnicode8, Xcode_ToUnicode16                                  */
/*                                                                       */
/* <Description>                                                         */
/*                                                                       */
/*  Applies IDNA spec ToUnicode operation on a domain label. Includes a  */
/*  good amount of commenting detail in .c on operation.                 */
/*                                                                       */
/*  Returns XCODE_SUCCESS if successful, or an XCODE error constant      */
/*  on failure.                                                          */
/*                                                                       */
/* <Parameters>                                                          */
/*                                                                       */
/*  pzInputString   - [in] 8-bit input string.                           */
/*                                                                       */
/*  iInputSize      - [in] Length of incoming 8-bit string.              */
/*                                                                       */
/*  puzOutputString - [in,out] UTF16 output character string buffer.     */
/*                    Must be at least MAX_LABEL_SIZE_16 in length.      */
/*                                                                       */
/*  piOutputSize    - [in,out] Length of incoming UTF16 buffer, and      */
/*                    contains length of resulting decoded string on     */
/*                    exit.                                              */
/*                                                                       */
XCODE_EXPORTEDAPI
int Xcode_ToUnicode8( const UCHAR8 *    pzInputString, 
                      int                iInputSize,
                      UTF16CHAR *        puzOutputString, 
                      int *              piOutputSize );
XCODE_EXPORTEDAPI
int Xcode_ToUnicode16( const UTF16CHAR * puzInputString, 
                       int               iInputSize,
                       UTF16CHAR *       puzOutputString, 
                       int *             piOutputSize );
/*                                                                       */
/*************************************************************************/

/*************************************************************************/
/*                                                                       */
/* <Function>                                                            */
/*                                                                       */
/*  Xcode_DomainToASCII                                                  */
/*                                                                       */
/* <Description>                                                         */
/*                                                                       */
/*  Applies IDNA spec ToASCII operation on a domain.                     */
/*                                                                       */
/*  Returns XCODE_SUCCESS if successful, or an XCODE error constant      */
/*  on failure.                                                          */
/*                                                                       */
/* <Parameters>                                                          */
/*                                                                       */
/*  puzInputString  - [in] UTF16 input string.                           */
/*                                                                       */
/*  iInputSize      - [in] Length of incoming UTF16 string.              */
/*                                                                       */
/*  pzOutputString  - [in,out] 8-bit output character string buffer.     */
/*                    Must be at least MAX_LABEL_SIZE_8 in length.       */
/*                                                                       */
/*  piOutputSize    - [in,out] Length of incoming 8-bit buffer, and      */
/*                    contains length of resulting encoding string on    */
/*                    exit.                                              */
/*                                                                       */
XCODE_EXPORTEDAPI
int Xcode_DomainToASCII( const UTF16CHAR *  puzInputString, 
                         int                iInputSize,
                         UCHAR8 *           pzOutputString, 
                         int *              piOutputSize );
/*                                                                       */
/*************************************************************************/

/*************************************************************************/
/*                                                                       */
/* <Function>                                                            */
/*                                                                       */
/*  Xcode_DomainToUnicode8,Xcode_DomainToUnicode16                       */
/*                                                                       */
/* <Description>                                                         */
/*                                                                       */
/*  Applies IDNA spec ToUnicode operation on a domain                    */
/*                                                                       */
/*  Returns XCODE_SUCCESS if successful, or an XCODE error constant      */
/*  on failure.                                                          */
/*                                                                       */
/* <Parameters>                                                          */
/*                                                                       */
/*  pzInputString   - [in] 8-bit input string.                           */
/*                                                                       */
/*  iInputSize      - [in] Length of incoming 8-bit string.              */
/*                                                                       */
/*  puzOutputString - [in,out] UTF16 output character string buffer.     */
/*                    Must be at least MAX_LABEL_SIZE_16 in length.      */
/*                                                                       */
/*  piOutputSize    - [in,out] Length of incoming UTF16 buffer, and      */
/*                    contains length of resulting decoded string on     */
/*                    exit.                                              */
/*                                                                       */
XCODE_EXPORTEDAPI
int Xcode_DomainToUnicode8( const UCHAR8 *     pzInputString, 
                            int                iInputSize,
                            UTF16CHAR *        puzOutputString, 
                            int *              piOutputSize );
XCODE_EXPORTEDAPI
int Xcode_DomainToUnicode16( const UTF16CHAR *  puzInputString, 
                             int                iInputSize,
                             UTF16CHAR *        puzOutputString, 
                             int *              piOutputSize );
/*                                                                       */
/*************************************************************************/

/*************************************************************************/
/*                                                                       */
/* <Function>                                                            */
/*                                                                       */
/*  Xcode_IsIDNADomainDelimitor                                          */
/*                                                                       */
/* <Description>                                                         */
/*                                                                       */
/*  Tests to see if the character passed in is a IDNA spec domain        */
/*  delimiter.                                                           */
/*                                                                       */
XCODE_EXPORTEDAPI
XcodeBool Xcode_IsIDNADomainDelimiter( const UTF16CHAR * wp );
/*                                                                       */
/*************************************************************************/



#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif	/* __toxxx_h__ */
