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

- (void)testLongDomain
{
    NSString *text = @"jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp.jp";
    NSArray *entities = [TwitterText entitiesInText:text];
    STAssertEquals(entities.count, (NSUInteger)1, nil);
    if (entities.count >= 1) {
        TwitterTextEntity *entity = [entities objectAtIndex:0];
        STAssertEquals(entity.range, NSMakeRange(0, text.length), nil);
    }
}

- (void)testJapaneseTLDFollowedByJapaneseCharacters
{
    NSString *text = @"テスト test.みんなです";
    NSArray *entities = [TwitterText entitiesInText:text];
    STAssertEquals(entities.count, (NSUInteger)1, nil);
    if (entities.count >= 1) {
        TwitterTextEntity *entity = [entities objectAtIndex:0];
        STAssertEquals(entity.range, NSMakeRange(4, 8), nil);
    }
}

- (void)testJapaneseTLDFollowedByASCIICharacters
{
    NSString *text = @"テスト test.みんなabc";
    NSArray *entities = [TwitterText entitiesInText:text];
    STAssertEquals(entities.count, (NSUInteger)0, nil);
}

- (void)testDomainFollowedByJapaneseCharacters
{
    NSString *text = @"example.comてすとですtwitter.みんなです.comcast.com";
    NSArray *entities = [TwitterText entitiesInText:text];
    STAssertEquals(entities.count, (NSUInteger)3, nil);
    if (entities.count >= 3) {
        TwitterTextEntity *firstEntity = [entities objectAtIndex:0];
        STAssertEquals(firstEntity.range, NSMakeRange(0, 11), nil);
        TwitterTextEntity *secondEntity = [entities objectAtIndex:1];
        STAssertEquals(secondEntity.range, NSMakeRange(16, 11), nil);
        TwitterTextEntity *thirdEntity = [entities objectAtIndex:2];
        STAssertEquals(thirdEntity.range, NSMakeRange(30, 11), nil);
    }
}

- (void)testURLDomainWithInvalidTLD
{
    NSString *text = @"test http://example.comだよね.comtest/hogehoge";
    NSArray *entities = [TwitterText entitiesInText:text];
    STAssertEquals(entities.count, (NSUInteger)0, nil);
}

