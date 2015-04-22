//
//  TwitterText.m
//
//  Copyright 2012-2014 Twitter, Inc.
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//  http://www.apache.org/licenses/LICENSE-2.0
//

#import "TwitterText.h"

#pragma mark - Regular Expressions

//
// These regular expressions are ported from twitter-text-rb on Apr 24 2012.
//

#define TWUControlCharacters        @"\\u0009-\\u000D"
#define TWUSpace                    @"\\u0020"
#define TWUControl85                @"\\u0085"
#define TWUNoBreakSpace             @"\\u00A0"
#define TWUOghamBreakSpace          @"\\u1680"
#define TWUMongolianVowelSeparator  @"\\u180E"
#define TWUWhiteSpaces              @"\\u2000-\\u200A"
#define TWULineSeparator            @"\\u2028"
#define TWUParagraphSeparator       @"\\u2029"
#define TWUNarrowNoBreakSpace       @"\\u202F"
#define TWUMediumMathematicalSpace  @"\\u205F"
#define TWUIdeographicSpace         @"\\u3000"

#define TWUUnicodeSpaces \
    TWUControlCharacters \
    TWUSpace \
    TWUControl85 \
    TWUNoBreakSpace \
    TWUOghamBreakSpace \
    TWUMongolianVowelSeparator \
    TWUWhiteSpaces \
    TWULineSeparator \
    TWUParagraphSeparator \
    TWUNarrowNoBreakSpace \
    TWUMediumMathematicalSpace \
    TWUIdeographicSpace

#define TWUInvalidCharacters        @"\\uFFFE\\uFEFF\\uFFFF\\u202A-\\u202E"

#define TWULatinAccents \
    @"\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u00FF\\u0100-\\u024F\\u0253-\\u0254\\u0256-\\u0257\\u0259\\u025b\\u0263\\u0268\\u026F\\u0272\\u0289\\u02BB\\u1E00-\\u1EFF"

//
// Hashtag
//

#define TWUPunctuationChars                             @"\\-_!\"#$%&'()*+,./:;<=>?@\\[\\]^`{|}~"
#define TWUPunctuationCharsWithoutHyphen                @"_!\"#$%&'()*+,./:;<=>?@\\[\\]^`{|}~"
#define TWUPunctuationCharsWithoutHyphenAndUnderscore   @"!\"#$%&'()*+,./:;<=>?@\\[\\]^`{|}~"
#define TWUCtrlChars                                    @"\\x00-\\x1F\\x7F"

#define TWHashtagAlpha                          @"[\\p{L}\\p{M}]"
#define TWHashtagSpecialChars                   @"_\\u200c\\u200d\\ua67e\\u05be\\u05f3\\u05f4\\u309b\\u309c\\u30a0\\u30fb\\u3003\\u0f0b\\u0f0c\\u00b7"
#define TWUHashtagAlphanumeric                  @"[\\p{L}\\p{M}\\p{Nd}" TWHashtagSpecialChars @"]"
#define TWUHashtagBoundaryInvalidChars          @"&\\p{L}\\p{M}\\p{Nd}" TWHashtagSpecialChars

#define TWUHashtagBoundary \
@"^|$|[^" \
    TWUHashtagBoundaryInvalidChars \
@"]"

#define TWUValidHashtag \
    @"(?:" TWUHashtagBoundary @")([#＃]" TWUHashtagAlphanumeric @"*" TWHashtagAlpha TWUHashtagAlphanumeric @"*)"

#define TWUEndHashTagMatch      @"\\A(?:[#＃]|://)"

//
// Symbol
//

#define TWUSymbol               @"[a-z]{1,6}(?:[._][a-z]{1,2})?"
#define TWUValidSymbol \
    @"(?:^|[" TWUUnicodeSpaces @"])" \
    @"(\\$" TWUSymbol @")" \
    @"(?=$|\\s|[" TWUPunctuationChars @"])"

//
// Mention and list name
//

#define TWUValidMentionPrecedingChars   @"(?:[^a-zA-Z0-9_!#$%&*@＠]|^|RT:?)"
#define TWUAtSigns                      @"[@＠]"
#define TWUValidUsername                @"\\A" TWUAtSigns @"[a-zA-Z0-9_]{1,20}\\z"
#define TWUValidList                    @"\\A" TWUAtSigns @"[a-zA-Z0-9_]{1,20}/[a-zA-Z][a-zA-Z0-9_\\-]{0,24}\\z"

