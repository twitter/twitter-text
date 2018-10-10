/*
 * Copyright 2018 Twitter, Inc.
 * Licensed under the Apache License, Version 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 */
/*************************************************************************/
/*                                                                       */
/* race                                                                  */
/*                                                                       */
/* Routines which handle race encoding and decoding.                     */
/*                                                                       */
/* (c) Verisign Inc., 2000-2002, All rights reserved                     */
/*                                                                       */
/*************************************************************************/

#include "race.h"

#ifdef SUPPORT_RACE

#ifndef WIN32
  #include <arpa/inet.h>
  #define myhtons htons
#else
  #include "adapter.h" /* Win32 Winsock replacement */
#endif

#include "xcode.h"
#include "util.h"

/* Prototypes */

int Xcode_race_RaceCompress( const UTF16CHAR *  uncompressed,
                            const size_t       uncompressed_size,
                            UCHAR8 *           compressed,
                            size_t *           compressed_size );
int Xcode_race_RaceDecompress( const UCHAR8* compressed,
                              const size_t compressed_size,
                              UTF16CHAR* decompressed,
                              size_t* decompressed_size );

/* Hex definitions */

#define ZERO                    0x00
#define DOUBLE_F                0xFF
#define DOUBLE_9                0x99
#define NO_COMPRESSION_FLAG     0xD8
#define HYPHEN                  0x002D


/********************************************************************************
 *                              Race                                            *
 ********************************************************************************/

/*
 * Xcode_race_RaceCompress - Employ RACE compression on a utf-16 string
 */

int Xcode_race_RaceCompress( const UTF16CHAR *  uncompressed,
                             const size_t       uncompressed_size,
                             UCHAR8 *           compressed,
                             size_t *           compressed_size ) 
{
  int i;
  short compress_flag;
  UCHAR8 U1, U2, N1;
  size_t compressed_offset;

  UTF16CHAR tmp16;
  UCHAR8 *  tmp8;
  tmp8 = (UCHAR8*) &tmp16;

  /* Assert proper size_ts */

  if (uncompressed_size < 1) {return XCODE_BAD_ARGUMENT_ERROR;}

  /* Traverse high UCHAR8s */

  U1 = ZERO;
  compress_flag = 1;

  for (i=0; i<(int)uncompressed_size; i++)
  {
    tmp16 = myhtons(*(uncompressed+i));  /* htons ensures [msb,lsb] */

    if (tmp8[0] != ZERO) 
    {
      if (U1 == ZERO) 
      {
        U1 = tmp8[0];
      } else if (tmp8[0] != U1) 
      {
        compress_flag = 0; 
        break;
      }
    }
  }

  compressed_offset = 0;

  if (compress_flag) 
  {
    if (U1 >= 0xD8 && U1 <= 0xDF) {return XCODE_ENRACE_INVALID_SURROGATE_STREAM;}

    *(compressed+compressed_offset++) = U1;

    for (i=0; i<(int)uncompressed_size; i++)
    {
      tmp16 = myhtons(*(uncompressed+i));  /* htons ensures [msb,lsb] */

      U2 = tmp8[0];
      N1 = tmp8[1];
      if (U2 == ZERO && N1 == DOUBLE_9) {return XCODE_ENRACE_DOUBLE_ESCAPE_PRESENT;}
      if (U2 == ZERO && N1 == LABEL_DELIMITER) {return XCODE_ENRACE_INTERNAL_DELIMITER_PRESENT;}

      if (U2 == U1) 
      {
        if (N1 != DOUBLE_F) 
        {
          if (compressed_offset == *compressed_size) {return XCODE_BUFFER_OVERFLOW_ERROR;}
          *(compressed+compressed_offset++) = N1;
        } else {
          if (compressed_offset == *compressed_size) {return XCODE_BUFFER_OVERFLOW_ERROR;}
          *(compressed+compressed_offset++) = DOUBLE_F;
          if (compressed_offset == *compressed_size) {return XCODE_BUFFER_OVERFLOW_ERROR;}
          *(compressed+compressed_offset++) = DOUBLE_9;
        }
      } else {
        if (compressed_offset == *compressed_size) {return XCODE_BUFFER_OVERFLOW_ERROR;}
        *(compressed+compressed_offset++) = DOUBLE_F;
        if (compressed_offset == *compressed_size) {return XCODE_BUFFER_OVERFLOW_ERROR;}
        *(compressed+compressed_offset++) = N1;
      }
	} /* for */

  } else {
    *(compressed+compressed_offset++) = NO_COMPRESSION_FLAG;
    for (i=0; i<(int)uncompressed_size; i++)
    {
      tmp16 = myhtons(*(uncompressed+i));  /* htons ensures [msb,lsb] */
      U2 = tmp8[0];
      N1 = tmp8[1];
      if (U2 == ZERO && N1 == LABEL_DELIMITER) {return XCODE_ENRACE_INTERNAL_DELIMITER_PRESENT;}
      if (compressed_offset > (*compressed_size) - 2) {return XCODE_BUFFER_OVERFLOW_ERROR;}
      *(compressed+compressed_offset++) = U2;
      *(compressed+compressed_offset++) = N1;
    }
  }

  if (compressed_offset > MAX_LABEL_SIZE_8) {return XCODE_ENRACE_COMPRESSION_TOO_LONG;}
  *compressed_size = compressed_offset;

  return XCODE_SUCCESS;
}

