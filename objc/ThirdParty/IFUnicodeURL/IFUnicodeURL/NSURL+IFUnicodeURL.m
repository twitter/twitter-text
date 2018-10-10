// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

//  Created by Sean Heber on 4/22/10.

#pragma mark imports

#import "IDNSDK/toxxx.h"
#import "IDNSDK/xcode.h"
#import "NSURL+IFUnicodeURL.h"

#pragma mark -

static NSString * const kIFUnicodeURLErrorDomain = @"kIFUnicodeURLErrorDomain";

@interface NSString (IFUnicodeURLHelpers)

/**
 This method checks if UTF-16 character sequence in the string is valid or not.
 If the string contains isolated high surrogate or isolated low surrogate, it is invalid.

 @return NO if the string contains invalid sequence, YES otherwise.
 */
- (BOOL)_IFUnicodeURL_isValidCharacterSequence;

- (NSArray *)_IFUnicodeURL_splitAfterString:(NSString *)string;
- (NSArray *)_IFUnicodeURL_splitBeforeCharactersInSet:(NSCharacterSet *)chars;
@end


@implementation NSString (IFUnicodeURLHelpers)

- (BOOL)_IFUnicodeURL_isValidCharacterSequence
{
    NSUInteger length = self.length;
    if (length == 0) {
        return YES;
    }

    unichar buffer[length];
    [self getCharacters:buffer range:NSMakeRange(0, length)];

    BOOL pendingSurrogateHigh = NO;
    for (NSInteger index = 0; index < (NSInteger)length; index++) {
        unichar c = buffer[index];
        if (CFStringIsSurrogateHighCharacter(c)) {
            if (pendingSurrogateHigh) {
                // Surrogate high after surrogate high
                return NO;
            } else {
                pendingSurrogateHigh = YES;
            }
        } else if (CFStringIsSurrogateLowCharacter(c)) {
            if (pendingSurrogateHigh) {
                pendingSurrogateHigh = NO;
            } else {
                // Isolated surrogate low
                return NO;
            }
        } else {
            if (pendingSurrogateHigh) {
                // Isolated surrogate high
                return NO;
            }
        }
    }

    if (pendingSurrogateHigh) {
        // Isolated surrogate high
        return NO;
    }

    return YES;
}

- (NSArray *)_IFUnicodeURL_splitAfterString:(NSString *)string
{
    NSString *firstPart;
    NSString *secondPart;
    NSRange range = [self rangeOfString:string];

    if (range.location != NSNotFound) {
        NSUInteger index = range.location+range.length;
        firstPart = [self substringToIndex:index];
        secondPart = [self substringFromIndex:index];
    } else {
        firstPart = @"";
        secondPart = self;
    }

    return [NSArray arrayWithObjects:firstPart, secondPart, nil];
}

- (NSArray *)_IFUnicodeURL_splitBeforeCharactersInSet:(NSCharacterSet *)chars
{
    NSUInteger index=0;
    for (; index<[self length]; index++) {
        if ([chars characterIsMember:[self characterAtIndex:index]]) {
            break;
        }
    }

    return [NSArray arrayWithObjects:[self substringToIndex:index], [self substringFromIndex:index], nil];
}

@end

static NSString *ConvertUnicodeDomainString(NSString *hostname, BOOL toAscii, NSError **error)
{
    const UTF16CHAR *inputString = (const UTF16CHAR *)[hostname cStringUsingEncoding:NSUTF16StringEncoding];
    NSUInteger inputLength = [hostname lengthOfBytesUsingEncoding:NSUTF16StringEncoding] / sizeof(UTF16CHAR);

    int ret = XCODE_SUCCESS;
    if (toAscii) {
        int outputLength = MAX_DOMAIN_SIZE_8;
        UCHAR8 outputString[outputLength];
        ret = Xcode_DomainToASCII(inputString, (int) inputLength, outputString, &outputLength);
        if (XCODE_SUCCESS == ret) {
            hostname = [[NSString alloc] initWithBytes:outputString length:outputLength encoding:NSASCIIStringEncoding];
        } else {
            // NSURL specifies that if a URL is malformed then URLWithString: returns nil, so
            // on error we return nil here.
            hostname = nil;
        }
    } else {
        int outputLength = MAX_DOMAIN_SIZE_16;
        UTF16CHAR outputString[outputLength];
        ret = Xcode_DomainToUnicode16(inputString, (int) inputLength, outputString, &outputLength);
        if (XCODE_SUCCESS == ret) {
            hostname = [[NSString alloc] initWithCharacters:outputString length:outputLength];
        } else {
            // NSURL specifies that if a URL is malformed then URLWithString: returns nil, so
            // on error we return nil here.
            hostname = nil;
        }
    }

    if (error && ret != XCODE_SUCCESS) {
        *error = [NSError errorWithDomain:kIFUnicodeURLErrorDomain code:ret userInfo:nil];
    }

    return hostname;
}