#define TWUValidMentionOrList \
    @"(" TWUValidMentionPrecedingChars @")" \
    @"(" TWUAtSigns @")" \
    @"([a-zA-Z0-9_]{1,20})" \
    @"(/[a-zA-Z][a-zA-Z0-9_\\-]{0,24})?"

#define TWUValidReply                   @"\\A(?:[" TWUUnicodeSpaces @"])*" TWUAtSigns @"([a-zA-Z0-9_]{1,20})"
#define TWUEndMentionMatch              @"\\A(?:" TWUAtSigns @"|[" TWULatinAccents @"]|://)"

//
// URL
//

#define TWUValidURLPrecedingChars       @"(?:[^a-zA-Z0-9@＠$#＃" TWUInvalidCharacters @"]|^)"

#define TWUDomainValidStartEndChars \
@"[^" \
    TWUPunctuationChars \
    TWUCtrlChars \
    TWUInvalidCharacters \
    TWUUnicodeSpaces \
@"]"

#define TWUSubdomainValidMiddleChars \
@"[^" \
    TWUPunctuationCharsWithoutHyphenAndUnderscore \
    TWUCtrlChars \
    TWUInvalidCharacters \
    TWUUnicodeSpaces \
@"]"

#define TWUDomainValidMiddleChars \
@"[^" \
    TWUPunctuationCharsWithoutHyphen \
    TWUCtrlChars \
    TWUInvalidCharacters \
    TWUUnicodeSpaces \
@"]"

#define TWUValidSubdomain \
@"(?:" \
    @"(?:" TWUDomainValidStartEndChars TWUSubdomainValidMiddleChars @"*)?" TWUDomainValidStartEndChars @"\\." \
@")"

#define TWUValidDomainName \
@"(?:" \
    @"(?:" TWUDomainValidStartEndChars TWUDomainValidMiddleChars @"*)?" TWUDomainValidStartEndChars @"\\." \
@")"

