/*************************************************************************/
/*                                                                       */
/* adapter                                                               */
/*                                                                       */
/* Win32 Winsock replacement adapter for Race encoding.                  */
/*                                                                       */
/* (c) Verisign Inc., 2000-2002, All rights reserved                     */
/*                                                                       */
/*************************************************************************/

#ifndef _XCODE_WIN32_ADAPTER_H_
#define _XCODE_WIN32_ADAPTER_H_

#ifdef __cplusplus
extern "C" 
{
#endif /* __cplusplus */

#ifdef WIN32
#ifdef SUPPORT_RACE

#pragma warning( disable : 4018 )

/*
  On Win32 platform, htons() is in the winsocks lib.
  To save a library load, we do it right here instead.
*/

#define INLINE_WORD_FLIP(out, in) \
{                                 \
  unsigned short int _in = (in);  \
  (out) = (_in << 8) | (_in >> 8);\
}

#define INLINE_HTONS(out, in) INLINE_WORD_FLIP(out, in)

#define INLINE_NTOHS(out, in) INLINE_WORD_FLIP(out, in)

#define INLINE_DWORD_FLIP(out, in)    \
{                                     \
  unsigned long int _in = (in);       \
  (out) = ((_in << 8) & 0x00ff0000) | \
  (_in << 24)                       | \
  ((_in >> 8) & 0x0000ff00)         | \
  (_in >> 24);                        \
}

#define INLINE_NTOHL(out, in) INLINE_DWORD_FLIP(out, in)

#define INLINE_HTONL(out, in) INLINE_DWORD_FLIP(out, in)

static unsigned short int myhtons(unsigned short int in) 
{
  unsigned short int out;

  INLINE_WORD_FLIP(out,in);

  return out; 
}

#endif
#endif

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* _XCODE_WIN32_ADAPTER_H_ */
