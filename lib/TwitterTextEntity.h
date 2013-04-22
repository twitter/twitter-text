//
//  TwitterTextEntity.h
//
//  Copyright 2012 Twitter, Inc.
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//  http://www.apache.org/licenses/LICENSE-2.0
//

#import <Foundation/Foundation.h>

typedef enum {
    TwitterTextEntityURL,
    TwitterTextEntityScreenName,
    TwitterTextEntityHashtag,
    TwitterTextEntityListName,
    TwitterTextEntitySymbol,
} TwitterTextEntityType;

@interface TwitterTextEntity : NSObject

@property (nonatomic, assign) TwitterTextEntityType type;
@property (nonatomic, assign) NSRange range;

+ (id)entityWithType:(TwitterTextEntityType)type range:(NSRange)range;

@end
