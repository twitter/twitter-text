// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0
//
//  TwitterTextTests.m
//

#import "TwitterTextTests.h"

@import TwitterText;

@implementation TwitterTextTests

- (void)testRemainingCharacterCountForLongTweet
{
    XCTAssertEqual([TwitterText remainingCharacterCount:@"123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890" transformedURLLength:23], -10);
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

- (void)testExtract
{
    NSString *fileName = [[[self class] conformanceRootDirectory] stringByAppendingPathComponent:@"extract.json"];
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
    NSArray *hashtagsFromAstral = [tests objectForKey:@"hashtags_from_astral"];
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
            XCTFail(@"Matching count is different: %lu != %lu\n%@", (unsigned long)expected.count, (unsigned long)results.count, testCase);
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
                    XCTFail(@"Expected start is greater than expected end: %lu, %lu", (unsigned long)expectedStart, (unsigned long)expectedEnd);
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
            XCTFail(@"Matching count is different: %lu != %lu\n%@", (unsigned long)expected.count, (unsigned long)results.count, testCase);
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
                    XCTFail(@"Expected start is greater than expected end: %lu, %lu", (unsigned long)expectedStart, (unsigned long)expectedEnd);
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
            XCTFail(@"Matching count is different: %lu != %lu\n%@", (unsigned long)expected.count, (unsigned long)results.count, testCase);
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
            XCTFail(@"Matching count is different: %lu != %lu\n%@\n%@", (unsigned long)expected.count, (unsigned long)results.count, testCase, resultTexts);
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
                    XCTFail(@"Expected start is greater than expected end: %lu, %lu", (unsigned long)expectedStart, (unsigned long)expectedEnd);
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
            XCTFail(@"Matching count is different: %lu != %lu\n%@\n%@", (unsigned long)expected.count, (unsigned long)results.count, testCase, resultTexts);
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
            XCTFail(@"Matching count is different: %lu != %lu\n%@\n%@", (unsigned long)expected.count, (unsigned long)results.count, testCase, resultTexts);
        }
    }

    //
    // Hashtags from Astral
    //

    for (NSDictionary *testCase in hashtagsFromAstral) {
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
            XCTFail(@"Matching count is different: %lu != %lu\n%@\n%@", (unsigned long)expected.count, (unsigned long)results.count, testCase, resultTexts);
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
                    XCTFail(@"Expected start is greater than expected end: %lu, %lu", (unsigned long)expectedStart, (unsigned long)expectedEnd);
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
            XCTFail(@"Matching count is different: %lu != %lu\n%@\n%@", (unsigned long)expected.count, (unsigned long)results.count, testCase, resultTexts);
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
            XCTFail(@"Matching count is different: %lu != %lu\n%@\n%@", (unsigned long)expected.count, (unsigned long)results.count, testCase, resultTexts);
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
                    XCTFail(@"Expected start is greater than expected end: %lu, %lu", (unsigned long)expectedStart, (unsigned long)expectedEnd);
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
            XCTFail(@"Matching count is different: %lu != %lu\n%@\n%@", (unsigned long)expected.count, (unsigned long)results.count, testCase, resultTexts);
        }
    }
}

- (void)testValidate
{
    NSString *fileName = [[[self class] conformanceRootDirectory] stringByAppendingPathComponent:@"validate.json"];
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

    [TwitterTextParser setDefaultParserWithConfiguration:[TwitterTextConfiguration configurationFromJSONResource:kTwitterTextParserConfigurationClassic]];

    NSDictionary *tests = [rootDic objectForKey:@"tests"];
    NSArray *lengths = [tests objectForKey:@"lengths"];

    for (NSDictionary *testCase in lengths) {
        NSString *text = [testCase objectForKey:@"text"];
        text = [self stringByParsingUnicodeEscapes:text];
        NSUInteger expected = [[testCase objectForKey:@"expected"] unsignedIntegerValue];
        NSUInteger len = [TwitterText tweetLength:text];
        TwitterTextParseResults *results = [[TwitterTextParser defaultParser] parseTweet:text];
        XCTAssertEqual(len, results.weightedLength, "TwitterTextParser with classic configuration is not compatible with TwitterText for string %@", text);
        XCTAssertEqual(len, expected, @"Length should be the same");
    }
}