#define TWUValidGTLD \
@"(?:" \
    @"abbott|abogado|academy|accountant|accountants|active|actor|ads|adult|aero|afl|agency|airforce|" \
    @"allfinanz|alsace|amsterdam|android|apartments|aquarelle|archi|army|arpa|asia|associates|attorney|" \
    @"auction|audio|autos|axa|band|bank|bar|barclaycard|barclays|bargains|bauhaus|bayern|bbc|beer|berlin|" \
    @"best|bid|bike|bingo|bio|biz|black|blackfriday|bloomberg|blue|bmw|bnpparibas|boats|bond|boo|boutique|" \
    @"brussels|budapest|build|builders|business|buzz|bzh|cab|cafe|cal|camera|camp|cancerresearch|canon|" \
    @"capetown|capital|caravan|cards|care|career|careers|cartier|casa|cash|casino|cat|catering|cbn|center|" \
    @"ceo|cern|cfd|channel|chat|cheap|chloe|christmas|chrome|church|citic|city|claims|cleaning|click|" \
    @"clinic|clothing|club|coach|codes|coffee|college|cologne|com|community|company|computer|condos|" \
    @"construction|consulting|contractors|cooking|cool|coop|country|courses|credit|creditcard|cricket|crs|" \
    @"cruises|cuisinella|cymru|cyou|dabur|dad|dance|date|dating|datsun|day|dclk|deals|degree|delivery|" \
    @"democrat|dental|dentist|desi|design|dev|diamonds|diet|digital|direct|directory|discount|dnp|docs|" \
    @"doha|domains|doosan|download|durban|dvag|eat|edu|education|email|emerck|energy|engineer|engineering|" \
    @"enterprises|epson|equipment|erni|esq|estate|eurovision|eus|events|everbank|exchange|expert|exposed|" \
    @"express|fail|faith|fan|fans|farm|fashion|feedback|film|finance|financial|firmdale|fish|fishing|fit|" \
    @"fitness|flights|florist|flowers|flsmidth|fly|foo|football|forex|forsale|foundation|frl|frogans|fund|" \
    @"furniture|futbol|gal|gallery|garden|gbiz|gdn|gent|ggee|gift|gifts|gives|glass|gle|global|globo|gmail|" \
    @"gmo|gmx|gold|goldpoint|golf|goo|goog|google|gop|gov|graphics|gratis|green|gripe|guge|guide|guitars|" \
    @"guru|hamburg|hangout|haus|healthcare|help|here|hermes|hiphop|hiv|holdings|holiday|homes|horse|host|" \
    @"hosting|house|how|ibm|ifm|immo|immobilien|industries|infiniti|info|ing|ink|institute|insure|int|" \
    @"international|investments|irish|iwc|java|jcb|jetzt|jewelry|jobs|joburg|juegos|kaufen|kddi|kim|" \
    @"kitchen|kiwi|koeln|komatsu|krd|kred|kyoto|lacaixa|land|lat|latrobe|lawyer|lds|lease|leclerc|legal|" \
    @"lgbt|lidl|life|lighting|limited|limo|link|loan|loans|london|lotte|lotto|love|ltda|luxe|luxury|madrid|" \
    @"maif|maison|management|mango|market|marketing|markets|marriott|media|meet|melbourne|meme|memorial|" \
    @"menu|miami|mil|mini|mma|mobi|moda|moe|monash|money|mormon|mortgage|moscow|motorcycles|mov|movie|mtn|" \
    @"mtpc|museum|nagoya|name|navy|net|network|neustar|new|news|nexus|ngo|nhk|nico|ninja|nissan|nra|nrw|" \
    @"ntt|nyc|okinawa|one|ong|onl|online|ooo|org|organic|osaka|otsuka|ovh|page|panerai|paris|partners|" \
    @"parts|party|pharmacy|photo|photography|photos|physio|piaget|pics|pictet|pictures|pink|pizza|place|" \
    @"plumbing|plus|pohl|poker|porn|post|praxi|press|pro|prod|productions|prof|properties|property|pub|" \
    @"qpon|quebec|racing|realtor|recipes|red|redstone|rehab|reise|reisen|reit|ren|rentals|repair|report|" \
    @"republican|rest|restaurant|review|reviews|rich|rio|rip|rocks|rodeo|rsvp|ruhr|ryukyu|saarland|sale|" \
    @"samsung|sap|sarl|saxo|sca|scb|schmidt|scholarships|school|schule|schwarz|science|scot|seat|services|" \
    @"sew|sex|sexy|shiksha|shoes|show|shriram|singles|site|sky|social|software|sohu|solar|solutions|sony|" \
    @"soy|space|spiegel|spreadbetting|study|style|sucks|supplies|supply|support|surf|surgery|suzuki|sydney|" \
    @"systems|taipei|tatar|tattoo|tax|team|tech|technology|tel|temasek|tennis|tickets|tienda|tips|tires|" \
    @"tirol|today|tokyo|tools|top|toshiba|tours|town|toys|trade|trading|training|travel|trust|tui|" \
    @"university|uno|uol|vacations|vegas|ventures|vermögensberater|vermögensberatung|versicherung|vet|" \
    @"viajes|video|villas|vision|vlaanderen|vodka|vote|voting|voto|voyage|wales|wang|watch|webcam|website|" \
    @"wed|wedding|weir|whoswho|wien|wiki|williamhill|win|wme|work|works|world|wtc|wtf|xerox|xin|xxx|xyz|" \
    @"yachts|yandex|yodobashi|yoga|yokohama|youtube|zip|zone|zuerich|дети|москва|онлайн|орг|рус|сайт|بازار|" \
    @"شبكة|موقع|संगठन|みんな|グーグル|世界|中信|中文网|企业|佛山|信息|健康|八卦|公司|公益|商城|商店|商标|在线|广东|慈善|我爱你|手机|政务|政府|时尚|机构|淡马锡|游戏|" \
    @"移动|组织机构|网址|网店|网络|谷歌|集团|飞利浦|삼성|onion" \
@")"

#define TWUValidCCTLD \
@"(?:" \
    @"ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bl|bm|bn|bo|bq|br|" \
    @"bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cw|cx|cy|cz|de|dj|dk|dm|do|dz|ec|ee|" \
    @"eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|" \
    @"hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|" \
    @"lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mf|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|" \
    @"nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|" \
    @"sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|ss|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|" \
    @"tv|tw|tz|ua|ug|uk|um|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|za|zm|zw|бел|мкд|мон|рф|срб|укр|қаз|" \
    @"հայ|الاردن|الجزائر|السعودية|المغرب|امارات|ایران|بھارت|تونس|سودان|سورية|عراق|عمان|فلسطين|قطر|مصر|" \
    @"مليسيا|پاکستان|भारत|বাংলা|ভারত|ਭਾਰਤ|ભારત|இந்தியா|இலங்கை|சிங்கப்பூர்|భారత్|ලංකා|ไทย|გე|中国|中國|台湾|台灣|" \
    @"新加坡|澳門|香港|한국" \
@")"

#define TWUValidPunycode                @"(?:xn--[0-9a-z]+)"

#define TWUValidSpecialCCTLD \
@"(?:" \
    @"co|tv" \
@")"

#define TWUSimplifiedValidTLDChars      TWUDomainValidStartEndChars
#define TWUSimplifiedValidTLD           TWUSimplifiedValidTLDChars @"{2,}"

