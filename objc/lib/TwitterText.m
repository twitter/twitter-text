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

#define TWUCyrillicHashtagChars                     @"\\u0400-\\u04FF"
#define TWUCyrillicSupplementHashtagChars           @"\\u0500-\\u0527"
#define TWUCyrillicExtendedAHashtagChars            @"\\u2DE0-\\u2DFF"
#define TWUCyrillicExtendedBHashtagChars            @"\\uA640-\\uA69F"
#define TWUHebrewHashtagChars                       @"\\u0591-\\u05BF\\u05C1-\\u05C2\\u05C4-\\u05C5\\u05C7\\u05D0-\\u05EA\\u05F0-\\u05F4"
#define TWUHebrewPresentationFormsHashtagChars      @"\\uFB12-\\uFB28\\uFB2A-\\uFB36\\uFB38-\\uFB3C\\uFB3E\\uFB40-\\uFB41\\uFB43-\\uFB44\\uFB46-\\uFB4F"
#define TWUArabicHashtagChars                       @"\\u0610-\\u061A\\u0620-\\u065F\\u066E-\\u06D3\\u06D5-\\u06DC\\u06DE-\\u06E8\\u06EA-\\u06EF\\u06FA-\\u06FC\\u06FF"
#define TWUArabicSupplementHashtagChars             @"\\u0750-\\u077F"
#define TWUArabicExtendedAHashtagChars              @"\\u08A0\\u08A2-\\u08AC\\u08E4-\\u08FE"
#define TWUArabicPresentationFormsAHashtagChars     @"\\uFB50-\\uFBB1\\uFBD3-\\uFD3D\\uFD50-\\uFD8F\\uFD92-\\uFDC7\\uFDF0-\\uFDFB"
#define TWUArabicPresentationFormsBHashtagChars     @"\\uFE70-\\uFE74\\uFE76-\\uFEFC"
#define TWUZeroWidthNonJoiner                       @"\\u200C"
#define TWUThaiHashtagChars                         @"\\u0E01-\\u0E3A"
#define TWUHangulHashtagChars                       @"\\u0E40-\\u0E4E"
#define TWUHangulJamoHashtagChars                   @"\\u1100-\\u11FF"
#define TWUHangulCompatibilityJamoHashtagChars      @"\\u3130-\\u3185"
#define TWUHangulJamoExtendedAHashtagChars          @"\\uA960-\\uA97F"
#define TWUHangulSyllablesHashtagChars              @"\\uAC00-\\uD7AF"
#define TWUHangulJamoExtendedBHashtagChars          @"\\uD7B0-\\uD7FF"
#define TWUHalfWidthHangulHashtagChars              @"\\uFFA1-\\uFFDC"

#define TWUNonLatinHashtagChars \
    TWUCyrillicHashtagChars \
    TWUCyrillicSupplementHashtagChars \
    TWUCyrillicExtendedAHashtagChars \
    TWUCyrillicExtendedBHashtagChars \
    TWUHebrewHashtagChars \
    TWUHebrewPresentationFormsHashtagChars \
    TWUArabicHashtagChars \
    TWUArabicSupplementHashtagChars \
    TWUArabicExtendedAHashtagChars \
    TWUArabicPresentationFormsAHashtagChars \
    TWUArabicPresentationFormsBHashtagChars \
    TWUZeroWidthNonJoiner \
    TWUThaiHashtagChars \
    TWUHangulHashtagChars \
    TWUHangulJamoHashtagChars \
    TWUHangulCompatibilityJamoHashtagChars \
    TWUHangulJamoExtendedAHashtagChars \
    TWUHangulSyllablesHashtagChars \
    TWUHangulJamoExtendedBHashtagChars \
    TWUHalfWidthHangulHashtagChars

