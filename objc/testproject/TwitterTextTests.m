//
//  TwitterTextTests.m
//
//  Copyright 2012-2014 Twitter, Inc.
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//  http://www.apache.org/licenses/LICENSE-2.0
//

#import "TwitterTextTests.h"
#import "TwitterText.h"

@implementation TwitterTextTests

- (void)setUp
{
    [super setUp];
}

- (void)tearDown
{
    [super tearDown];
}

- (void)testRemainingCountForLongTweet
{
    XCTAssertEqual([TwitterText remainingCharacterCount:@"123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890" httpURLLength:22 httpsURLLength:23], (NSInteger)-10);
}

- (void)testHashtagBoundary
{
    NSCharacterSet *set = [TwitterText validHashtagBoundaryCharacterSet];
    XCTAssertTrue(set != nil);
    XCTAssertFalse([set characterIsMember:'a']);
    XCTAssertFalse([set characterIsMember:'m']);
    XCTAssertFalse([set characterIsMember:'z']);
    XCTAssertFalse([set characterIsMember:'A']);
    XCTAssertFalse([set characterIsMember:'M']);
    XCTAssertFalse([set characterIsMember:'Z']);
    XCTAssertFalse([set characterIsMember:'0']);
    XCTAssertFalse([set characterIsMember:'5']);
    XCTAssertFalse([set characterIsMember:'9']);
    XCTAssertFalse([set characterIsMember:'_']);
    XCTAssertFalse([set characterIsMember:'&']);
    XCTAssertTrue([set characterIsMember:' ']);
    XCTAssertTrue([set characterIsMember:'#']);
    XCTAssertTrue([set characterIsMember:'@']);
    XCTAssertTrue([set characterIsMember:',']);
    XCTAssertTrue([set characterIsMember:'=']);
    XCTAssertTrue([set characterIsMember:[@"　" characterAtIndex:0]]);
    XCTAssertTrue([set characterIsMember:[@"\u00BF" characterAtIndex:0]]);
    XCTAssertFalse([set characterIsMember:[@"\u00C0" characterAtIndex:0]]);
    XCTAssertFalse([set characterIsMember:[@"\u00D6" characterAtIndex:0]]);
    XCTAssertTrue([set characterIsMember:[@"\u00D7" characterAtIndex:0]]);
    XCTAssertFalse([set characterIsMember:[@"\u00E0" characterAtIndex:0]]);

    NSString *validLongCharacterString = @"\U0001FFFF";
    XCTAssertTrue([set longCharacterIsMember:CFStringGetLongCharacterForSurrogatePair([validLongCharacterString characterAtIndex:0], [validLongCharacterString characterAtIndex:1])]);

    NSString *invalidLongCharacterString = @"\U00020000";
    XCTAssertFalse([set longCharacterIsMember:CFStringGetLongCharacterForSurrogatePair([invalidLongCharacterString characterAtIndex:0], [invalidLongCharacterString characterAtIndex:1])]);
}

- (void)testLongDomain
{
    NSString *text = @"jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp";
    NSArray *entities = [TwitterText entitiesInText:text];
    XCTAssertEqual(entities.count, (NSUInteger)1);
    if (entities.count >= 1) {
        TwitterTextEntity *entity = [entities objectAtIndex:0];
        XCTAssertEqualObjects(NSStringFromRange(entity.range), NSStringFromRange(NSMakeRange(0, text.length)));
    }
}

- (void)testJapaneseTLDFollowedByJapaneseCharacters
{
    NSString *text = @"テスト test.みんなです";
    NSArray *entities = [TwitterText entitiesInText:text];
    XCTAssertEqual(entities.count, (NSUInteger)1);
    if (entities.count >= 1) {
        TwitterTextEntity *entity = [entities objectAtIndex:0];
        XCTAssertEqualObjects(NSStringFromRange(entity.range), NSStringFromRange(NSMakeRange(4, 8)));
    }
}