#define TWUSimplifiedValidDomain \
@"(?:" \
    TWUValidSubdomain @"*" TWUValidDomainName TWUSimplifiedValidTLD \
@")"

#define TWUURLDomainForValidation \
@"\\A(?:" \
    TWUValidSubdomain @"*" TWUValidDomainName \
    @"(?:" TWUValidGTLD @"|" TWUValidCCTLD @"|" TWUValidPunycode @")" \
@")\\z"

#define TWUValidASCIIDomain \
    @"(?:[a-zA-Z0-9][a-zA-Z0-9\\-_" TWULatinAccents @"]*\\.)+" \
    @"(?:" TWUValidGTLD @"|" TWUValidCCTLD @"|" TWUValidPunycode @")(?=[^0-9a-z@]|$)"

#define TWUValidTCOURL                  @"https?://t\\.co/[a-zA-Z0-9]+"
#define TWUInvalidShortDomain           @"\\A" TWUValidDomainName TWUValidCCTLD @"\\z"
#define TWUValidSpecialShortDomain      @"\\A" TWUValidDomainName TWUValidSpecialCCTLD @"\\z"

#define TWUValidPortNumber              @"[0-9]+"
#define TWUValidGeneralURLPathChars     @"[a-zA-Z0-9!\\*';:=+,.$/%#\\[\\]\\-_~&|@" TWULatinAccents @"]"

#define TWUValidURLBalancedParens \
@"\\(" \
    @"(?:" \
        TWUValidGeneralURLPathChars @"+" \
        @"|" \
        @"(?:" \
            @"\\(" \
                TWUValidGeneralURLPathChars @"+" \
            @"\\)" \
        @")" \
    @")" \
@"\\)"

#define TWUValidURLPathEndingChars      @"[a-zA-Z0-9=_#/+\\-" TWULatinAccents @"]|(?:" TWUValidURLBalancedParens @")"

#define TWUValidURLPath \
@"(?:" \
    @"(?:" \
        TWUValidGeneralURLPathChars @"*" \
        @"(?:" TWUValidURLBalancedParens TWUValidGeneralURLPathChars @"*)*" TWUValidURLPathEndingChars \
    @")" \
    @"|" \
    @"(?:" TWUValidGeneralURLPathChars @"+/)" \
@")"

#define TWUValidURLQueryChars           @"[a-zA-Z0-9!?*'\\(\\);:&=+$/%#\\[\\]\\-_\\.,~|@]"
#define TWUValidURLQueryEndingChars     @"[a-zA-Z0-9_&=#/]"

#define TWUSimplifiedValidURL \
@"(" \
    @"(" TWUValidURLPrecedingChars @")" \
    @"(" \
        @"(https?://)?" \
        @"(" TWUSimplifiedValidDomain @")" \
        @"(?::(" TWUValidPortNumber @"))?" \
        @"(/" TWUValidURLPath @"*)?" \
        @"(\\?" TWUValidURLQueryChars @"*" TWUValidURLQueryEndingChars @")?" \
    @")" \
@")"

#pragma mark - Constants

static const NSUInteger MaxTweetLength = 140;
static const NSUInteger HTTPShortURLLength = 22;
static const NSUInteger HTTPSShortURLLength = 23;

@implementation TwitterText

#pragma mark - Public Methods

+ (NSArray *)entitiesInText:(NSString *)text
{
    if (!text.length) {
        return [NSArray array];
    }

    NSMutableArray *results = [NSMutableArray array];

    NSArray *urls = [self URLsInText:text];
    [results addObjectsFromArray:urls];

    NSArray *hashtags = [self hashtagsInText:text withURLEntities:urls];
    [results addObjectsFromArray:hashtags];

    NSArray *symbols = [self symbolsInText:text withURLEntities:urls];
    [results addObjectsFromArray:symbols];

    NSArray *mentionsAndLists = [self mentionsOrListsInText:text];
    NSMutableArray *addingItems = [NSMutableArray array];

    for (TwitterTextEntity *entity in mentionsAndLists) {
        NSRange entityRange = entity.range;
        BOOL found = NO;
        for (TwitterTextEntity *existingEntity in results) {
            if (NSIntersectionRange(existingEntity.range, entityRange).length > 0) {
                found = YES;
                break;
            }
        }
        if (!found) {
            [addingItems addObject:entity];
        }
    }

    [results addObjectsFromArray:addingItems];
    [results sortUsingSelector:@selector(compare:)];

    return results;
}