- (void)_testWeightedTweetsCountingWithTestSuite:(NSString *)testSuite
{
    NSString *fileName = [[[self class] conformanceRootDirectory] stringByAppendingPathComponent:@"validate.json"];
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
    NSArray *lengths = [tests objectForKey:testSuite];

    for (NSDictionary *testCase in lengths) {
        NSString *text = [testCase objectForKey:@"text"];
        text = [self stringByParsingUnicodeEscapes:text];
        NSDictionary *expected = [testCase objectForKey:@"expected"];
        TwitterTextParseResults *results = [[TwitterTextParser defaultParser] parseTweet:text];

        NSString *testDescription = testCase[@"description"];
        NSInteger weightedLength = [expected[@"weightedLength"] integerValue];
        NSInteger permillage = [expected[@"permillage"] integerValue];
        BOOL isValid = [expected[@"valid"] boolValue];
        NSUInteger displayRangeStart = [expected[@"displayRangeStart"] integerValue];
        NSUInteger displayRangeEnd = [expected[@"displayRangeEnd"] integerValue];
        NSUInteger validRangeStart = [expected[@"validRangeStart"] integerValue];
        NSUInteger validRangeEnd = [expected[@"validRangeEnd"] integerValue];

        XCTAssertEqual(results.weightedLength, weightedLength, @"Length should be the same in \"%@\"", testDescription);
        XCTAssertEqual(results.permillage, permillage, @"Permillage should be the same in \"%@\"", testDescription);
        XCTAssertEqual(results.isValid, isValid, @"Valid should be the samein \"%@\"", testDescription);
        XCTAssertEqual(results.displayTextRange.location, displayRangeStart, @"Display text range start should be the same in \"%@\"", testDescription);
        XCTAssertEqual(results.displayTextRange.length, displayRangeEnd - displayRangeStart + 1, @"Display text range length should be the same in \"%@\"", testDescription);
        XCTAssertEqual(results.validDisplayTextRange.location, validRangeStart, @"Valid text range start should be the same in \"%@\"", testDescription);
        XCTAssertEqual(results.validDisplayTextRange.length, validRangeEnd - validRangeStart + 1, @"Valid text range length should be the same in \"%@\"", testDescription);
    }
}

- (void)testUnicodePointTweetLengthCounting
{
    [TwitterTextParser setDefaultParserWithConfiguration:[TwitterTextConfiguration configurationFromJSONResource:kTwitterTextParserConfigurationV2]];
    [self _testWeightedTweetsCountingWithTestSuite:@"WeightedTweetsCounterTest"];
}

- (void)testEmojiWeightedTweetLengthCounting
{
    [TwitterTextParser setDefaultParserWithConfiguration:[TwitterTextConfiguration configurationFromJSONResource:kTwitterTextParserConfigurationV3]];
    [self _testWeightedTweetsCountingWithTestSuite:@"WeightedTweetsWithDiscountedEmojiCounterTest"];
}

- (void)testEmojiWeightedTweetLengthCountingWithDiscountedUnicode9Emoji
{
    [TwitterTextParser setDefaultParserWithConfiguration:[TwitterTextConfiguration configurationFromJSONResource:kTwitterTextParserConfigurationV3]];
    [self _testWeightedTweetsCountingWithTestSuite:@"WeightedTweetsWithDiscountedUnicode9EmojiCounterTest"];
}

- (void)testEmojiWeightedTweetLengthCountingWithDiscountedUnicode10Emoji
{
// TODO: drop-iOS-10: when dropping support for iOS 10, remove the #if, #endif and everything in between
#if __IPHONE_11_0 > __IPHONE_OS_VERSION_MIN_REQUIRED
    if (@available(iOS 11, *)) {
    } else {
        NSLog(@"Info: in iOS %@ -[NSString enumerateSubstringsInRange:options:usingBlock:] does not enumerate ranges correctly for Unicode 10; therefore, this test is being bypassed",
              [NSProcessInfo processInfo].operatingSystemVersionString);
        return;
    }
#endif // #if __IPHONE_11_0 > __IPHONE_OS_VERSION_MIN_REQUIRED
    [TwitterTextParser setDefaultParserWithConfiguration:[TwitterTextConfiguration configurationFromJSONResource:kTwitterTextParserConfigurationV3]];
    [self _testWeightedTweetsCountingWithTestSuite:@"WeightedTweetsWithDiscountedUnicode10EmojiCounterTest"];
}

- (void)testZeroWidthJoinerAndNonJoiner
{
    // This test is in the Objective-C code because the behavior seems to differ between
    // this implementation and other platforms.
    [TwitterTextParser setDefaultParserWithConfiguration:[TwitterTextConfiguration configurationFromJSONResource:kTwitterTextParserConfigurationV3]];
    NSString *text = @"ZWJ: क्ष -> क्\u200Dष; ZWNJ: क्ष -> क्\u200Cष";
    text = [self stringByParsingUnicodeEscapes:text];
    TwitterTextParseResults *results = [[TwitterTextParser defaultParser] parseTweet:text];
    XCTAssertEqual(results.weightedLength, 35);
    XCTAssertEqual(results.permillage, 125);
    XCTAssertEqual(results.isValid, YES);
    XCTAssertEqual(results.displayTextRange.location, 0);
    XCTAssertEqual(results.displayTextRange.length, 35);
    XCTAssertEqual(results.validDisplayTextRange.location, 0);
    XCTAssertEqual(results.validDisplayTextRange.length, 35);
}