- (void)testExtract
{
    NSString *fileName = @"../test/json-conformance/extract.json";
    NSData *data = [NSData dataWithContentsOfFile:fileName];
    if (!data) {
        NSString *error = [NSString stringWithFormat:@"No test data: %@", fileName];
        STFail(error);
        return;
    }
    NSDictionary *rootDic = [NSJSONSerialization JSONObjectWithData:data options:0 error:NULL];
    if (!rootDic) {
        NSString *error = [NSString stringWithFormat:@"Invalid test data: %@", fileName];
        STFail(error);
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
            NSInteger count = results.count;
            for (NSInteger i=0; i<count; i++) {
                NSString *expectedText = [expected objectAtIndex:i];
                
                TwitterTextEntity *entity = [results objectAtIndex:i];
                NSRange actualRange = entity.range;
                actualRange.location++;
                actualRange.length--;
                NSString *actualText = [text substringWithRange:actualRange];
                
                STAssertEqualObjects(expectedText, actualText, @"%@", testCase);
            }
        } else {
            STFail(@"Matching count is different: %lu != %lu\n%@", expected.count, results.count, testCase);
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
            NSInteger count = results.count;
            for (NSInteger i=0; i<count; i++) {
                NSDictionary *expectedDic = [expected objectAtIndex:i];
                NSString *expectedText = [expectedDic objectForKey:@"screen_name"];
                NSArray *indices = [expectedDic objectForKey:@"indices"];
                NSInteger expectedStart = [[indices objectAtIndex:0] intValue];
                NSInteger expectedEnd = [[indices objectAtIndex:1] intValue];
                NSRange expectedRange = NSMakeRange(expectedStart, expectedEnd - expectedStart);
                
                TwitterTextEntity *entity = [results objectAtIndex:i];
                NSRange actualRange = entity.range;
                NSRange r = actualRange;
                r.location++;
                r.length--;
                NSString *actualText = [text substringWithRange:r];
                
                STAssertEqualObjects(expectedText, actualText, @"%@", testCase);
                STAssertTrue(NSEqualRanges(expectedRange, actualRange), @"%@ != %@\n%@", NSStringFromRange(expectedRange), NSStringFromRange(actualRange), testCase);
            }
        } else {
            STFail(@"Matching count is different: %lu != %lu\n%@", expected.count, results.count, testCase);
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
            NSInteger count = results.count;
            for (NSInteger i=0; i<count; i++) {
                NSDictionary *expectedDic = [expected objectAtIndex:i];
                NSString *expectedText = [expectedDic objectForKey:@"screen_name"];
                NSString *expectedListSlug = [expectedDic objectForKey:@"list_slug"];
                if (expectedListSlug.length > 0) {
                    expectedText = [expectedText stringByAppendingString:expectedListSlug];
                }
                NSArray *indices = [expectedDic objectForKey:@"indices"];
                NSInteger expectedStart = [[indices objectAtIndex:0] intValue];
                NSInteger expectedEnd = [[indices objectAtIndex:1] intValue];
                NSRange expectedRange = NSMakeRange(expectedStart, expectedEnd - expectedStart);
                
                TwitterTextEntity *entity = [results objectAtIndex:i];
                NSRange actualRange = entity.range;
                NSRange r = actualRange;
                r.location++;
                r.length--;
                NSString *actualText = [text substringWithRange:r];
                
                STAssertEqualObjects(expectedText, actualText, @"%@", testCase);
                STAssertTrue(NSEqualRanges(expectedRange, actualRange), @"%@ != %@\n%@", NSStringFromRange(expectedRange), NSStringFromRange(actualRange), testCase);
            }
        } else {
            STFail(@"Matching count is different: %lu != %lu\n%@", expected.count, results.count, testCase);
        }
    }

    //
    // Reply
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
                STAssertNil(actual, @"%@\n%@", actual, testCase);
            } else {
                STAssertEqualObjects(expected, actual, @"%@", testCase);
            }
        }
    }

    //
    // URL
    //
    
    for (NSDictionary *testCase in urls) {
        NSString *text = [testCase objectForKey:@"text"];
        NSArray *expected = [testCase objectForKey:@"expected"];

        NSArray *results = [TwitterText URLsInText:text];
        if (results.count == expected.count) {
            NSInteger count = results.count;
            for (NSInteger i=0; i<count; i++) {
                NSString *expectedText = [expected objectAtIndex:i];
                
                TwitterTextEntity *entity = [results objectAtIndex:i];
                NSRange r = entity.range;
                NSString *actualText = [text substringWithRange:r];
                
                STAssertEqualObjects(expectedText, actualText, @"%@", testCase);
            }
        } else {
            NSMutableArray *resultTexts = [NSMutableArray array];
            for (TwitterTextEntity *entity in results) {
                [resultTexts addObject:[text substringWithRange:entity.range]];
            }
            STFail(@"Matching count is different: %lu != %lu\n%@\n%@", expected.count, results.count, testCase, resultTexts);
        }
    }
    
    //
    // URL with indices
    //
    
    for (NSDictionary *testCase in urlsWithIndices) {
        NSString *text = [testCase objectForKey:@"text"];
        NSArray *expected = [testCase objectForKey:@"expected"];
        
        NSArray *results = [TwitterText URLsInText:text];
        if (results.count == expected.count) {
            NSInteger count = results.count;
            for (NSInteger i=0; i<count; i++) {
                NSDictionary *expectedDic = [expected objectAtIndex:i];
                NSString *expectedUrl = [expectedDic objectForKey:@"url"];
                NSArray *expectedIndices = [expectedDic objectForKey:@"indices"];
                NSInteger expectedStart = [[expectedIndices objectAtIndex:0] integerValue];
                NSInteger expectedEnd = [[expectedIndices objectAtIndex:1] integerValue];
                NSRange expectedRange = NSMakeRange(expectedStart, expectedEnd - expectedStart);
                
                TwitterTextEntity *entity = [results objectAtIndex:i];
                NSRange actualRange = entity.range;
                NSString *actualText = [text substringWithRange:actualRange];
                
                STAssertEqualObjects(expectedUrl, actualText, @"%@", testCase);
                STAssertTrue(NSEqualRanges(expectedRange, actualRange), @"%@ != %@\n%@", NSStringFromRange(expectedRange), NSStringFromRange(actualRange), testCase);
            }
        } else {
            NSMutableArray *resultTexts = [NSMutableArray array];
            for (TwitterTextEntity *entity in results) {
                [resultTexts addObject:[text substringWithRange:entity.range]];
            }
            STFail(@"Matching count is different: %lu != %lu\n%@\n%@", expected.count, results.count, testCase, resultTexts);
        }
    }
    
    //
    // Hashtag
    //
    
    for (NSDictionary *testCase in hashtags) {
        NSString *text = [testCase objectForKey:@"text"];
        NSArray *expected = [testCase objectForKey:@"expected"];
        
        NSArray *results = [TwitterText hashtagsInText:text checkingURLOverlap:YES];
        if (results.count == expected.count) {
            NSInteger count = results.count;
            for (NSInteger i=0; i<count; i++) {
                NSString *expectedText = [expected objectAtIndex:i];
                
                TwitterTextEntity *entity = [results objectAtIndex:i];
                NSRange r = entity.range;
                r.location++;
                r.length--;
                NSString *actualText = [text substringWithRange:r];
                
                STAssertEqualObjects(expectedText, actualText, @"%@", testCase);
            }
        } else {
            NSMutableArray *resultTexts = [NSMutableArray array];
            for (TwitterTextEntity *entity in results) {
                [resultTexts addObject:[text substringWithRange:entity.range]];
            }
            STFail(@"Matching count is different: %lu != %lu\n%@\n%@", expected.count, results.count, testCase, resultTexts);
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
            NSInteger count = results.count;
            for (NSInteger i=0; i<count; i++) {
                NSDictionary *expectedDic = [expected objectAtIndex:i];
                NSString *expectedHashtag = [expectedDic objectForKey:@"hashtag"];
                NSArray *expectedIndices = [expectedDic objectForKey:@"indices"];
                NSInteger expectedStart = [[expectedIndices objectAtIndex:0] integerValue];
                NSInteger expectedEnd = [[expectedIndices objectAtIndex:1] integerValue];
                NSRange expectedRange = NSMakeRange(expectedStart, expectedEnd - expectedStart);
                
                TwitterTextEntity *entity = [results objectAtIndex:i];
                NSRange actualRange = entity.range;
                NSRange r = actualRange;
                r.location++;
                r.length--;
                NSString *actualText = [text substringWithRange:r];
                
                STAssertEqualObjects(expectedHashtag, actualText, @"%@", testCase);
                STAssertTrue(NSEqualRanges(expectedRange, actualRange), @"%@ != %@\n%@", NSStringFromRange(expectedRange), NSStringFromRange(actualRange), testCase);
            }
        } else {
            NSMutableArray *resultTexts = [NSMutableArray array];
            for (TwitterTextEntity *entity in results) {
                [resultTexts addObject:[text substringWithRange:entity.range]];
            }
            STFail(@"Matching count is different: %lu != %lu\n%@\n%@", expected.count, results.count, testCase, resultTexts);
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
            NSInteger count = results.count;
            for (NSInteger i=0; i<count; i++) {
                NSString *expectedText = [expected objectAtIndex:i];
                
                TwitterTextEntity *entity = [results objectAtIndex:i];
                NSRange r = entity.range;
                r.location++;
                r.length--;
                NSString *actualText = [text substringWithRange:r];
                
                STAssertEqualObjects(expectedText, actualText, @"%@", testCase);
            }
        } else {
            NSMutableArray *resultTexts = [NSMutableArray array];
            for (TwitterTextEntity *entity in results) {
                [resultTexts addObject:[text substringWithRange:entity.range]];
            }
            STFail(@"Matching count is different: %lu != %lu\n%@\n%@", expected.count, results.count, testCase, resultTexts);
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
            NSInteger count = results.count;
            for (NSInteger i=0; i<count; i++) {
                NSDictionary *expectedDic = [expected objectAtIndex:i];
                NSString *expectedSymbol = [expectedDic objectForKey:@"cashtag"];
                NSArray *expectedIndices = [expectedDic objectForKey:@"indices"];
                int expectedStart = [[expectedIndices objectAtIndex:0] intValue];
                int expectedEnd = [[expectedIndices objectAtIndex:1] intValue];
                NSRange expectedRange = NSMakeRange(expectedStart, expectedEnd - expectedStart);
                
                TwitterTextEntity *entity = [results objectAtIndex:i];
                NSRange actualRange = entity.range;
                NSRange r = actualRange;
                r.location++;
                r.length--;
                NSString *actualText = [text substringWithRange:r];
                
                STAssertEqualObjects(expectedSymbol, actualText, @"%@", testCase);
                STAssertTrue(NSEqualRanges(expectedRange, actualRange), @"%@ != %@\n%@", NSStringFromRange(expectedRange), NSStringFromRange(actualRange), testCase);
            }
        } else {
            NSMutableArray *resultTexts = [NSMutableArray array];
            for (TwitterTextEntity *entity in results) {
                [resultTexts addObject:[text substringWithRange:entity.range]];
            }
            STFail(@"Matching count is different: %lu != %lu\n%@\n%@", expected.count, results.count, testCase, resultTexts);
        }
    }
}