+ (NSArray *)URLsInText:(NSString *)text
{
    if (!text.length) {
        return [NSArray array];
    }

    NSMutableArray *results = [NSMutableArray array];
    NSUInteger len = text.length;
    NSUInteger position = 0;
    NSRange allRange = NSMakeRange(0, 0);

    while (1) {
        position = NSMaxRange(allRange);
        if (len <= position) {
            break;
        }

        NSTextCheckingResult *urlResult = [[self simplifiedValidURLRegexp] firstMatchInString:text options:NSMatchingWithoutAnchoringBounds range:NSMakeRange(position, len - position)];
        if (!urlResult || urlResult.numberOfRanges < 9) {
            break;
        }

        allRange = urlResult.range;
        NSRange precedingRange = [urlResult rangeAtIndex:2];
        NSRange urlRange = [urlResult rangeAtIndex:3];
        NSRange protocolRange = [urlResult rangeAtIndex:4];
        NSRange domainRange = [urlResult rangeAtIndex:5];
        NSRange pathRange = [urlResult rangeAtIndex:7];

        // If protocol is missing and domain contains non-ASCII characters,
        // extract ASCII-only domains.
        if (protocolRange.location == NSNotFound) {
            if (precedingRange.location != NSNotFound && precedingRange.length > 0) {
                NSString *preceding = [text substringWithRange:precedingRange];
                NSRange suffixRange = [preceding rangeOfCharacterFromSet:[self invalidURLWithoutProtocolPrecedingCharSet] options:NSBackwardsSearch | NSAnchoredSearch];
                if (suffixRange.location != NSNotFound) {
                    continue;
                }
            }

            NSUInteger domainStart = domainRange.location;
            NSUInteger domainEnd = NSMaxRange(domainRange);
            TwitterTextEntity *lastEntity = nil;

            while (domainStart < domainEnd) {
                // Include succeeding character for validation
                NSUInteger checkingDomainLength = domainEnd - domainStart;
                if (domainStart + checkingDomainLength < len) {
                    checkingDomainLength++;
                }
                NSTextCheckingResult *asciiResult = [[self validASCIIDomainRegexp] firstMatchInString:text options:0 range:NSMakeRange(domainStart, checkingDomainLength)];
                if (!asciiResult) {
                    break;
                }

                urlRange = asciiResult.range;
                lastEntity = [TwitterTextEntity entityWithType:TwitterTextEntityURL range:urlRange];

                NSTextCheckingResult *invalidShortResult = [[self invalidShortDomainRegexp] firstMatchInString:text options:0 range:urlRange];
                NSTextCheckingResult *validSpecialShortResult = [[self validSpecialShortDomainRegexp] firstMatchInString:text options:0 range:urlRange];
                if (pathRange.location != NSNotFound || validSpecialShortResult != nil || invalidShortResult == nil) {
                    [results addObject:lastEntity];
                }

                domainStart = NSMaxRange(urlRange);
            }

            if (!lastEntity) {
                continue;
            }

            if (pathRange.location != NSNotFound && NSMaxRange(lastEntity.range) == pathRange.location) {
                NSRange entityRange = lastEntity.range;
                entityRange.length += pathRange.length;
                lastEntity.range = entityRange;
            }

            // Adjust next position
            allRange = lastEntity.range;

        } else {
            // In the case of t.co URLs, don't allow additional path characters
            NSRange tcoRange = [[self validTCOURLRegexp] rangeOfFirstMatchInString:text options:0 range:urlRange];
            if (tcoRange.location != NSNotFound) {
                urlRange.length = tcoRange.length;
            } else {
                // Validate domain with precise pattern
                NSRange validationResult = [[self URLRegexpForValidation] rangeOfFirstMatchInString:text options:0 range:domainRange];
                if (validationResult.location == NSNotFound) {
                    continue;
                }
            }

            TwitterTextEntity *entity = [TwitterTextEntity entityWithType:TwitterTextEntityURL range:urlRange];
            [results addObject:entity];
        }
    }

    return results;
}

+ (NSArray *)hashtagsInText:(NSString *)text checkingURLOverlap:(BOOL)checkingURLOverlap
{
    if (!text.length) {
        return [NSArray array];
    }

    NSArray *urls = nil;
    if (checkingURLOverlap) {
        urls = [self URLsInText:text];
    }
    return [self hashtagsInText:text withURLEntities:urls];
}

