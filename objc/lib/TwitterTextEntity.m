// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0
//
//  TwitterTextEntity.m
//

#import "TwitterTextEntity.h"

@implementation TwitterTextEntity

- (instancetype)initWithType:(TwitterTextEntityType)type range:(NSRange)range
{
    self = [super init];
    if (self) {
        _type = type;
        _range = range;
    }
    return self;
}

+ (instancetype)entityWithType:(TwitterTextEntityType)type range:(NSRange)range
{
    return [[self alloc] initWithType:type range:range];
}

- (NSComparisonResult)compare:(TwitterTextEntity *)right
{
    NSUInteger leftLocation = _range.location;
    NSUInteger leftLength = _range.length;
    NSRange rightRange = right.range;
    NSUInteger rightLocation = rightRange.location;
    NSUInteger rightLength = rightRange.length;

    if (leftLocation < rightLocation) {
        return NSOrderedAscending;
    } else if (leftLocation > rightLocation) {
        return NSOrderedDescending;
    } else if (leftLength < rightLength) {
        return NSOrderedAscending;
    } else if (leftLength > rightLength) {
        return NSOrderedDescending;
    } else {
        return NSOrderedSame;
    }
}

- (NSString *)description
{
    NSString *typeString = nil;
    switch (_type) {
        case TwitterTextEntityURL:
            typeString = @"URL";
            break;
        case TwitterTextEntityScreenName:
            typeString = @"ScreenName";
            break;
        case TwitterTextEntityHashtag:
            typeString = @"Hashtag";
            break;
        case TwitterTextEntityListName:
            typeString = @"ListName";
            break;
        case TwitterTextEntitySymbol:
            typeString = @"Symbol";
            break;
        case TwitterTextEntityTweetChar:
            typeString = @"TweetChar";
            break;
        case TwitterTextEntityTweetEmojiChar:
            typeString = @"TweetEmojiChar";
            break;
    }
    return [NSString stringWithFormat:@"<%@: %@ %@>", NSStringFromClass([self class]), typeString, NSStringFromRange(_range)];
}

@end