- (void)testValidate
{
    NSString *fileName = @"../test/json-conformance/validate.json";
    NSData *data = [NSData dataWithContentsOfFile:fileName];
    if (!data) {
        NSString *error = [NSString stringWithFormat:@"No test data: %@", fileName];
        STFail(error);
        return;
    }
    NSDictionary *rootDic = [NSJSONSerialization JSONObjectWithData:data options:0 error:NULL];
    if (!rootDic) {
        NSString *error = [NSString stringWithFormat:@"Invalid test data: %@", fileName];
        STFail(error);
        return;
    }
    
    NSDictionary *tests = [rootDic objectForKey:@"tests"];
    NSArray *lengths = [tests objectForKey:@"lengths"];
    
    for (NSDictionary *testCase in lengths) {
        NSString *text = [testCase objectForKey:@"text"];
        text = [self stringByParsingUnicodeEscapes:text];
        NSInteger expected = [[testCase objectForKey:@"expected"] intValue];
        NSInteger len = [TwitterText tweetLength:text];
        STAssertEquals(len, expected, @"Length should be the same");
    }
}

- (NSString *)stringByParsingUnicodeEscapes:(NSString *)string
{
    static NSRegularExpression *regex = nil;
    if (!regex) {
        regex = [[NSRegularExpression alloc] initWithPattern:@"\\\\U([0-9a-fA-F]{8}|[0-9a-fA-F]{4})" options:0 error:NULL];
    }

    NSInteger index = 0;
    while (index < [string length]) {
        NSTextCheckingResult *result = [regex firstMatchInString:string options:0 range:NSMakeRange(index, [string length] - index)];
        if (!result) {
            break;
        }
        NSRange patternRange = result.range;
        NSRange hexRange = [result rangeAtIndex:1];
        NSInteger resultLength = 1;
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
