//
//  TwitterText.h
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
#import "TwitterTextEntity.h"

@interface TwitterText : NSObject

+ (NSArray*)entitiesInText:(NSString*)text;
+ (NSArray*)URLsInText:(NSString*)text;
+ (NSArray*)hashtagsInText:(NSString*)text checkingURLOverlap:(BOOL)checkingURLOverlap;
+ (NSArray*)cashtagsInText:(NSString*)text checkingURLOverlap:(BOOL)checkingURLOverlap;
+ (NSArray*)mentionedScreenNamesInText:(NSString*)text;
+ (NSArray*)mentionsOrListsInText:(NSString*)text;
+ (TwitterTextEntity*)repliedScreenNameInText:(NSString*)text;

+ (int)tweetLength:(NSString*)text;
+ (int)tweetLength:(NSString*)text httpURLLength:(int)httpURLLength httpsURLLength:(int)httpsURLLength;

+ (int)remainingCharacterCount:(NSString*)text;
+ (int)remainingCharacterCount:(NSString*)text httpURLLength:(int)httpURLLength httpsURLLength:(int)httpsURLLength;

@end