+ (NSArray *)hashtagsInText:(NSString *)text withURLEntities:(NSArray *)urlEntities
{
    if (!text.length) {
        return [NSArray array];
    }

    NSMutableArray *results = [NSMutableArray array];
    NSUInteger len = text.length;
    NSUInteger position = 0;

    while (1) {
        NSTextCheckingResult *matchResult = [[self validHashtagRegexp] firstMatchInString:text options:NSMatchingWithoutAnchoringBounds range:NSMakeRange(position, len - position)];
        if (!matchResult || matchResult.numberOfRanges < 2) {
            break;
        }

        NSRange hashtagRange = [matchResult rangeAtIndex:1];
        BOOL matchOk = YES;

        // Check URL overlap
        for (TwitterTextEntity *urlEntity in urlEntities) {
            if (NSIntersectionRange(urlEntity.range, hashtagRange).length > 0) {
                matchOk = NO;
                break;
            }
        }

        if (matchOk) {
            NSUInteger afterStart = NSMaxRange(hashtagRange);
            if (afterStart < len) {
                NSRange endMatchRange = [[self endHashtagRegexp] rangeOfFirstMatchInString:text options:0 range:NSMakeRange(afterStart, len - afterStart)];
                if (endMatchRange.location != NSNotFound) {
                    matchOk = NO;
                }
            }

            if (matchOk) {
                TwitterTextEntity *entity = [TwitterTextEntity entityWithType:TwitterTextEntityHashtag range:hashtagRange];
                [results addObject:entity];
            }
        }

        position = NSMaxRange(matchResult.range);
    }

    return results;
}

+ (NSArray *)symbolsInText:(NSString *)text checkingURLOverlap:(BOOL)checkingURLOverlap
{
    if (!text.length) {
        return [NSArray array];
    }

    NSArray *urls = nil;
    if (checkingURLOverlap) {
        urls = [self URLsInText:text];
    }
    return [self symbolsInText:text withURLEntities:urls];
}

+ (NSArray *)symbolsInText:(NSString *)text withURLEntities:(NSArray *)urlEntities
{
    if (!text.length) {
        return [NSArray array];
    }

    NSMutableArray *results = [NSMutableArray array];
    NSUInteger len = text.length;
    NSUInteger position = 0;

    while (1) {
        NSTextCheckingResult *matchResult = [[self validSymbolRegexp] firstMatchInString:text options:NSMatchingWithoutAnchoringBounds range:NSMakeRange(position, len - position)];
        if (!matchResult || matchResult.numberOfRanges < 2) {
            break;
        }

        NSRange symbolRange = [matchResult rangeAtIndex:1];
        BOOL matchOk = YES;

        // Check URL overlap
        for (TwitterTextEntity *urlEntity in urlEntities) {
            if (NSIntersectionRange(urlEntity.range, symbolRange).length > 0) {
                matchOk = NO;
                break;
            }
        }

        if (matchOk) {
            TwitterTextEntity *entity = [TwitterTextEntity entityWithType:TwitterTextEntitySymbol range:symbolRange];
            [results addObject:entity];
        }

        position = NSMaxRange(matchResult.range);
    }

    return results;
}

+ (NSArray *)mentionedScreenNamesInText:(NSString *)text
{
    if (!text.length) {
        return [NSArray array];
    }

    NSArray *mentionsOrLists = [self mentionsOrListsInText:text];
    NSMutableArray *results = [NSMutableArray array];

    for (TwitterTextEntity *entity in mentionsOrLists) {
        if (entity.type == TwitterTextEntityScreenName) {
            [results addObject:entity];
        }
    }

    return results;
}

+ (NSArray *)mentionsOrListsInText:(NSString *)text
{
    if (!text.length) {
        return [NSArray array];
    }

    NSMutableArray *results = [NSMutableArray array];
    NSUInteger len = text.length;
    NSUInteger position = 0;

    while (1) {
        NSTextCheckingResult *matchResult = [[self validMentionOrListRegexp] firstMatchInString:text options:NSMatchingWithoutAnchoringBounds range:NSMakeRange(position, len - position)];
        if (!matchResult || matchResult.numberOfRanges < 5) {
            break;
        }

        NSRange allRange = matchResult.range;
        NSUInteger end = NSMaxRange(allRange);

        NSRange endMentionRange = [[self endMentionRegexp] rangeOfFirstMatchInString:text options:0 range:NSMakeRange(end, len - end)];
        if (endMentionRange.location == NSNotFound) {
            NSRange atSignRange = [matchResult rangeAtIndex:2];
            NSRange screenNameRange = [matchResult rangeAtIndex:3];
            NSRange listNameRange = [matchResult rangeAtIndex:4];

            if (listNameRange.location == NSNotFound) {
                TwitterTextEntity *entity = [TwitterTextEntity entityWithType:TwitterTextEntityScreenName range:NSMakeRange(atSignRange.location, NSMaxRange(screenNameRange) - atSignRange.location)];
                [results addObject:entity];
            } else {
                TwitterTextEntity *entity = [TwitterTextEntity entityWithType:TwitterTextEntityListName range:NSMakeRange(atSignRange.location, NSMaxRange(listNameRange) - atSignRange.location)];
                [results addObject:entity];
            }
        } else {
            // Avoid matching the second username in @username@username
            end++;
        }

        position = end;
    }

    return results;
}

