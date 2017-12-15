//  Created by Sean Heber on 4/22/10.
#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

// These map to error codes defined in toxxx.h
typedef NS_ENUM(NSUInteger, IFUnicodeURLConvertError) {
    IFUnicodeURLConvertErrorNone             = 0,
    IFUnicodeURLConvertErrorSTD3NonLDH       = 300,
    IFUnicodeURLConvertErrorSTD3Hyphen       = 301,
    IFUnicodeURLConvertErrorAlreadyEncoded   = 302,
    IFUnicodeURLConvertErrorInvalidDNSLength = 303,
    IFUnicodeURLConvertErrorCircleCheck      = 304
};

@interface NSURL (IFUnicodeURL)

// These take a normal NSString that may (or may not) contain a URL with a non-ASCII host name.
// Normally NSURL doesn't work with these kinds of URLs (at least on iOS as of 11.0).
// This will decode them according to the various RFCs into the ASCII host name and return a normal NSURL
// object instance made with the converted host string in place of the unicode one.
// NOTE: These methods also sanitize the path/query by decoding and re-encoding any percent escaped stuff.
// NSURL doesn't normally do anything like that, but I found it handy to have.
+ (NSURL *)URLWithUnicodeString:(NSString *)str error:(NSError * _Nullable *)error;
- (instancetype)initWithUnicodeString:(NSString *)str error:(NSError * _Nullable *)error;

+ (NSURL *)URLWithUnicodeString:(NSString *)str;
- (instancetype)initWithUnicodeString:(NSString *)str;

// This will return the same thing as NSURL's absoluteString method, but it converts the domain back into
// the unicode characters that a user would expect to see in a UI, etc.
- (NSString *)unicodeAbsoluteString;

// Returns the same as NSURL's host method, but will convert it back into the unicode characters if possible.
- (NSString *)unicodeHost;

+ (NSString *)decodeUnicodeDomainString:(NSString *)domain;

@end

NS_ASSUME_NONNULL_END