- (void)testUnicodeDirectionalMarkerCounting
{
    NSString *fileName = [[[self class] conformanceRootDirectory] stringByAppendingPathComponent:@"validate.json"];
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

    [TwitterTextParser setDefaultParserWithConfiguration:[TwitterTextConfiguration configurationFromJSONResource:kTwitterTextParserConfigurationV2]];
    NSDictionary *tests = [rootDic objectForKey:@"tests"];
    NSArray *lengths = [tests objectForKey:@"UnicodeDirectionalMarkerCounterTest"];

    for (NSDictionary *testCase in lengths) {
        NSString *text = [testCase objectForKey:@"text"];
        text = [self stringByParsingUnicodeEscapes:text];
        NSDictionary *expected = [testCase objectForKey:@"expected"];
        TwitterTextParseResults *results = [[TwitterTextParser defaultParser] parseTweet:text];
        XCTAssertEqual(results.weightedLength, [expected[@"weightedLength"] integerValue], @"Length should be the same");
        XCTAssertEqual(results.permillage, [expected[@"permillage"] integerValue], @"Permillage should be the same");
        XCTAssertEqual(results.isValid, [expected[@"valid"] boolValue], @"Valid should be the same");
        XCTAssertEqual(results.displayTextRange.location, [expected[@"displayRangeStart"] integerValue], @"Display text range start should be the same");
        XCTAssertEqual(results.displayTextRange.length, [expected[@"displayRangeEnd"] integerValue] - [expected[@"displayRangeStart"] integerValue] + 1, @"Display text range length should be the same");
        XCTAssertEqual(results.validDisplayTextRange.location, [expected[@"validRangeStart"] integerValue], @"Valid text range start should be the same");
        XCTAssertEqual(results.validDisplayTextRange.length, [expected[@"validRangeEnd"] integerValue] - [expected[@"validRangeStart"] integerValue] + 1, @"Valid text range length should be the same");
    }
}

- (void)testTlds
{
    NSString *fileName = [[[self class] conformanceRootDirectory] stringByAppendingPathComponent:@"tlds.json"];
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
            XCTFail(@"Matching count is different: %lu != %lu\n%@\n%@", (unsigned long)expected.count, (unsigned long)results.count, testCase, resultTexts);
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
            XCTFail(@"Matching count is different: %lu != %lu\n%@\n%@", (unsigned long)expected.count, (unsigned long)results.count, testCase, resultTexts);
        }
    }
}

- (void)testTwitterTextParserConfiguration
{
    NSString *configurationString = @"{\"version\": 1, \"maxWeightedTweetLength\": 280, \"scale\": 2, \"defaultWeight\": 1, \"transformedURLLength\": 23, \"ranges\": [{\"start\": 4352, \"end\": 4353, \"weight\": 2}]}";
    TwitterTextConfiguration *configuration = [TwitterTextConfiguration configurationFromJSONString:configurationString];

    XCTAssertEqual(1, configuration.version);
    XCTAssertEqual(1, configuration.defaultWeight);
    XCTAssertEqual(23, configuration.transformedURLLength);
    XCTAssertEqual(280, configuration.maxWeightedTweetLength);
    XCTAssertEqual(2, configuration.scale);
    TwitterTextWeightedRange *weightedRange = configuration.ranges[0];
    XCTAssertEqual(4352, weightedRange.range.location);
    XCTAssertEqual(1, weightedRange.range.length);
    XCTAssertEqual(2, weightedRange.weight);
}

- (void)testTwitterTextParserConfigurationV2ToV3Transition
{
    TwitterTextConfiguration *configurationV2 = [TwitterTextConfiguration configurationFromJSONResource:kTwitterTextParserConfigurationV2];
    TwitterTextConfiguration *configurationV3 = [TwitterTextConfiguration configurationFromJSONResource:kTwitterTextParserConfigurationV3];

    XCTAssertEqual(configurationV2.defaultWeight, configurationV3.defaultWeight);
    XCTAssertEqual(configurationV2.transformedURLLength, configurationV3.transformedURLLength);
    XCTAssertEqual(configurationV2.maxWeightedTweetLength, configurationV3.maxWeightedTweetLength);
    XCTAssertEqual(configurationV2.scale, configurationV3.scale);

    for (NSUInteger i = 0; i < configurationV2.ranges.count; i++) {
        TwitterTextWeightedRange *weightedRangeV2 = configurationV2.ranges[i];
        TwitterTextWeightedRange *weightedRangeV3 = configurationV3.ranges[i];
        XCTAssertTrue(NSEqualRanges(weightedRangeV2.range, weightedRangeV3.range));
        XCTAssertEqual(weightedRangeV2.weight, weightedRangeV3.weight);
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

+ (NSString *)conformanceRootDirectory
{
    NSString *sourceFilePath = [[NSString alloc] initWithCString:__FILE__ encoding:NSUTF8StringEncoding];
    return [[[sourceFilePath stringByDeletingLastPathComponent] stringByDeletingLastPathComponent] stringByAppendingPathComponent:@"tests/json-conformance"];
}

@end
