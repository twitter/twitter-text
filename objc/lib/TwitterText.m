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
#define TWHashtagSpecialChars                   @"_\\u200c\\u200d\\ua67e\\u05be\\u05f3\\u05f4\\uff5e\\u301c\\u309b\\u309c\\u30a0\\u30fb\\u3003\\u0f0b\\u0f0c\\u00b7"
#define TWUHashtagAlphanumeric                  @"[\\p{L}\\p{M}\\p{Nd}" TWHashtagSpecialChars @"]"
#define TWUHashtagBoundaryInvalidChars          @"&\\p{L}\\p{M}\\p{Nd}" TWHashtagSpecialChars

#define TWUHashtagBoundary \
@"^|$|[^" \
    TWUHashtagBoundaryInvalidChars \
@"]"

#define TWUValidHashtag \
    @"(?:" TWUHashtagBoundary @")([#＃](?!\ufe0f|\u20e3)" TWUHashtagAlphanumeric @"*" TWHashtagAlpha TWUHashtagAlphanumeric @"*)"

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

#define TWUValidMentionPrecedingChars   @"(?:[^a-zA-Z0-9_!#$%&*@＠]|^|(?:^|[^a-zA-Z0-9_+~.-])RT:?)"
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
    @"aaa|aarp|abb|abbott|abbvie|able|abogado|abudhabi|academy|accenture|accountant|accountants|aco|active|" \
    @"actor|adac|ads|adult|aeg|aero|aetna|afl|agakhan|agency|aig|airbus|airforce|airtel|akdn|alibaba|" \
    @"alipay|allfinanz|ally|alsace|alstom|amica|amsterdam|analytics|android|anquan|anz|apartments|app|" \
    @"apple|aquarelle|aramco|archi|army|arpa|art|arte|asia|associates|attorney|auction|audi|audible|audio|" \
    @"author|auto|autos|avianca|aws|axa|azure|baby|baidu|band|bank|bar|barcelona|barclaycard|barclays|" \
    @"barefoot|bargains|bauhaus|bayern|bbc|bbva|bcg|bcn|beats|beer|bentley|berlin|best|bet|bharti|bible|" \
    @"bid|bike|bing|bingo|bio|biz|black|blackfriday|blanco|blog|bloomberg|blue|bms|bmw|bnl|bnpparibas|" \
    @"boats|boehringer|bom|bond|boo|book|boots|bosch|bostik|bot|boutique|bradesco|bridgestone|broadway|" \
    @"broker|brother|brussels|budapest|bugatti|build|builders|business|buy|buzz|bzh|cab|cafe|cal|call|cam|" \
    @"camera|camp|cancerresearch|canon|capetown|capital|car|caravan|cards|care|career|careers|cars|cartier|" \
    @"casa|cash|casino|cat|catering|cba|cbn|ceb|center|ceo|cern|cfa|cfd|chanel|channel|chase|chat|cheap|" \
    @"chintai|chloe|christmas|chrome|church|cipriani|circle|cisco|citic|city|cityeats|claims|cleaning|" \
    @"click|clinic|clinique|clothing|cloud|club|clubmed|coach|codes|coffee|college|cologne|com|commbank|" \
    @"community|company|compare|computer|comsec|condos|construction|consulting|contact|contractors|cooking|" \
    @"cookingchannel|cool|coop|corsica|country|coupon|coupons|courses|credit|creditcard|creditunion|" \
    @"cricket|crown|crs|cruises|csc|cuisinella|cymru|cyou|dabur|dad|dance|date|dating|datsun|day|dclk|dds|" \
    @"deal|dealer|deals|degree|delivery|dell|deloitte|delta|democrat|dental|dentist|desi|design|dev|dhl|" \
    @"diamonds|diet|digital|direct|directory|discount|dnp|docs|dog|doha|domains|doosan|dot|download|drive|" \
    @"dtv|dubai|dunlop|dupont|durban|dvag|earth|eat|edeka|edu|education|email|emerck|energy|engineer|" \
    @"engineering|enterprises|epost|epson|equipment|ericsson|erni|esq|estate|eurovision|eus|events|" \
    @"everbank|exchange|expert|exposed|express|extraspace|fage|fail|fairwinds|faith|family|fan|fans|farm|" \
    @"farmers|fashion|fast|feedback|ferrero|film|final|finance|financial|fire|firestone|firmdale|fish|" \
    @"fishing|fit|fitness|flickr|flights|flir|florist|flowers|flsmidth|fly|foo|foodnetwork|football|ford|" \
    @"forex|forsale|forum|foundation|fox|fresenius|frl|frogans|frontdoor|frontier|ftr|fund|furniture|" \
    @"futbol|fyi|gal|gallery|gallo|gallup|game|games|garden|gbiz|gdn|gea|gent|genting|ggee|gift|gifts|" \
    @"gives|giving|glass|gle|global|globo|gmail|gmbh|gmo|gmx|gold|goldpoint|golf|goo|goodyear|goog|google|" \
    @"gop|got|gov|grainger|graphics|gratis|green|gripe|group|guardian|gucci|guge|guide|guitars|guru|" \
    @"hamburg|hangout|haus|hdfcbank|health|healthcare|help|helsinki|here|hermes|hgtv|hiphop|hisamitsu|" \
    @"hitachi|hiv|hkt|hockey|holdings|holiday|homedepot|homes|honda|horse|host|hosting|hoteles|hotmail|" \
    @"house|how|hsbc|htc|hyundai|ibm|icbc|ice|icu|ifm|iinet|imamat|imdb|immo|immobilien|industries|" \
    @"infiniti|info|ing|ink|institute|insurance|insure|int|international|investments|ipiranga|irish|" \
    @"iselect|ismaili|ist|istanbul|itau|itv|iwc|jaguar|java|jcb|jcp|jetzt|jewelry|jlc|jll|jmp|jnj|jobs|" \
    @"joburg|jot|joy|jpmorgan|jprs|juegos|kaufen|kddi|kerryhotels|kerrylogistics|kerryproperties|kfh|kia|" \
    @"kim|kinder|kindle|kitchen|kiwi|koeln|komatsu|kosher|kpmg|kpn|krd|kred|kuokgroup|kyoto|lacaixa|" \
    @"lamborghini|lamer|lancaster|land|landrover|lanxess|lasalle|lat|latrobe|law|lawyer|lds|lease|leclerc|" \
    @"legal|lego|lexus|lgbt|liaison|lidl|life|lifeinsurance|lifestyle|lighting|like|limited|limo|lincoln|" \
    @"linde|link|lipsy|live|living|lixil|loan|loans|locker|locus|lol|london|lotte|lotto|love|ltd|ltda|" \
    @"lupin|luxe|luxury|madrid|maif|maison|makeup|man|management|mango|market|marketing|markets|marriott|" \
    @"mattel|mba|med|media|meet|melbourne|meme|memorial|men|menu|meo|metlife|miami|microsoft|mil|mini|mlb|" \
    @"mls|mma|mobi|mobily|moda|moe|moi|mom|monash|money|montblanc|mormon|mortgage|moscow|motorcycles|mov|" \
    @"movie|movistar|mtn|mtpc|mtr|museum|mutual|mutuelle|nadex|nagoya|name|natura|navy|nec|net|netbank|" \
    @"netflix|network|neustar|new|news|next|nextdirect|nexus|nfl|ngo|nhk|nico|nikon|ninja|nissan|nissay|" \
    @"nokia|northwesternmutual|norton|now|nowruz|nowtv|nra|nrw|ntt|nyc|obi|office|okinawa|olayan|" \
    @"olayangroup|ollo|omega|one|ong|onl|online|ooo|oracle|orange|org|organic|orientexpress|origins|osaka|" \
    @"otsuka|ott|ovh|page|pamperedchef|panerai|paris|pars|partners|parts|party|passagens|pccw|pet|pharmacy|" \
    @"philips|photo|photography|photos|physio|piaget|pics|pictet|pictures|pid|pin|ping|pink|pioneer|pizza|" \
    @"place|play|playstation|plumbing|plus|pohl|poker|politie|porn|post|praxi|press|prime|pro|prod|" \
    @"productions|prof|progressive|promo|properties|property|protection|pub|pwc|qpon|quebec|quest|racing|" \
    @"read|realestate|realtor|realty|recipes|red|redstone|redumbrella|rehab|reise|reisen|reit|ren|rent|" \
    @"rentals|repair|report|republican|rest|restaurant|review|reviews|rexroth|rich|richardli|ricoh|rio|rip|" \
    @"rocher|rocks|rodeo|room|rsvp|ruhr|run|rwe|ryukyu|saarland|safe|safety|sakura|sale|salon|samsung|" \
    @"sandvik|sandvikcoromant|sanofi|sap|sapo|sarl|sas|save|saxo|sbi|sbs|sca|scb|schaeffler|schmidt|" \
    @"scholarships|school|schule|schwarz|science|scor|scot|seat|security|seek|select|sener|services|seven|" \
    @"sew|sex|sexy|sfr|sharp|shaw|shell|shia|shiksha|shoes|shop|shopping|shouji|show|shriram|silk|sina|" \
    @"singles|site|ski|skin|sky|skype|smile|sncf|soccer|social|softbank|software|sohu|solar|solutions|song|" \
    @"sony|soy|space|spiegel|spot|spreadbetting|srl|stada|star|starhub|statebank|statefarm|statoil|stc|" \
    @"stcgroup|stockholm|storage|store|stream|studio|study|style|sucks|supplies|supply|support|surf|" \
    @"surgery|suzuki|swatch|swiss|sydney|symantec|systems|tab|taipei|talk|taobao|tatamotors|tatar|tattoo|" \
    @"tax|taxi|tci|tdk|team|tech|technology|tel|telecity|telefonica|temasek|tennis|teva|thd|theater|" \
    @"theatre|tickets|tienda|tiffany|tips|tires|tirol|tmall|today|tokyo|tools|top|toray|toshiba|total|" \
    @"tours|town|toyota|toys|trade|trading|training|travel|travelchannel|travelers|travelersinsurance|" \
    @"trust|trv|tube|tui|tunes|tushu|tvs|ubs|unicom|university|uno|uol|ups|vacations|vana|vegas|ventures|" \
    @"verisign|vermögensberater|vermögensberatung|versicherung|vet|viajes|video|vig|viking|villas|vin|vip|" \
    @"virgin|vision|vista|vistaprint|viva|vlaanderen|vodka|volkswagen|vote|voting|voto|voyage|vuelos|wales|" \
    @"walter|wang|wanggou|warman|watch|watches|weather|weatherchannel|webcam|weber|website|wed|wedding|" \
    @"weibo|weir|whoswho|wien|wiki|williamhill|win|windows|wine|wme|wolterskluwer|woodside|work|works|" \
    @"world|wtc|wtf|xbox|xerox|xihuan|xin|xperia|xxx|xyz|yachts|yahoo|yamaxun|yandex|yodobashi|yoga|" \
    @"yokohama|you|youtube|yun|zappos|zara|zero|zip|zone|zuerich|дети|ком|москва|онлайн|орг|рус|сайт|קום|" \
    @"ابوظبي|ارامكو|العليان|بازار|بيتك|شبكة|كوم|موبايلي|موقع|همراه|कॉम|नेट|संगठन|คอม|みんな|クラウド|グーグル|コム|ストア|" \
    @"セール|ファッション|ポイント|世界|中信|中文网|企业|佛山|信息|健康|八卦|公司|公益|商城|商店|商标|嘉里|嘉里大酒店|在线|大拿|娱乐|家電|工行|广东|微博|慈善|我爱你|手机|手表|" \
    @"政务|政府|新闻|时尚|書籍|机构|淡马锡|游戏|点看|珠宝|移动|组织机构|网址|网店|网站|网络|联通|诺基亚|谷歌|购物|集团|電訊盈科|飞利浦|食品|餐厅|닷넷|닷컴|삼성|onion" \
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
    @"tv|tw|tz|ua|ug|uk|um|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|za|zm|zw|ελ|бг|бел|ею|мкд|мон|рф|срб|" \
    @"укр|қаз|հայ|الاردن|الجزائر|السعودية|المغرب|امارات|ایران|بھارت|تونس|سودان|سورية|عراق|عمان|فلسطين|قطر|" \
    @"مصر|مليسيا|پاکستان|भारत|বাংলা|ভারত|ভাৰত|ਭਾਰਤ|ભારત|ଭାରତ|இந்தியா|இலங்கை|சிங்கப்பூர்|భారత్|ಭಾರತ|ഭാരതം|" \
    @"ලංකා|ไทย|გე|中国|中國|台湾|台灣|新加坡|澳門|香港|한국" \
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
#define TWUValidGeneralURLPathChars     @"[a-zA-Z\\p{Cyrillic}0-9!\\*';:=+,.$/%#\\[\\]\\-_~&|@" TWULatinAccents @"]"

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

#define TWUValidURLPathEndingChars      @"[a-zA-Z\\p{Cyrillic}0-9=_#/+\\-" TWULatinAccents @"]|(?:" TWUValidURLBalancedParens @")"

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
static const NSUInteger HTTPShortURLLength = 23;
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
