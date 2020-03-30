// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0
//
//  TwitterText.h
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
+ (NSInteger)tweetLength:(NSString *)text transformedURLLength:(NSInteger)transformedURLLength;
+ (NSInteger)tweetLength:(NSString *)text httpURLLength:(NSInteger)httpURLLength httpsURLLength:(NSInteger)httpsURLLength __attribute__((deprecated("Use tweetLength:transformedURLLength: instead")));

+ (NSInteger)remainingCharacterCount:(NSString *)text;
+ (NSInteger)remainingCharacterCount:(NSString *)text transformedURLLength:(NSInteger)transformedURLLength;
+ (NSInteger)remainingCharacterCount:(NSString *)text httpURLLength:(NSInteger)httpURLLength httpsURLLength:(NSInteger)httpsURLLength __attribute__((deprecated("Use tweetLength:transformedURLLength: instead")));

+ (void)eagerlyLoadRegexps;

@end

FOUNDATION_EXTERN NSString * const kTwitterTextParserConfigurationClassic;
FOUNDATION_EXTERN NSString * const kTwitterTextParserConfigurationV2;
FOUNDATION_EXTERN NSString * const kTwitterTextParserConfigurationV3;

@interface TwitterTextWeightedRange : NSObject
/**
 *  Contiguous unicode region
 */
@property (nonatomic, readonly) NSRange range;
/**
 *  Weight for each unicode point in the region
 */
@property (nonatomic, readonly) NSInteger weight;

@end

@interface TwitterTextConfiguration : NSObject

+ (instancetype)configurationFromJSONResource:(NSString *)jsonResource;
+ (instancetype)configurationFromJSONString:(NSString *)jsonString;

@property (nonatomic, readonly) NSInteger version;
@property (nonatomic, readonly) NSInteger maxWeightedTweetLength;
@property (nonatomic, readonly) NSInteger scale;
@property (nonatomic, readonly) NSInteger defaultWeight;
@property (nonatomic, readonly) NSInteger transformedURLLength;
@property (nonatomic, readonly, getter=isEmojiParsingEnabled) BOOL emojiParsingEnabled;
@property (nonatomic, readonly) NSArray<TwitterTextWeightedRange *> *ranges;

@end

@interface TwitterTextParseResults : NSObject

- (instancetype)initWithWeightedLength:(NSInteger)length permillage:(NSInteger)permillage valid:(BOOL)valid displayRange:(NSRange)displayRange validRange:(NSRange)validRange;

/**
 *  The adjust tweet length based on char weights.
 */
@property (nonatomic, readonly) NSInteger weightedLength;

/**
 *  Compute true weightedLength by weightedLength/permillage
 */
@property (nonatomic, readonly) NSInteger permillage;

/**
 *  If the tweet is valid or not.
 */
@property (nonatomic, readonly) BOOL isValid;

/**
 *  Text range that is visible
 */
@property (nonatomic, readonly) NSRange displayTextRange;

/**
 *  Text range that is valid under Twitter
 */
@property (nonatomic, readonly) NSRange validDisplayTextRange;

@end

@interface TwitterTextParser : NSObject

@property (nonatomic, readonly) TwitterTextConfiguration *configuration;

+ (instancetype)defaultParser NS_SWIFT_NAME(defaultParser());
+ (void)setDefaultParserWithConfiguration:(TwitterTextConfiguration *)configuration;

- (instancetype)initWithConfiguration:(TwitterTextConfiguration *)configuration;
- (TwitterTextParseResults *)parseTweet:(NSString *)text;
- (NSInteger)maxWeightedTweetLength;

@end

NS_ASSUME_NONNULL_END