/*
 * Xcode_race_RaceDecompress - Employ RACE decompression on a utf-16 string
 */

int Xcode_race_RaceDecompress( const UCHAR8* compressed,
                               const size_t compressed_size,
                               UTF16CHAR* decompressed,
                               size_t* decompressed_size ) 
{
  int i;
  UCHAR8 U1, N1;
  short ff_flag;
  short unescaped_octet_flag;
  short invalid_dns_flag;
  size_t offset;

  UCHAR8 alt_U1;
  short alt_compress_flag;

  #ifdef XCODE_PRINTF_DEBUG
    Xcode_ShowCharString("  Xcode_race_RaceDecompress\n   -> ",compressed,compressed_size,"\n");
  #endif

  if (compressed_size < 1) {return XCODE_BAD_ARGUMENT_ERROR;}
  if (compressed_size == 1) {return XCODE_DERACE_ODD_OCTET_COUNT;}

  invalid_dns_flag = 0;
  unescaped_octet_flag = 0;
  ff_flag = 0;
  offset = 0;
  U1 = *compressed;

  if (U1 >= 0xD9 && U1 <= 0xDF) {return XCODE_DERACE_INVALID_SURROGATES_DECOMPRESSED;}

  if (U1 == NO_COMPRESSION_FLAG) 
  {
    if ((compressed_size-1)%2==1) {return XCODE_DERACE_ODD_OCTET_COUNT;}

    alt_U1 = ZERO;
    alt_compress_flag = 1;

    for (i=1; i<(int)compressed_size; i+=2)
    {
      if (*(compressed+i) != ZERO) 
      {
        if (alt_U1 == ZERO) 
        {
          alt_U1 = *(compressed+i);
        } else if (*(compressed+i) != alt_U1) 
        {
          alt_compress_flag = 0; 
          break;
        }
      }
    }

    if (alt_compress_flag) {return XCODE_DERACE_IMPROPER_NULL_COMPRESSION;}

    i = 1;
    while (i<(int)compressed_size)
    {
      U1 = *(compressed+i++);
      N1 = *(compressed+i++);

      if (U1 == ZERO) 
      {
        if (N1 == LABEL_DELIMITER) {return XCODE_DERACE_INTERNAL_DELIMITER_PRESENT;}
        if (!valid_dns_character8(N1)) {invalid_dns_flag = 1;}
      } else {
        invalid_dns_flag = 1;
      }

      if (offset == *decompressed_size) {return XCODE_BUFFER_OVERFLOW_ERROR;}
      *(decompressed+offset++) = (UTF16CHAR)((U1<<8)+N1);
    }

  } else {

    for (i=1; i<(int)compressed_size; i++)
    {
      N1 = *(compressed+i);

      if (!ff_flag) 
      {
        if (N1 == DOUBLE_F) 
        {
          ff_flag = 1;

        } else {

          if (U1 == ZERO) 
          {
            if (N1 == DOUBLE_9) {return XCODE_DERACE_DOUBLE_ESCAPE_PRESENT;}
            if (N1 == LABEL_DELIMITER) {return XCODE_DERACE_INTERNAL_DELIMITER_PRESENT;}
            if (!valid_dns_character8(N1)) {invalid_dns_flag = 1;}
		  } else {
            invalid_dns_flag = 1;
          }

          unescaped_octet_flag = 1;

          if (offset == *decompressed_size) {return XCODE_BUFFER_OVERFLOW_ERROR;}
          *(decompressed+offset++) = (UTF16CHAR)((U1<<8)+N1);
        }
      } else {

        ff_flag = 0;
        if (N1 == DOUBLE_9) 
        {
          unescaped_octet_flag = 1;
          invalid_dns_flag = 1;

          if (offset == *decompressed_size) {return XCODE_BUFFER_OVERFLOW_ERROR;}
          *(decompressed+offset++) = (UTF16CHAR)((U1<<8)+DOUBLE_F);
        } else {
          if (U1 == ZERO) {return XCODE_DERACE_UNNEEDED_ESCAPE_PRESENT;}
          if (N1 == LABEL_DELIMITER) {return XCODE_DERACE_INTERNAL_DELIMITER_PRESENT;}
          if (!valid_dns_character8(N1)) {invalid_dns_flag = 1;}
          if (offset == *decompressed_size) {return XCODE_BUFFER_OVERFLOW_ERROR;}
          *(decompressed+offset++) = N1;
        }
      }
    }

    if (ff_flag) {return XCODE_DERACE_TRAILING_ESCAPE_PRESENT;}
    if (U1 && !unescaped_octet_flag) {return XCODE_DERACE_UNESCAPED_OCTETS_ABSENT;}
    /*if (offset%2==1) {return XCODE_DERACE_ODD_OCTET_COUNT;}*/
  }

  if (!invalid_dns_flag) {return XCODE_DERACE_DNS_COMPATIBLE_ENCODING_PRESENT;}
  *decompressed_size = offset;

  /* Success */

  #ifdef XCODE_PRINTF_DEBUG
    Xcode_ShowUCharString("   <- ",decompressed,*decompressed_size,"\n");
  #endif

  return XCODE_SUCCESS;
}


