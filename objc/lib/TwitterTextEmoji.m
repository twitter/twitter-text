// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0
//
//  TwitterTextEmoji.m
//  TwitterTextEmoji
//
//  Created by David LaMacchia on 06/21/18.
//

#import "TwitterTextEmoji.h"

NS_ASSUME_NONNULL_BEGIN

@implementation NSString (TwitterTextEmoji)

- (BOOL)tt_isEmoji
{
    NSRange range = NSMakeRange(0, self.length);
    NSArray<NSTextCheckingResult *> *matches = [TwitterTextEmojiRegex() matchesInString:self options:0 range:range];
    return (matches.count == 1 && matches[0].range.location != NSNotFound && NSMaxRange(matches[0].range) <= self.length);
}

@end

NS_ASSUME_NONNULL_END