- (void)testJapaneseTLDFollowedByASCIICharacters
{
    NSString *text = @"テスト test.みんなabc";
    NSArray *entities = [TwitterText entitiesInText:text];
    XCTAssertEqual(entities.count, (NSUInteger)0);
}

- (void)testDomainFollowedByJapaneseCharacters
{
    NSString *text = @"example.comてすとですtwitter.みんなです.comcast.com";
    NSArray *entities = [TwitterText entitiesInText:text];
    XCTAssertEqual(entities.count, (NSUInteger)3);
    if (entities.count >= 3) {
        TwitterTextEntity *firstEntity = [entities objectAtIndex:0];
        XCTAssertEqualObjects(NSStringFromRange(firstEntity.range), NSStringFromRange(NSMakeRange(0, 11)));
        TwitterTextEntity *secondEntity = [entities objectAtIndex:1];
        XCTAssertEqualObjects(NSStringFromRange(secondEntity.range), NSStringFromRange(NSMakeRange(16, 11)));
        TwitterTextEntity *thirdEntity = [entities objectAtIndex:2];
        XCTAssertEqualObjects(NSStringFromRange(thirdEntity.range), NSStringFromRange(NSMakeRange(30, 11)));
    }
}

- (void)testURLDomainWithInvalidTLD
{
    NSString *text = @"test http://example.comだよね.comtest/hogehoge";
    NSArray *entities = [TwitterText entitiesInText:text];
    XCTAssertEqual(entities.count, (NSUInteger)0);
}

