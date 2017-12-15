/*************************************************************************/
/*                                                                       */
/* static nameprep data lookup tables                                    */
/*                                                                       */
/* Struct definitions and data file includes for inline normalization.   */
/*                                                                       */
/* (c) Verisign Inc., 2000-2002, All rights reserved                     */
/*                                                                       */
/*************************************************************************/

#ifndef __nameprep_static_h__
#define __nameprep_static_h__

#ifdef __cplusplus
extern "C" 
{
#endif /* __cplusplus */

/* lookup table data structure definitions */

#include "nameprep_datastructures.h"

/* static data lookup tables */

#include "nameprep_compatible.h"
#include "nameprep_cononical.h"
#include "nameprep_compose.h"
#include "nameprep_decompose.h"
#include "nameprep_charmap.h"
#include "nameprep_bidi_randalcat.h"
#include "nameprep_bidi_lcat.h"
#ifdef AllowUnassigned
#include "nameprep_prohibit_allowunassigned.h"
#else
#include "nameprep_prohibit.h"
#endif

/* data table lookup routines */

#include "nameprep_lookups.h"

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* __nameprep_static_h__ */