#define TWUKatakanaHashtagChars                 @"\\u30A1-\\u30FA\\u30FC-\\u30FE"
#define TWUKatakanaHalfWidthHashtagChars        @"\\uFF66-\\uFF9F"
#define TWULatinFullWidthHashtagChars           @"\\uFF10-\\uFF19\\uFF21-\\uFF3A\\uFF41-\\uFF5A"
#define TWUHiraganaHashtagChars                 @"\\u3041-\\u3096\\u3099-\\u309E"
#define TWUCJKExtensionAHashtagChars            @"\\u3400-\\u4DBF"
#define TWUCJKUnifiedHashtagChars               @"\\u4E00-\\u9FFF"
#define TWUCJKExtensionBHashtagChars            @"\\U00020000-\\U0002A6DF"
#define TWUCJKExtensionCHashtagChars            @"\\U0002A700-\\U0002B73F"
#define TWUCJKExtensionDHashtagChars            @"\\U0002B740-\\U0002B81F"
#define TWUCJKSupplementHashtagChars            @"\\U0002F800-\\U0002FA1F\\u3003\\u3005\\u303B"

#define TWUCJKHashtagCharacters \
    TWUKatakanaHashtagChars \
    TWUKatakanaHalfWidthHashtagChars \
    TWULatinFullWidthHashtagChars \
    TWUHiraganaHashtagChars \
    TWUCJKExtensionAHashtagChars \
    TWUCJKUnifiedHashtagChars \
    TWUCJKExtensionBHashtagChars \
    TWUCJKExtensionCHashtagChars \
    TWUCJKExtensionDHashtagChars \
    TWUCJKSupplementHashtagChars

#define TWUPunctuationChars                             @"\\-_!\"#$%&'()*+,./:;<=>?@\\[\\]^`{|}~"
#define TWUPunctuationCharsWithoutHyphen                @"_!\"#$%&'()*+,./:;<=>?@\\[\\]^`{|}~"
#define TWUPunctuationCharsWithoutHyphenAndUnderscore   @"!\"#$%&'()*+,./:;<=>?@\\[\\]^`{|}~"
#define TWUCtrlChars                                    @"\\x00-\\x1F\\x7F"

#define TWHashtagAlpha \
@"[a-z_" \
    TWULatinAccents \
    TWUNonLatinHashtagChars \
    TWUCJKHashtagCharacters \
@"]"

#define TWUHashtagAlphanumeric \
@"[a-z0-9_" \
    TWULatinAccents \
    TWUNonLatinHashtagChars \
    TWUCJKHashtagCharacters \
@"]"