- (void)testExtract
{
    NSString *sourceFilePath = [[NSString alloc] initWithCString:__FILE__ encoding:NSUTF8StringEncoding];
#if !__has_feature(objc_arc)
    [sourceFilePath autorelease];
#endif
    sourceFilePath = [[sourceFilePath stringByDeletingLastPathComponent] stringByDeletingLastPathComponent];
    NSString *baseFileName = @"test/json-conformance/extract.json";
    NSString *fileName = [sourceFilePath stringByAppendingPathComponent:baseFileName];
    NSData *data = [NSData dataWithContentsOfFile:fileName];
    if (!data) {
        XCTFail(@"No test data: %@", fileName);
        return;
    }
    NSDictionary *rootDic = [NSJSONSerialization JSONObjectWithData:data options:0 error:NULL];
    if (!rootDic) {
        XCTFail(@"Invalid test data: %@", fileName);
        return;
    }
    
    NSDictionary *tests = [rootDic objectForKey:@"tests"];
    
    NSArray *mentions = [tests objectForKey:@"mentions"];
    NSArray *mentionsWithIndices = [tests objectForKey:@"mentions_with_indices"];
    NSArray *mentionsOrListsWithIndices = [tests objectForKey:@"mentions_or_lists_with_indices"];
    NSArray *replies = [tests objectForKey:@"replies"];
    NSArray *urls = [tests objectForKey:@"urls"];
    NSArray *urlsWithIndices = [tests objectForKey:@"urls_with_indices"];
    NSArray *hashtags = [tests objectForKey:@"hashtags"];
    NSArray *hashtagsWithIndices = [tests objectForKey:@"hashtags_with_indices"];
    NSArray *symbols = [tests objectForKey:@"cashtags"];
    NSArray *symbolsWithIndices = [tests objectForKey:@"cashtags_with_indices"];
    
    //
    // Mentions
    //
    
    for (NSDictionary *testCase in mentions) {
        NSString *text = [testCase objectForKey:@"text"];
        NSArray *expected = [testCase objectForKey:@"expected"];
        
        NSArray *results = [TwitterText mentionsOrListsInText:text];
        if (results.count == expected.count) {
            NSUInteger count = results.count;
            for (NSUInteger i = 0; i < count; i++) {
                NSString *expectedText = [expected objectAtIndex:i];
                
                TwitterTextEntity *entity = [results objectAtIndex:i];
                NSRange actualRange = entity.range;
                actualRange.location++;
                actualRange.length--;
                NSString *actualText = [text substringWithRange:actualRange];
                
                XCTAssertEqualObjects(expectedText, actualText, @"%@", testCase);
            }
        } else {
            XCTFail(@"Matching count is different: %lu != %lu\n%@", expected.count, results.count, testCase);
        }
    }
    
    //
    // Mentions with indices
    //
    
    for (NSDictionary *testCase in mentionsWithIndices) {
        NSString *text = [testCase objectForKey:@"text"];
        NSArray *expected = [testCase objectForKey:@"expected"];
        
        NSArray *results = [TwitterText mentionsOrListsInText:text];
        if (results.count == expected.count) {
            NSUInteger count = results.count;
            for (NSUInteger i = 0; i < count; i++) {
                NSDictionary *expectedDic = [expected objectAtIndex:i];
                NSString *expectedText = [expectedDic objectForKey:@"screen_name"];
                NSArray *indices = [expectedDic objectForKey:@"indices"];
                NSUInteger expectedStart = [[indices objectAtIndex:0] unsignedIntegerValue];
                NSUInteger expectedEnd = [[indices objectAtIndex:1] unsignedIntegerValue];
                if (expectedEnd < expectedStart) {
                    XCTFail(@"Expected start is greater than expected end: %ld, %ld", expectedStart, expectedEnd);
                }
                NSRange expectedRange = NSMakeRange(expectedStart, expectedEnd - expectedStart);
                
                TwitterTextEntity *entity = [results objectAtIndex:i];
                NSRange actualRange = entity.range;
                NSRange r = actualRange;
                r.location++;
                r.length--;
                NSString *actualText = [text substringWithRange:r];
                
                XCTAssertEqualObjects(expectedText, actualText, @"%@", testCase);
                XCTAssertTrue(NSEqualRanges(expectedRange, actualRange), @"%@ != %@\n%@", NSStringFromRange(expectedRange), NSStringFromRange(actualRange), testCase);
            }
        } else {
            XCTFail(@"Matching count is different: %lu != %lu\n%@", expected.count, results.count, testCase);
        }
    }
    
    //
    // Mentions or lists with indices
    //
    
    for (NSDictionary *testCase in mentionsOrListsWithIndices) {
        NSString *text = [testCase objectForKey:@"text"];
        NSArray *expected = [testCase objectForKey:@"expected"];
        
        NSArray *results = [TwitterText mentionsOrListsInText:text];
        if (results.count == expected.count) {
            NSUInteger count = results.count;
            for (NSUInteger i = 0; i < count; i++) {
                NSDictionary *expectedDic = [expected objectAtIndex:i];
                NSString *expectedText = [expectedDic objectForKey:@"screen_name"];
                NSString *expectedListSlug = [expectedDic objectForKey:@"list_slug"];
                if (expectedListSlug.length > 0) {
                    expectedText = [expectedText stringByAppendingString:expectedListSlug];
                }
                NSArray *indices = [expectedDic objectForKey:@"indices"];
                NSUInteger expectedStart = [[indices objectAtIndex:0] unsignedIntegerValue];
                NSUInteger expectedEnd = [[indices objectAtIndex:1] unsignedIntegerValue];
                if (expectedEnd < expectedStart) {
                    XCTFail(@"Expected start is greater than expected end: %ld, %ld", expectedStart, expectedEnd);
                }
                NSRange expectedRange = NSMakeRange(expectedStart, expectedEnd - expectedStart);
                
                TwitterTextEntity *entity = [results objectAtIndex:i];
                NSRange actualRange = entity.range;
                NSRange r = actualRange;
                r.location++;
                r.length--;
                NSString *actualText = [text substringWithRange:r];
                
                XCTAssertEqualObjects(expectedText, actualText, @"%@", testCase);
                XCTAssertTrue(NSEqualRanges(expectedRange, actualRange), @"%@ != %@\n%@", NSStringFromRange(expectedRange), NSStringFromRange(actualRange), testCase);
            }
        } else {
            XCTFail(@"Matching count is different: %lu != %lu\n%@", expected.count, results.count, testCase);
        }
    }

    //
    // Replies
    //
    
    for (NSDictionary *testCase in replies) {
        NSString *text = [testCase objectForKey:@"text"];
        NSString *expected = [testCase objectForKey:@"expected"];
        if (expected == (id)[NSNull null]) {
            expected = nil;
        }
        
        TwitterTextEntity *result = [TwitterText repliedScreenNameInText:text];
        if (result || expected) {
            NSRange range = result.range;
            NSString *actual = [text substringWithRange:range];
            if (expected == nil) {
                XCTAssertNil(actual, @"%@\n%@", actual, testCase);
            } else {
                XCTAssertEqualObjects(expected, actual, @"%@", testCase);
            }
        }
    }

    //
    // URLs
    //
    
    for (NSDictionary *testCase in urls) {
        NSString *text = [testCase objectForKey:@"text"];
        NSArray *expected = [testCase objectForKey:@"expected"];

        NSArray *results = [TwitterText URLsInText:text];
        if (results.count == expected.count) {
            NSUInteger count = results.count;
            for (NSUInteger i = 0; i < count; i++) {
                NSString *expectedText = [expected objectAtIndex:i];
                
                TwitterTextEntity *entity = [results objectAtIndex:i];
                NSRange r = entity.range;
                NSString *actualText = [text substringWithRange:r];
                
                XCTAssertEqualObjects(expectedText, actualText, @"%@", testCase);
            }
        } else {
            NSMutableArray *resultTexts = [NSMutableArray array];
            for (TwitterTextEntity *entity in results) {
                [resultTexts addObject:[text substringWithRange:entity.range]];
            }
            XCTFail(@"Matching count is different: %lu != %lu\n%@\n%@", expected.count, results.count, testCase, resultTexts);
        }
    }
    
    //
    // URLs with indices
    //
    
    for (NSDictionary *testCase in urlsWithIndices) {
        NSString *text = [testCase objectForKey:@"text"];
        NSArray *expected = [testCase objectForKey:@"expected"];
        
        NSArray *results = [TwitterText URLsInText:text];
        if (results.count == expected.count) {
            NSUInteger count = results.count;
            for (NSUInteger i = 0; i < count; i++) {
                NSDictionary *expectedDic = [expected objectAtIndex:i];
                NSString *expectedUrl = [expectedDic objectForKey:@"url"];
                NSArray *expectedIndices = [expectedDic objectForKey:@"indices"];
                NSUInteger expectedStart = [[expectedIndices objectAtIndex:0] unsignedIntegerValue];
                NSUInteger expectedEnd = [[expectedIndices objectAtIndex:1] unsignedIntegerValue];
                if (expectedEnd < expectedStart) {
                    XCTFail(@"Expected start is greater than expected end: %ld, %ld", expectedStart, expectedEnd);
                }
                NSRange expectedRange = NSMakeRange(expectedStart, expectedEnd - expectedStart);
                
                TwitterTextEntity *entity = [results objectAtIndex:i];
                NSRange actualRange = entity.range;
                NSString *actualText = [text substringWithRange:actualRange];
                
                XCTAssertEqualObjects(expectedUrl, actualText, @"%@", testCase);
                XCTAssertTrue(NSEqualRanges(expectedRange, actualRange), @"%@ != %@\n%@", NSStringFromRange(expectedRange), NSStringFromRange(actualRange), testCase);
            }
        } else {
            NSMutableArray *resultTexts = [NSMutableArray array];
            for (TwitterTextEntity *entity in results) {
                [resultTexts addObject:[text substringWithRange:entity.range]];
            }
            XCTFail(@"Matching count is different: %lu != %lu\n%@\n%@", expected.count, results.count, testCase, resultTexts);
        }
    }
    
    //
    // Hashtags
    //
    
    for (NSDictionary *testCase in hashtags) {
        NSString *text = [testCase objectForKey:@"text"];
        NSArray *expected = [testCase objectForKey:@"expected"];
        
        NSArray *results = [TwitterText hashtagsInText:text checkingURLOverlap:YES];
        if (results.count == expected.count) {
            NSUInteger count = results.count;
            for (NSUInteger i = 0; i < count; i++) {
                NSString *expectedText = [expected objectAtIndex:i];
                
                TwitterTextEntity *entity = [results objectAtIndex:i];
                NSRange r = entity.range;
                r.location++;
                r.length--;
                NSString *actualText = [text substringWithRange:r];
                
                XCTAssertEqualObjects(expectedText, actualText, @"%@", testCase);
            }
        } else {
            NSMutableArray *resultTexts = [NSMutableArray array];
            for (TwitterTextEntity *entity in results) {
                [resultTexts addObject:[text substringWithRange:entity.range]];
            }
            XCTFail(@"Matching count is different: %lu != %lu\n%@\n%@", expected.count, results.count, testCase, resultTexts);
        }
    }
    
    //
    // Hashtags with indices
    //
    
    for (NSDictionary *testCase in hashtagsWithIndices) {
        NSString *text = [testCase objectForKey:@"text"];
        NSArray *expected = [testCase objectForKey:@"expected"];
        
        NSArray *results = [TwitterText hashtagsInText:text checkingURLOverlap:YES];
        if (results.count == expected.count) {
            NSUInteger count = results.count;
            for (NSUInteger i = 0; i < count; i++) {
                NSDictionary *expectedDic = [expected objectAtIndex:i];
                NSString *expectedHashtag = [expectedDic objectForKey:@"hashtag"];
                NSArray *expectedIndices = [expectedDic objectForKey:@"indices"];
                NSUInteger expectedStart = [[expectedIndices objectAtIndex:0] unsignedIntegerValue];
                NSUInteger expectedEnd = [[expectedIndices objectAtIndex:1] unsignedIntegerValue];
                if (expectedEnd < expectedStart) {
                    XCTFail(@"Expected start is greater than expected end: %ld, %ld", expectedStart, expectedEnd);
                }
                NSRange expectedRange = NSMakeRange(expectedStart, expectedEnd - expectedStart);
                
                TwitterTextEntity *entity = [results objectAtIndex:i];
                NSRange actualRange = entity.range;
                NSRange r = actualRange;
                r.location++;
                r.length--;
                NSString *actualText = [text substringWithRange:r];
                
                XCTAssertEqualObjects(expectedHashtag, actualText, @"%@", testCase);
                XCTAssertTrue(NSEqualRanges(expectedRange, actualRange), @"%@ != %@\n%@", NSStringFromRange(expectedRange), NSStringFromRange(actualRange), testCase);
            }
        } else {
            NSMutableArray *resultTexts = [NSMutableArray array];
            for (TwitterTextEntity *entity in results) {
                [resultTexts addObject:[text substringWithRange:entity.range]];
            }
            XCTFail(@"Matching count is different: %lu != %lu\n%@\n%@", expected.count, results.count, testCase, resultTexts);
        }
    }
    
    //
    // Symbols
    //
    for (NSDictionary *testCase in symbols) {
        NSString *text = [testCase objectForKey:@"text"];
        NSArray *expected = [testCase objectForKey:@"expected"];
        
        NSArray *results = [TwitterText symbolsInText:text checkingURLOverlap:YES];
        if (results.count == expected.count) {
            NSUInteger count = results.count;
            for (NSUInteger i = 0; i < count; i++) {
                NSString *expectedText = [expected objectAtIndex:i];
                
                TwitterTextEntity *entity = [results objectAtIndex:i];
                NSRange r = entity.range;
                r.location++;
                r.length--;
                NSString *actualText = [text substringWithRange:r];
                
                XCTAssertEqualObjects(expectedText, actualText, @"%@", testCase);
            }
        } else {
            NSMutableArray *resultTexts = [NSMutableArray array];
            for (TwitterTextEntity *entity in results) {
                [resultTexts addObject:[text substringWithRange:entity.range]];
            }
            XCTFail(@"Matching count is different: %lu != %lu\n%@\n%@", expected.count, results.count, testCase, resultTexts);
        }
    }
    
    //
    // Symbols with indices
    //
    for (NSDictionary *testCase in symbolsWithIndices) {
        NSString *text = [testCase objectForKey:@"text"];
        NSArray *expected = [testCase objectForKey:@"expected"];
        
        NSArray *results = [TwitterText symbolsInText:text checkingURLOverlap:YES];
        if (results.count == expected.count) {
            NSUInteger count = results.count;
            for (NSUInteger i = 0; i < count; i++) {
                NSDictionary *expectedDic = [expected objectAtIndex:i];
                NSString *expectedSymbol = [expectedDic objectForKey:@"cashtag"];
                NSArray *expectedIndices = [expectedDic objectForKey:@"indices"];
                NSUInteger expectedStart = [[expectedIndices objectAtIndex:0] unsignedIntegerValue];
                NSUInteger expectedEnd = [[expectedIndices objectAtIndex:1] unsignedIntegerValue];
                if (expectedEnd < expectedStart) {
                    XCTFail(@"Expected start is greater than expected end: %ld, %ld", expectedStart, expectedEnd);
                }
                NSRange expectedRange = NSMakeRange(expectedStart, expectedEnd - expectedStart);
                
                TwitterTextEntity *entity = [results objectAtIndex:i];
                NSRange actualRange = entity.range;
                NSRange r = actualRange;
                r.location++;
                r.length--;
                NSString *actualText = [text substringWithRange:r];
                
                XCTAssertEqualObjects(expectedSymbol, actualText, @"%@", testCase);
                XCTAssertTrue(NSEqualRanges(expectedRange, actualRange), @"%@ != %@\n%@", NSStringFromRange(expectedRange), NSStringFromRange(actualRange), testCase);
            }
        } else {
            NSMutableArray *resultTexts = [NSMutableArray array];
            for (TwitterTextEntity *entity in results) {
                [resultTexts addObject:[text substringWithRange:entity.range]];
            }
            XCTFail(@"Matching count is different: %lu != %lu\n%@\n%@", expected.count, results.count, testCase, resultTexts);
        }
    }
}