static NSString *ConvertUnicodeURLString(NSString *str, BOOL toAscii, NSError **error)
{
    if (!str) {
        return nil;
    }
    NSMutableArray *urlParts = [NSMutableArray array];
    NSString *hostname = nil;
    NSArray *parts = nil;

    parts = [str _IFUnicodeURL_splitAfterString:@":"];
    hostname = [parts objectAtIndex:1];
    [urlParts addObject:[parts objectAtIndex:0]];

    parts = [hostname _IFUnicodeURL_splitAfterString:@"//"];
    hostname = [parts objectAtIndex:1];
    [urlParts addObject:[parts objectAtIndex:0]];

    parts = [hostname _IFUnicodeURL_splitBeforeCharactersInSet:[NSCharacterSet characterSetWithCharactersInString:@"/?#"]];
    hostname = [parts objectAtIndex:0];
    [urlParts addObject:[parts objectAtIndex:1]];

    parts = [hostname _IFUnicodeURL_splitAfterString:@"@"];
    hostname = [parts objectAtIndex:1];
    [urlParts addObject:[parts objectAtIndex:0]];

    parts = [hostname _IFUnicodeURL_splitBeforeCharactersInSet:[NSCharacterSet characterSetWithCharactersInString:@":"]];
    hostname = [parts objectAtIndex:0];
    [urlParts addObject:[parts objectAtIndex:1]];

    // Now that we have isolated just the hostname, do the magic decoding...
    hostname = ConvertUnicodeDomainString(hostname, toAscii, error);
    if (!hostname) {
        return nil;
    }
    // This will try to clean up the stuff after the hostname in the URL by making sure it's all encoded properly.
    // NSURL doesn't normally do anything like this, but I found it useful for my purposes to put it in here.
    NSString *afterHostname = [[urlParts objectAtIndex:4] stringByAppendingString:[urlParts objectAtIndex:2]];
    NSString *processedAfterHostname = [afterHostname stringByRemovingPercentEncoding] ?: afterHostname;
    static NSCharacterSet *sURLFragmentPlusHashtagPlusBracketsCharacterSet;
    static dispatch_once_t sConstructURLFragmentPlusHashtagPlusBracketsOnceToken;
    dispatch_once(&sConstructURLFragmentPlusHashtagPlusBracketsOnceToken, ^{
        NSMutableCharacterSet *URLFragmentPlusHashtagPlusBracketsMutableCharacterSet = [[NSCharacterSet URLFragmentAllowedCharacterSet] mutableCopy];
        [URLFragmentPlusHashtagPlusBracketsMutableCharacterSet addCharactersInString:@"#[]"];
        sURLFragmentPlusHashtagPlusBracketsCharacterSet = [URLFragmentPlusHashtagPlusBracketsMutableCharacterSet copy];
    });
    NSString* finalAfterHostname = [processedAfterHostname stringByAddingPercentEncodingWithAllowedCharacters:sURLFragmentPlusHashtagPlusBracketsCharacterSet];

    // Now recreate the URL safely with the new hostname (if it was successful) instead...
    NSArray *reconstructedArray = [NSArray arrayWithObjects:[urlParts objectAtIndex:0], [urlParts objectAtIndex:1], [urlParts objectAtIndex:3], hostname, finalAfterHostname, nil];
    NSString *reconstructedURLString = [reconstructedArray componentsJoinedByString:@""];

    if (reconstructedURLString.length == 0) {
        return nil;
    }
    if (![reconstructedURLString _IFUnicodeURL_isValidCharacterSequence]) {
        // If reconstructedURLString contains invalid UTF-16 sequence,
        // we treat it as an error.
        return nil;
    }
    return reconstructedURLString;
}

@implementation NSURL (IFUnicodeURL)

+ (NSURL *)URLWithUnicodeString:(NSString *)str
{
    return [self URLWithUnicodeString:str error:nil];
}

+ (NSURL *)URLWithUnicodeString:(NSString *)str error:(NSError **)error
{
    return ([str length]) ? [[self alloc] initWithUnicodeString:str error:error] : nil;
}

- (instancetype)initWithUnicodeString:(NSString *)str
{
    return [self initWithUnicodeString:str error:nil];
}

- (instancetype)initWithUnicodeString:(NSString *)str error:(NSError **)error
{
    str = ConvertUnicodeURLString(str, YES, error);
    self = (str) ? [self initWithString:str] : nil;
    return self;
}

- (NSString *)unicodeAbsoluteString
{
    return ConvertUnicodeURLString([self absoluteString], NO, nil);
}

- (NSString *)unicodeHost
{
    return ConvertUnicodeDomainString([self host], NO, nil);
}

+ (NSString *)decodeUnicodeDomainString:(NSString*)domain
{
    return ConvertUnicodeDomainString(domain, NO, nil);
}

@end
