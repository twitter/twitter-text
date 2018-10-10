// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0
//
//  NSURL+IFUnicodeURLTest.m
//  TFSUtilities
//
//  Created by Satoshi Nakagawa on 11/18/14.
//

@import TwitterText.NSURL_IFUnicodeURL;
@import XCTest;


@interface NSURL_IFUnicodeURLTest : XCTestCase
@end

@implementation NSURL_IFUnicodeURLTest

- (void)testURLWithStringWithNormalDomain
{
    NSURL *url = [NSURL URLWithString:@"https://www.google.com"];
    XCTAssertEqualObjects([url unicodeAbsoluteString], @"https://www.google.com");
    XCTAssertEqualObjects([url absoluteString], @"https://www.google.com");
    XCTAssertEqualObjects([url unicodeHost], @"www.google.com");
}

- (void)testURLWithUnicodeStringWithNormalDomain
{
    NSURL *url = [NSURL URLWithUnicodeString:@"https://www.google.com"];
    XCTAssertEqualObjects([url unicodeAbsoluteString], @"https://www.google.com");
    XCTAssertEqualObjects([url absoluteString], @"https://www.google.com");
    XCTAssertEqualObjects([url unicodeHost], @"www.google.com");
}

- (void)testURLWithStringWithJapaneseDomain
{
    NSURL *url = [NSURL URLWithString:@"https://xn--eckwd4c7cu47r2wf.jp"];
    XCTAssertEqualObjects([url unicodeAbsoluteString], @"https://ドメイン名例.jp");
    XCTAssertEqualObjects([url absoluteString], @"https://xn--eckwd4c7cu47r2wf.jp");
    XCTAssertEqualObjects([url unicodeHost], @"ドメイン名例.jp");
}

- (void)testURLWithUnicodeStringWithJapaneseDomain
{
    NSURL *url = [NSURL URLWithUnicodeString:@"http://ドメイン名例.jp"];
    XCTAssertEqualObjects([url unicodeAbsoluteString], @"http://ドメイン名例.jp");
    XCTAssertEqualObjects([url absoluteString], @"http://xn--eckwd4c7cu47r2wf.jp");
    XCTAssertEqualObjects([url unicodeHost], @"ドメイン名例.jp");
}

- (void)testURLWithUnicodeStringWithEmojiDomain
{
    NSURL *url = [NSURL URLWithUnicodeString:@"https://😭😭😭😂😂😂😭😭😭💯💯💯💯💯.com/😭😭"];
    XCTAssertEqualObjects([url unicodeAbsoluteString], @"https://😭😭😭😂😂😂😭😭😭💯💯💯💯💯.com/%F0%9F%98%AD%F0%9F%98%AD");
    XCTAssertEqualObjects([url absoluteString], @"https://xn--rs8haaaa34raa89aaadaa.com/%F0%9F%98%AD%F0%9F%98%AD");
    XCTAssertEqualObjects([url unicodeHost], @"😭😭😭😂😂😂😭😭😭💯💯💯💯💯.com");
}

- (void)testURLWithUnicodeStringWithInvalidLongUnicodeDomain
{
    NSURL *url = [NSURL URLWithUnicodeString:@"http://あいうえおかきくけこあいうえおかきくけこあいうえおかきくけこあいうえおかきくけこあいうえおかきくけこあいう.com"];
    XCTAssertNil(url);
}

- (void)testDecodeUnicodeDomainStringWithNormalDomain
{
    NSString *decodedDomain = [NSURL decodeUnicodeDomainString:@"www.google.com"];
    XCTAssertEqualObjects(decodedDomain, @"www.google.com");
}

- (void)testDecodeUnicodeDomainStringWithTCO
{
    NSString *decodedDomain = [NSURL decodeUnicodeDomainString:@"t.co"];
    XCTAssertEqualObjects(decodedDomain, @"t.co");
}

- (void)testDecodeUnicodeDomainStringWithJapaneseDomain
{
    NSString *decodedDomain = [NSURL decodeUnicodeDomainString:@"xn--eckwd4c7cu47r2wf.jp"];
    XCTAssertEqualObjects(decodedDomain, @"ドメイン名例.jp");
}

- (void)testDecodeUnicodeDomainStringWithEmojiDomain
{
    NSString *decodedDomain = [NSURL decodeUnicodeDomainString:@"xn--rs8haaaa34raa89aaadaa.com"];
    XCTAssertEqualObjects(decodedDomain, @"😭😭😭😂😂😂😭😭😭💯💯💯💯💯.com");
}

- (void)testDecodeUnicodeDomainStringWithInvalidPunycodeInternational
{
    NSString *decodedDomain = [NSURL decodeUnicodeDomainString:@"xn--みんな.com"];
    XCTAssertEqualObjects(decodedDomain, @"xn--みんな.com");
}

- (void)testDecodeUnicodeDomainStringWithInvalidPunycode
{
    // This looks strange. But this is the current library spec.
    NSString *decodedDomain = [NSURL decodeUnicodeDomainString:@"xn--0.com"];
    XCTAssertEqualObjects(decodedDomain, @".com");
}

- (void)testDecodeUnicodeDomainStringWithInvalidInternationalDomain
{
    // This looks strange. But this is the current library spec.
    NSString *decodedDomain = [NSURL decodeUnicodeDomainString:@"www.xn--l8j3933d.com"];
    XCTAssertEqualObjects(decodedDomain, @"www..com");
}

@end