#define TWUHashtagBoundaryInvalidChars \
@"a-z0-9&_" \
TWULatinAccents \
TWUNonLatinHashtagChars \
TWUCJKHashtagCharacters

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
    @"abogado|academy|accountants|active|actor|adult|aero|agency|airforce|allfinanz|alsace|android|" \
    @"aquarelle|archi|army|arpa|asia|associates|attorney|auction|audio|autos|axa|band|bar|bargains|bayern|" \
    @"beer|berlin|best|bid|bike|bio|biz|black|blackfriday|bloomberg|blue|bmw|bnpparibas|boo|boutique|" \
    @"brussels|budapest|build|builders|business|buzz|bzh|cab|cal|camera|camp|cancerresearch|capetown|" \
    @"capital|caravan|cards|care|career|careers|cartier|casa|cash|cat|catering|center|ceo|cern|channel|" \
    @"cheap|christmas|chrome|church|citic|city|claims|cleaning|click|clinic|clothing|club|coach|codes|" \
    @"coffee|college|cologne|com|community|company|computer|condos|construction|consulting|contractors|" \
    @"cooking|cool|coop|country|credit|creditcard|cricket|crs|cruises|cuisinella|cymru|dad|dance|dating|" \
    @"day|deals|degree|delivery|democrat|dental|dentist|desi|diamonds|diet|digital|direct|directory|" \
    @"discount|dnp|domains|durban|dvag|eat|edu|education|email|emerck|energy|engineer|engineering|" \
    @"enterprises|equipment|esq|estate|eurovision|eus|events|everbank|exchange|expert|exposed|fail|farm|" \
    @"fashion|feedback|finance|financial|firmdale|fish|fishing|fitness|flights|florist|flsmidth|fly|foo|" \
    @"forsale|foundation|frl|frogans|fund|furniture|futbol|gal|gallery|gbiz|gent|gift|gifts|gives|glass|" \
    @"gle|global|globo|gmail|gmo|gmx|google|gop|gov|graphics|gratis|green|gripe|guide|guitars|guru|hamburg|" \
    @"haus|healthcare|help|here|hiphop|hiv|holdings|holiday|homes|horse|host|hosting|house|how|ibm|immo|" \
    @"immobilien|industries|info|ing|ink|institute|insure|int|international|investments|irish|jetzt|jobs|" \
    @"joburg|juegos|kaufen|kim|kitchen|kiwi|koeln|krd|kred|lacaixa|land|latrobe|lawyer|lds|lease|legal|" \
    @"lgbt|life|lighting|limited|limo|link|loans|london|lotto|ltda|luxe|luxury|madrid|maison|management|" \
    @"mango|market|marketing|media|meet|melbourne|meme|memorial|menu|miami|mil|mini|mobi|moda|moe|monash|" \
    @"money|mormon|mortgage|moscow|motorcycles|mov|museum|nagoya|name|navy|net|network|neustar|new|nexus|" \
    @"ngo|nhk|ninja|nra|nrw|nyc|okinawa|ong|onl|ooo|org|organic|otsuka|ovh|paris|partners|parts|party|" \
    @"pharmacy|photo|photography|photos|physio|pics|pictures|pink|pizza|place|plumbing|pohl|poker|porn|" \
    @"post|praxi|press|pro|prod|productions|prof|properties|property|pub|qpon|quebec|realtor|recipes|red|" \
    @"rehab|reise|reisen|reit|ren|rentals|repair|report|republican|rest|restaurant|reviews|rich|rio|rip|" \
    @"rocks|rodeo|rsvp|ruhr|ryukyu|saarland|samsung|sarl|sca|scb|schmidt|schule|science|scot|services|sexy|" \
    @"shiksha|shoes|singles|social|software|sohu|solar|solutions|soy|space|spiegel|supplies|supply|support|" \
    @"surf|surgery|suzuki|sydney|systems|taipei|tatar|tattoo|tax|technology|tel|tienda|tips|tirol|today|" \
    @"tokyo|tools|top|town|toys|trade|training|travel|trust|tui|university|uno|uol|vacations|vegas|" \
    @"ventures|vermögensberater|vermögensberatung|versicherung|vet|viajes|villas|vision|vlaanderen|vodka|" \
    @"vote|voting|voto|voyage|wales|wang|watch|webcam|website|wed|wedding|whoswho|wien|wiki|williamhill|" \
    @"wme|work|works|world|wtc|wtf|xxx|xyz|yachts|yandex|yoga|yokohama|youtube|zip|zone|дети|москва|онлайн|" \
    @"орг|рус|сайт|بازار|شبكة|موقع|संगठन|みんな|グーグル|世界|中信|中文网|企业|佛山|八卦|公司|公益|商城|商店|商标|在线|广东|我爱你|手机|政务|机构|游戏|" \
    @"移动|组织机构|网址|网店|网络|谷歌|集团|삼성|onion" \
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
    @"新加坡|香港|한국" \
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

static NSInteger hexValueForCharacter(unichar character)
{
    if ('0' <= character && character <= '9') {
        return (NSInteger)(character - '0');
    } else if ('a' <= character && character <= 'z') {
        return (NSInteger)(character - 'a' + 10);
    } else if ('A' <= character && character <= 'Z') {
        return (NSInteger)(character - 'A' + 10);
    } else {
        return -1;
    }
}

static NSInteger hexDigitValue(NSString *string, NSUInteger startLocation, NSUInteger length)
{
    if (string.length < startLocation + length) {
        return -1;
    }

    NSUInteger value = 0;
    for (NSUInteger index = 0; index < length; index++) {
        unichar sequenceChar = [string characterAtIndex:startLocation + index];
        NSInteger parsedValue = hexValueForCharacter(sequenceChar);
        if (parsedValue == -1) {
            // Invalid hex digit
            return -1;
        }
        value <<= 4;
        value |= (NSUInteger)parsedValue;
    }

    return (NSInteger)value;
}