- (void)testValidate
{
    NSString *fileName = @"../test/json-conformance/validate.json";
    NSData *data = [NSData dataWithContentsOfFile:fileName];
    if (!data) {
        XCTFail(@"No test data: %@", fileName);
        return;
    }
    NSDictionary *rootDic = [NSJSONSerialization JSONObjectWithData:data options:0 error:NULL];
    if (!rootDic) {
        XCTFail(@"Invalid test data: %@", fileName);
        return;
    }
    
    NSDictionary *tests = [rootDic objectForKey:@"tests"];
    NSArray *lengths = [tests objectForKey:@"lengths"];
    
    for (NSDictionary *testCase in lengths) {
        NSString *text = [testCase objectForKey:@"text"];
        text = [self stringByParsingUnicodeEscapes:text];
        NSUInteger expected = [[testCase objectForKey:@"expected"] unsignedIntegerValue];
        NSUInteger len = [TwitterText tweetLength:text];
        XCTAssertEqual(len, expected, @"Length should be the same");
    }
}

- (void)testTlds
{
    NSString *fileName = @"../test/json-conformance/tlds.json";
    NSData *data = [NSData dataWithContentsOfFile:fileName];
    if (!data) {
        XCTFail(@"No test data: %@", fileName);
        return;
    }
    NSDictionary *rootDic = [NSJSONSerialization JSONObjectWithData:data options:0 error:NULL];
    if (!rootDic) {
        XCTFail(@"Invalid test data: %@", fileName);
        return;
    }
    
    NSDictionary *tests = [rootDic objectForKey:@"tests"];
    
    NSArray *country = [tests objectForKey:@"country"];
    NSArray *generic = [tests objectForKey:@"generic"];
    
    //
    // URLs with ccTLD
    //
    for (NSDictionary *testCase in country) {
        NSString *text = [testCase objectForKey:@"text"];
        NSArray *expected = [testCase objectForKey:@"expected"];
        
        NSArray *results = [TwitterText URLsInText:text];
        if (results.count == expected.count) {
            NSUInteger count = results.count;
            for (NSUInteger i = 0; i < count; i++) {
                NSString *expectedText = [expected objectAtIndex:i];
                
                TwitterTextEntity *entity = [results objectAtIndex:i];
                NSRange r = entity.range;
                NSString *actualText = [text substringWithRange:r];
                
                XCTAssertEqualObjects(expectedText, actualText, @"%@", testCase);
            }
        } else {
            NSMutableArray *resultTexts = [NSMutableArray array];
            for (TwitterTextEntity *entity in results) {
                [resultTexts addObject:[text substringWithRange:entity.range]];
            }
            XCTFail(@"Matching count is different: %lu != %lu\n%@\n%@", expected.count, results.count, testCase, resultTexts);
        }
    }
    
    //
    // URLs with gTLD
    //
    for (NSDictionary *testCase in generic) {
        NSString *text = [testCase objectForKey:@"text"];
        NSArray *expected = [testCase objectForKey:@"expected"];
        
        NSArray *results = [TwitterText URLsInText:text];
        if (results.count == expected.count) {
            NSUInteger count = results.count;
            for (NSUInteger i = 0; i < count; i++) {
                NSString *expectedText = [expected objectAtIndex:i];
                
                TwitterTextEntity *entity = [results objectAtIndex:i];
                NSRange r = entity.range;
                NSString *actualText = [text substringWithRange:r];
                
                XCTAssertEqualObjects(expectedText, actualText, @"%@", testCase);
            }
        } else {
            NSMutableArray *resultTexts = [NSMutableArray array];
            for (TwitterTextEntity *entity in results) {
                [resultTexts addObject:[text substringWithRange:entity.range]];
            }
            XCTFail(@"Matching count is different: %lu != %lu\n%@\n%@", expected.count, results.count, testCase, resultTexts);
        }
    }
}

