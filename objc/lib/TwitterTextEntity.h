// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0
//
//  TwitterTextEntity.h
//

#import <Foundation/Foundation.h>

typedef NS_ENUM(NSUInteger, TwitterTextEntityType) {
    TwitterTextEntityURL,
    TwitterTextEntityScreenName,
    TwitterTextEntityHashtag,
    TwitterTextEntityListName,
    TwitterTextEntitySymbol,
    TwitterTextEntityTweetChar,
    TwitterTextEntityTweetEmojiChar
};

@interface TwitterTextEntity : NSObject

@property (nonatomic) TwitterTextEntityType type;
@property (nonatomic) NSRange range;

+ (instancetype)entityWithType:(TwitterTextEntityType)type range:(NSRange)range;

@end