/********************************************************************************
 *                              Base32                                          *
 ********************************************************************************/

/* Prototypes */

UCHAR8 Xcode_enmap32_race(const UCHAR8 input);
UCHAR8 Xcode_demap32_race(const UCHAR8 input);
int Xcode_enbase32_race( const UCHAR8* input,
                        const size_t input_size,
                        UCHAR8* output,
                        size_t* output_size );
int Xcode_debase32_race( const UCHAR8* input,
                        const size_t input_size,
                        UCHAR8* output,
                        size_t* output_size );

/*
 * Xcode_enmap32_race - Map 5 bit chunk to dns friendly octet
 */

UCHAR8 Xcode_enmap32_race(const UCHAR8 input) 
{
  if (input <= 0x19) {return input+0x61;}
  if (input <= 0x1F) {return input+0x18;}
  return DOUBLE_F;
}

/*
 * Xcode_demap32_race - Demap dns friendly octet to 5 bit chunk
 */

UCHAR8 Xcode_demap32_race(const UCHAR8 input) 
{
  if (input >= 0x32 && input <= 0x37) {return input-0x18;}
  if (input >= 0x61 && input <= 0x7A) {return input-0x61;}
  return DOUBLE_F;
}

/*
 * Xcode_enbase32_race - Convert compressed multilingual octets to dns friendly octets
 */

