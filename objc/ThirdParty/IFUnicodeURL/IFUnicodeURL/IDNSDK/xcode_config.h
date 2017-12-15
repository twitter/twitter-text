/*************************************************************************/
/*                                                                       */
/* xcode_config.h                                                        */
/*                                                                       */
/* Various library configuration switches, constants, types and          */
/* input/output data file information.                                   */
/*                                                                       */
/* (c) Verisign Inc., 2000-2002, All rights reserved                     */
/*                                                                       */
/*************************************************************************/

#ifndef __XCODE_CONFIG_H__ /* __XCODE_CONFIG_H__ */
#define __XCODE_CONFIG_H__ /* __XCODE_CONFIG_H__ */

#include <sys/types.h>
#include <wchar.h>
#include <string.h>
#include <limits.h>

#ifdef __cplusplus
extern "C" 
{
#endif /* __cplusplus */

/*************************************************************************/
/*                                                                       */
/* <Define>                                                              */
/*                                                                       */
/*  LABEL_DELIMITER                                                      */
/*                                                                       */
/* <Description>                                                         */
/*                                                                       */
/*  The value of the IDNA spec domain delimiter used in encoded domains. */
/*  This value is primarily used in the DomainToUnicode routines.        */
/*                                                                       */
#define LABEL_DELIMITER           0x2E
/*                                                                       */
/*************************************************************************/

/*************************************************************************/
/*                                                                       */
/* <Define>                                                              */
/*                                                                       */
/*  LABEL_HYPHEN                                                         */
/*                                                                       */
/* <Description>                                                         */
/*                                                                       */
/*  The value of the IDNA spec hyphen. ('-')                             */
/*                                                                       */
#define LABEL_HYPHEN              0x2D
/*                                                                       */
/*************************************************************************/

/*************************************************************************/
/*                                                                       */
/* <Type Definitions>                                                    */
/*                                                                       */
/*  UCHAR8, UTF16CHAR, DWORD, QWORD                                      */ 
/*                                                                       */
/* <Description>                                                         */
/*                                                                       */
/*  Common types definitions used throughout the library.                */
/*                                                                       */
/* 16 bit UTF16 codepoint                                                */
/*                                                                       */
#ifndef UTF16CHAR
  typedef unsigned short int  UTF16CHAR;
#endif
/*                                                                       */
/* 8  bit ASCII codepoint                                                */
/*                                                                       */
#ifndef UCHAR8
  typedef unsigned char UCHAR8;
#endif
/*                                                                       */
/* 32-bit character type                                                 */
/*                                                                       */
#ifndef DWORD
  typedef unsigned long DWORD;
#endif
/*                                                                       */
/* 64-bit character pair type                                            */
/*                                                                       */
#ifndef QWORD
  #ifdef WIN32
    typedef unsigned __int64 QWORD;
  #else
    typedef unsigned long long QWORD;
  #endif
#endif
/*                                                                       */
/* boolean type                                                          */
/*                                                                       */
typedef enum 
{ 
  XCODE_TRUE  = 1, 
  XCODE_FALSE = 0 
} XcodeBoolean, XcodeBool;
/*                                                                       */
/*************************************************************************/

/*************************************************************************/
/*                                                                       */
/* <Define>                                                              */
/*                                                                       */
/*  ACE_PREFIX, ACE_PREFIX32[]                                           */
/*                                                                       */
/* <Description>                                                         */
/*                                                                       */
/*  The ACE prefix for IDNA is "xn--" or any capitalization thereof.     */
/*                                                                       */
#define ACE_PREFIX "xn--"
const static DWORD ACE_PREFIX32[4] = { 'x', 'n', '-', '-' };
/*                                                                       */
/*************************************************************************/

/*************************************************************************/
/*                                                                       */
/* <Define>                                                              */
/*                                                                       */
/*  MAX_LABEL_SIZE, MAX_DOMAIN_SIZE_8                                    */
/*                                                                       */
/* <Description>                                                         */
/*                                                                       */
/*  The maximum size of 32, 16, & 8 bit strings to be passed into        */
/*  the library's routines. Used internally to define input / output     */
/*  buffer sizes as well. Input string lengths of the applicable type    */
/*  will not be encoded.                                                 */
/*                                                                       */
/*                                                                       */
#define MAX_LABEL_SIZE_32           128
#define MAX_LABEL_SIZE_16           128
#define MAX_LABEL_SIZE_8            256
#define MAX_DOMAIN_SIZE_8           1024
#define MAX_DOMAIN_SIZE_16          1024
/*                                                                       */
/*************************************************************************/

/*************************************************************************/
/*                                                                       */
/* <Define>                                                              */
/*                                                                       */
/*  ULABEL_DELIMITER_LIST, ULABEL_DELIMITER_LIST_LENGTH                  */
/*                                                                       */
/* <Description>                                                         */
/*                                                                       */
/*  IDNA accepted UTF16 domain label delimiters.                         */
/*                                                                       */
/* 1) Whenever dots are used as label separators, the following          */
/*    characters MUST be recognized as dots: U+002E (full stop), U+3002  */
/*    (ideographic full stop), U+FF0E (fullwidth full stop), U+FF61      */
/*    (halfwidth ideographic full stop).                                 */
/*                                                                       */
static const UTF16CHAR ULABEL_DELIMITER_LIST[4] = { 0x002E, 0x3002, 0xFF0E, 0xFF61 };
#define ULABEL_DELIMITER_LIST_LENGTH 4
/*                                                                       */
/*************************************************************************/

/*************************************************************************/
/*                                                                       */
/* <Compile Switch>                                                      */
/*                                                                       */
/*  UseSTD3ASCIIRules                                                    */
/*                                                                       */
/* <Description>                                                         */
/*                                                                       */
/*  Optionally apply STD3 DNS rules to labels in ToXXX routines per      */
/*  IDNA.                                                                */
/*                                                                       */
/* From IDNA, section 4 - Conversion operations                          */
/*                                                                       */
/* 3) For each label, decide whether or not to enforce the restrictions  */
/*    on ASCII characters in host names [STD3].  (Applications already   */
/*    faced this choice before the introduction of IDNA, and can         */
/*    continue to make the decision the same way they always have; IDNA  */
/*    makes no new recommendations regarding this choice.)  If the       */
/*    restrictions are to be enforced, set the flag called               */
/*    "UseSTD3ASCIIRules" for that label.                                */
/*                                                                       */
/* From IDNA, section 4.1  - ToASCII                                     */
/*                                                                       */
/* 3. If the UseSTD3ASCIIRules flag is set, then perform these checks:   */
/*                                                                       */
/*   (a) Verify the absence of non-LDH ASCII code points; that is, the   */
/*       absence of 0..2C, 2E..2F, 3A..40, 5B..60, and 7B..7F.           */
/*                                                                       */
/*   (b) Verify the absence of leading and trailing hyphen-minus; that   */
/*       is, the absence of U+002D at the beginning and end of the       */
/*       sequence.                                                       */
/*                                                                       */
#define UseSTD3ASCIIRules                                             
/*                                                                       */
/*************************************************************************/

/*************************************************************************/
/*                                                                       */
/* <Compile Switch>                                                      */
/*                                                                       */
/*  AllowUnassigned                                                      */
/*                                                                       */
/* <Description>                                                         */
/*                                                                       */
/*  Optionally allow unassigned unicode codepoints per IDNA in Query     */
/*  string processing. Client applications predominately deal with       */
/*  "stored strings", therefore this compile switch is turned off by     */
/*  default.                                                             */
/*                                                                       */
/* From STRINGPREP:                                                      */
/*                                                                       */
/*  7. Unassigned Code Points in Stringprep Profiles                     */
/*                                                                       */
/*  This section describes two different types of strings in typical     */
/*  protocols where internationalized strings are used: "stored strings" */
/*  and "queries".  Of course, different Internet protocols use strings  */
/*  very differently, so these terms cannot be used exactly in every     */
/*  protocol that needs to use stringprep.  In general, "stored strings" */
/*  are strings that are used in protocol identifiers and named entities,*/
/*  such as names in digital certificates and DNS domain name parts.     */
/*  "Queries" are strings that are used to match against strings that are*/
/*  stored identifiers, such as user-entered names for digital           */
/*  certificate authorities and DNS lookups.                             */
/*                                                                       */
/*  All code points not assigned in the character repertoire named in a  */
/*  stringprep profile are called "unassigned code points".  Stored      */
/*  strings using the profile MUST NOT contain any unassigned code       */
/*  points.  Queries for matching strings MAY contain unassigned code    */
/*  points.  Note that this is the only part of this document where the  */
/*  requirements for queries differs from the requirements for stored    */
/*  strings.                                                             */
/*                                                                       */
/* From IDNA, section 4 - Conversion operations                          */
/*                                                                       */
/*  1) Decide whether the domain name is a "stored string" or a "query   */
/*     string" as described in [STRINGPREP].  If this conversion follows */
/*     the "queries" rule from [STRINGPREP], set the flag called         */
/*     "AllowUnassigned".                                                */
/*                                                                       */
#define AllowUnassigned                                               
/*                                                                       */
/*************************************************************************/

/*************************************************************************/
/*                                                                       */
/* <Compile Switch>                                                      */
/*                                                                       */
/*  SUPPORT_RACE                                                         */
/*                                                                       */
/* <Description>                                                         */
/*                                                                       */
/*  Export Race decoding routine during compile. Race encoding was used  */
/*  in the IDN testbed prior to IDNA's publication and the decision to   */
/*  use Punycode encoding. See race.h for more information.              */
/*                                                                       */
#define SUPPORT_RACE                                                  
/*                                                                       */
/*************************************************************************/

/*************************************************************************/
/*                                                                       */
/* <Build Config>                                                        */
/*                                                                       */
/*  XCODE_EXPORTEDAPI                                                    */
/*                                                                       */
/* <Description>                                                         */
/*                                                                       */
/*  XCODE_EXPORTEDAPI can be used to append a platform specific exported */
/*  function declaration.                                                */
/*                                                                       */
/*                                                                       */
#ifdef WIN32
  #pragma warning( disable : 4018 ) /* signed/unsigned mismatch */
  #ifdef XCODEDLL_EXPORTS /* building a Win32 DLL */
    #define XCODE_EXPORTEDAPI __declspec(dllexport)
  #else /* building a Win32 static library */
    #define XCODE_EXPORTEDAPI extern
  #endif
#else /* other platforms currently do not use this */
  #define XCODE_EXPORTEDAPI 
#endif
/*                                                                       */
/*************************************************************************/

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* __XCODE_CONFIG_H__ */