+ (TwitterTextEntity *)repliedScreenNameInText:(NSString *)text
{
    if (!text.length) {
        return nil;
    }

    NSUInteger len = text.length;

    NSTextCheckingResult *matchResult = [[self validReplyRegexp] firstMatchInString:text options:(NSMatchingWithoutAnchoringBounds | NSMatchingAnchored) range:NSMakeRange(0, len)];
    if (!matchResult || matchResult.numberOfRanges < 2) {
        return nil;
    }

    NSRange replyRange = [matchResult rangeAtIndex:1];
    NSUInteger replyEnd = NSMaxRange(replyRange);

    NSRange endMentionRange = [[self endMentionRegexp] rangeOfFirstMatchInString:text options:0 range:NSMakeRange(replyEnd, len - replyEnd)];
    if (endMentionRange.location != NSNotFound) {
        return nil;
    }

    return [TwitterTextEntity entityWithType:TwitterTextEntityScreenName range:replyRange];
}

+ (NSUInteger)tweetLength:(NSString *)text
{
    return [self tweetLength:text httpURLLength:HTTPShortURLLength httpsURLLength:HTTPSShortURLLength];
}

static NSCharacterSet *validHashtagBoundaryCharacterSet()
{
    // Generate equivalent character set matched by TWUHashtagBoundaryInvalidChars regex and invert
    NSMutableCharacterSet *set = [NSMutableCharacterSet letterCharacterSet];
    [set formUnionWithCharacterSet:[NSCharacterSet decimalDigitCharacterSet]];
    [set formUnionWithCharacterSet:[NSCharacterSet characterSetWithCharactersInString: TWHashtagSpecialChars @"&"]];
    return [set invertedSet];
}

+ (NSCharacterSet *)validHashtagBoundaryCharacterSet
{
    static NSCharacterSet *charSet = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        charSet = validHashtagBoundaryCharacterSet();
#if !__has_feature(objc_arc)
        [charSet retain];
#endif
    });
    return charSet;
}

+ (NSUInteger)tweetLength:(NSString *)text httpURLLength:(NSUInteger)httpURLLength httpsURLLength:(NSUInteger)httpsURLLength
{
    // Use Unicode Normalization Form Canonical Composition to calculate tweet text length
    text = [text precomposedStringWithCanonicalMapping];

    if (!text.length) {
        return 0;
    }

    // Remove URLs from text and add t.co length
    NSMutableString *string = [text mutableCopy];
#if !__has_feature(objc_arc)
    [string autorelease];
#endif

    NSUInteger urlLengthOffset = 0;
    NSArray *urlEntities = [self URLsInText:text];
    for (NSInteger i = (NSInteger)urlEntities.count - 1; i >= 0; i--) {
        TwitterTextEntity *entity = [urlEntities objectAtIndex:(NSUInteger)i];
        NSRange urlRange = entity.range;
        NSString *url = [string substringWithRange:urlRange];
        if ([url rangeOfString:@"https" options:(NSCaseInsensitiveSearch | NSAnchoredSearch)].location == 0) {
            urlLengthOffset += httpsURLLength;
        } else {
            urlLengthOffset += httpURLLength;
        }
        [string deleteCharactersInRange:urlRange];
    }

    NSUInteger len = string.length;
    NSUInteger charCount = len + urlLengthOffset;

    // Adjust count for surrogate pair characters
    if (len > 0) {
        UniChar buffer[len];
        [string getCharacters:buffer range:NSMakeRange(0, len)];

        for (NSUInteger i = 0; i < len; i++) {
            UniChar c = buffer[i];
            if (CFStringIsSurrogateHighCharacter(c)) {
                if (i + 1 < len) {
                    UniChar d = buffer[i + 1];
                    if (CFStringIsSurrogateLowCharacter(d)) {
                        charCount--;
                        i++;
                    }
                }
            }
        }
    }

    return charCount;
}

+ (NSInteger)remainingCharacterCount:(NSString *)text
{
    return [self remainingCharacterCount:text httpURLLength:HTTPShortURLLength httpsURLLength:HTTPSShortURLLength];
}