int Xcode_enbase32_race( const UCHAR8* input,
                         const size_t input_size,
                         UCHAR8* output,
                         size_t* output_size ) 
{
  size_t output_offset = 0;
  size_t input_offset = 0;
  UCHAR8 octet = ZERO;
  size_t octet_size = 0;
  UCHAR8 delta = 0;
  size_t delta_size = 0;
  size_t old_delta_size = 0;

  #ifdef XCODE_PRINTF_DEBUG
    Xcode_ShowCharString("  Xcode_enbase32_race\n   -> ",input,input_size,"\n");
  #endif

  while (input_offset < input_size) 
  {
    octet = *(input+input_offset);

    if (octet_size == 0) 
    {
      octet = octet >> (3+delta_size);
    } else {
      octet = (UCHAR8)(octet << octet_size);
      octet = octet >> 3;
    }

    delta += octet;

    old_delta_size = delta_size;
    delta_size += (8 - octet_size);

    if (delta_size >= 5) 
    {
      #ifdef XCODE_PRINTF_DEBUG
        Xcode_ShowOctetBinary("    ",delta,5,0,"\n");
      #endif

      if ((*(output+output_offset++) = Xcode_enmap32_race(delta)) == DOUBLE_F)
      {return XCODE_ENBASE32_INVALID_5BIT_CHARACTER;}

      delta = ZERO;
      delta_size = 0;
    }

    octet_size += (5 - old_delta_size);

    if (octet_size >= 8) 
    {
      input_offset++;
      octet_size = 0;
    }
  }

  if (delta_size > 0) 
  {
    #ifdef XCODE_PRINTF_DEBUG
      Xcode_ShowOctetBinary("    ",delta,5,0,"\n");
    #endif

    if ((*(output+output_offset++) = Xcode_enmap32_race(delta)) == DOUBLE_F)
    {return XCODE_ENBASE32_INVALID_5BIT_CHARACTER;}

  }
	
  *output_size = output_offset;

  #ifdef XCODE_PRINTF_DEBUG
    Xcode_ShowAceString("   <- ",output,*output_size,"\n");
  #endif

  return XCODE_SUCCESS;
}

/*
 * Xcode_debase32_race - Deconvert dns friendly octets to compressed multilingual octets
 */

int Xcode_debase32_race( const UCHAR8* input,
                         const size_t input_size,
                         UCHAR8* output,
                         size_t* output_size ) 
{
  size_t output_offset = 0;
  size_t input_offset = 0;
  UCHAR8 delta = ZERO;
  size_t delta_size = 0;
  UCHAR8 pentet = ZERO;
  size_t pentet_size = 0;
  short shift = 0;

  #ifdef XCODE_PRINTF_DEBUG
    Xcode_ShowAceString("  Xcode_debase32_race\n   -> ",input,input_size,"\n");
  #endif

  if ((input_size%8 == 1) ||
      (input_size%8 == 3) ||
      (input_size%8 == 6)) {return XCODE_DEBASE32_5BIT_UNDERFLOW;}

  while (input_offset < input_size) 
  {

    if ((pentet = Xcode_demap32_race(*(input+input_offset))) == DOUBLE_F)
      {return XCODE_DEBASE32_INVALID_ACE_CHARACTERS;}

    shift = (short)(3-delta_size+pentet_size);

    if (shift < 0) {
      pentet = pentet >> (shift*-1);
      delta_size += 5+shift;
      pentet_size += 5+shift;
    } else {
      pentet = (UCHAR8)(pentet << shift);
      delta_size += (5-pentet_size);
      pentet_size += (5-pentet_size);
    }

    delta += pentet;

    if (pentet_size == 5) 
    {
      pentet_size=0;
      input_offset++;
    }

    if (delta_size == 8) 
    {
      #ifdef XCODE_PRINTF_DEBUG
        Xcode_ShowOctetBinary("    ",delta,8,0,"\n");
      #endif

      if (output_offset == *output_size) {return XCODE_BUFFER_OVERFLOW_ERROR;}

      *(output+output_offset++) = delta;
      delta_size = 0;
      delta = ZERO;
    }
  }

  *output_size = output_offset;

  #ifdef XCODE_PRINTF_DEBUG
    Xcode_ShowCharString("   <- ",output,*output_size,"\n");
  #endif

  if (delta) { return XCODE_DEBASE32_5BIT_OVERFLOW;}

  return XCODE_SUCCESS;
}