- (NSString *)stringByParsingUnicodeEscapes:(NSString *)string
{
    static NSRegularExpression *regex = nil;
    if (!regex) {
        regex = [[NSRegularExpression alloc] initWithPattern:@"\\\\U([0-9a-fA-F]{8}|[0-9a-fA-F]{4})" options:0 error:NULL];
    }

    NSUInteger index = 0;
    while (index < string.length) {
        NSTextCheckingResult *result = [regex firstMatchInString:string options:0 range:NSMakeRange(index, string.length - index)];
        if (!result) {
            break;
        }
        NSRange patternRange = result.range;
        NSRange hexRange = [result rangeAtIndex:1];
        NSUInteger resultLength = 1;
        if (hexRange.location != NSNotFound) {
            NSString *hexString = [string substringWithRange:hexRange];
            long value = strtol([hexString UTF8String], NULL, 16);
            if (value < 0x10000) {
                string = [string stringByReplacingCharactersInRange:patternRange withString:[NSString stringWithFormat:@"%C", (UniChar)value]];
            } else {
                UniChar surrogates[2];
                if (CFStringGetSurrogatePairForLongCharacter((UTF32Char)value, surrogates)) {
                    string = [string stringByReplacingCharactersInRange:patternRange withString:[NSString stringWithCharacters:surrogates length:2]];
                    resultLength = 2;
                }
            }
        }
        index = patternRange.location + resultLength;
    }

    return string;
}

@end
