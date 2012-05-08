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

+ (NSArray*)extractEntities:(NSString*)text;
+ (NSArray*)extractURLs:(NSString*)text;
+ (NSArray*)extractHashtags:(NSString*)text checkingURLOverlap:(BOOL)checkingURLOverlap;
+ (NSArray*)extractMentionedScreenNames:(NSString*)text;
+ (NSArray*)extractMentionsOrLists:(NSString*)text;
+ (TwitterTextEntity*)extractReplyScreenName:(NSString*)text;

+ (int)tweetLength:(NSString*)text;

+ (int)remainingCharacterCount:(NSString*)text;
+ (int)remainingCharacterCount:(NSString*)text httpURLLength:(int)httpURLLength httpsURLLength:(int)httpsURLLength;

@end
