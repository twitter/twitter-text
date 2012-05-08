//
//  TwitterTextTests.m
//
//  Copyright 2012 Twitter, Inc.
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
    
    //
    // Mentions
    //
    
    for (NSDictionary *testCase in mentions) {
        NSString *text = [testCase objectForKey:@"text"];
        NSArray *expected = [testCase objectForKey:@"expected"];
        
        NSArray *results = [TwitterText mentionsOrListsInText:text];
        if (results.count == expected.count) {
            int count = results.count;
            for (int i=0; i<count; i++) {
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
            int count = results.count;
            for (int i=0; i<count; i++) {
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
            int count = results.count;
            for (int i=0; i<count; i++) {
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
            int count = results.count;
            for (int i=0; i<count; i++) {
                NSString *expectedText = [expected objectAtIndex:i];
                
                TwitterTextEntity *entity = [results objectAtIndex:i];
                NSRange r = entity.range;
                NSString *actualText = [text substringWithRange:r];
                
                STAssertEqualObjects(expectedText, actualText, @"%@", testCase);
            }
        } else {
            STFail(@"Matching count is different: %lu != %lu\n%@", expected.count, results.count, testCase);
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
            int count = results.count;
            for (int i=0; i<count; i++) {
                NSDictionary *expectedDic = [expected objectAtIndex:i];
                NSString *expectedUrl = [expectedDic objectForKey:@"url"];
                NSArray *expectedIndices = [expectedDic objectForKey:@"indices"];
                int expectedStart = [[expectedIndices objectAtIndex:0] intValue];
                int expectedEnd = [[expectedIndices objectAtIndex:1] intValue];
                NSRange expectedRange = NSMakeRange(expectedStart, expectedEnd - expectedStart);
                
                TwitterTextEntity *entity = [results objectAtIndex:i];
                NSRange actualRange = entity.range;
                NSString *actualText = [text substringWithRange:actualRange];
                
                STAssertEqualObjects(expectedUrl, actualText, @"%@", testCase);
                STAssertTrue(NSEqualRanges(expectedRange, actualRange), @"%@ != %@\n%@", NSStringFromRange(expectedRange), NSStringFromRange(actualRange), testCase);
            }
        } else {
            STFail(@"Matching count is different: %lu != %lu\n%@", expected.count, results.count, testCase);
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
            int count = results.count;
            for (int i=0; i<count; i++) {
                NSString *expectedText = [expected objectAtIndex:i];
                
                TwitterTextEntity *entity = [results objectAtIndex:i];
                NSRange r = entity.range;
                r.location++;
                r.length--;
                NSString *actualText = [text substringWithRange:r];
                
                STAssertEqualObjects(expectedText, actualText, @"%@", testCase);
            }
        } else {
            STFail(@"Matching count is different: %lu != %lu\n%@", expected.count, results.count, testCase);
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
            int count = results.count;
            for (int i=0; i<count; i++) {
                NSDictionary *expectedDic = [expected objectAtIndex:i];
                NSString *expectedHashtag = [expectedDic objectForKey:@"hashtag"];
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
                
                STAssertEqualObjects(expectedHashtag, actualText, @"%@", testCase);
                STAssertTrue(NSEqualRanges(expectedRange, actualRange), @"%@ != %@\n%@", NSStringFromRange(expectedRange), NSStringFromRange(actualRange), testCase);
            }
        } else {
            STFail(@"Matching count is different: %lu != %lu\n%@", expected.count, results.count, testCase);
        }
    }
}

@end