+ (NSInteger)remainingCharacterCount:(NSString *)text httpURLLength:(NSUInteger)httpURLLength httpsURLLength:(NSUInteger)httpsURLLength
{
    return (NSInteger)MaxTweetLength - (NSInteger)[self tweetLength:text httpURLLength:httpURLLength httpsURLLength:httpsURLLength];
}

#pragma mark - Private Methods

+ (NSRegularExpression*)simplifiedValidURLRegexp
{
    static NSRegularExpression *regexp;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        regexp = [[NSRegularExpression alloc] initWithPattern:TWUSimplifiedValidURL options:NSRegularExpressionCaseInsensitive error:NULL];
    });
    return regexp;
}

+ (NSRegularExpression*)URLRegexpForValidation
{
    static NSRegularExpression *regexp;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        regexp = [[NSRegularExpression alloc] initWithPattern:TWUURLDomainForValidation options:NSRegularExpressionCaseInsensitive error:NULL];
    });
    return regexp;
}

+ (NSRegularExpression*)validASCIIDomainRegexp
{
    static NSRegularExpression *regexp;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        regexp = [[NSRegularExpression alloc] initWithPattern:TWUValidASCIIDomain options:NSRegularExpressionCaseInsensitive error:NULL];
    });
    return regexp;
}

+ (NSRegularExpression*)invalidShortDomainRegexp
{
    static NSRegularExpression *regexp;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        regexp = [[NSRegularExpression alloc] initWithPattern:TWUInvalidShortDomain options:NSRegularExpressionCaseInsensitive error:NULL];
    });
    return regexp;
}

+ (NSRegularExpression*)validSpecialShortDomainRegexp
{
    static NSRegularExpression *regexp;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        regexp = [[NSRegularExpression alloc] initWithPattern:TWUValidSpecialShortDomain options:NSRegularExpressionCaseInsensitive error:NULL];
    });
    return regexp;
}

+ (NSRegularExpression*)validTCOURLRegexp
{
    static NSRegularExpression *regexp;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        regexp = [[NSRegularExpression alloc] initWithPattern:TWUValidTCOURL options:NSRegularExpressionCaseInsensitive error:NULL];
    });
    return regexp;
}

+ (NSRegularExpression*)validHashtagRegexp
{
    static NSRegularExpression *regexp;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        regexp = [[NSRegularExpression alloc] initWithPattern:TWUValidHashtag options:NSRegularExpressionCaseInsensitive error:NULL];
    });
    return regexp;
}

+ (NSRegularExpression*)endHashtagRegexp
{
    static NSRegularExpression *regexp;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        regexp = [[NSRegularExpression alloc] initWithPattern:TWUEndHashTagMatch options:NSRegularExpressionCaseInsensitive error:NULL];
    });
    return regexp;
}

+ (NSRegularExpression*)validSymbolRegexp
{
    static NSRegularExpression *regexp;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        regexp = [[NSRegularExpression alloc] initWithPattern:TWUValidSymbol options:NSRegularExpressionCaseInsensitive error:NULL];
    });
    return regexp;
}

+ (NSRegularExpression*)validMentionOrListRegexp
{
    static NSRegularExpression *regexp;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        regexp = [[NSRegularExpression alloc] initWithPattern:TWUValidMentionOrList options:NSRegularExpressionCaseInsensitive error:NULL];
    });
    return regexp;
}

+ (NSRegularExpression*)validReplyRegexp
{
    static NSRegularExpression *regexp;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        regexp = [[NSRegularExpression alloc] initWithPattern:TWUValidReply options:NSRegularExpressionCaseInsensitive error:NULL];
    });
    return regexp;
}

+ (NSRegularExpression*)endMentionRegexp
{
    static NSRegularExpression *regexp;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        regexp = [[NSRegularExpression alloc] initWithPattern:TWUEndMentionMatch options:NSRegularExpressionCaseInsensitive error:NULL];
    });
    return regexp;
}

+ (NSCharacterSet*)invalidURLWithoutProtocolPrecedingCharSet
{
    static NSCharacterSet *charSet;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        charSet = [NSCharacterSet characterSetWithCharactersInString:@"-_./"];
#if !__has_feature(objc_arc)
        [charSet retain];
#endif
    });
    return charSet;
}

+ (NSRegularExpression*)validDomainSucceedingCharRegexp
{
    static NSRegularExpression *regexp;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        regexp = [[NSRegularExpression alloc] initWithPattern:TWUEndMentionMatch options:NSRegularExpressionCaseInsensitive error:NULL];
    });
    return regexp;
}

@end
