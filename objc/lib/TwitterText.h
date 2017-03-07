//
//  TwitterText.h
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
#import "TwitterTextEntity.h"

NS_ASSUME_NONNULL_BEGIN

@interface TwitterText : NSObject

+ (NSArray<TwitterTextEntity *> *)entitiesInText:(NSString *)text;
+ (NSArray<TwitterTextEntity *> *)URLsInText:(NSString *)text;
+ (NSArray<TwitterTextEntity *> *)hashtagsInText:(NSString *)text checkingURLOverlap:(BOOL)checkingURLOverlap;
+ (NSArray<TwitterTextEntity *> *)symbolsInText:(NSString *)text checkingURLOverlap:(BOOL)checkingURLOverlap;
+ (NSArray<TwitterTextEntity *> *)mentionedScreenNamesInText:(NSString *)text;
+ (NSArray<TwitterTextEntity *> *)mentionsOrListsInText:(NSString *)text;
+ (nullable TwitterTextEntity *)repliedScreenNameInText:(NSString *)text;

+ (NSCharacterSet *)validHashtagBoundaryCharacterSet;

+ (NSInteger)tweetLength:(NSString *)text;
+ (NSInteger)tweetLength:(NSString *)text httpURLLength:(NSInteger)httpURLLength httpsURLLength:(NSInteger)httpsURLLength;

+ (NSInteger)remainingCharacterCount:(NSString *)text;
+ (NSInteger)remainingCharacterCount:(NSString *)text httpURLLength:(NSInteger)httpURLLength httpsURLLength:(NSInteger)httpsURLLength;

@end

NS_ASSUME_NONNULL_END
