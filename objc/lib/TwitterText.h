//
//  TwitterText.h
//
//  Copyright 2012-2016 Twitter, Inc.
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//  http://www.apache.org/licenses/LICENSE-2.0
//

#import <Foundation/Foundation.h>
#import "TwitterTextEntity.h"

#if !__has_feature(nullability)
#define nonnull
#define nullable
#define _Nullable
#define _Nonnull
#endif

#ifndef NS_ASSUME_NONNULL_BEGIN
#define NS_ASSUME_NONNULL_BEGIN
#endif

#ifndef NS_ASSUME_NONNULL_END
#define NS_ASSUME_NONNULL_END
#endif

#if __has_feature(objc_generics)
typedef NSArray<TwitterTextEntity *> TwitterTextEntityArray;
typedef NSMutableArray<TwitterTextEntity *> TwitterTextMutableEntityArray;
#else
typedef NSArray TwitterTextEntityArray;
typedef NSMutableArray TwitterTextMutableEntityArray;
#endif


NS_ASSUME_NONNULL_BEGIN

@interface TwitterText : NSObject

+ (TwitterTextEntityArray *)entitiesInText:(NSString *)text;
+ (TwitterTextEntityArray *)URLsInText:(NSString *)text;
+ (TwitterTextEntityArray *)hashtagsInText:(NSString *)text checkingURLOverlap:(BOOL)checkingURLOverlap;
+ (TwitterTextEntityArray *)symbolsInText:(NSString *)text checkingURLOverlap:(BOOL)checkingURLOverlap;
+ (TwitterTextEntityArray *)mentionedScreenNamesInText:(NSString *)text;
+ (TwitterTextEntityArray *)mentionsOrListsInText:(NSString *)text;
+ (nullable TwitterTextEntity *)repliedScreenNameInText:(NSString *)text;

+ (NSCharacterSet *)validHashtagBoundaryCharacterSet;

+ (NSUInteger)tweetLength:(NSString *)text;
+ (NSUInteger)tweetLength:(NSString *)text httpURLLength:(NSUInteger)httpURLLength httpsURLLength:(NSUInteger)httpsURLLength;

+ (NSInteger)remainingCharacterCount:(NSString *)text;
+ (NSInteger)remainingCharacterCount:(NSString *)text httpURLLength:(NSUInteger)httpURLLength httpsURLLength:(NSUInteger)httpsURLLength;

@end

NS_ASSUME_NONNULL_END
