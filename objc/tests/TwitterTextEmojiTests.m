// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0
//
//  TwitterTextEmojiTests.m
//  TwitterTextEmojiTests
//
//  Created by David LaMacchia on 06/21/18.
//

#import "TwitterTextEmoji.h"
#import "TwitterTextEmojiTests.h"

@interface NSRegularExpression (TestHelpers)
- (NSArray<NSString *> *)matchesInString:(NSString *)string;
@end

@implementation NSRegularExpression (TestHelpers)

- (NSArray<NSString *> *)matchesInString:(NSString *)string
{
    NSUInteger length = string.length;
    NSRange range = NSMakeRange(0, length);
    NSArray<NSTextCheckingResult *> *matches = [self matchesInString:string options:0 range:range];

    NSMutableArray *results = [[NSMutableArray alloc] init];

    for (NSTextCheckingResult *match in matches) {
        if (NSMaxRange(match.range) <= length) {
            [results addObject:[string substringWithRange:match.range]];
        }
    }
    return results;
}

@end

@implementation TwitterTextEmojiTests

- (void)testEmojiUnicode10
{
    NSArray<NSString *> *matches = [TwitterTextEmojiRegex() matchesInString:@"Unicode 10.0; grinning face with one large and one small eye: 🤪; woman with headscarf: 🧕; (fitzpatrick) woman with headscarf + medium-dark skin tone: 🧕🏾; flag (England): 🏴󠁧󠁢󠁥󠁮󠁧󠁿"];
    NSArray<NSString *> *expected = [NSArray arrayWithObjects:@"🤪", @"🧕", @"🧕🏾", @"🏴󠁧󠁢󠁥󠁮󠁧󠁿", nil];

    for (NSUInteger i = 0; i < matches.count; i++) {
        XCTAssertTrue([matches[i] isEqualToString:expected[i]]);
    }
}


- (void)testEmojiUnicode9
{
    NSArray<NSString *> *matches = [TwitterTextEmojiRegex() matchesInString:@"Unicode 9.0; face with cowboy hat: 🤠; woman dancing: 💃, woman dancing + medium-dark skin tone: 💃🏾"];
    NSArray<NSString *> *expected = [NSArray arrayWithObjects:@"🤠", @"💃", @"💃🏾", nil];

    for (NSUInteger i = 0; i < matches.count; i++) {
        XCTAssertTrue([matches[i] isEqualToString:expected[i]]);
    }
}


- (void)testIsEmoji
{
    XCTAssertTrue([@"🤦" tt_isEmoji]);
    XCTAssertTrue([@"🏴󠁧󠁢󠁥󠁮󠁧󠁿" tt_isEmoji]);
    XCTAssertTrue([@"👨‍👨‍👧‍👧" tt_isEmoji]);
    XCTAssertTrue([@"0️⃣" tt_isEmoji]);

    XCTAssertFalse([@"A" tt_isEmoji]);
    XCTAssertFalse([@"Á" tt_isEmoji]);
}

@end
