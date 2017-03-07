//
//  TwitterTextEntity.h
//
//  Copyright 2012-2017 Twitter, Inc.
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//  http://www.apache.org/licenses/LICENSE-2.0
//

#import <Foundation/Foundation.h>

typedef NS_ENUM(NSUInteger, TwitterTextEntityType) {
    TwitterTextEntityURL,
    TwitterTextEntityScreenName,
    TwitterTextEntityHashtag,
    TwitterTextEntityListName,
    TwitterTextEntitySymbol,
};

@interface TwitterTextEntity : NSObject

@property (nonatomic) TwitterTextEntityType type;
@property (nonatomic) NSRange range;

+ (instancetype)entityWithType:(TwitterTextEntityType)type range:(NSRange)range;

@end