/********************************************************************************
 *                              Entry Point                                     *
 ********************************************************************************/

/*
 * Xcode_race_encodeString - Encode an undelimited domain label using RACE
 */

int Xcode_race_encodeString( const UTF16CHAR *  unicode,
                             const size_t       unicode_size,
                             UCHAR8 *           race,
                             size_t *           race_size,
                             const UCHAR8 *     race_prefix,
                             const size_t       race_prefix_size ) 
{

  int i;
  size_t      unicode_offset;
  size_t      compressed_size = MAX_LABEL_SIZE_8;
  UCHAR8      compressed[MAX_LABEL_SIZE_8];
  int         return_code;
  short       invalid_dns_flag;
  UTF16CHAR   cursor;

  if (unicode_size < 1) {return XCODE_BAD_ARGUMENT_ERROR;}

  unicode_offset = 0;
  invalid_dns_flag = 0;

  while (unicode_offset < unicode_size) 
  {
    cursor = *(unicode+unicode_offset++);
    if (! valid_dns_character16(cursor)) {invalid_dns_flag = 1;}
  }

  if (invalid_dns_flag) 
  {
    for(i=0; i<(int)race_prefix_size; i++)
    {
      if (i == (int)*race_size) {return XCODE_BUFFER_OVERFLOW_ERROR;}
      *(race+i) = *(race_prefix+i);
    }

    (*race_size) -= race_prefix_size;

    return_code = Xcode_race_RaceCompress(unicode,unicode_size,compressed,&compressed_size);
    if (return_code != XCODE_SUCCESS) {return return_code; }

    return_code = Xcode_enbase32_race(compressed,compressed_size,race+race_prefix_size,race_size);
    if (return_code != XCODE_SUCCESS) {return return_code; }

    (*race_size) += race_prefix_size;

  } else {
    return_code = shrink_UChar_to_Octet(unicode,unicode_size,race,race_size);
    if (return_code != XCODE_SUCCESS) {return return_code; }
  }

  /* terminate the string */

  *(race + *race_size) = 0;

  return XCODE_SUCCESS;
}

/*
 * Xcode_race_decodeString - Decode an undelimited domain label using RACE
 */

int Xcode_race_decodeString( UCHAR8 *       race,
                             const size_t   race_size,
                             UTF16CHAR *    unicode,
                             size_t *       unicode_size,
                             const UCHAR8 * race_prefix,
                             const size_t   race_prefix_size ) 
{

  size_t      compressed_size = MAX_LABEL_SIZE_8;
  UCHAR8      compressed[MAX_LABEL_SIZE_8];
  int         return_code;
  int i;

  if (race_size < 1) {return XCODE_BAD_ARGUMENT_ERROR;}

  if (starts_with_ignore_case(race,race_size,race_prefix,race_prefix_size)) 
  {

    lower_case(race,race_size);

    return_code=Xcode_debase32_race(race+race_prefix_size,race_size-race_prefix_size,compressed,&compressed_size);
    if (return_code != XCODE_SUCCESS) {return return_code; }

    return_code = Xcode_race_RaceDecompress(compressed,compressed_size,unicode,unicode_size);
    if (return_code != XCODE_SUCCESS) {return return_code; }

  } else {

    for (i=0; i<(int)race_size; i++)
    {
      if (*(race+i) == LABEL_DELIMITER) {return XCODE_DERACE_INTERNAL_DELIMITER_PRESENT;}
    }

    return_code = expand_Octet_to_UChar(race,race_size,unicode,unicode_size);
    if (return_code != XCODE_SUCCESS) {return return_code; }

  }

  /* terminate the string */

  *(unicode + *unicode_size) = 0;

  return XCODE_SUCCESS;
}

#endif /* SUPPORT_RACE */