static NSInteger nextTokenValue(NSString *string, NSUInteger startLocation, NSUInteger *pLength)
{
    NSUInteger len = string.length;
    if (len <= startLocation) {
        return -1;
    }

    unichar currentChar = [string characterAtIndex:startLocation];
    if (currentChar == '\\') {
        if (startLocation + 1 < len) {
            startLocation++;
            unichar nextChar = [string characterAtIndex:startLocation];
            if (nextChar == 'u') {
                if (startLocation + 4 < len) {
                    startLocation++;
                    // 4 hex digits
                    NSInteger value = hexDigitValue(string, startLocation, 4);
                    if (pLength) {
                        *pLength = 2 + 4;
                    }
                    return value;
                }
            } else if (nextChar == 'U') {
                if (startLocation + 8 < len) {
                    startLocation++;
                    // 8 hex digits
                    NSInteger value = hexDigitValue(string, startLocation, 8);
                    if (pLength) {
                        *pLength = 2 + 8;
                    }
                    return value;
                }
            } else {
                // Normal escape
                if (pLength) {
                    *pLength = 1 + 1;
                }
                return (NSInteger)nextChar;
            }
        }
        return -1;
    } else if (CFStringIsSurrogateHighCharacter(currentChar)) {
        if (startLocation + 1 < len) {
            startLocation++;
            unichar nextChar = [string characterAtIndex:startLocation];
            if (CFStringIsSurrogateLowCharacter(nextChar)) {
                // Surrogate pair character
                if (pLength) {
                    *pLength = 2;
                }
                return CFStringGetLongCharacterForSurrogatePair(currentChar, nextChar);
            }
        }
        return -1;
    } else {
        // Normal character
        if (pLength) {
            *pLength = 1;
        }
        return (NSInteger)currentChar;
    }
}

static NSCharacterSet *validHashtagBoundaryCharacterSet()
{
    NSMutableCharacterSet *set = [NSMutableCharacterSet characterSetWithRange:NSMakeRange(0, 0)];
    NSString *invalidChars = TWUHashtagBoundaryInvalidChars;
    if ([invalidChars rangeOfString:@"a-z"].location != NSNotFound && [invalidChars rangeOfString:@"A-Z"].location == NSNotFound) {
        invalidChars = [invalidChars stringByAppendingString:@"A-Z"];
    }

    NSUInteger len = invalidChars.length;
    if (!len) {
        return nil;
    }

    BOOL inRange = NO;
    NSNumber *pendingValue = nil;

    NSUInteger offset = 0;
    NSUInteger parsedLength = 0;
    while (offset < len) {
        NSInteger value = nextTokenValue(invalidChars, offset, &parsedLength);
        if (value == -1) {
            // Parse error
            return nil;
        }

        NSNumber *currentValue = nil;

        if (value == '-' && parsedLength == 1) {
            if (offset == 0) {
                currentValue = @('-');
            } else if (!pendingValue) {
                // Found invalid '-'
                return nil;
            } else if (!inRange) {
                inRange = YES;
            } else {
                // Found sequence "--"
                return nil;
            }
        } else {
            currentValue = @(value);
        }

        if (currentValue) {
            if (inRange) {
                // Found range
                if (pendingValue) {
                    NSInteger start = [pendingValue integerValue];
                    if (start <= value) {
                        [set addCharactersInRange:NSMakeRange((NSUInteger)start, (NSUInteger)(value - start + 1))];
                    }
                }
                pendingValue = nil;
                inRange = NO;
            } else {
                // Found indivisual character
                if (pendingValue) {
                    [set addCharactersInRange:NSMakeRange((NSUInteger)[pendingValue integerValue], 1)];
                }
                pendingValue = currentValue;
            }
        }

        offset += parsedLength;
    }

    if (inRange) {
        // Found '-' in the end
        return nil;
    }

    // Found indivisual character
    if (pendingValue) {
        [set addCharactersInRange:NSMakeRange((NSUInteger)[pendingValue integerValue], 1)];
    }

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
