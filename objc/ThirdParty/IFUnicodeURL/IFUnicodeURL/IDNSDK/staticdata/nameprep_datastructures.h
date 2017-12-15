/*********************************************************************************/
/*                                                                               */
/* nameprep_datastructures.h                                                     */
/*                                                                               */
/* Defines the data structures used by nameprep in the xcode library. The data   */
/* headers are generated using the header export utility program.                */
/*                                                                               */
/* (c) Verisign Inc., 2000-2003, All rights reserved                             */
/*                                                                               */
/*********************************************************************************/

#ifndef __nameprep_datastructures_h__
#define __nameprep_datastructures_h__

#ifdef __cplusplus
extern "C" 
{
#endif /* __cplusplus */


/*
*
* Prohibit data table:
*
*  struct _ProhibitRangesTable
*  {
*    DWORD low;
*    DWORD high;
*  };
*  typedef struct _ProhibitRangesTable ProhibitRangesTable;
*
*  static ProhibitRangesTable g_prohibitTable[PROHIBIT_ENTRYCOUNT] = 
*  {
*    { low, high },
*    ..
*  }
*
*  - 33 lines/ranges in the Prohibit data file
*  - low / high value for each
*  - single entries are in both high/low values 
*
 */

struct _ProhibitRangesTable
{
  DWORD low;
  DWORD high;
};
typedef struct _ProhibitRangesTable ProhibitRangesTable;
typedef struct _ProhibitRangesTable LCatRangesTable;

/*
*
* Character Map data table:
*
* Input data file example:
*
*  character; (mapped to) char1 char2 char3...; Description
*  character; (mapped out) ;                    Description
*
*  1FFB;   1F7D;       Case map
*  1FFC;   03C9 03B9;  Case map
*  200D;   ;           Map to nothing
*  20A8;   0072 0073;  Additional folding
*  2102;   0063;       Additional folding
*  2103;   00B0 0063;  Additional folding
*
* Mapped characters range from 00 00AD to 01 D7BB.
*
* Output data structure:
*
*  The data is stored in a lookup table. Nameprep uses a simple
*  binary search to find an entry or the lack of one. Expansion
*  character lists are either 3 characters, or 0/1/2 with a 
*  terminating null character.
*
*  const DWORD g_charmapTable[CHARMAP_ENTRYCOUNT][4] = {
*    { char, char1, char2, char3, char4 },
*    { char, char1, char2, char3, char4 },
*  }
*
 */

struct _CharmapTable
{
  DWORD dwCodepoint;
  short length;
  DWORD dwzData[4];
};
typedef struct _CharmapTable CharmapTable;


/*
*
* Canonical Class data table
*
* Input data file example:
*
*   Generated from the Unicode data file.
*
* Output data structure:
*
*  Key value pairs.
*
*  static CanonicalTable g_canonicalTable[CANONICAL_ENTRYCOUNT] = {
*    { cp 0x00000300, class 0x000000E6},
*  }
*
 */

typedef struct
{
  DWORD dwCodepoint;
  DWORD dwClass;
} CanonicalTable;


/*
*
* Decomposition data table
*
* Input data file example:
*
*  Generated from the Unicode data file.
*
* Output data structure:
*
*  Codepoints which are decomposed in to a set of characters are listed in 
*  sequetial order. dwCodepoint = codepoint, length = number of characters in the
*  decomposition string, dwzData = decomposition string terminated by null 
*  character.
*
*  static DecomposeTable g_decomposeTable[DECOMPOSE_ENTRYCOUNT] = {
*    { cp 0x000000BC, len 3, decomp {0x0031,0x2044,0x0034,0x0000} },
*  }
*
 */

typedef struct
{
  DWORD dwCodepoint;
  short length;
  DWORD dwzData[20];
} DecomposeTable;

/*
*
* Composition data table
*
* Input data file example:
*
*  Generated from the Unicode data file.
*
* Output data structure:
*
*  Codepoint pairs stored in 32 bit values and are listed in sequetial order.
*
*  static ComposeTable g_composeTable[COMPOSE_ENTRYCOUNT] = {
*    { cp pair 0x0415000000000300, composed 0x00000400},
*  }
*
 */

typedef struct
{
  QWORD qwPair;
  DWORD dwCodepoint;
} ComposeTable;

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* __nameprep_datastructures_h__ */
