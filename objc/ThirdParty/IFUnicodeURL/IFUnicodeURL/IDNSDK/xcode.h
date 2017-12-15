/*************************************************************************/
/*                                                                       */
/* VeriSign XCode (encode/decode) IDNA Library                           */
/*                                                                       */
/* A library for encoding / decoding of domain strings.                  */
/*                                                                       */
/* (c) VeriSign Inc., 2003, All rights reserved                          */
/*                                                                       */
/*************************************************************************/

/*
  TODO:
  - race encoding needs testing
  
  Misc:

  - make system for unix
  - update readme
*/

/*************************************************************************/
/*                                                                       */
/* Copyright (c) 2003, VeriSign Inc.                                     */
/* All rights reserved.                                                  */
/*                                                                       */
/* Redistribution and use in source and binary forms, with or            */
/* without modification, are permitted provided that the following       */
/* conditions are met:                                                   */
/*                                                                       */
/*  1) Redistributions of source code must retain the above copyright    */
/*     notice, this list of conditions and the following disclaimer.     */
/*                                                                       */
/*  2) Redistributions in binary form must reproduce the above copyright */
/*     notice, this list of conditions and the following disclaimer in   */
/*     the documentation and/or other materials provided with the        */
/*     distribution.                                                     */
/*                                                                       */
/*  3) Neither the name of the VeriSign Inc. nor the names of its        */
/*     contributors may be used to endorse or promote products derived   */
/*     from this software without specific prior written permission.     */
/*                                                                       */
/* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS   */
/* "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT     */
/* LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS     */
/* FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE        */
/* COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,   */
/* INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,  */
/* BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS */
/* OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED    */
/* AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT           */
/* LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN     */
/* ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE       */
/* POSSIBILITY OF SUCH DAMAGE.                                           */
/*                                                                       */
/* This software is licensed under the BSD open source license. For more */
/* information visit www.opensource.org.                                 */
/*                                                                       */
/*************************************************************************/

/*************************************************************************/
/*                                                                       */
/* Authors:                                                              */
/*                                                                       */
/*  Jim Mathies (VeriSign)                                               */
/*  John Colosi (VeriSign)                                               */
/*  Jay Juan (VeriSign)                                                  */
/*  Srikanth Veeramachaneni (VeriSign)                                   */
/*                                                                       */
/*************************************************************************/

#ifndef __XCODE_H__
#define __XCODE_H__

#include "xcode_config.h"
#include "toxxx.h"
#include "nameprep.h"
#include "puny.h"
#ifdef SUPPORT_RACE
#include "race.h"
#endif
#include "util.h"

#ifdef __cplusplus
extern "C" 
{
#endif /* __cplusplus */

/*************************************************************************/
/*                                                                       */
/* <Define>                                                              */
/*                                                                       */
/*  XCODELIBRARY_VERSION, NAMEPREPDATA_VERSION                           */
/*                                                                       */
/* <Description>                                                         */
/*                                                                       */
/*  The current version of this library, and the accompanying            */
/*  normalization and nameprep data & header files.                      */
/*                                                                       */
/*                                                                       */
#define XCODELIBRARY_VERSION        2.00
#define NAMEPREPDATA_VERSION_STR    "11"
/*                                                                       */
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
/*   puny.h - ace/punycode encode/decode errors.                         */
/*   nameprep.h - nameprep / normalization errors.                       */
/*   toxxx.h - ToXXX processing errors.                                  */
/*                                                                       */
/*  Errors <= 20 - Indicates common library error.                       */
/*  Errors > 20  - Indicates a module specific error.                    */
/*                                                                       */
/*************************************************************************/

/* Common error codes (0-20) */

#define XCODE_SUCCESS                   0 /* success */
#define XCODE_BAD_ARGUMENT_ERROR        1 /* an input argument was invalid */
#define XCODE_MEMORY_ALLOCATION_ERROR   2 /* failed to allocate needed memory */
#define XCODE_BUFFER_OVERFLOW_ERROR     3 /* an input string was too long (>MAX_LABEL_SIZE_X) */

/* Component specific error code base constants */

#define ACE_SPECIFIC            100
#define NAMEPREP_SPECIFIC       200
#define TOXXX_SPECIFIC          300
#define UTIL_SPECIFIC           400

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif
