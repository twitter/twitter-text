// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0
//
//  TwitterText.m
//

#import "NSURL+IFUnicodeURL.h"
#import "TwitterText.h"
#import "TwitterTextEmoji.h"

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

#define TWUUnicodeALM               @"\\u061C"
#define TWUUnicodeLRM               @"\\u200E"
#define TWUUnicodeRLM               @"\\u200F"
#define TWUUnicodeLRE               @"\\u202A"
#define TWUUnicodeRLE               @"\\u202B"
#define TWUUnicodePDF               @"\\u202C"
#define TWUUnicodeLRO               @"\\u202D"
#define TWUUnicodeRLO               @"\\u202E"
#define TWUUnicodeLRI               @"\\u2066"
#define TWUUnicodeRLI               @"\\u2067"
#define TWUUnicodeFSI               @"\\u2068"
#define TWUUnicodePDI               @"\\u2069"

#define TWUUnicodeDirectionalCharacters \
    TWUUnicodeALM \
    TWUUnicodeLRM \
    TWUUnicodeRLM \
    TWUUnicodeLRE \
    TWUUnicodeRLE \
    TWUUnicodePDF \
    TWUUnicodeLRO \
    TWUUnicodeRLO \
    TWUUnicodeLRI \
    TWUUnicodeRLI \
    TWUUnicodeFSI \
    TWUUnicodePDI

#define TWUInvalidCharacters        @"\\uFFFE\\uFEFF\\uFFFF"
#define TWUInvalidCharactersPattern @"[" TWUInvalidCharacters @"]"

#define TWULatinAccents \
    @"\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u00FF\\u0100-\\u024F\\u0253-\\u0254\\u0256-\\u0257\\u0259\\u025b\\u0263\\u0268\\u026F\\u0272\\u0289\\u02BB\\u1E00-\\u1EFF"

//
// Hashtag
//

#define TWUPunctuationChars                             @"-_!\"#$%&'\\(\\)*+,./:;<=>?@\\[\\]^`\\{|}~"
#define TWUPunctuationCharsWithoutHyphen                @"_!\"#$%&'\\(\\)*+,./:;<=>?@\\[\\]^`\\{|}~"
#define TWUPunctuationCharsWithoutHyphenAndUnderscore   @"!\"#$%&'\\(\\)*+,./:;<=>?@\\[\\]^`\\{|}~"

#define TWHashtagAlpha                          @"[\\p{L}\\p{M}]"
#define TWHashtagSpecialChars                   @"_\\u200c\\u200d\\ua67e\\u05be\\u05f3\\u05f4\\uff5e\\u301c\\u309b\\u309c\\u30a0\\u30fb\\u3003\\u0f0b\\u0f0c\\u00b7"
#define TWUHashtagAlphanumeric                  @"[\\p{L}\\p{M}\\p{Nd}" TWHashtagSpecialChars @"]"
#define TWUHashtagBoundaryInvalidChars          @"&\\p{L}\\p{M}\\p{Nd}" TWHashtagSpecialChars

#define TWUHashtagBoundary \
@"^|\\ufe0e|\\ufe0f|$|[^" \
    TWUHashtagBoundaryInvalidChars \
@"]"

#define TWUValidHashtag \
    @"(?:" TWUHashtagBoundary @")([#＃](?!\ufe0f|\u20e3)" TWUHashtagAlphanumeric @"*" TWHashtagAlpha TWUHashtagAlphanumeric @"*)"

#define TWUEndHashTagMatch      @"\\A(?:[#＃]|://)"

//
// Symbol (Cashtag)
//

#define TWUSymbol               @"[a-z]{1,6}(?:[._][a-z]{1,2})?"
#define TWUValidSymbol \
    @"(?:^|[" TWUUnicodeSpaces TWUUnicodeDirectionalCharacters @"])" \
    @"(\\$" TWUSymbol @")" \
    @"(?=$|\\s|[" TWUPunctuationChars @"])"

//
// Mention and list name
//

#define TWUValidMentionPrecedingChars   @"(?:[^a-z0-9_!#$%&*@＠]|^|(?:^|[^a-z0-9_+~.-])RT:?)"
#define TWUAtSigns                      @"[@＠]"
#define TWUValidUsername                @"\\A" TWUAtSigns @"[a-z0-9_]{1,20}\\z"
#define TWUValidList                    @"\\A" TWUAtSigns @"[a-z0-9_]{1,20}/[a-z][a-z0-9_\\-]{0,24}\\z"

#define TWUValidMentionOrList \
    @"(" TWUValidMentionPrecedingChars @")" \
    @"(" TWUAtSigns @")" \
    @"([a-z0-9_]{1,20})" \
    @"(/[a-z][a-z0-9_\\-]{0,24})?"

#define TWUValidReply                   @"\\A(?:[" TWUUnicodeSpaces TWUUnicodeDirectionalCharacters @"])*" TWUAtSigns @"([a-z0-9_]{1,20})"
#define TWUEndMentionMatch              @"\\A(?:" TWUAtSigns @"|[" TWULatinAccents @"]|://)"

//
// URL
//

#define TWUValidURLPrecedingChars       @"(?:[^a-z0-9@＠$#＃" TWUInvalidCharacters @"]|[" TWUUnicodeDirectionalCharacters "]|^)"

// These patterns extract domains that are ascii+latin only. We separately check
// for unencoded domains with unicode characters elsewhere.
#define TWUValidURLCharacters           @"[a-z0-9" TWULatinAccents @"]"
#define TWUValidURLSubdomain            @"(?>(?:" TWUValidURLCharacters @"[" TWUValidURLCharacters @"\\-_]{0,255})?" TWUValidURLCharacters @"\\.)"
#define TWUValidURLDomain               @"(?:(?:" TWUValidURLCharacters @"[" TWUValidURLCharacters @"\\-]{0,255})?" TWUValidURLCharacters @"\\.)"

// Used to extract domains that contain unencoded unicode.
#define TWUValidURLUnicodeCharacters \
@"[^" \
    TWUPunctuationChars \
    @"\\s\\p{Z}\\p{InGeneralPunctuation}" \
@"]"

#define TWUValidURLUnicodeDomain        @"(?:(?:" TWUValidURLUnicodeCharacters @"[" TWUValidURLUnicodeCharacters @"\\-]{0,255})?" TWUValidURLUnicodeCharacters @"\\.)"

#define TWUValidPunycode                @"(?:xn--[-0-9a-z]+)"

#define TWUValidDomain \
@"(?:" \
    TWUValidURLSubdomain @"*" TWUValidURLDomain \
    @"(?:" TWUValidGTLD @"|" TWUValidCCTLD @"|" TWUValidPunycode @")" \
@")" \
@"|(?:(?<=https?://)" \
  @"(?:" \
    @"(?:" TWUValidURLDomain TWUValidCCTLD @")" \
    @"|(?:" \
      TWUValidURLUnicodeDomain @"{0,255}" TWUValidURLUnicodeDomain \
      @"(?:" TWUValidGTLD @"|" TWUValidCCTLD @")" \
    @")" \
  @")" \
@")" \
@"|(?:" \
  TWUValidURLDomain TWUValidCCTLD @"(?=/)" \
@")"

#define TWUValidPortNumber              @"[0-9]++"
#define TWUValidGeneralURLPathChars     @"[a-z\\p{Cyrillic}0-9!\\*';:=+,.$/%#\\[\\]\\-\\u2013_~&|@" TWULatinAccents @"]"

#define TWUValidURLBalancedParens               \
@"\\(" \
    @"(?:" \
        TWUValidGeneralURLPathChars @"+" \
        @"|" \
        @"(?:" \
          TWUValidGeneralURLPathChars @"*" \
          @"\\(" \
            TWUValidGeneralURLPathChars @"+" \
          @"\\)" \
        TWUValidGeneralURLPathChars @"*" \
      @")" \
    @")" \
@"\\)"

#define TWUValidURLPathEndingChars      @"[a-z\\p{Cyrillic}0-9=_#/+\\-" TWULatinAccents @"]|(?:" TWUValidURLBalancedParens @")"

#define TWUValidPath @"(?:" \
  @"(?:" \
    TWUValidGeneralURLPathChars @"*" \
    @"(?:" TWUValidURLBalancedParens TWUValidGeneralURLPathChars @"*)*" \
    TWUValidURLPathEndingChars \
  @")|(?:@" TWUValidGeneralURLPathChars @"+/)" \
@")"

#define TWUValidURLQueryChars           @"[a-z0-9!?*'\\(\\);:&=+$/%#\\[\\]\\-_\\.,~|@]"
#define TWUValidURLQueryEndingChars     @"[a-z0-9\\-_&=#/]"

#define TWUValidURLPatternString \
@"(" \
  @"(" TWUValidURLPrecedingChars @")" \
  @"(" \
    @"(https?://)?" \
    @"(" TWUValidDomain @")" \
    @"(?::(" TWUValidPortNumber @"))?" \
    @"(/" \
      TWUValidPath @"*+" \
    @")?" \
    @"(\\?" TWUValidURLQueryChars @"*" \
            TWUValidURLQueryEndingChars @")?" \
  @")" \
@")"

typedef NS_ENUM(NSInteger, TWUValidURLGroup) {
    TWUValidURLGroupAll = 1,
    TWUValidURLGroupPreceding,
    TWUValidURLGroupURL,
    TWUValidURLGroupProtocol,
    TWUValidURLGroupDomain,
    TWUValidURLGroupPort,
    TWUValidURLGroupPath,
    TWUValidURLGroupQueryString
};

#define TWUValidGTLD \
@"(?:(?:" \
    @"삼성|닷컴|닷넷|香格里拉|餐厅|食品|飞利浦|電訊盈科|集团|通販|购物|谷歌|诺基亚|联通|网络|网站|网店|网址|组织机构|移动|珠宝|点看|游戏|淡马锡|机构|書籍|时尚|新闻|政府|政务|" \
    @"招聘|手表|手机|我爱你|慈善|微博|广东|工行|家電|娱乐|天主教|大拿|大众汽车|在线|嘉里大酒店|嘉里|商标|商店|商城|公益|公司|八卦|健康|信息|佛山|企业|中文网|中信|世界|ポイント|" \
    @"ファッション|セール|ストア|コム|グーグル|クラウド|みんな|คอม|संगठन|नेट|कॉम|همراه|موقع|موبايلي|كوم|كاثوليك|عرب|شبكة|بيتك|بازار|" \
    @"العليان|ارامكو|اتصالات|ابوظبي|קום|сайт|рус|орг|онлайн|москва|ком|католик|дети|zuerich|zone|zippo|zip|" \
    @"zero|zara|zappos|yun|youtube|you|yokohama|yoga|yodobashi|yandex|yamaxun|yahoo|yachts|xyz|xxx|xperia|" \
    @"xin|xihuan|xfinity|xerox|xbox|wtf|wtc|wow|world|works|work|woodside|wolterskluwer|wme|winners|wine|" \
    @"windows|win|williamhill|wiki|wien|whoswho|weir|weibo|wedding|wed|website|weber|webcam|weatherchannel|" \
    @"weather|watches|watch|warman|wanggou|wang|walter|walmart|wales|vuelos|voyage|voto|voting|vote|volvo|" \
    @"volkswagen|vodka|vlaanderen|vivo|viva|vistaprint|vista|vision|visa|virgin|vip|vin|villas|viking|vig|" \
    @"video|viajes|vet|versicherung|vermögensberatung|vermögensberater|verisign|ventures|vegas|vanguard|" \
    @"vana|vacations|ups|uol|uno|university|unicom|uconnect|ubs|ubank|tvs|tushu|tunes|tui|tube|trv|trust|" \
    @"travelersinsurance|travelers|travelchannel|travel|training|trading|trade|toys|toyota|town|tours|" \
    @"total|toshiba|toray|top|tools|tokyo|today|tmall|tkmaxx|tjx|tjmaxx|tirol|tires|tips|tiffany|tienda|" \
    @"tickets|tiaa|theatre|theater|thd|teva|tennis|temasek|telefonica|telecity|tel|technology|tech|team|" \
    @"tdk|tci|taxi|tax|tattoo|tatar|tatamotors|target|taobao|talk|taipei|tab|systems|symantec|sydney|swiss|" \
    @"swiftcover|swatch|suzuki|surgery|surf|support|supply|supplies|sucks|style|study|studio|stream|store|" \
    @"storage|stockholm|stcgroup|stc|statoil|statefarm|statebank|starhub|star|staples|stada|srt|srl|" \
    @"spreadbetting|spot|sport|spiegel|space|soy|sony|song|solutions|solar|sohu|software|softbank|social|" \
    @"soccer|sncf|smile|smart|sling|skype|sky|skin|ski|site|singles|sina|silk|shriram|showtime|show|shouji|" \
    @"shopping|shop|shoes|shiksha|shia|shell|shaw|sharp|shangrila|sfr|sexy|sex|sew|seven|ses|services|" \
    @"sener|select|seek|security|secure|seat|search|scot|scor|scjohnson|science|schwarz|schule|school|" \
    @"scholarships|schmidt|schaeffler|scb|sca|sbs|sbi|saxo|save|sas|sarl|sapo|sap|sanofi|sandvikcoromant|" \
    @"sandvik|samsung|samsclub|salon|sale|sakura|safety|safe|saarland|ryukyu|rwe|run|ruhr|rugby|rsvp|room|" \
    @"rogers|rodeo|rocks|rocher|rmit|rip|rio|ril|rightathome|ricoh|richardli|rich|rexroth|reviews|review|" \
    @"restaurant|rest|republican|report|repair|rentals|rent|ren|reliance|reit|reisen|reise|rehab|" \
    @"redumbrella|redstone|red|recipes|realty|realtor|realestate|read|raid|radio|racing|qvc|quest|quebec|" \
    @"qpon|pwc|pub|prudential|pru|protection|property|properties|promo|progressive|prof|productions|prod|" \
    @"pro|prime|press|praxi|pramerica|post|porn|politie|poker|pohl|pnc|plus|plumbing|playstation|play|" \
    @"place|pizza|pioneer|pink|ping|pin|pid|pictures|pictet|pics|piaget|physio|photos|photography|photo|" \
    @"phone|philips|phd|pharmacy|pfizer|pet|pccw|pay|passagens|party|parts|partners|pars|paris|panerai|" \
    @"panasonic|pamperedchef|page|ovh|ott|otsuka|osaka|origins|orientexpress|organic|org|orange|oracle|" \
    @"open|ooo|onyourside|online|onl|ong|one|omega|ollo|oldnavy|olayangroup|olayan|okinawa|office|off|" \
    @"observer|obi|nyc|ntt|nrw|nra|nowtv|nowruz|now|norton|northwesternmutual|nokia|nissay|nissan|ninja|" \
    @"nikon|nike|nico|nhk|ngo|nfl|nexus|nextdirect|next|news|newholland|new|neustar|network|netflix|" \
    @"netbank|net|nec|nba|navy|natura|nationwide|name|nagoya|nadex|nab|mutuelle|mutual|museum|mtr|mtpc|mtn|" \
    @"msd|movistar|movie|mov|motorcycles|moto|moscow|mortgage|mormon|mopar|montblanc|monster|money|monash|" \
    @"mom|moi|moe|moda|mobily|mobile|mobi|mma|mls|mlb|mitsubishi|mit|mint|mini|mil|microsoft|miami|metlife|" \
    @"merckmsd|meo|menu|men|memorial|meme|melbourne|meet|media|med|mckinsey|mcdonalds|mcd|mba|mattel|" \
    @"maserati|marshalls|marriott|markets|marketing|market|map|mango|management|man|makeup|maison|maif|" \
    @"madrid|macys|luxury|luxe|lupin|lundbeck|ltda|ltd|lplfinancial|lpl|love|lotto|lotte|london|lol|loft|" \
    @"locus|locker|loans|loan|llp|llc|lixil|living|live|lipsy|link|linde|lincoln|limo|limited|lilly|like|" \
    @"lighting|lifestyle|lifeinsurance|life|lidl|liaison|lgbt|lexus|lego|legal|lefrak|leclerc|lease|lds|" \
    @"lawyer|law|latrobe|latino|lat|lasalle|lanxess|landrover|land|lancome|lancia|lancaster|lamer|" \
    @"lamborghini|ladbrokes|lacaixa|kyoto|kuokgroup|kred|krd|kpn|kpmg|kosher|komatsu|koeln|kiwi|kitchen|" \
    @"kindle|kinder|kim|kia|kfh|kerryproperties|kerrylogistics|kerryhotels|kddi|kaufen|juniper|juegos|jprs|" \
    @"jpmorgan|joy|jot|joburg|jobs|jnj|jmp|jll|jlc|jio|jewelry|jetzt|jeep|jcp|jcb|java|jaguar|iwc|iveco|" \
    @"itv|itau|istanbul|ist|ismaili|iselect|irish|ipiranga|investments|intuit|international|intel|int|" \
    @"insure|insurance|institute|ink|ing|info|infiniti|industries|inc|immobilien|immo|imdb|imamat|ikano|" \
    @"iinet|ifm|ieee|icu|ice|icbc|ibm|hyundai|hyatt|hughes|htc|hsbc|how|house|hotmail|hotels|hoteles|hot|" \
    @"hosting|host|hospital|horse|honeywell|honda|homesense|homes|homegoods|homedepot|holiday|holdings|" \
    @"hockey|hkt|hiv|hitachi|hisamitsu|hiphop|hgtv|hermes|here|helsinki|help|healthcare|health|hdfcbank|" \
    @"hdfc|hbo|haus|hangout|hamburg|hair|guru|guitars|guide|guge|gucci|guardian|group|grocery|gripe|green|" \
    @"gratis|graphics|grainger|gov|got|gop|google|goog|goodyear|goodhands|goo|golf|goldpoint|gold|godaddy|" \
    @"gmx|gmo|gmbh|gmail|globo|global|gle|glass|glade|giving|gives|gifts|gift|ggee|george|genting|gent|gea|" \
    @"gdn|gbiz|gay|garden|gap|games|game|gallup|gallo|gallery|gal|fyi|futbol|furniture|fund|fun|fujixerox|" \
    @"fujitsu|ftr|frontier|frontdoor|frogans|frl|fresenius|free|fox|foundation|forum|forsale|forex|ford|" \
    @"football|foodnetwork|food|foo|fly|flsmidth|flowers|florist|flir|flights|flickr|fitness|fit|fishing|" \
    @"fish|firmdale|firestone|fire|financial|finance|final|film|fido|fidelity|fiat|ferrero|ferrari|" \
    @"feedback|fedex|fast|fashion|farmers|farm|fans|fan|family|faith|fairwinds|fail|fage|extraspace|" \
    @"express|exposed|expert|exchange|everbank|events|eus|eurovision|etisalat|esurance|estate|esq|erni|" \
    @"ericsson|equipment|epson|epost|enterprises|engineering|engineer|energy|emerck|email|education|edu|" \
    @"edeka|eco|eat|earth|dvr|dvag|durban|dupont|duns|dunlop|duck|dubai|dtv|drive|download|dot|doosan|" \
    @"domains|doha|dog|dodge|doctor|docs|dnp|diy|dish|discover|discount|directory|direct|digital|diet|" \
    @"diamonds|dhl|dev|design|desi|dentist|dental|democrat|delta|deloitte|dell|delivery|degree|deals|" \
    @"dealer|deal|dds|dclk|day|datsun|dating|date|data|dance|dad|dabur|cyou|cymru|cuisinella|csc|cruises|" \
    @"cruise|crs|crown|cricket|creditunion|creditcard|credit|cpa|courses|coupons|coupon|country|corsica|" \
    @"coop|cool|cookingchannel|cooking|contractors|contact|consulting|construction|condos|comsec|computer|" \
    @"compare|company|community|commbank|comcast|com|cologne|college|coffee|codes|coach|clubmed|club|cloud|" \
    @"clothing|clinique|clinic|click|cleaning|claims|cityeats|city|citic|citi|citadel|cisco|circle|" \
    @"cipriani|church|chrysler|chrome|christmas|chloe|chintai|cheap|chat|chase|charity|channel|chanel|cfd|" \
    @"cfa|cern|ceo|center|ceb|cbs|cbre|cbn|cba|catholic|catering|cat|casino|cash|caseih|case|casa|cartier|" \
    @"cars|careers|career|care|cards|caravan|car|capitalone|capital|capetown|canon|cancerresearch|camp|" \
    @"camera|cam|calvinklein|call|cal|cafe|cab|bzh|buzz|buy|business|builders|build|bugatti|budapest|" \
    @"brussels|brother|broker|broadway|bridgestone|bradesco|box|boutique|bot|boston|bostik|bosch|boots|" \
    @"booking|book|boo|bond|bom|bofa|boehringer|boats|bnpparibas|bnl|bmw|bms|blue|bloomberg|blog|" \
    @"blockbuster|blanco|blackfriday|black|biz|bio|bingo|bing|bike|bid|bible|bharti|bet|bestbuy|best|" \
    @"berlin|bentley|beer|beauty|beats|bcn|bcg|bbva|bbt|bbc|bayern|bauhaus|basketball|baseball|bargains|" \
    @"barefoot|barclays|barclaycard|barcelona|bar|bank|band|bananarepublic|banamex|baidu|baby|azure|axa|" \
    @"aws|avianca|autos|auto|author|auspost|audio|audible|audi|auction|attorney|athleta|associates|asia|" \
    @"asda|arte|art|arpa|army|archi|aramco|arab|aquarelle|apple|app|apartments|aol|anz|anquan|android|" \
    @"analytics|amsterdam|amica|amfam|amex|americanfamily|americanexpress|alstom|alsace|ally|allstate|" \
    @"allfinanz|alipay|alibaba|alfaromeo|akdn|airtel|airforce|airbus|aigo|aig|agency|agakhan|africa|afl|" \
    @"afamilycompany|aetna|aero|aeg|adult|ads|adac|actor|active|aco|accountants|accountant|accenture|" \
    @"academy|abudhabi|abogado|able|abc|abbvie|abbott|abb|abarth|aarp|aaa|onion" \
@")(?=[^a-z0-9@+-]|$))"

#define TWUValidCCTLD \
@"(?:(?:" \
    @"한국|香港|澳門|新加坡|台灣|台湾|中國|中国|გე|ລາວ|ไทย|ලංකා|ഭാരതം|ಭಾರತ|భారత్|சிங்கப்பூர்|இலங்கை|இந்தியா|ଭାରତ|ભારત|ਭਾਰਤ|" \
    @"ভাৰত|ভারত|বাংলা|भारोत|भारतम्|भारत|ڀارت|پاکستان|موريتانيا|مليسيا|مصر|قطر|فلسطين|عمان|عراق|سورية|سودان|" \
    @"تونس|بھارت|بارت|ایران|امارات|المغرب|السعودية|الجزائر|البحرين|الاردن|հայ|қаз|укр|срб|рф|мон|мкд|ею|" \
    @"бел|бг|ευ|ελ|zw|zm|za|yt|ye|ws|wf|vu|vn|vi|vg|ve|vc|va|uz|uy|us|um|uk|ug|ua|tz|tw|tv|tt|tr|tp|to|tn|" \
    @"tm|tl|tk|tj|th|tg|tf|td|tc|sz|sy|sx|sv|su|st|ss|sr|so|sn|sm|sl|sk|sj|si|sh|sg|se|sd|sc|sb|sa|rw|ru|" \
    @"rs|ro|re|qa|py|pw|pt|ps|pr|pn|pm|pl|pk|ph|pg|pf|pe|pa|om|nz|nu|nr|np|no|nl|ni|ng|nf|ne|nc|na|mz|my|" \
    @"mx|mw|mv|mu|mt|ms|mr|mq|mp|mo|mn|mm|ml|mk|mh|mg|mf|me|md|mc|ma|ly|lv|lu|lt|ls|lr|lk|li|lc|lb|la|kz|" \
    @"ky|kw|kr|kp|kn|km|ki|kh|kg|ke|jp|jo|jm|je|it|is|ir|iq|io|in|im|il|ie|id|hu|ht|hr|hn|hm|hk|gy|gw|gu|" \
    @"gt|gs|gr|gq|gp|gn|gm|gl|gi|gh|gg|gf|ge|gd|gb|ga|fr|fo|fm|fk|fj|fi|eu|et|es|er|eh|eg|ee|ec|dz|do|dm|" \
    @"dk|dj|de|cz|cy|cx|cw|cv|cu|cr|co|cn|cm|cl|ck|ci|ch|cg|cf|cd|cc|ca|bz|by|bw|bv|bt|bs|br|bq|bo|bn|bm|" \
    @"bl|bj|bi|bh|bg|bf|be|bd|bb|ba|az|ax|aw|au|at|as|ar|aq|ao|an|am|al|ai|ag|af|ae|ad|ac" \
@")(?=[^a-z0-9@+-]|$))"

#define TWUValidTCOURL                  @"^https?://t\\.co/([a-z0-9]+)"

#define TWUValidURLPath \
@"(?:" \
    @"(?:" \
        TWUValidGeneralURLPathChars @"*" \
        @"(?:" TWUValidURLBalancedParens TWUValidGeneralURLPathChars @"*)*" TWUValidURLPathEndingChars \
    @")" \
    @"|" \
    @"(?:" TWUValidGeneralURLPathChars @"+/)" \
@")"

#pragma mark - Constants

// This matches the maximum length of an URL allowed by Twitter's backend.
static const NSInteger kMaxURLLength = 4096;
static const NSInteger kMaxTCOSlugLength = 40;
static const NSInteger kMaxTweetLengthLegacy = 140;
static const NSInteger kTransformedURLLength = 23;
static const NSInteger kPermillageScaleFactor = 1000;

// The backend adds http:// for normal links and https to *.twitter.com URLs
// (it also rewrites http to https for URLs matching *.twitter.com).
// We always add https://. By making the assumption that kURLProtocolLength
// is https, the trade off is we'll disallow a http URL that is 4096 characters.
static const NSInteger kURLProtocolLength = 8; // length of @"https://"

typedef NSInteger (^TextUnitCounterBlock)(NSInteger currentLength, NSString* text, TwitterTextEntity *entity, NSString *substring);

@implementation TwitterText

#pragma mark - Public Methods

+ (NSArray<TwitterTextEntity *> *)entitiesInText:(NSString *)text
{
    if (!text.length) {
        return @[];
    }

    NSMutableArray<TwitterTextEntity *> *results = [NSMutableArray<TwitterTextEntity *> array];

    NSArray<TwitterTextEntity *> *urls = [self URLsInText:text];
    [results addObjectsFromArray:urls];

    NSArray<TwitterTextEntity *> *hashtags = [self hashtagsInText:text withURLEntities:urls];
    [results addObjectsFromArray:hashtags];

    NSArray<TwitterTextEntity *> *symbols = [self symbolsInText:text withURLEntities:urls];
    [results addObjectsFromArray:symbols];

    NSArray<TwitterTextEntity *> *mentionsAndLists = [self mentionsOrListsInText:text];
    NSMutableArray<TwitterTextEntity *> *addingItems = [NSMutableArray<TwitterTextEntity *> array];

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

+ (NSArray<TwitterTextEntity *> *)URLsInText:(NSString *)text
{
    if (!text.length) {
        return @[];
    }

    NSMutableArray<TwitterTextEntity *> *results = [NSMutableArray<TwitterTextEntity *> array];
    NSUInteger len = text.length;
    NSUInteger position = 0;
    NSRange allRange = NSMakeRange(0, 0);

    while (1) {
        position = NSMaxRange(allRange);
        if (len <= position) {
            break;
        }

        NSTextCheckingResult *urlResult = [[self validURLRegexp] firstMatchInString:text options:NSMatchingWithoutAnchoringBounds range:NSMakeRange(position, len - position)];
        if (!urlResult) {
            break;
        }

        allRange = urlResult.range;
        if (urlResult.numberOfRanges < 9) {
            // Continue processing after the end of this invalid result.
            continue;
        }

        NSRange urlRange = [urlResult rangeAtIndex:TWUValidURLGroupURL];
        NSRange precedingRange = [urlResult rangeAtIndex:TWUValidURLGroupPreceding];
        NSRange protocolRange = [urlResult rangeAtIndex:TWUValidURLGroupProtocol];
        NSRange domainRange = [urlResult rangeAtIndex:TWUValidURLGroupDomain];

        NSString *protocol = (protocolRange.location != NSNotFound) ? [text substringWithRange:protocolRange] : nil;
        if (protocol.length == 0) {
            NSString *preceding = (precedingRange.location != NSNotFound) ? [text substringWithRange:precedingRange] : nil;
            NSRange suffixRange = [preceding rangeOfCharacterFromSet:[self invalidURLWithoutProtocolPrecedingCharSet] options:NSBackwardsSearch | NSAnchoredSearch];
            if (suffixRange.location != NSNotFound) {
                continue;
            }
        }

        NSString *url = (urlRange.location != NSNotFound) ? [text substringWithRange:urlRange] : nil;
        NSString *host = (domainRange.location != NSNotFound) ? [text substringWithRange:domainRange] : nil;

        NSInteger start = urlRange.location;
        NSInteger end = NSMaxRange(urlRange);

        NSTextCheckingResult *tcoResult = url ? [[self validTCOURLRegexp] firstMatchInString:url options:0 range:NSMakeRange(0, url.length)] : nil;
        if (tcoResult && tcoResult.numberOfRanges >= 2) {
            NSRange tcoRange = [tcoResult rangeAtIndex:0];
            NSRange tcoUrlSlugRange = [tcoResult rangeAtIndex:1];
            if (tcoRange.location == NSNotFound || tcoUrlSlugRange.location == NSNotFound) {
                continue;
            }
            NSString *tcoUrlSlug = [text substringWithRange:tcoUrlSlugRange];
            // In the case of t.co URLs, don't allow additional path characters and ensure that the slug is under 40 chars.
            if ([tcoUrlSlug length] > kMaxTCOSlugLength) {
                continue;
            } else {
                url = [url substringWithRange:tcoRange];
                end = start + url.length;
            }
        }
        if ([self isValidHostAndLength:url.length protocol:protocol host:host]) {
            TwitterTextEntity *entity = [TwitterTextEntity entityWithType:TwitterTextEntityURL range:NSMakeRange(start, end - start)];
            [results addObject:entity];
            allRange = entity.range;
        }
    }
    return results;
}

+ (NSArray<TwitterTextEntity *> *)hashtagsInText:(NSString *)text checkingURLOverlap:(BOOL)checkingURLOverlap
{
    if (!text.length) {
        return @[];
    }

    NSArray<TwitterTextEntity *> *urls = nil;
    if (checkingURLOverlap) {
        urls = [self URLsInText:text];
    }
    return [self hashtagsInText:text withURLEntities:urls];
}

+ (NSArray<TwitterTextEntity *> *)hashtagsInText:(NSString *)text withURLEntities:(NSArray<TwitterTextEntity *> *)urlEntities
{
    if (!text.length) {
        return @[];
    }

    NSMutableArray<TwitterTextEntity *> *results = [NSMutableArray<TwitterTextEntity *> array];
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

+ (NSArray<TwitterTextEntity *> *)symbolsInText:(NSString *)text checkingURLOverlap:(BOOL)checkingURLOverlap
{
    if (!text.length) {
        return @[];
    }

    NSArray<TwitterTextEntity *> *urls = nil;
    if (checkingURLOverlap) {
        urls = [self URLsInText:text];
    }
    return [self symbolsInText:text withURLEntities:urls];
}

+ (NSArray<TwitterTextEntity *> *)symbolsInText:(NSString *)text withURLEntities:(NSArray<TwitterTextEntity *> *)urlEntities
{
    if (!text.length) {
        return @[];
    }

    NSMutableArray<TwitterTextEntity *> *results = [NSMutableArray<TwitterTextEntity *> array];
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

+ (NSArray<TwitterTextEntity *> *)mentionedScreenNamesInText:(NSString *)text
{
    if (!text.length) {
        return @[];
    }

    NSArray<TwitterTextEntity *> *mentionsOrLists = [self mentionsOrListsInText:text];
    NSMutableArray<TwitterTextEntity *> *results = [NSMutableArray<TwitterTextEntity *> array];

    for (TwitterTextEntity *entity in mentionsOrLists) {
        if (entity.type == TwitterTextEntityScreenName) {
            [results addObject:entity];
        }
    }

    return results;
}

+ (NSArray<TwitterTextEntity *> *)mentionsOrListsInText:(NSString *)text
{
    if (!text.length) {
        return @[];
    }

    NSMutableArray<TwitterTextEntity *> *results = [NSMutableArray<TwitterTextEntity *> array];
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

+ (NSCharacterSet *)validHashtagBoundaryCharacterSet
{
    static NSCharacterSet *charset;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        // Generate equivalent character set matched by TWUHashtagBoundaryInvalidChars regex and invert
        NSMutableCharacterSet *set = [NSMutableCharacterSet letterCharacterSet];
        [set formUnionWithCharacterSet:[NSCharacterSet decimalDigitCharacterSet]];
        [set formUnionWithCharacterSet:[NSCharacterSet characterSetWithCharactersInString: TWHashtagSpecialChars @"&"]];
        charset = [set invertedSet];
    });
    return charset;
}

+ (NSInteger)tweetLength:(NSString *)text
{
    return [self tweetLength:text transformedURLLength:kTransformedURLLength];
}

+ (NSInteger)tweetLength:(NSString *)text httpURLLength:(NSInteger)httpURLLength httpsURLLength:(NSInteger)httpsURLLength
{
    // Deprecated, here for backwards compatibility. Just uses the httpsURLLength, which has been the same as httpURLLength
    // for some time.
    return [self tweetLength:text transformedURLLength:httpsURLLength];
}

+ (NSInteger)tweetLength:(NSString *)text transformedURLLength:(NSInteger)transformedURLLength
{
    // Use Unicode Normalization Form Canonical Composition to calculate tweet text length
    text = [text precomposedStringWithCanonicalMapping];

    if (!text.length) {
        return 0;
    }

    // Remove URLs from text and add t.co length
    NSMutableString *string = [text mutableCopy];

    NSUInteger urlLengthOffset = 0;
    NSArray<TwitterTextEntity *> *urlEntities = [self URLsInText:text];
    for (NSInteger i = (NSInteger)urlEntities.count - 1; i >= 0; i--) {
        TwitterTextEntity *entity = [urlEntities objectAtIndex:(NSUInteger)i];
        NSRange urlRange = entity.range;
        urlLengthOffset += transformedURLLength;
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

    return (NSInteger)charCount;
}

+ (NSInteger)remainingCharacterCount:(NSString *)text
{
    return [self remainingCharacterCount:text transformedURLLength:kTransformedURLLength];
}

+ (NSInteger)remainingCharacterCount:(NSString *)text transformedURLLength:(NSInteger)transformedURLLength
{
    return kMaxTweetLengthLegacy - [self tweetLength:text transformedURLLength:transformedURLLength];
}

+ (NSInteger)remainingCharacterCount:(NSString *)text httpURLLength:(NSInteger)httpURLLength httpsURLLength:(NSInteger)httpsURLLength
{
    return kMaxTweetLengthLegacy - [self tweetLength:text httpURLLength:httpURLLength httpsURLLength:httpsURLLength];
}

+ (void)eagerlyLoadRegexps
{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        dispatch_queue_t queue = dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_LOW, 0);

        dispatch_async(queue, ^{
            @autoreleasepool {
                __unused NSRegularExpression *exp = [self validHashtagRegexp];
            }
        });

        dispatch_async(queue, ^{
            @autoreleasepool {
                __unused NSRegularExpression *exp = [self validURLRegexp];
            }
        });

        dispatch_async(queue, ^{
            @autoreleasepool {
                __unused NSRegularExpression *exp = [self validGTLDRegexp];
            }
        });

        dispatch_async(queue, ^{
            @autoreleasepool {
                __unused NSRegularExpression *exp = [self validDomainRegexp];
            }
        });

        dispatch_async(queue, ^{
            @autoreleasepool {
                __unused NSRegularExpression *exp = [self invalidCharacterRegexp];
            }
        });

        dispatch_async(queue, ^{
            @autoreleasepool {
                __unused NSRegularExpression *exp = [self validTCOURLRegexp];
            }
        });

        dispatch_async(queue, ^{
            @autoreleasepool {
                __unused NSRegularExpression *exp = [self endHashtagRegexp];
            }
        });

        dispatch_async(queue, ^{
            @autoreleasepool {
                __unused NSRegularExpression *exp = [self validSymbolRegexp];
            }
        });

        dispatch_async(queue, ^{
            @autoreleasepool {
                __unused NSRegularExpression *exp = [self validMentionOrListRegexp];
            }
        });

        dispatch_async(queue, ^{
            @autoreleasepool {
                __unused NSRegularExpression *exp = [self validReplyRegexp];
            }
        });

        dispatch_async(queue, ^{
            @autoreleasepool {
                __unused NSRegularExpression *exp = [self endMentionRegexp];
            }
        });

        dispatch_async(queue, ^{
            @autoreleasepool {
                __unused NSRegularExpression *exp = [self validDomainSucceedingCharRegexp];
            }
        });
    });
}

#pragma mark - Private Methods

+ (NSRegularExpression *)validGTLDRegexp
{
    static NSRegularExpression *regexp;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        regexp = [[NSRegularExpression alloc] initWithPattern:TWUValidGTLD options:NSRegularExpressionCaseInsensitive error:NULL];
    });
    return regexp;
}

+ (NSRegularExpression *)validURLRegexp
{
    static NSRegularExpression *regexp;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        regexp = [[NSRegularExpression alloc] initWithPattern:TWUValidURLPatternString options:NSRegularExpressionCaseInsensitive error:NULL];
    });
    return regexp;
}

+ (NSRegularExpression *)validDomainRegexp
{
    static NSRegularExpression *regexp;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        regexp = [[NSRegularExpression alloc] initWithPattern:TWUValidDomain options:NSRegularExpressionCaseInsensitive error:NULL];
    });
    return regexp;
}

+ (NSRegularExpression *)invalidCharacterRegexp
{
    static NSRegularExpression *regexp;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        regexp = [[NSRegularExpression alloc] initWithPattern:TWUInvalidCharactersPattern options:NSRegularExpressionCaseInsensitive error:NULL];
    });
    return regexp;
}

+ (NSRegularExpression *)validTCOURLRegexp
{
    static NSRegularExpression *regexp;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        regexp = [[NSRegularExpression alloc] initWithPattern:TWUValidTCOURL options:NSRegularExpressionCaseInsensitive error:NULL];
    });
    return regexp;
}

+ (NSRegularExpression *)validHashtagRegexp
{
    static NSRegularExpression *regexp;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        regexp = [[NSRegularExpression alloc] initWithPattern:TWUValidHashtag options:NSRegularExpressionCaseInsensitive error:NULL];
    });
    return regexp;
}

+ (NSRegularExpression *)endHashtagRegexp
{
    static NSRegularExpression *regexp;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        regexp = [[NSRegularExpression alloc] initWithPattern:TWUEndHashTagMatch options:NSRegularExpressionCaseInsensitive error:NULL];
    });
    return regexp;
}

+ (NSRegularExpression *)validSymbolRegexp
{
    static NSRegularExpression *regexp;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        regexp = [[NSRegularExpression alloc] initWithPattern:TWUValidSymbol options:NSRegularExpressionCaseInsensitive error:NULL];
    });
    return regexp;
}

+ (NSRegularExpression *)validMentionOrListRegexp
{
    static NSRegularExpression *regexp;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        regexp = [[NSRegularExpression alloc] initWithPattern:TWUValidMentionOrList options:NSRegularExpressionCaseInsensitive error:NULL];
    });
    return regexp;
}

+ (NSRegularExpression *)validReplyRegexp
{
    static NSRegularExpression *regexp;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        regexp = [[NSRegularExpression alloc] initWithPattern:TWUValidReply options:NSRegularExpressionCaseInsensitive error:NULL];
    });
    return regexp;
}

+ (NSRegularExpression *)endMentionRegexp
{
    static NSRegularExpression *regexp;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        regexp = [[NSRegularExpression alloc] initWithPattern:TWUEndMentionMatch options:NSRegularExpressionCaseInsensitive error:NULL];
    });
    return regexp;
}

+ (NSCharacterSet *)invalidURLWithoutProtocolPrecedingCharSet
{
    static NSCharacterSet *charset;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        charset = [NSCharacterSet characterSetWithCharactersInString:@"-_./"];
    });
    return charset;
}

+ (NSRegularExpression *)validDomainSucceedingCharRegexp
{
    static NSRegularExpression *regexp;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        regexp = [[NSRegularExpression alloc] initWithPattern:TWUEndMentionMatch options:NSRegularExpressionCaseInsensitive error:NULL];
    });
    return regexp;
}

+ (BOOL)isValidHostAndLength:(NSUInteger)urlLength protocol:(NSString *)protocol host:(NSString *)host
{
    if (!host) {
        return NO;
    }

    NSError *error;
    NSInteger originalHostLength = [host length];

    NSURL *url = [NSURL URLWithUnicodeString:host error:&error];
    if (error) {
        if (error.code == IFUnicodeURLConvertErrorInvalidDNSLength) {
            // If the error is specifically IFUnicodeURLConvertErrorInvalidDNSLength,
            // just return a false result. NSURL will happily create a URL for a host
            // with labels > 63 characters (radar 35802213).
            return NO;
        } else {
            // Attempt to create a NSURL object. We may have received an error from
            // URLWithUnicodeString above because the input is not valid for punycode
            // conversion (example: non-LDH characters are invalid and will trigger
            // an error with code == IFUnicodeURLConvertErrorSTD3NonLDH but may be
            // allowed normally per RFC 1035.
            url = [NSURL URLWithString:host];
        }
    }

    if (!url) {
        return NO;
    }

    // Should be encoded if necessary.
    host = url.absoluteString;

    NSInteger updatedHostLength = [host length];
    if (updatedHostLength == 0) {
        return NO;
    } else if (updatedHostLength > originalHostLength) {
        urlLength += (updatedHostLength - originalHostLength);
    }

    // Because the backend always adds https:// if we're missing a protocol, add this length
    // back in when checking vs. our maximum allowed length of a URL, if necessary.
    NSInteger urlLengthWithProtocol = urlLength;
    if (!protocol) {
        urlLengthWithProtocol += kURLProtocolLength;
    }
    return urlLengthWithProtocol <= kMaxURLLength;
}

@end

NSString * const kTwitterTextParserConfigurationClassic = @"v1";
NSString * const kTwitterTextParserConfigurationV2 = @"v2";
NSString * const kTwitterTextParserConfigurationV3 = @"v3";

static TwitterTextParser *sDefaultParser;

@implementation TwitterTextParser

+ (dispatch_queue_t)_queue
{
    static dispatch_queue_t sQueue;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sQueue = dispatch_queue_create("twitterText", DISPATCH_QUEUE_SERIAL);
    });
    return sQueue;
}

- (instancetype)initWithConfiguration:(TwitterTextConfiguration *)configuration
{
    if (self = [super init]) {
        _configuration = configuration;
    }
    return self;
}

+ (instancetype)defaultParser
{
    dispatch_sync([self _queue], ^{
        @autoreleasepool {
            if (!sDefaultParser) {
                TwitterTextConfiguration *configuration = [TwitterTextConfiguration configurationFromJSONResource:kTwitterTextParserConfigurationV3];
                sDefaultParser = [[TwitterTextParser alloc] initWithConfiguration:configuration];
            }
        }
    });
    return sDefaultParser;
}

+ (void)setDefaultParserWithConfiguration:(TwitterTextConfiguration *)configuration
{
    dispatch_async([self _queue], ^{
        @autoreleasepool {
            sDefaultParser = [[TwitterTextParser alloc] initWithConfiguration:configuration];
        }
    });
}

- (NSInteger)maxWeightedTweetLength
{
    return _configuration.maxWeightedTweetLength;
}

- (TwitterTextParseResults *)parseTweet:(NSString *)text
{
    // Use Unicode Normalization Form Canonical Composition
    NSString *normalizedText;
    NSUInteger normalizedTextLength;
    if (text.length != 0) {
        normalizedText = [text precomposedStringWithCanonicalMapping];
        normalizedTextLength = normalizedText.length;
    } else {
        normalizedTextLength = 0;
    }

    if (normalizedTextLength == 0) {
        NSRange rangeZero = NSMakeRange(0, 0);
        return [[TwitterTextParseResults alloc] initWithWeightedLength:0 permillage:0 valid:YES displayRange:rangeZero validRange:rangeZero];
    }

    const NSRange rangeNotFound = NSMakeRange(NSNotFound, NSNotFound);

    // Build an map of ranges, assuming the original character count does not change after normalization
    const NSUInteger textLength = text.length;
    NSRange textRanges[textLength], *ptr = textRanges;
    for (NSUInteger i = 0; i < textLength; i++) {
        textRanges[i] = rangeNotFound;
    }
    [self _tt_lengthOfText:text range:NSMakeRange(0, text.length) countingBlock:^NSInteger(NSInteger index, NSString *blockText, TwitterTextEntity *entity, NSString *substring) {
        // entity.range.length can be > 1 for emoji, decomposed characters, etc.
        for (NSInteger i = 0; i < entity.range.length; i++) {
            if (index+i < textLength) {
                ptr[index+i] = entity.range;
            } else {
                NSAssert(NO, @"index+i (%ld+%ld) greater than text.length (%lu) for text \"%@\"", (long)index, (long)i, (unsigned long)textLength, text);  // casts will be unnecessary when TwitterText is no longer built for 32-bit targets
            }
        }
        return index + entity.range.length;
    }];

    NSRange normalizedRanges[normalizedTextLength], *normalizedRangesPtr = normalizedRanges;
    for (NSUInteger i = 0; i < normalizedTextLength; i++) {
        normalizedRangesPtr[i] = rangeNotFound;
    }

    __block NSInteger offset = 0;
    [self _tt_lengthOfText:normalizedText range:NSMakeRange(0, normalizedTextLength) countingBlock:^NSInteger(NSInteger composedCharIndex, NSString *blockText, TwitterTextEntity *entity, NSString *substring) {
        // map index of each composed char back to its pre-normalized index.
        if (composedCharIndex+offset < textLength) {
            NSRange originalRange = ptr[composedCharIndex+offset];
            for (NSInteger i = 0; i < entity.range.length; i++) {
                normalizedRangesPtr[composedCharIndex+i] = originalRange;
            }
            if (originalRange.length > entity.range.length) {
                offset += (originalRange.length - entity.range.length);
            }
        } else {
            NSAssert(NO, @"composedCharIndex+offset (%ld+%ld) greater than text.length (%lu) for text \"%@\"", (long)composedCharIndex, (long)offset, (unsigned long)textLength, text); // casts will be unnecessary when TwitterText is no longer built for 32-bit targets
        }
        return composedCharIndex + entity.range.length;
    }];

    NSArray<TwitterTextEntity *> *urlEntities = [TwitterText URLsInText:normalizedText];

    __block BOOL isValid = YES;
    __block NSInteger weightedLength = 0;
    __block NSInteger validStartIndex = NSNotFound, validEndIndex = NSNotFound;
    __block NSInteger displayStartIndex = NSNotFound, displayEndIndex = NSNotFound;
    TextUnitCounterBlock textUnitCountingBlock = ^NSInteger(NSInteger previousLength, NSString *blockText, TwitterTextEntity *entity, NSString *substring) {
        NSRange range = entity.range;
        NSInteger updatedLength = previousLength;
        switch (entity.type) {
            case TwitterTextEntityURL:
                updatedLength = previousLength + (self->_configuration.transformedURLLength * self->_configuration.scale);
                break;
            case TwitterTextEntityTweetEmojiChar:
                updatedLength = previousLength + self.configuration.defaultWeight;
                break;
            case TwitterTextEntityTweetChar:
                updatedLength = previousLength + [self _tt_lengthOfWeightedChar:substring];
                break;
            case TwitterTextEntityScreenName:
            case TwitterTextEntityHashtag:
            case TwitterTextEntityListName:
            case TwitterTextEntitySymbol:
                // Do nothing for these entity types.
                break;
        }
        if (validStartIndex == NSNotFound) {
            validStartIndex = range.location;
        }
        if (displayStartIndex == NSNotFound) {
            displayStartIndex = range.location;
        }
        if (range.length > 0) {
            displayEndIndex = NSMaxRange(range) - 1;
        }
        if (range.location + range.length <= blockText.length) {
            NSTextCheckingResult *invalidResult = [[TwitterText invalidCharacterRegexp] firstMatchInString:blockText options:0 range:range];
            if (invalidResult) {
                isValid = NO;
            } else if (isValid && (updatedLength + weightedLength <= self.maxWeightedTweetLength * self->_configuration.scale)) {
                validEndIndex = (range.length > 0) ? NSMaxRange(range) - 1 : range.location;
            } else {
                isValid = NO;
            }
        } else {
            NSAssert(NO, @"range (%@) outside bounds of blockText.length (%lu) for blockText \"%@\"", NSStringFromRange(range), (unsigned long)blockText.length, blockText);
            isValid = NO;
        }
        return updatedLength;
    };

    NSInteger textIndex = 0;
    for (TwitterTextEntity *urlEntity in urlEntities) {
        if (textIndex < urlEntity.range.location) {
            weightedLength += [self _tt_lengthOfText:normalizedText range:NSMakeRange(textIndex, urlEntity.range.location - textIndex) countingBlock:textUnitCountingBlock];
        }

        weightedLength += textUnitCountingBlock(0, normalizedText, urlEntity, [normalizedText substringWithRange:urlEntity.range]);

        textIndex = urlEntity.range.location + urlEntity.range.length;
    }

    // handle trailing text
    weightedLength += [self _tt_lengthOfText:normalizedText range:NSMakeRange(textIndex, normalizedTextLength - textIndex) countingBlock:textUnitCountingBlock];

    NSAssert(!NSEqualRanges(normalizedRanges[displayStartIndex], rangeNotFound), @"displayStartIndex should map to existing index in original string");
    NSAssert(!NSEqualRanges(normalizedRanges[displayEndIndex], rangeNotFound), @"displayEndIndex should map to existing index in original string");
    NSAssert(!NSEqualRanges(normalizedRanges[validStartIndex], rangeNotFound), @"validStartIndex should map to existing index in original string");
    NSAssert(!NSEqualRanges(normalizedRanges[validEndIndex], rangeNotFound), @"validEndIndex should map to existing index in original string");

    if (displayStartIndex == NSNotFound) {
        displayStartIndex = 0;
    }
    if (displayEndIndex == NSNotFound) {
        displayEndIndex = 0;
    }
    if (validStartIndex == NSNotFound) {
        validStartIndex = 0;
    }
    if (validEndIndex == NSNotFound) {
        validEndIndex = 0;
    }

    NSRange displayRange = NSMakeRange(normalizedRanges[displayStartIndex].location, NSMaxRange(normalizedRanges[displayEndIndex]) - normalizedRanges[displayStartIndex].location);
    NSRange validRange = NSMakeRange(normalizedRanges[validStartIndex].location, NSMaxRange(normalizedRanges[validEndIndex]) - normalizedRanges[validStartIndex].location);

    NSInteger scaledWeightedLength = weightedLength / _configuration.scale;
    NSInteger permillage = (NSInteger)(kPermillageScaleFactor * (scaledWeightedLength / (float)[self maxWeightedTweetLength]));
    return [[TwitterTextParseResults alloc] initWithWeightedLength:scaledWeightedLength permillage:permillage valid:isValid displayRange:displayRange validRange:validRange];
}

#pragma mark -- Private methods

- (NSInteger)_tt_lengthOfText:(NSString *)text range:(NSRange)range countingBlock:(nonnull TextUnitCounterBlock)countingBlock
{
    __block NSInteger length = 0;

    NSMutableArray *emojiRanges = [[NSMutableArray alloc] init];
    if (self.configuration.isEmojiParsingEnabled) {
        // With emoji parsing enabled, we first find all emoji in the input text (so that we only
        // have to match vs. the complex emoji regex once).
        NSArray<NSTextCheckingResult *> *emojiMatches = [TwitterTextEmojiRegex() matchesInString:text options:0 range:NSMakeRange(0, text.length)];
        for (NSTextCheckingResult *match in emojiMatches) {
            [emojiRanges addObject:[NSValue valueWithRange:match.range]];
        }
    }

    if (range.location + range.length <= text.length) {
// TODO: drop-iOS-10: when dropping support for iOS 10, remove the #if, #endif and everything in between
#if __IPHONE_11_0 > __IPHONE_OS_VERSION_MIN_REQUIRED
#if 0
        // Unicode 10.0 isn't fully supported on iOS 10.

        // e.g. on iOS 10, closure block arg of [NSString enumerateSubstringsInRange:options:usingBlock:]
        // is called an "incorrect" number of times for some Unicode10 composed character sequences

        // i.e. calling enumerateSubstringsInRange:options:usingBlock: on the string

        @"🤪; 🧕; 🧕🏾; 🏴󠁧󠁢󠁥󠁮󠁧󠁿"

        // results in the following values of `substringRange` and `substring` within the block
        // and of the __block var `length` once the block is complete:

        //  iOS 11 and above

            substringRange = @"{1, 2}" , substring = @"🤪"
            substringRange = @"{3, 1}" , substring = @";"
            substringRange = @"{4, 1}" , substring = @" "
            substringRange = @"{5, 2}" , substring = @"🧕"
            substringRange = @"{7, 1}" , substring = @";"
            substringRange = @"{8, 1}" , substring = @" "
            substringRange = @"{9, 4}" , substring = @"🧕🏾"
            substringRange = @"{13, 1}" , substring = @";"
            substringRange = @"{14, 1}" , substring = @" "
            substringRange = @"{15, 14}" , substring = @"🏴󠁧󠁢󠁥󠁮󠁧󠁿"

            length = 15

        //  iOS 10

            substringRange = @"{1, 2}" , substring = @"🤪"
            substringRange = @"{3, 1}" , substring = @";"
            substringRange = @"{4, 1}" , substring = @" "
            substringRange = @"{5, 2}" , substring = @"🧕"
            substringRange = @"{7, 1}" , substring = @";"
            substringRange = @"{8, 1}" , substring = @" "
            substringRange = @"{9, 2}" , substring = @"🧕"
            substringRange = @"{11, 2}" , substring = @"🏾"
            substringRange = @"{13, 1}" , substring = @";"
            substringRange = @"{14, 1}" , substring = @" "
            substringRange = @"{15, 2}" , substring = @"🏴"
            substringRange = @"{17, 2}" , substring = @"󠁧"
            substringRange = @"{19, 2}" , substring = @"󠁢"
            substringRange = @"{21, 2}" , substring = @"󠁥"
            substringRange = @"{23, 2}" , substring = @"󠁮"
            substringRange = @"{25, 2}" , substring = @"󠁧"
            substringRange = @"{27, 2}" , substring = @"󠁿"

            length = 29

#endif // #if 0
#endif // #if __IPHONE_11_0 > __IPHONE_OS_VERSION_MIN_REQUIRED
        [text enumerateSubstringsInRange:range options:NSStringEnumerationByComposedCharacterSequences usingBlock:^(NSString *substring, NSRange substringRange, NSRange enclosingRange, BOOL *stop) {
            if (countingBlock != NULL) {
                TwitterTextEntityType type = (self.configuration.isEmojiParsingEnabled && [emojiRanges containsObject:[NSValue valueWithRange:substringRange]]) ? TwitterTextEntityTweetEmojiChar : TwitterTextEntityTweetChar;
                length = countingBlock(length, text, [TwitterTextEntity entityWithType:type range:substringRange], substring);
            }
        }];
    } else {
        NSAssert(NO, @"range (%@) outside bounds of text.length (%lu) for text \"%@\"", NSStringFromRange(range), (unsigned long)text.length, text);
        length = text.length;
    }

    return length;
}

- (NSInteger)_tt_lengthOfWeightedChar:(NSString *)text
{
    NSInteger length = text.length;
    if (length == 0) {
        return 0;
    }

    UniChar buffer[length];
    [text getCharacters:buffer range:NSMakeRange(0, length)];

    NSInteger weightedLength = 0;
    NSInteger codepointCount = 0;
    UniChar *ptr = buffer;
    for (NSUInteger i = 0; i < length; i++) {
        __block NSInteger charWeight = _configuration.defaultWeight;
        BOOL isSurrogatePair = (i + 1 < length && CFStringIsSurrogateHighCharacter(ptr[i]) && CFStringIsSurrogateLowCharacter(ptr[i+1]));
        for (TwitterTextWeightedRange *weightedRange in _configuration.ranges) {
            NSInteger begin = weightedRange.range.location;
            NSInteger end = weightedRange.range.location + weightedRange.range.length;

            if (isSurrogatePair) {
                UTF32Char char32 = CFStringGetLongCharacterForSurrogatePair(ptr[i], ptr[i+1]);
                if (char32 >= begin && char32 <= end) {
                    charWeight = weightedRange.weight;
                    break;
                }
            } else if (ptr[i] >= begin && ptr[i] <= end) {
                charWeight = weightedRange.weight;
                break;
            }
        }

        // skip the next char of the surrogate pair.
        if (isSurrogatePair) {
            i++;
        }

        codepointCount++;

        weightedLength += charWeight;
    }

    return weightedLength;
}

@end

@implementation TwitterTextWeightedRange

- (instancetype)initWithRange:(NSRange)range weight:(NSInteger)weight
{
    self = [super init];
    if (self) {
        _range = range;
        _weight = weight;
    }
    return self;
}

@end

@implementation TwitterTextParseResults

- (instancetype)initWithWeightedLength:(NSInteger)length permillage:(NSInteger)permillage valid:(BOOL)valid displayRange:(NSRange)displayRange validRange:(NSRange)validRange
{
    self = [super init];
    if (self) {
        _weightedLength = length;
        _permillage = permillage;
        _isValid = valid;
        _displayTextRange = displayRange;
        _validDisplayTextRange = validRange;
    }
    return self;
}

- (NSString *)description
{
    return [NSString stringWithFormat:@"weightedLength: %ld, permillage: %ld, isValid: %d, displayTextRange: %@, validDisplayTextRange: %@", (long)_weightedLength, (long)_permillage, _isValid, NSStringFromRange(_displayTextRange), NSStringFromRange(_validDisplayTextRange)]; // TODO: when no longer supporting 32-bit devices, remove (long) casts
}


@end

@implementation TwitterTextConfiguration

- (instancetype)initWithJSONString:(NSString *)jsonString
{
    self = [super init];
    if (self) {
        NSError *jsonError = nil;
        NSData *jsonData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
        NSDictionary *jsonDictionary = [NSJSONSerialization JSONObjectWithData:jsonData options:NSJSONReadingMutableContainers error:&jsonError];

        _version = [jsonDictionary[@"version"] integerValue];
        _maxWeightedTweetLength = [jsonDictionary[@"maxWeightedTweetLength"] integerValue];
        _scale = [jsonDictionary[@"scale"] integerValue];
        _defaultWeight = [jsonDictionary[@"defaultWeight"] integerValue];
        _transformedURLLength = [jsonDictionary[@"transformedURLLength"] integerValue];
        _emojiParsingEnabled = [jsonDictionary[@"emojiParsingEnabled"] boolValue];
        NSArray *jsonRanges = jsonDictionary[@"ranges"];
        NSMutableArray *ranges = [NSMutableArray arrayWithCapacity:jsonRanges.count];
        for (NSDictionary *rangeDict in jsonRanges) {
            NSRange range;
            range.location = [rangeDict[@"start"] integerValue];
            range.length = [rangeDict[@"end"] integerValue] - range.location;
            NSInteger charWeight = [rangeDict[@"weight"] integerValue];
            TwitterTextWeightedRange *charWeightObject = [[TwitterTextWeightedRange alloc] initWithRange:range weight:charWeight];
            [ranges addObject:charWeightObject];
        }
        _ranges = [ranges copy];
    }
    return self;
}

+ (instancetype)configurationFromJSONResource:(NSString *)jsonResource
{
    NSError *error = nil;
    NSString *sourceFile = [[NSBundle bundleForClass:self] pathForResource:jsonResource ofType:@"json"];
    NSString *jsonString = [NSString stringWithContentsOfFile:sourceFile encoding:NSUTF8StringEncoding error:&error];
    return !error ? [self configurationFromJSONString:jsonString] : nil;
}

+ (instancetype)configurationFromJSONString:(NSString *)jsonString
{
    return [[TwitterTextConfiguration alloc] initWithJSONString:jsonString];
}

@end
