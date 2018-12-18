/*!
 * twitter-text 3.0.1
 *
 * Copyright 2018 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this work except in compliance with the License.
 * You may obtain a copy of the License at:
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.twttr = global.twttr || {}, global.twttr.txt = factory());
}(this, (function () { 'use strict';

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var cashtag = /[a-z]{1,6}(?:[._][a-z]{1,2})?/i;

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var punct = /\!'#%&'\(\)*\+,\\\-\.\/:;<=>\?@\[\]\^_{|}~\$/;

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

// Builds a RegExp
var regexSupplant = function (regex, map, flags) {
  flags = flags || '';
  if (typeof regex !== 'string') {
    if (regex.global && flags.indexOf('g') < 0) {
      flags += 'g';
    }
    if (regex.ignoreCase && flags.indexOf('i') < 0) {
      flags += 'i';
    }
    if (regex.multiline && flags.indexOf('m') < 0) {
      flags += 'm';
    }

    regex = regex.source;
  }

  return new RegExp(regex.replace(/#\{(\w+)\}/g, function (match, name) {
    var newRegex = map[name] || '';
    if (typeof newRegex !== 'string') {
      newRegex = newRegex.source;
    }
    return newRegex;
  }), flags);
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var spacesGroup = /\x09-\x0D\x20\x85\xA0\u1680\u180E\u2000-\u200A\u2028\u2029\u202F\u205F\u3000/;

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var spaces = regexSupplant(/[#{spacesGroup}]/, { spacesGroup: spacesGroup });

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var validCashtag = regexSupplant('(^|#{spaces})(\\$)(#{cashtag})(?=$|\\s|[#{punct}])', { cashtag: cashtag, spaces: spaces, punct: punct }, 'gi');

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var extractCashtagsWithIndices = function (text) {
  if (!text || text.indexOf('$') === -1) {
    return [];
  }

  var tags = [];

  text.replace(validCashtag, function (match, before, dollar, cashtag, offset, chunk) {
    var startPosition = offset + before.length;
    var endPosition = startPosition + cashtag.length + 1;
    tags.push({
      cashtag: cashtag,
      indices: [startPosition, endPosition]
    });
  });

  return tags;
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var hashSigns = /[#＃]/;

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var endHashtagMatch = regexSupplant(/^(?:#{hashSigns}|:\/\/)/, { hashSigns: hashSigns });

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var validCCTLD = regexSupplant(RegExp('(?:(?:' + '한국|香港|澳門|新加坡|台灣|台湾|中國|中国|გე|ไทย|ලංකා|ഭാരതം|ಭಾರತ|భారత్|சிங்கப்பூர்|இலங்கை|இந்தியா|ଭାରତ|ભારત|' + 'ਭਾਰਤ|ভাৰত|ভারত|বাংলা|भारोत|भारतम्|भारत|ڀارت|پاکستان|موريتانيا|مليسيا|مصر|قطر|فلسطين|عمان|عراق|' + 'سورية|سودان|تونس|بھارت|بارت|ایران|امارات|المغرب|السعودية|الجزائر|الاردن|հայ|қаз|укр|срб|рф|' + 'мон|мкд|ею|бел|бг|ελ|zw|zm|za|yt|ye|ws|wf|vu|vn|vi|vg|ve|vc|va|uz|uy|us|um|uk|ug|ua|tz|tw|tv|' + 'tt|tr|tp|to|tn|tm|tl|tk|tj|th|tg|tf|td|tc|sz|sy|sx|sv|su|st|ss|sr|so|sn|sm|sl|sk|sj|si|sh|sg|' + 'se|sd|sc|sb|sa|rw|ru|rs|ro|re|qa|py|pw|pt|ps|pr|pn|pm|pl|pk|ph|pg|pf|pe|pa|om|nz|nu|nr|np|no|' + 'nl|ni|ng|nf|ne|nc|na|mz|my|mx|mw|mv|mu|mt|ms|mr|mq|mp|mo|mn|mm|ml|mk|mh|mg|mf|me|md|mc|ma|ly|' + 'lv|lu|lt|ls|lr|lk|li|lc|lb|la|kz|ky|kw|kr|kp|kn|km|ki|kh|kg|ke|jp|jo|jm|je|it|is|ir|iq|io|in|' + 'im|il|ie|id|hu|ht|hr|hn|hm|hk|gy|gw|gu|gt|gs|gr|gq|gp|gn|gm|gl|gi|gh|gg|gf|ge|gd|gb|ga|fr|fo|' + 'fm|fk|fj|fi|eu|et|es|er|eh|eg|ee|ec|dz|do|dm|dk|dj|de|cz|cy|cx|cw|cv|cu|cr|co|cn|cm|cl|ck|ci|' + 'ch|cg|cf|cd|cc|ca|bz|by|bw|bv|bt|bs|br|bq|bo|bn|bm|bl|bj|bi|bh|bg|bf|be|bd|bb|ba|az|ax|aw|au|' + 'at|as|ar|aq|ao|an|am|al|ai|ag|af|ae|ad|ac' + ')(?=[^0-9a-zA-Z@]|$))'));

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var directionalMarkersGroup = /\u202A-\u202E\u061C\u200E\u200F\u2066\u2067\u2068\u2069/;

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var invalidCharsGroup = /\uFFFE\uFEFF\uFFFF/;

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

// simple string interpolation
var stringSupplant = function (str, map) {
  return str.replace(/#\{(\w+)\}/g, function (match, name) {
    return map[name] || '';
  });
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var invalidDomainChars = stringSupplant('#{punct}#{spacesGroup}#{invalidCharsGroup}#{directionalMarkersGroup}', {
  punct: punct,
  spacesGroup: spacesGroup,
  invalidCharsGroup: invalidCharsGroup,
  directionalMarkersGroup: directionalMarkersGroup
});

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var validDomainChars = regexSupplant(/[^#{invalidDomainChars}]/, {
  invalidDomainChars: invalidDomainChars
});

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var validDomainName = regexSupplant(/(?:(?:#{validDomainChars}(?:-|#{validDomainChars})*)?#{validDomainChars}\.)/, {
  validDomainChars: validDomainChars
});

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var validGTLD = regexSupplant(RegExp('(?:(?:' + '삼성|닷컴|닷넷|香格里拉|餐厅|食品|飞利浦|電訊盈科|集团|通販|购物|谷歌|诺基亚|联通|网络|网站|网店|网址|组织机构|移动|珠宝|点看|游戏|淡马锡|机构|書籍|时尚|新闻|' + '政府|政务|招聘|手表|手机|我爱你|慈善|微博|广东|工行|家電|娱乐|天主教|大拿|大众汽车|在线|嘉里大酒店|嘉里|商标|商店|商城|公益|公司|八卦|健康|信息|佛山|企业|' + '中文网|中信|世界|ポイント|ファッション|セール|ストア|コム|グーグル|クラウド|みんな|คอม|संगठन|नेट|कॉम|همراه|موقع|موبايلي|كوم|' + 'كاثوليك|عرب|شبكة|بيتك|بازار|العليان|ارامكو|اتصالات|ابوظبي|קום|сайт|рус|орг|онлайн|москва|ком|' + 'католик|дети|zuerich|zone|zippo|zip|zero|zara|zappos|yun|youtube|you|yokohama|yoga|yodobashi|' + 'yandex|yamaxun|yahoo|yachts|xyz|xxx|xperia|xin|xihuan|xfinity|xerox|xbox|wtf|wtc|wow|world|' + 'works|work|woodside|wolterskluwer|wme|winners|wine|windows|win|williamhill|wiki|wien|whoswho|' + 'weir|weibo|wedding|wed|website|weber|webcam|weatherchannel|weather|watches|watch|warman|' + 'wanggou|wang|walter|walmart|wales|vuelos|voyage|voto|voting|vote|volvo|volkswagen|vodka|' + 'vlaanderen|vivo|viva|vistaprint|vista|vision|visa|virgin|vip|vin|villas|viking|vig|video|' + 'viajes|vet|versicherung|vermögensberatung|vermögensberater|verisign|ventures|vegas|vanguard|' + 'vana|vacations|ups|uol|uno|university|unicom|uconnect|ubs|ubank|tvs|tushu|tunes|tui|tube|trv|' + 'trust|travelersinsurance|travelers|travelchannel|travel|training|trading|trade|toys|toyota|' + 'town|tours|total|toshiba|toray|top|tools|tokyo|today|tmall|tkmaxx|tjx|tjmaxx|tirol|tires|tips|' + 'tiffany|tienda|tickets|tiaa|theatre|theater|thd|teva|tennis|temasek|telefonica|telecity|tel|' + 'technology|tech|team|tdk|tci|taxi|tax|tattoo|tatar|tatamotors|target|taobao|talk|taipei|tab|' + 'systems|symantec|sydney|swiss|swiftcover|swatch|suzuki|surgery|surf|support|supply|supplies|' + 'sucks|style|study|studio|stream|store|storage|stockholm|stcgroup|stc|statoil|statefarm|' + 'statebank|starhub|star|staples|stada|srt|srl|spreadbetting|spot|sport|spiegel|space|soy|sony|' + 'song|solutions|solar|sohu|software|softbank|social|soccer|sncf|smile|smart|sling|skype|sky|' + 'skin|ski|site|singles|sina|silk|shriram|showtime|show|shouji|shopping|shop|shoes|shiksha|shia|' + 'shell|shaw|sharp|shangrila|sfr|sexy|sex|sew|seven|ses|services|sener|select|seek|security|' + 'secure|seat|search|scot|scor|scjohnson|science|schwarz|schule|school|scholarships|schmidt|' + 'schaeffler|scb|sca|sbs|sbi|saxo|save|sas|sarl|sapo|sap|sanofi|sandvikcoromant|sandvik|samsung|' + 'samsclub|salon|sale|sakura|safety|safe|saarland|ryukyu|rwe|run|ruhr|rugby|rsvp|room|rogers|' + 'rodeo|rocks|rocher|rmit|rip|rio|ril|rightathome|ricoh|richardli|rich|rexroth|reviews|review|' + 'restaurant|rest|republican|report|repair|rentals|rent|ren|reliance|reit|reisen|reise|rehab|' + 'redumbrella|redstone|red|recipes|realty|realtor|realestate|read|raid|radio|racing|qvc|quest|' + 'quebec|qpon|pwc|pub|prudential|pru|protection|property|properties|promo|progressive|prof|' + 'productions|prod|pro|prime|press|praxi|pramerica|post|porn|politie|poker|pohl|pnc|plus|' + 'plumbing|playstation|play|place|pizza|pioneer|pink|ping|pin|pid|pictures|pictet|pics|piaget|' + 'physio|photos|photography|photo|phone|philips|phd|pharmacy|pfizer|pet|pccw|pay|passagens|' + 'party|parts|partners|pars|paris|panerai|panasonic|pamperedchef|page|ovh|ott|otsuka|osaka|' + 'origins|orientexpress|organic|org|orange|oracle|open|ooo|onyourside|online|onl|ong|one|omega|' + 'ollo|oldnavy|olayangroup|olayan|okinawa|office|off|observer|obi|nyc|ntt|nrw|nra|nowtv|nowruz|' + 'now|norton|northwesternmutual|nokia|nissay|nissan|ninja|nikon|nike|nico|nhk|ngo|nfl|nexus|' + 'nextdirect|next|news|newholland|new|neustar|network|netflix|netbank|net|nec|nba|navy|natura|' + 'nationwide|name|nagoya|nadex|nab|mutuelle|mutual|museum|mtr|mtpc|mtn|msd|movistar|movie|mov|' + 'motorcycles|moto|moscow|mortgage|mormon|mopar|montblanc|monster|money|monash|mom|moi|moe|moda|' + 'mobily|mobile|mobi|mma|mls|mlb|mitsubishi|mit|mint|mini|mil|microsoft|miami|metlife|merckmsd|' + 'meo|menu|men|memorial|meme|melbourne|meet|media|med|mckinsey|mcdonalds|mcd|mba|mattel|' + 'maserati|marshalls|marriott|markets|marketing|market|map|mango|management|man|makeup|maison|' + 'maif|madrid|macys|luxury|luxe|lupin|lundbeck|ltda|ltd|lplfinancial|lpl|love|lotto|lotte|' + 'london|lol|loft|locus|locker|loans|loan|llc|lixil|living|live|lipsy|link|linde|lincoln|limo|' + 'limited|lilly|like|lighting|lifestyle|lifeinsurance|life|lidl|liaison|lgbt|lexus|lego|legal|' + 'lefrak|leclerc|lease|lds|lawyer|law|latrobe|latino|lat|lasalle|lanxess|landrover|land|lancome|' + 'lancia|lancaster|lamer|lamborghini|ladbrokes|lacaixa|kyoto|kuokgroup|kred|krd|kpn|kpmg|kosher|' + 'komatsu|koeln|kiwi|kitchen|kindle|kinder|kim|kia|kfh|kerryproperties|kerrylogistics|' + 'kerryhotels|kddi|kaufen|juniper|juegos|jprs|jpmorgan|joy|jot|joburg|jobs|jnj|jmp|jll|jlc|jio|' + 'jewelry|jetzt|jeep|jcp|jcb|java|jaguar|iwc|iveco|itv|itau|istanbul|ist|ismaili|iselect|irish|' + 'ipiranga|investments|intuit|international|intel|int|insure|insurance|institute|ink|ing|info|' + 'infiniti|industries|inc|immobilien|immo|imdb|imamat|ikano|iinet|ifm|ieee|icu|ice|icbc|ibm|' + 'hyundai|hyatt|hughes|htc|hsbc|how|house|hotmail|hotels|hoteles|hot|hosting|host|hospital|' + 'horse|honeywell|honda|homesense|homes|homegoods|homedepot|holiday|holdings|hockey|hkt|hiv|' + 'hitachi|hisamitsu|hiphop|hgtv|hermes|here|helsinki|help|healthcare|health|hdfcbank|hdfc|hbo|' + 'haus|hangout|hamburg|hair|guru|guitars|guide|guge|gucci|guardian|group|grocery|gripe|green|' + 'gratis|graphics|grainger|gov|got|gop|google|goog|goodyear|goodhands|goo|golf|goldpoint|gold|' + 'godaddy|gmx|gmo|gmbh|gmail|globo|global|gle|glass|glade|giving|gives|gifts|gift|ggee|george|' + 'genting|gent|gea|gdn|gbiz|garden|gap|games|game|gallup|gallo|gallery|gal|fyi|futbol|furniture|' + 'fund|fun|fujixerox|fujitsu|ftr|frontier|frontdoor|frogans|frl|fresenius|free|fox|foundation|' + 'forum|forsale|forex|ford|football|foodnetwork|food|foo|fly|flsmidth|flowers|florist|flir|' + 'flights|flickr|fitness|fit|fishing|fish|firmdale|firestone|fire|financial|finance|final|film|' + 'fido|fidelity|fiat|ferrero|ferrari|feedback|fedex|fast|fashion|farmers|farm|fans|fan|family|' + 'faith|fairwinds|fail|fage|extraspace|express|exposed|expert|exchange|everbank|events|eus|' + 'eurovision|etisalat|esurance|estate|esq|erni|ericsson|equipment|epson|epost|enterprises|' + 'engineering|engineer|energy|emerck|email|education|edu|edeka|eco|eat|earth|dvr|dvag|durban|' + 'dupont|duns|dunlop|duck|dubai|dtv|drive|download|dot|doosan|domains|doha|dog|dodge|doctor|' + 'docs|dnp|diy|dish|discover|discount|directory|direct|digital|diet|diamonds|dhl|dev|design|' + 'desi|dentist|dental|democrat|delta|deloitte|dell|delivery|degree|deals|dealer|deal|dds|dclk|' + 'day|datsun|dating|date|data|dance|dad|dabur|cyou|cymru|cuisinella|csc|cruises|cruise|crs|' + 'crown|cricket|creditunion|creditcard|credit|courses|coupons|coupon|country|corsica|coop|cool|' + 'cookingchannel|cooking|contractors|contact|consulting|construction|condos|comsec|computer|' + 'compare|company|community|commbank|comcast|com|cologne|college|coffee|codes|coach|clubmed|' + 'club|cloud|clothing|clinique|clinic|click|cleaning|claims|cityeats|city|citic|citi|citadel|' + 'cisco|circle|cipriani|church|chrysler|chrome|christmas|chloe|chintai|cheap|chat|chase|charity|' + 'channel|chanel|cfd|cfa|cern|ceo|center|ceb|cbs|cbre|cbn|cba|catholic|catering|cat|casino|cash|' + 'caseih|case|casa|cartier|cars|careers|career|care|cards|caravan|car|capitalone|capital|' + 'capetown|canon|cancerresearch|camp|camera|cam|calvinklein|call|cal|cafe|cab|bzh|buzz|buy|' + 'business|builders|build|bugatti|budapest|brussels|brother|broker|broadway|bridgestone|' + 'bradesco|box|boutique|bot|boston|bostik|bosch|boots|booking|book|boo|bond|bom|bofa|boehringer|' + 'boats|bnpparibas|bnl|bmw|bms|blue|bloomberg|blog|blockbuster|blanco|blackfriday|black|biz|bio|' + 'bingo|bing|bike|bid|bible|bharti|bet|bestbuy|best|berlin|bentley|beer|beauty|beats|bcn|bcg|' + 'bbva|bbt|bbc|bayern|bauhaus|basketball|baseball|bargains|barefoot|barclays|barclaycard|' + 'barcelona|bar|bank|band|bananarepublic|banamex|baidu|baby|azure|axa|aws|avianca|autos|auto|' + 'author|auspost|audio|audible|audi|auction|attorney|athleta|associates|asia|asda|arte|art|arpa|' + 'army|archi|aramco|arab|aquarelle|apple|app|apartments|aol|anz|anquan|android|analytics|' + 'amsterdam|amica|amfam|amex|americanfamily|americanexpress|alstom|alsace|ally|allstate|' + 'allfinanz|alipay|alibaba|alfaromeo|akdn|airtel|airforce|airbus|aigo|aig|agency|agakhan|africa|' + 'afl|afamilycompany|aetna|aero|aeg|adult|ads|adac|actor|active|aco|accountants|accountant|' + 'accenture|academy|abudhabi|abogado|able|abc|abbvie|abbott|abb|abarth|aarp|aaa|onion' + ')(?=[^0-9a-zA-Z@]|$))'));

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var validPunycode = /(?:xn--[\-0-9a-z]+)/;

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var validSubdomain = regexSupplant(/(?:(?:#{validDomainChars}(?:[_-]|#{validDomainChars})*)?#{validDomainChars}\.)/, {
  validDomainChars: validDomainChars
});

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var validDomain = regexSupplant(/(?:#{validSubdomain}*#{validDomainName}(?:#{validGTLD}|#{validCCTLD}|#{validPunycode}))/, { validDomainName: validDomainName, validSubdomain: validSubdomain, validGTLD: validGTLD, validCCTLD: validCCTLD, validPunycode: validPunycode });

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var validPortNumber = /[0-9]+/;

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var cyrillicLettersAndMarks = /\u0400-\u04FF/;

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var latinAccentChars = /\xC0-\xD6\xD8-\xF6\xF8-\xFF\u0100-\u024F\u0253\u0254\u0256\u0257\u0259\u025B\u0263\u0268\u026F\u0272\u0289\u028B\u02BB\u0300-\u036F\u1E00-\u1EFF/;

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var validGeneralUrlPathChars = regexSupplant(/[a-z#{cyrillicLettersAndMarks}0-9!\*';:=\+,\.\$\/%#\[\]\-\u2013_~@\|&#{latinAccentChars}]/i, { cyrillicLettersAndMarks: cyrillicLettersAndMarks, latinAccentChars: latinAccentChars });

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

// Allow URL paths to contain up to two nested levels of balanced parens
//  1. Used in Wikipedia URLs like /Primer_(film)
//  2. Used in IIS sessions like /S(dfd346)/
//  3. Used in Rdio URLs like /track/We_Up_(Album_Version_(Edited))/
var validUrlBalancedParens = regexSupplant('\\(' + '(?:' + '#{validGeneralUrlPathChars}+' + '|' +
// allow one nested level of balanced parentheses
'(?:' + '#{validGeneralUrlPathChars}*' + '\\(' + '#{validGeneralUrlPathChars}+' + '\\)' + '#{validGeneralUrlPathChars}*' + ')' + ')' + '\\)', { validGeneralUrlPathChars: validGeneralUrlPathChars }, 'i');

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

// Valid end-of-path chracters (so /foo. does not gobble the period).
// 1. Allow =&# for empty URL parameters and other URL-join artifacts
var validUrlPathEndingChars = regexSupplant(/[\+\-a-z#{cyrillicLettersAndMarks}0-9=_#\/#{latinAccentChars}]|(?:#{validUrlBalancedParens})/i, { cyrillicLettersAndMarks: cyrillicLettersAndMarks, latinAccentChars: latinAccentChars, validUrlBalancedParens: validUrlBalancedParens });

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

// Allow @ in a url, but only in the middle. Catch things like http://example.com/@user/
var validUrlPath = regexSupplant('(?:' + '(?:' + '#{validGeneralUrlPathChars}*' + '(?:#{validUrlBalancedParens}#{validGeneralUrlPathChars}*)*' + '#{validUrlPathEndingChars}' + ')|(?:@#{validGeneralUrlPathChars}+/)' + ')', {
  validGeneralUrlPathChars: validGeneralUrlPathChars,
  validUrlBalancedParens: validUrlBalancedParens,
  validUrlPathEndingChars: validUrlPathEndingChars
}, 'i');

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var validUrlPrecedingChars = regexSupplant(/(?:[^A-Za-z0-9@＠$#＃#{invalidCharsGroup}]|[#{directionalMarkersGroup}]|^)/, {
  invalidCharsGroup: invalidCharsGroup,
  directionalMarkersGroup: directionalMarkersGroup
});

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var validUrlQueryChars = /[a-z0-9!?\*'@\(\);:&=\+\$\/%#\[\]\-_\.,~|]/i;

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var validUrlQueryEndingChars = /[a-z0-9\-_&=#\/]/i;

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var extractUrl = regexSupplant('(' + // $1 total match
'(#{validUrlPrecedingChars})' + // $2 Preceeding chracter
'(' + // $3 URL
'(https?:\\/\\/)?' + // $4 Protocol (optional)
'(#{validDomain})' + // $5 Domain(s)
'(?::(#{validPortNumber}))?' + // $6 Port number (optional)
'(\\/#{validUrlPath}*)?' + // $7 URL Path
'(\\?#{validUrlQueryChars}*#{validUrlQueryEndingChars})?' + // $8 Query String
')' + ')', {
  validUrlPrecedingChars: validUrlPrecedingChars,
  validDomain: validDomain,
  validPortNumber: validPortNumber,
  validUrlPath: validUrlPath,
  validUrlQueryChars: validUrlQueryChars,
  validUrlQueryEndingChars: validUrlQueryEndingChars
}, 'gi');

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var invalidUrlWithoutProtocolPrecedingChars = /[-_.\/]$/;

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};



function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();















var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var punycode = createCommonjsModule(function (module, exports) {
	/*! https://mths.be/punycode v1.4.1 by @mathias */
	(function (root) {

		/** Detect free variables */
		var freeExports = 'object' == 'object' && exports && !exports.nodeType && exports;
		var freeModule = 'object' == 'object' && module && !module.nodeType && module;
		var freeGlobal = _typeof(commonjsGlobal) == 'object' && commonjsGlobal;
		if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal) {
			root = freeGlobal;
		}

		/**
   * The `punycode` object.
   * @name punycode
   * @type Object
   */
		var punycode,


		/** Highest positive signed 32-bit float value */
		maxInt = 2147483647,
		    // aka. 0x7FFFFFFF or 2^31-1

		/** Bootstring parameters */
		base = 36,
		    tMin = 1,
		    tMax = 26,
		    skew = 38,
		    damp = 700,
		    initialBias = 72,
		    initialN = 128,
		    // 0x80
		delimiter = '-',
		    // '\x2D'

		/** Regular expressions */
		regexPunycode = /^xn--/,
		    regexNonASCII = /[^\x20-\x7E]/,
		    // unprintable ASCII chars + non-ASCII chars
		regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g,
		    // RFC 3490 separators

		/** Error messages */
		errors = {
			'overflow': 'Overflow: input needs wider integers to process',
			'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
			'invalid-input': 'Invalid input'
		},


		/** Convenience shortcuts */
		baseMinusTMin = base - tMin,
		    floor = Math.floor,
		    stringFromCharCode = String.fromCharCode,


		/** Temporary variable */
		key;

		/*--------------------------------------------------------------------------*/

		/**
   * A generic error utility function.
   * @private
   * @param {String} type The error type.
   * @returns {Error} Throws a `RangeError` with the applicable error message.
   */
		function error(type) {
			throw new RangeError(errors[type]);
		}

		/**
   * A generic `Array#map` utility function.
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} callback The function that gets called for every array
   * item.
   * @returns {Array} A new array of values returned by the callback function.
   */
		function map(array, fn) {
			var length = array.length;
			var result = [];
			while (length--) {
				result[length] = fn(array[length]);
			}
			return result;
		}

		/**
   * A simple `Array#map`-like wrapper to work with domain name strings or email
   * addresses.
   * @private
   * @param {String} domain The domain name or email address.
   * @param {Function} callback The function that gets called for every
   * character.
   * @returns {Array} A new string of characters returned by the callback
   * function.
   */
		function mapDomain(string, fn) {
			var parts = string.split('@');
			var result = '';
			if (parts.length > 1) {
				// In email addresses, only the domain name should be punycoded. Leave
				// the local part (i.e. everything up to `@`) intact.
				result = parts[0] + '@';
				string = parts[1];
			}
			// Avoid `split(regex)` for IE8 compatibility. See #17.
			string = string.replace(regexSeparators, '\x2E');
			var labels = string.split('.');
			var encoded = map(labels, fn).join('.');
			return result + encoded;
		}

		/**
   * Creates an array containing the numeric code points of each Unicode
   * character in the string. While JavaScript uses UCS-2 internally,
   * this function will convert a pair of surrogate halves (each of which
   * UCS-2 exposes as separate characters) into a single code point,
   * matching UTF-16.
   * @see `punycode.ucs2.encode`
   * @see <https://mathiasbynens.be/notes/javascript-encoding>
   * @memberOf punycode.ucs2
   * @name decode
   * @param {String} string The Unicode input string (UCS-2).
   * @returns {Array} The new array of code points.
   */
		function ucs2decode(string) {
			var output = [],
			    counter = 0,
			    length = string.length,
			    value,
			    extra;
			while (counter < length) {
				value = string.charCodeAt(counter++);
				if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
					// high surrogate, and there is a next character
					extra = string.charCodeAt(counter++);
					if ((extra & 0xFC00) == 0xDC00) {
						// low surrogate
						output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
					} else {
						// unmatched surrogate; only append this code unit, in case the next
						// code unit is the high surrogate of a surrogate pair
						output.push(value);
						counter--;
					}
				} else {
					output.push(value);
				}
			}
			return output;
		}

		/**
   * Creates a string based on an array of numeric code points.
   * @see `punycode.ucs2.decode`
   * @memberOf punycode.ucs2
   * @name encode
   * @param {Array} codePoints The array of numeric code points.
   * @returns {String} The new Unicode string (UCS-2).
   */
		function ucs2encode(array) {
			return map(array, function (value) {
				var output = '';
				if (value > 0xFFFF) {
					value -= 0x10000;
					output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
					value = 0xDC00 | value & 0x3FF;
				}
				output += stringFromCharCode(value);
				return output;
			}).join('');
		}

		/**
   * Converts a basic code point into a digit/integer.
   * @see `digitToBasic()`
   * @private
   * @param {Number} codePoint The basic numeric code point value.
   * @returns {Number} The numeric value of a basic code point (for use in
   * representing integers) in the range `0` to `base - 1`, or `base` if
   * the code point does not represent a value.
   */
		function basicToDigit(codePoint) {
			if (codePoint - 48 < 10) {
				return codePoint - 22;
			}
			if (codePoint - 65 < 26) {
				return codePoint - 65;
			}
			if (codePoint - 97 < 26) {
				return codePoint - 97;
			}
			return base;
		}

		/**
   * Converts a digit/integer into a basic code point.
   * @see `basicToDigit()`
   * @private
   * @param {Number} digit The numeric value of a basic code point.
   * @returns {Number} The basic code point whose value (when used for
   * representing integers) is `digit`, which needs to be in the range
   * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
   * used; else, the lowercase form is used. The behavior is undefined
   * if `flag` is non-zero and `digit` has no uppercase form.
   */
		function digitToBasic(digit, flag) {
			//  0..25 map to ASCII a..z or A..Z
			// 26..35 map to ASCII 0..9
			return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
		}

		/**
   * Bias adaptation function as per section 3.4 of RFC 3492.
   * https://tools.ietf.org/html/rfc3492#section-3.4
   * @private
   */
		function adapt(delta, numPoints, firstTime) {
			var k = 0;
			delta = firstTime ? floor(delta / damp) : delta >> 1;
			delta += floor(delta / numPoints);
			for (; /* no initialization */delta > baseMinusTMin * tMax >> 1; k += base) {
				delta = floor(delta / baseMinusTMin);
			}
			return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
		}

		/**
   * Converts a Punycode string of ASCII-only symbols to a string of Unicode
   * symbols.
   * @memberOf punycode
   * @param {String} input The Punycode string of ASCII-only symbols.
   * @returns {String} The resulting string of Unicode symbols.
   */
		function decode(input) {
			// Don't use UCS-2
			var output = [],
			    inputLength = input.length,
			    out,
			    i = 0,
			    n = initialN,
			    bias = initialBias,
			    basic,
			    j,
			    index,
			    oldi,
			    w,
			    k,
			    digit,
			    t,

			/** Cached calculation results */
			baseMinusT;

			// Handle the basic code points: let `basic` be the number of input code
			// points before the last delimiter, or `0` if there is none, then copy
			// the first basic code points to the output.

			basic = input.lastIndexOf(delimiter);
			if (basic < 0) {
				basic = 0;
			}

			for (j = 0; j < basic; ++j) {
				// if it's not a basic code point
				if (input.charCodeAt(j) >= 0x80) {
					error('not-basic');
				}
				output.push(input.charCodeAt(j));
			}

			// Main decoding loop: start just after the last delimiter if any basic code
			// points were copied; start at the beginning otherwise.

			for (index = basic > 0 ? basic + 1 : 0; index < inputLength;) /* no final expression */{

				// `index` is the index of the next character to be consumed.
				// Decode a generalized variable-length integer into `delta`,
				// which gets added to `i`. The overflow checking is easier
				// if we increase `i` as we go, then subtract off its starting
				// value at the end to obtain `delta`.
				for (oldi = i, w = 1, k = base;; /* no condition */k += base) {

					if (index >= inputLength) {
						error('invalid-input');
					}

					digit = basicToDigit(input.charCodeAt(index++));

					if (digit >= base || digit > floor((maxInt - i) / w)) {
						error('overflow');
					}

					i += digit * w;
					t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;

					if (digit < t) {
						break;
					}

					baseMinusT = base - t;
					if (w > floor(maxInt / baseMinusT)) {
						error('overflow');
					}

					w *= baseMinusT;
				}

				out = output.length + 1;
				bias = adapt(i - oldi, out, oldi == 0);

				// `i` was supposed to wrap around from `out` to `0`,
				// incrementing `n` each time, so we'll fix that now:
				if (floor(i / out) > maxInt - n) {
					error('overflow');
				}

				n += floor(i / out);
				i %= out;

				// Insert `n` at position `i` of the output
				output.splice(i++, 0, n);
			}

			return ucs2encode(output);
		}

		/**
   * Converts a string of Unicode symbols (e.g. a domain name label) to a
   * Punycode string of ASCII-only symbols.
   * @memberOf punycode
   * @param {String} input The string of Unicode symbols.
   * @returns {String} The resulting Punycode string of ASCII-only symbols.
   */
		function encode(input) {
			var n,
			    delta,
			    handledCPCount,
			    basicLength,
			    bias,
			    j,
			    m,
			    q,
			    k,
			    t,
			    currentValue,
			    output = [],

			/** `inputLength` will hold the number of code points in `input`. */
			inputLength,

			/** Cached calculation results */
			handledCPCountPlusOne,
			    baseMinusT,
			    qMinusT;

			// Convert the input in UCS-2 to Unicode
			input = ucs2decode(input);

			// Cache the length
			inputLength = input.length;

			// Initialize the state
			n = initialN;
			delta = 0;
			bias = initialBias;

			// Handle the basic code points
			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue < 0x80) {
					output.push(stringFromCharCode(currentValue));
				}
			}

			handledCPCount = basicLength = output.length;

			// `handledCPCount` is the number of code points that have been handled;
			// `basicLength` is the number of basic code points.

			// Finish the basic string - if it is not empty - with a delimiter
			if (basicLength) {
				output.push(delimiter);
			}

			// Main encoding loop:
			while (handledCPCount < inputLength) {

				// All non-basic code points < n have been handled already. Find the next
				// larger one:
				for (m = maxInt, j = 0; j < inputLength; ++j) {
					currentValue = input[j];
					if (currentValue >= n && currentValue < m) {
						m = currentValue;
					}
				}

				// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
				// but guard against overflow
				handledCPCountPlusOne = handledCPCount + 1;
				if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
					error('overflow');
				}

				delta += (m - n) * handledCPCountPlusOne;
				n = m;

				for (j = 0; j < inputLength; ++j) {
					currentValue = input[j];

					if (currentValue < n && ++delta > maxInt) {
						error('overflow');
					}

					if (currentValue == n) {
						// Represent delta as a generalized variable-length integer
						for (q = delta, k = base;; /* no condition */k += base) {
							t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
							if (q < t) {
								break;
							}
							qMinusT = q - t;
							baseMinusT = base - t;
							output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0)));
							q = floor(qMinusT / baseMinusT);
						}

						output.push(stringFromCharCode(digitToBasic(q, 0)));
						bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
						delta = 0;
						++handledCPCount;
					}
				}

				++delta;
				++n;
			}
			return output.join('');
		}

		/**
   * Converts a Punycode string representing a domain name or an email address
   * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
   * it doesn't matter if you call it on a string that has already been
   * converted to Unicode.
   * @memberOf punycode
   * @param {String} input The Punycoded domain name or email address to
   * convert to Unicode.
   * @returns {String} The Unicode representation of the given Punycode
   * string.
   */
		function toUnicode(input) {
			return mapDomain(input, function (string) {
				return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
			});
		}

		/**
   * Converts a Unicode string representing a domain name or an email address to
   * Punycode. Only the non-ASCII parts of the domain name will be converted,
   * i.e. it doesn't matter if you call it with a domain that's already in
   * ASCII.
   * @memberOf punycode
   * @param {String} input The domain name or email address to convert, as a
   * Unicode string.
   * @returns {String} The Punycode representation of the given domain name or
   * email address.
   */
		function toASCII(input) {
			return mapDomain(input, function (string) {
				return regexNonASCII.test(string) ? 'xn--' + encode(string) : string;
			});
		}

		/*--------------------------------------------------------------------------*/

		/** Define the public API */
		punycode = {
			/**
    * A string representing the current Punycode.js version number.
    * @memberOf punycode
    * @type String
    */
			'version': '1.4.1',
			/**
    * An object of methods to convert from JavaScript's internal character
    * representation (UCS-2) to Unicode code points, and back.
    * @see <https://mathiasbynens.be/notes/javascript-encoding>
    * @memberOf punycode
    * @type Object
    */
			'ucs2': {
				'decode': ucs2decode,
				'encode': ucs2encode
			},
			'decode': decode,
			'encode': encode,
			'toASCII': toASCII,
			'toUnicode': toUnicode
		};

		/** Expose `punycode` */
		// Some AMD build optimizers, like r.js, check for specific condition patterns
		// like the following:
		if (typeof undefined == 'function' && _typeof(undefined.amd) == 'object' && undefined.amd) {
			undefined('punycode', function () {
				return punycode;
			});
		} else if (freeExports && freeModule) {
			if (module.exports == freeExports) {
				// in Node.js, io.js, or RingoJS v0.8.0+
				freeModule.exports = punycode;
			} else {
				// in Narwhal or RingoJS v0.7.0-
				for (key in punycode) {
					punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
				}
			}
		} else {
			// in Rhino or a web browser
			root.punycode = punycode;
		}
	})(commonjsGlobal);
});

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var validAsciiDomain = regexSupplant(/(?:(?:[\-a-z0-9#{latinAccentChars}]+)\.)+(?:#{validGTLD}|#{validCCTLD}|#{validPunycode})/gi, { latinAccentChars: latinAccentChars, validGTLD: validGTLD, validCCTLD: validCCTLD, validPunycode: validPunycode });

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var MAX_DOMAIN_LABEL_LENGTH = 63;
var PUNYCODE_ENCODED_DOMAIN_PREFIX = 'xn--';
// This is an extremely lightweight implementation of domain name validation according to RFC 3490
// Our regexes handle most of the cases well enough
// See https://tools.ietf.org/html/rfc3490#section-4.1 for details
var idna = {
  toAscii: function toAscii(domain) {
    if (domain.substring(0, 4) === PUNYCODE_ENCODED_DOMAIN_PREFIX && !domain.match(validAsciiDomain)) {
      // Punycode encoded url cannot contain non ASCII characters
      return;
    }

    var labels = domain.split('.');
    for (var i = 0; i < labels.length; i++) {
      var label = labels[i];
      var punycodeEncodedLabel = punycode.toASCII(label);
      if (punycodeEncodedLabel.length < 1 || punycodeEncodedLabel.length > MAX_DOMAIN_LABEL_LENGTH) {
        // DNS label has invalid length
        return;
      }
    }
    return labels.join('.');
  }
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var validTcoUrl = regexSupplant(/^https?:\/\/t\.co\/([a-z0-9]+)(?:\?#{validUrlQueryChars}*#{validUrlQueryEndingChars})?/, { validUrlQueryChars: validUrlQueryChars, validUrlQueryEndingChars: validUrlQueryEndingChars }, 'i');

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var DEFAULT_PROTOCOL = 'https://';
var DEFAULT_PROTOCOL_OPTIONS = { extractUrlsWithoutProtocol: true };
var MAX_URL_LENGTH = 4096;
var MAX_TCO_SLUG_LENGTH = 40;

var extractUrlsWithIndices = function extractUrlsWithIndices(text) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_PROTOCOL_OPTIONS;

  if (!text || (options.extractUrlsWithoutProtocol ? !text.match(/\./) : !text.match(/:/))) {
    return [];
  }

  var urls = [];

  var _loop = function _loop() {
    var before = RegExp.$2;
    var url = RegExp.$3;
    var protocol = RegExp.$4;
    var domain = RegExp.$5;
    var path = RegExp.$7;
    var endPosition = extractUrl.lastIndex;
    var startPosition = endPosition - url.length;

    if (!isValidUrl(url, protocol || DEFAULT_PROTOCOL, domain)) {
      return 'continue';
    }
    // extract ASCII-only domains.
    if (!protocol) {
      if (!options.extractUrlsWithoutProtocol || before.match(invalidUrlWithoutProtocolPrecedingChars)) {
        return 'continue';
      }

      var lastUrl = null;
      var asciiEndPosition = 0;
      domain.replace(validAsciiDomain, function (asciiDomain) {
        var asciiStartPosition = domain.indexOf(asciiDomain, asciiEndPosition);
        asciiEndPosition = asciiStartPosition + asciiDomain.length;
        lastUrl = {
          url: asciiDomain,
          indices: [startPosition + asciiStartPosition, startPosition + asciiEndPosition]
        };
        urls.push(lastUrl);
      });

      // no ASCII-only domain found. Skip the entire URL.
      if (lastUrl == null) {
        return 'continue';
      }

      // lastUrl only contains domain. Need to add path and query if they exist.
      if (path) {
        lastUrl.url = url.replace(domain, lastUrl.url);
        lastUrl.indices[1] = endPosition;
      }
    } else {
      // In the case of t.co URLs, don't allow additional path characters.
      if (url.match(validTcoUrl)) {
        var tcoUrlSlug = RegExp.$1;
        if (tcoUrlSlug && tcoUrlSlug.length > MAX_TCO_SLUG_LENGTH) {
          return 'continue';
        } else {
          url = RegExp.lastMatch;
          endPosition = startPosition + url.length;
        }
      }
      urls.push({
        url: url,
        indices: [startPosition, endPosition]
      });
    }
  };

  while (extractUrl.exec(text)) {
    var _ret = _loop();

    if (_ret === 'continue') continue;
  }

  return urls;
};

var isValidUrl = function isValidUrl(url, protocol, domain) {
  var urlLength = url.length;
  var punycodeEncodedDomain = idna.toAscii(domain);
  if (!punycodeEncodedDomain || !punycodeEncodedDomain.length) {
    return false;
  }

  urlLength = urlLength + punycodeEncodedDomain.length - domain.length;
  return protocol.length + urlLength <= MAX_URL_LENGTH;
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var removeOverlappingEntities = function (entities) {
  entities.sort(function (a, b) {
    return a.indices[0] - b.indices[0];
  });

  var prev = entities[0];
  for (var i = 1; i < entities.length; i++) {
    if (prev.indices[1] > entities[i].indices[0]) {
      entities.splice(i, 1);
      i--;
    } else {
      prev = entities[i];
    }
  }
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

// Generated from unicode_regex/unicode_regex_groups.scala, same as objective c's \p{L}\p{M}
var astralLetterAndMarks = /\ud800[\udc00-\udc0b\udc0d-\udc26\udc28-\udc3a\udc3c\udc3d\udc3f-\udc4d\udc50-\udc5d\udc80-\udcfa\uddfd\ude80-\ude9c\udea0-\uded0\udee0\udf00-\udf1f\udf30-\udf40\udf42-\udf49\udf50-\udf7a\udf80-\udf9d\udfa0-\udfc3\udfc8-\udfcf]|\ud801[\udc00-\udc9d\udd00-\udd27\udd30-\udd63\ude00-\udf36\udf40-\udf55\udf60-\udf67]|\ud802[\udc00-\udc05\udc08\udc0a-\udc35\udc37\udc38\udc3c\udc3f-\udc55\udc60-\udc76\udc80-\udc9e\udd00-\udd15\udd20-\udd39\udd80-\uddb7\uddbe\uddbf\ude00-\ude03\ude05\ude06\ude0c-\ude13\ude15-\ude17\ude19-\ude33\ude38-\ude3a\ude3f\ude60-\ude7c\ude80-\ude9c\udec0-\udec7\udec9-\udee6\udf00-\udf35\udf40-\udf55\udf60-\udf72\udf80-\udf91]|\ud803[\udc00-\udc48]|\ud804[\udc00-\udc46\udc7f-\udcba\udcd0-\udce8\udd00-\udd34\udd50-\udd73\udd76\udd80-\uddc4\uddda\ude00-\ude11\ude13-\ude37\udeb0-\udeea\udf01-\udf03\udf05-\udf0c\udf0f\udf10\udf13-\udf28\udf2a-\udf30\udf32\udf33\udf35-\udf39\udf3c-\udf44\udf47\udf48\udf4b-\udf4d\udf57\udf5d-\udf63\udf66-\udf6c\udf70-\udf74]|\ud805[\udc80-\udcc5\udcc7\udd80-\uddb5\uddb8-\uddc0\ude00-\ude40\ude44\ude80-\udeb7]|\ud806[\udca0-\udcdf\udcff\udec0-\udef8]|\ud808[\udc00-\udf98]|\ud80c[\udc00-\udfff]|\ud80d[\udc00-\udc2e]|\ud81a[\udc00-\ude38\ude40-\ude5e\uded0-\udeed\udef0-\udef4\udf00-\udf36\udf40-\udf43\udf63-\udf77\udf7d-\udf8f]|\ud81b[\udf00-\udf44\udf50-\udf7e\udf8f-\udf9f]|\ud82c[\udc00\udc01]|\ud82f[\udc00-\udc6a\udc70-\udc7c\udc80-\udc88\udc90-\udc99\udc9d\udc9e]|\ud834[\udd65-\udd69\udd6d-\udd72\udd7b-\udd82\udd85-\udd8b\uddaa-\uddad\ude42-\ude44]|\ud835[\udc00-\udc54\udc56-\udc9c\udc9e\udc9f\udca2\udca5\udca6\udca9-\udcac\udcae-\udcb9\udcbb\udcbd-\udcc3\udcc5-\udd05\udd07-\udd0a\udd0d-\udd14\udd16-\udd1c\udd1e-\udd39\udd3b-\udd3e\udd40-\udd44\udd46\udd4a-\udd50\udd52-\udea5\udea8-\udec0\udec2-\udeda\udedc-\udefa\udefc-\udf14\udf16-\udf34\udf36-\udf4e\udf50-\udf6e\udf70-\udf88\udf8a-\udfa8\udfaa-\udfc2\udfc4-\udfcb]|\ud83a[\udc00-\udcc4\udcd0-\udcd6]|\ud83b[\ude00-\ude03\ude05-\ude1f\ude21\ude22\ude24\ude27\ude29-\ude32\ude34-\ude37\ude39\ude3b\ude42\ude47\ude49\ude4b\ude4d-\ude4f\ude51\ude52\ude54\ude57\ude59\ude5b\ude5d\ude5f\ude61\ude62\ude64\ude67-\ude6a\ude6c-\ude72\ude74-\ude77\ude79-\ude7c\ude7e\ude80-\ude89\ude8b-\ude9b\udea1-\udea3\udea5-\udea9\udeab-\udebb]|\ud840[\udc00-\udfff]|\ud841[\udc00-\udfff]|\ud842[\udc00-\udfff]|\ud843[\udc00-\udfff]|\ud844[\udc00-\udfff]|\ud845[\udc00-\udfff]|\ud846[\udc00-\udfff]|\ud847[\udc00-\udfff]|\ud848[\udc00-\udfff]|\ud849[\udc00-\udfff]|\ud84a[\udc00-\udfff]|\ud84b[\udc00-\udfff]|\ud84c[\udc00-\udfff]|\ud84d[\udc00-\udfff]|\ud84e[\udc00-\udfff]|\ud84f[\udc00-\udfff]|\ud850[\udc00-\udfff]|\ud851[\udc00-\udfff]|\ud852[\udc00-\udfff]|\ud853[\udc00-\udfff]|\ud854[\udc00-\udfff]|\ud855[\udc00-\udfff]|\ud856[\udc00-\udfff]|\ud857[\udc00-\udfff]|\ud858[\udc00-\udfff]|\ud859[\udc00-\udfff]|\ud85a[\udc00-\udfff]|\ud85b[\udc00-\udfff]|\ud85c[\udc00-\udfff]|\ud85d[\udc00-\udfff]|\ud85e[\udc00-\udfff]|\ud85f[\udc00-\udfff]|\ud860[\udc00-\udfff]|\ud861[\udc00-\udfff]|\ud862[\udc00-\udfff]|\ud863[\udc00-\udfff]|\ud864[\udc00-\udfff]|\ud865[\udc00-\udfff]|\ud866[\udc00-\udfff]|\ud867[\udc00-\udfff]|\ud868[\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|\ud86a[\udc00-\udfff]|\ud86b[\udc00-\udfff]|\ud86c[\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d]|\ud87e[\udc00-\ude1d]|\udb40[\udd00-\uddef]/;

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

// Generated from unicode_regex/unicode_regex_groups.scala, same as objective c's \p{L}\p{M}
var bmpLetterAndMarks = /A-Za-z\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0300-\u0374\u0376\u0377\u037a-\u037d\u037f\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u0483-\u052f\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u05d0-\u05ea\u05f0-\u05f2\u0610-\u061a\u0620-\u065f\u066e-\u06d3\u06d5-\u06dc\u06df-\u06e8\u06ea-\u06ef\u06fa-\u06fc\u06ff\u0710-\u074a\u074d-\u07b1\u07ca-\u07f5\u07fa\u0800-\u082d\u0840-\u085b\u08a0-\u08b2\u08e4-\u0963\u0971-\u0983\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bc-\u09c4\u09c7\u09c8\u09cb-\u09ce\u09d7\u09dc\u09dd\u09df-\u09e3\u09f0\u09f1\u0a01-\u0a03\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a59-\u0a5c\u0a5e\u0a70-\u0a75\u0a81-\u0a83\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abc-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ad0\u0ae0-\u0ae3\u0b01-\u0b03\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3c-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b5c\u0b5d\u0b5f-\u0b63\u0b71\u0b82\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd0\u0bd7\u0c00-\u0c03\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c39\u0c3d-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c58\u0c59\u0c60-\u0c63\u0c81-\u0c83\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbc-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0cde\u0ce0-\u0ce3\u0cf1\u0cf2\u0d01-\u0d03\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d-\u0d44\u0d46-\u0d48\u0d4a-\u0d4e\u0d57\u0d60-\u0d63\u0d7a-\u0d7f\u0d82\u0d83\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0df2\u0df3\u0e01-\u0e3a\u0e40-\u0e4e\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb9\u0ebb-\u0ebd\u0ec0-\u0ec4\u0ec6\u0ec8-\u0ecd\u0edc-\u0edf\u0f00\u0f18\u0f19\u0f35\u0f37\u0f39\u0f3e-\u0f47\u0f49-\u0f6c\u0f71-\u0f84\u0f86-\u0f97\u0f99-\u0fbc\u0fc6\u1000-\u103f\u1050-\u108f\u109a-\u109d\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u135d-\u135f\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16f1-\u16f8\u1700-\u170c\u170e-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176c\u176e-\u1770\u1772\u1773\u1780-\u17d3\u17d7\u17dc\u17dd\u180b-\u180d\u1820-\u1877\u1880-\u18aa\u18b0-\u18f5\u1900-\u191e\u1920-\u192b\u1930-\u193b\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19b0-\u19c9\u1a00-\u1a1b\u1a20-\u1a5e\u1a60-\u1a7c\u1a7f\u1aa7\u1ab0-\u1abe\u1b00-\u1b4b\u1b6b-\u1b73\u1b80-\u1baf\u1bba-\u1bf3\u1c00-\u1c37\u1c4d-\u1c4f\u1c5a-\u1c7d\u1cd0-\u1cd2\u1cd4-\u1cf6\u1cf8\u1cf9\u1d00-\u1df5\u1dfc-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u20d0-\u20f0\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2183\u2184\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d7f-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2de0-\u2dff\u2e2f\u3005\u3006\u302a-\u302f\u3031-\u3035\u303b\u303c\u3041-\u3096\u3099\u309a\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua672\ua674-\ua67d\ua67f-\ua69d\ua69f-\ua6e5\ua6f0\ua6f1\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua7ad\ua7b0\ua7b1\ua7f7-\ua827\ua840-\ua873\ua880-\ua8c4\ua8e0-\ua8f7\ua8fb\ua90a-\ua92d\ua930-\ua953\ua960-\ua97c\ua980-\ua9c0\ua9cf\ua9e0-\ua9ef\ua9fa-\ua9fe\uaa00-\uaa36\uaa40-\uaa4d\uaa60-\uaa76\uaa7a-\uaac2\uaadb-\uaadd\uaae0-\uaaef\uaaf2-\uaaf6\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uab30-\uab5a\uab5c-\uab5f\uab64\uab65\uabc0-\uabea\uabec\uabed\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf870-\uf87f\uf882\uf884-\uf89f\uf8b8\uf8c1-\uf8d6\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe00-\ufe0f\ufe20-\ufe2d\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc/;

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var nonBmpCodePairs = /[\uD800-\uDBFF][\uDC00-\uDFFF]/gm;

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

// A hashtag must contain at least one unicode letter or mark, as well as numbers, underscores, and select special characters.
var hashtagAlpha = regexSupplant(/(?:[#{bmpLetterAndMarks}]|(?=#{nonBmpCodePairs})(?:#{astralLetterAndMarks}))/, {
  bmpLetterAndMarks: bmpLetterAndMarks,
  nonBmpCodePairs: nonBmpCodePairs,
  astralLetterAndMarks: astralLetterAndMarks
});

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var astralNumerals = /\ud801[\udca0-\udca9]|\ud804[\udc66-\udc6f\udcf0-\udcf9\udd36-\udd3f\uddd0-\uddd9\udef0-\udef9]|\ud805[\udcd0-\udcd9\ude50-\ude59\udec0-\udec9]|\ud806[\udce0-\udce9]|\ud81a[\ude60-\ude69\udf50-\udf59]|\ud835[\udfce-\udfff]/;

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var bmpNumerals = /0-9\u0660-\u0669\u06f0-\u06f9\u07c0-\u07c9\u0966-\u096f\u09e6-\u09ef\u0a66-\u0a6f\u0ae6-\u0aef\u0b66-\u0b6f\u0be6-\u0bef\u0c66-\u0c6f\u0ce6-\u0cef\u0d66-\u0d6f\u0de6-\u0def\u0e50-\u0e59\u0ed0-\u0ed9\u0f20-\u0f29\u1040-\u1049\u1090-\u1099\u17e0-\u17e9\u1810-\u1819\u1946-\u194f\u19d0-\u19d9\u1a80-\u1a89\u1a90-\u1a99\u1b50-\u1b59\u1bb0-\u1bb9\u1c40-\u1c49\u1c50-\u1c59\ua620-\ua629\ua8d0-\ua8d9\ua900-\ua909\ua9d0-\ua9d9\ua9f0-\ua9f9\uaa50-\uaa59\uabf0-\uabf9\uff10-\uff19/;

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var hashtagSpecialChars = /_\u200c\u200d\ua67e\u05be\u05f3\u05f4\uff5e\u301c\u309b\u309c\u30a0\u30fb\u3003\u0f0b\u0f0c\xb7/;

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var hashtagAlphaNumeric = regexSupplant(/(?:[#{bmpLetterAndMarks}#{bmpNumerals}#{hashtagSpecialChars}]|(?=#{nonBmpCodePairs})(?:#{astralLetterAndMarks}|#{astralNumerals}))/, {
  bmpLetterAndMarks: bmpLetterAndMarks,
  bmpNumerals: bmpNumerals,
  hashtagSpecialChars: hashtagSpecialChars,
  nonBmpCodePairs: nonBmpCodePairs,
  astralLetterAndMarks: astralLetterAndMarks,
  astralNumerals: astralNumerals
});

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var codePoint = /(?:[^\uD800-\uDFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF])/;

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var hashtagBoundary = regexSupplant(/(?:^|\uFE0E|\uFE0F|$|(?!#{hashtagAlphaNumeric}|&)#{codePoint})/, {
  codePoint: codePoint,
  hashtagAlphaNumeric: hashtagAlphaNumeric
});

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var validHashtag = regexSupplant(/(#{hashtagBoundary})(#{hashSigns})(?!\uFE0F|\u20E3)(#{hashtagAlphaNumeric}*#{hashtagAlpha}#{hashtagAlphaNumeric}*)/gi, { hashtagBoundary: hashtagBoundary, hashSigns: hashSigns, hashtagAlphaNumeric: hashtagAlphaNumeric, hashtagAlpha: hashtagAlpha });

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var extractHashtagsWithIndices = function extractHashtagsWithIndices(text, options) {
  if (!options) {
    options = { checkUrlOverlap: true };
  }

  if (!text || !text.match(hashSigns)) {
    return [];
  }

  var tags = [];

  text.replace(validHashtag, function (match, before, hash, hashText, offset, chunk) {
    var after = chunk.slice(offset + match.length);
    if (after.match(endHashtagMatch)) {
      return;
    }
    var startPosition = offset + before.length;
    var endPosition = startPosition + hashText.length + 1;
    tags.push({
      hashtag: hashText,
      indices: [startPosition, endPosition]
    });
  });

  if (options.checkUrlOverlap) {
    // also extract URL entities
    var urls = extractUrlsWithIndices(text);
    if (urls.length > 0) {
      var entities = tags.concat(urls);
      // remove overlap
      removeOverlappingEntities(entities);
      // only push back hashtags
      tags = [];
      for (var i = 0; i < entities.length; i++) {
        if (entities[i].hashtag) {
          tags.push(entities[i]);
        }
      }
    }
  }

  return tags;
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var atSigns = /[@＠]/;

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var endMentionMatch = regexSupplant(/^(?:#{atSigns}|[#{latinAccentChars}]|:\/\/)/, { atSigns: atSigns, latinAccentChars: latinAccentChars });

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var validMentionPrecedingChars = /(?:^|[^a-zA-Z0-9_!#$%&*@＠]|(?:^|[^a-zA-Z0-9_+~.-])(?:rt|RT|rT|Rt):?)/;

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var validMentionOrList = regexSupplant('(#{validMentionPrecedingChars})' + // $1: Preceding character
'(#{atSigns})' + // $2: At mark
'([a-zA-Z0-9_]{1,20})' + // $3: Screen name
'(/[a-zA-Z][a-zA-Z0-9_-]{0,24})?', // $4: List (optional)
{ validMentionPrecedingChars: validMentionPrecedingChars, atSigns: atSigns }, 'g');

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var extractMentionsOrListsWithIndices = function (text) {
  if (!text || !text.match(atSigns)) {
    return [];
  }

  var possibleNames = [];

  text.replace(validMentionOrList, function (match, before, atSign, screenName, slashListname, offset, chunk) {
    var after = chunk.slice(offset + match.length);
    if (!after.match(endMentionMatch)) {
      slashListname = slashListname || '';
      var startPosition = offset + before.length;
      var endPosition = startPosition + screenName.length + slashListname.length + 1;
      possibleNames.push({
        screenName: screenName,
        listSlug: slashListname,
        indices: [startPosition, endPosition]
      });
    }
  });

  return possibleNames;
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var extractEntitiesWithIndices = function (text, options) {
  var entities = extractUrlsWithIndices(text, options).concat(extractMentionsOrListsWithIndices(text)).concat(extractHashtagsWithIndices(text, { checkUrlOverlap: false })).concat(extractCashtagsWithIndices(text));

  if (entities.length == 0) {
    return [];
  }

  removeOverlappingEntities(entities);
  return entities;
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var clone = function (o) {
  var r = {};
  for (var k in o) {
    if (o.hasOwnProperty(k)) {
      r[k] = o[k];
    }
  }

  return r;
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var BOOLEAN_ATTRIBUTES = {
  disabled: true,
  readonly: true,
  multiple: true,
  checked: true
};

// Options which should not be passed as HTML attributes
var OPTIONS_NOT_ATTRIBUTES = {
  urlClass: true,
  listClass: true,
  usernameClass: true,
  hashtagClass: true,
  cashtagClass: true,
  usernameUrlBase: true,
  listUrlBase: true,
  hashtagUrlBase: true,
  cashtagUrlBase: true,
  usernameUrlBlock: true,
  listUrlBlock: true,
  hashtagUrlBlock: true,
  linkUrlBlock: true,
  usernameIncludeSymbol: true,
  suppressLists: true,
  suppressNoFollow: true,
  targetBlank: true,
  suppressDataScreenName: true,
  urlEntities: true,
  symbolTag: true,
  textWithSymbolTag: true,
  urlTarget: true,
  invisibleTagAttrs: true,
  linkAttributeBlock: true,
  linkTextBlock: true,
  htmlEscapeNonEntities: true
};

var extractHtmlAttrsFromOptions = function (options) {
  var htmlAttrs = {};
  for (var k in options) {
    var v = options[k];
    if (OPTIONS_NOT_ATTRIBUTES[k]) {
      continue;
    }
    if (BOOLEAN_ATTRIBUTES[k]) {
      v = v ? k : null;
    }
    if (v == null) {
      continue;
    }
    htmlAttrs[k] = v;
  }
  return htmlAttrs;
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var HTML_ENTITIES = {
  '&': '&amp;',
  '>': '&gt;',
  '<': '&lt;',
  '"': '&quot;',
  "'": '&#39;'
};

var htmlEscape = function (text) {
  return text && text.replace(/[&"'><]/g, function (character) {
    return HTML_ENTITIES[character];
  });
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var BOOLEAN_ATTRIBUTES$1 = {
  disabled: true,
  readonly: true,
  multiple: true,
  checked: true
};

var tagAttrs = function (attributes) {
  var htmlAttrs = '';
  for (var k in attributes) {
    var v = attributes[k];
    if (BOOLEAN_ATTRIBUTES$1[k]) {
      v = v ? k : null;
    }
    if (v == null) {
      continue;
    }
    htmlAttrs += ' ' + htmlEscape(k) + '="' + htmlEscape(v.toString()) + '"';
  }
  return htmlAttrs;
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var linkToText = function (entity, text, attributes, options) {
  if (!options.suppressNoFollow) {
    attributes.rel = 'nofollow';
  }
  // if linkAttributeBlock is specified, call it to modify the attributes
  if (options.linkAttributeBlock) {
    options.linkAttributeBlock(entity, attributes);
  }
  // if linkTextBlock is specified, call it to get a new/modified link text
  if (options.linkTextBlock) {
    text = options.linkTextBlock(entity, text);
  }
  var d = {
    text: text,
    attr: tagAttrs(attributes)
  };
  return stringSupplant('<a#{attr}>#{text}</a>', d);
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var linkToTextWithSymbol = function (entity, symbol, text, attributes, options) {
  var taggedSymbol = options.symbolTag ? '<' + options.symbolTag + '>' + symbol + '</' + options.symbolTag + '>' : symbol;
  text = htmlEscape(text);
  var taggedText = options.textWithSymbolTag ? '<' + options.textWithSymbolTag + '>' + text + '</' + options.textWithSymbolTag + '>' : text;

  if (options.usernameIncludeSymbol || !symbol.match(atSigns)) {
    return linkToText(entity, taggedSymbol + taggedText, attributes, options);
  } else {
    return taggedSymbol + linkToText(entity, taggedText, attributes, options);
  }
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var linkToCashtag = function (entity, text, options) {
  var cashtag = htmlEscape(entity.cashtag);
  var attrs = clone(options.htmlAttrs || {});
  attrs.href = options.cashtagUrlBase + cashtag;
  attrs.title = '$' + cashtag;
  attrs['class'] = options.cashtagClass;
  if (options.targetBlank) {
    attrs.target = '_blank';
  }

  return linkToTextWithSymbol(entity, '$', cashtag, attrs, options);
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var rtlChars = /[\u0600-\u06FF]|[\u0750-\u077F]|[\u0590-\u05FF]|[\uFE70-\uFEFF]/gm;

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var linkToHashtag = function (entity, text, options) {
  var hash = text.substring(entity.indices[0], entity.indices[0] + 1);
  var hashtag = htmlEscape(entity.hashtag);
  var attrs = clone(options.htmlAttrs || {});
  attrs.href = options.hashtagUrlBase + hashtag;
  attrs.title = '#' + hashtag;
  attrs['class'] = options.hashtagClass;
  if (hashtag.charAt(0).match(rtlChars)) {
    attrs['class'] += ' rtl';
  }
  if (options.targetBlank) {
    attrs.target = '_blank';
  }

  return linkToTextWithSymbol(entity, hash, hashtag, attrs, options);
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var linkTextWithEntity = function (entity, options) {
  var displayUrl = entity.display_url;
  var expandedUrl = entity.expanded_url;

  // Goal: If a user copies and pastes a tweet containing t.co'ed link, the resulting paste
  // should contain the full original URL (expanded_url), not the display URL.
  //
  // Method: Whenever possible, we actually emit HTML that contains expanded_url, and use
  // font-size:0 to hide those parts that should not be displayed (because they are not part of display_url).
  // Elements with font-size:0 get copied even though they are not visible.
  // Note that display:none doesn't work here. Elements with display:none don't get copied.
  //
  // Additionally, we want to *display* ellipses, but we don't want them copied.  To make this happen we
  // wrap the ellipses in a tco-ellipsis class and provide an onCopy handler that sets display:none on
  // everything with the tco-ellipsis class.
  //
  // Exception: pic.twitter.com images, for which expandedUrl = "https://twitter.com/#!/username/status/1234/photo/1
  // For those URLs, display_url is not a substring of expanded_url, so we don't do anything special to render the elided parts.
  // For a pic.twitter.com URL, the only elided part will be the "https://", so this is fine.

  var displayUrlSansEllipses = displayUrl.replace(/…/g, ''); // We have to disregard ellipses for matching
  // Note: we currently only support eliding parts of the URL at the beginning or the end.
  // Eventually we may want to elide parts of the URL in the *middle*.  If so, this code will
  // become more complicated.  We will probably want to create a regexp out of display URL,
  // replacing every ellipsis with a ".*".
  if (expandedUrl.indexOf(displayUrlSansEllipses) != -1) {
    var displayUrlIndex = expandedUrl.indexOf(displayUrlSansEllipses);
    var v = {
      displayUrlSansEllipses: displayUrlSansEllipses,
      // Portion of expandedUrl that precedes the displayUrl substring
      beforeDisplayUrl: expandedUrl.substr(0, displayUrlIndex),
      // Portion of expandedUrl that comes after displayUrl
      afterDisplayUrl: expandedUrl.substr(displayUrlIndex + displayUrlSansEllipses.length),
      precedingEllipsis: displayUrl.match(/^…/) ? '…' : '',
      followingEllipsis: displayUrl.match(/…$/) ? '…' : ''
    };
    for (var k in v) {
      if (v.hasOwnProperty(k)) {
        v[k] = htmlEscape(v[k]);
      }
    }
    // As an example: The user tweets "hi http://longdomainname.com/foo"
    // This gets shortened to "hi http://t.co/xyzabc", with display_url = "…nname.com/foo"
    // This will get rendered as:
    // <span class='tco-ellipsis'> <!-- This stuff should get displayed but not copied -->
    //   …
    //   <!-- There's a chance the onCopy event handler might not fire. In case that happens,
    //        we include an &nbsp; here so that the … doesn't bump up against the URL and ruin it.
    //        The &nbsp; is inside the tco-ellipsis span so that when the onCopy handler *does*
    //        fire, it doesn't get copied.  Otherwise the copied text would have two spaces in a row,
    //        e.g. "hi  http://longdomainname.com/foo".
    //   <span style='font-size:0'>&nbsp;</span>
    // </span>
    // <span style='font-size:0'>  <!-- This stuff should get copied but not displayed -->
    //   http://longdomai
    // </span>
    // <span class='js-display-url'> <!-- This stuff should get displayed *and* copied -->
    //   nname.com/foo
    // </span>
    // <span class='tco-ellipsis'> <!-- This stuff should get displayed but not copied -->
    //   <span style='font-size:0'>&nbsp;</span>
    //   …
    // </span>
    v['invisible'] = options.invisibleTagAttrs;
    return stringSupplant("<span class='tco-ellipsis'>#{precedingEllipsis}<span #{invisible}>&nbsp;</span></span><span #{invisible}>#{beforeDisplayUrl}</span><span class='js-display-url'>#{displayUrlSansEllipses}</span><span #{invisible}>#{afterDisplayUrl}</span><span class='tco-ellipsis'><span #{invisible}>&nbsp;</span>#{followingEllipsis}</span>", v);
  }
  return displayUrl;
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var urlHasProtocol = /^https?:\/\//i;

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var linkToUrl = function (entity, text, options) {
  var url = entity.url;
  var displayUrl = url;
  var linkText = htmlEscape(displayUrl);

  // If the caller passed a urlEntities object (provided by a Twitter API
  // response with include_entities=true), we use that to render the display_url
  // for each URL instead of it's underlying t.co URL.
  var urlEntity = options.urlEntities && options.urlEntities[url] || entity;
  if (urlEntity.display_url) {
    linkText = linkTextWithEntity(urlEntity, options);
  }

  var attrs = clone(options.htmlAttrs || {});

  if (!url.match(urlHasProtocol)) {
    url = 'http://' + url;
  }
  attrs.href = url;

  if (options.targetBlank) {
    attrs.target = '_blank';
  }

  // set class only if urlClass is specified.
  if (options.urlClass) {
    attrs['class'] = options.urlClass;
  }

  // set target only if urlTarget is specified.
  if (options.urlTarget) {
    attrs.target = options.urlTarget;
  }

  if (!options.title && urlEntity.display_url) {
    attrs.title = urlEntity.expanded_url;
  }

  return linkToText(entity, linkText, attrs, options);
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var linkToMentionAndList = function (entity, text, options) {
  var at = text.substring(entity.indices[0], entity.indices[0] + 1);
  var user = htmlEscape(entity.screenName);
  var slashListname = htmlEscape(entity.listSlug);
  var isList = entity.listSlug && !options.suppressLists;
  var attrs = clone(options.htmlAttrs || {});
  attrs['class'] = isList ? options.listClass : options.usernameClass;
  attrs.href = isList ? options.listUrlBase + user + slashListname : options.usernameUrlBase + user;
  if (!isList && !options.suppressDataScreenName) {
    attrs['data-screen-name'] = user;
  }
  if (options.targetBlank) {
    attrs.target = '_blank';
  }

  return linkToTextWithSymbol(entity, at, isList ? user + slashListname : user, attrs, options);
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

// Default CSS class for auto-linked lists (along with the url class)
var DEFAULT_LIST_CLASS = 'tweet-url list-slug';
// Default CSS class for auto-linked usernames (along with the url class)
var DEFAULT_USERNAME_CLASS = 'tweet-url username';
// Default CSS class for auto-linked hashtags (along with the url class)
var DEFAULT_HASHTAG_CLASS = 'tweet-url hashtag';
// Default CSS class for auto-linked cashtags (along with the url class)
var DEFAULT_CASHTAG_CLASS = 'tweet-url cashtag';

var autoLinkEntities = function (text, entities, options) {
  var options = clone(options || {});
  options.hashtagClass = options.hashtagClass || DEFAULT_HASHTAG_CLASS;
  options.hashtagUrlBase = options.hashtagUrlBase || 'https://twitter.com/search?q=%23';
  options.cashtagClass = options.cashtagClass || DEFAULT_CASHTAG_CLASS;
  options.cashtagUrlBase = options.cashtagUrlBase || 'https://twitter.com/search?q=%24';
  options.listClass = options.listClass || DEFAULT_LIST_CLASS;
  options.usernameClass = options.usernameClass || DEFAULT_USERNAME_CLASS;
  options.usernameUrlBase = options.usernameUrlBase || 'https://twitter.com/';
  options.listUrlBase = options.listUrlBase || 'https://twitter.com/';
  options.htmlAttrs = extractHtmlAttrsFromOptions(options);
  options.invisibleTagAttrs = options.invisibleTagAttrs || "style='position:absolute;left:-9999px;'";

  // remap url entities to hash
  var urlEntities, i, len;
  if (options.urlEntities) {
    urlEntities = {};
    for (i = 0, len = options.urlEntities.length; i < len; i++) {
      urlEntities[options.urlEntities[i].url] = options.urlEntities[i];
    }
    options.urlEntities = urlEntities;
  }

  var result = '';
  var beginIndex = 0;

  // sort entities by start index
  entities.sort(function (a, b) {
    return a.indices[0] - b.indices[0];
  });

  var nonEntity = options.htmlEscapeNonEntities ? htmlEscape : function (text) {
    return text;
  };

  for (var i = 0; i < entities.length; i++) {
    var entity = entities[i];
    result += nonEntity(text.substring(beginIndex, entity.indices[0]));

    if (entity.url) {
      result += linkToUrl(entity, text, options);
    } else if (entity.hashtag) {
      result += linkToHashtag(entity, text, options);
    } else if (entity.screenName) {
      result += linkToMentionAndList(entity, text, options);
    } else if (entity.cashtag) {
      result += linkToCashtag(entity, text, options);
    }
    beginIndex = entity.indices[1];
  }
  result += nonEntity(text.substring(beginIndex, text.length));
  return result;
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var autoLink = function (text, options) {
  var entities = extractEntitiesWithIndices(text, {
    extractUrlsWithoutProtocol: false
  });
  return autoLinkEntities(text, entities, options);
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var autoLinkCashtags = function (text, options) {
  var entities = extractCashtagsWithIndices(text);
  return autoLinkEntities(text, entities, options);
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var autoLinkHashtags = function (text, options) {
  var entities = extractHashtagsWithIndices(text);
  return autoLinkEntities(text, entities, options);
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var autoLinkUrlsCustom = function (text, options) {
  var entities = extractUrlsWithIndices(text, {
    extractUrlsWithoutProtocol: false
  });
  return autoLinkEntities(text, entities, options);
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var autoLinkUsernamesOrLists = function (text, options) {
  var entities = extractMentionsOrListsWithIndices(text);
  return autoLinkEntities(text, entities, options);
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

/**
 * Copied from https://github.com/twitter/twitter-text/blob/master/js/twitter-text.js
 */

var convertUnicodeIndices = function convertUnicodeIndices(text, entities, indicesInUTF16) {
  if (entities.length === 0) {
    return;
  }

  var charIndex = 0;
  var codePointIndex = 0;

  // sort entities by start index
  entities.sort(function (a, b) {
    return a.indices[0] - b.indices[0];
  });
  var entityIndex = 0;
  var entity = entities[0];

  while (charIndex < text.length) {
    if (entity.indices[0] === (indicesInUTF16 ? charIndex : codePointIndex)) {
      var len = entity.indices[1] - entity.indices[0];
      entity.indices[0] = indicesInUTF16 ? codePointIndex : charIndex;
      entity.indices[1] = entity.indices[0] + len;

      entityIndex++;
      if (entityIndex === entities.length) {
        // no more entity
        break;
      }
      entity = entities[entityIndex];
    }

    var c = text.charCodeAt(charIndex);
    if (c >= 0xd800 && c <= 0xdbff && charIndex < text.length - 1) {
      // Found high surrogate char
      c = text.charCodeAt(charIndex + 1);
      if (c >= 0xdc00 && c <= 0xdfff) {
        // Found surrogate pair
        charIndex++;
      }
    }
    codePointIndex++;
    charIndex++;
  }
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var modifyIndicesFromUnicodeToUTF16 = function (text, entities) {
  convertUnicodeIndices(text, entities, false);
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var autoLinkWithJSON = function (text, json, options) {
  // map JSON entity to twitter-text entity
  if (json.user_mentions) {
    for (var i = 0; i < json.user_mentions.length; i++) {
      // this is a @mention
      json.user_mentions[i].screenName = json.user_mentions[i].screen_name;
    }
  }

  if (json.hashtags) {
    for (var i = 0; i < json.hashtags.length; i++) {
      // this is a #hashtag
      json.hashtags[i].hashtag = json.hashtags[i].text;
    }
  }

  if (json.symbols) {
    for (var i = 0; i < json.symbols.length; i++) {
      // this is a $CASH tag
      json.symbols[i].cashtag = json.symbols[i].text;
    }
  }

  // concatenate all entities
  var entities = [];
  for (var key in json) {
    entities = entities.concat(json[key]);
  }

  // modify indices to UTF-16
  modifyIndicesFromUnicodeToUTF16(text, entities);

  return autoLinkEntities(text, entities, options);
};

// This file is generated by scripts/buildConfig.js
var configs = {
  version1: {
    version: 1,
    maxWeightedTweetLength: 140,
    scale: 1,
    defaultWeight: 1,
    transformedURLLength: 23,
    ranges: []
  },
  version2: {
    version: 2,
    maxWeightedTweetLength: 280,
    scale: 100,
    defaultWeight: 200,
    transformedURLLength: 23,
    ranges: [{ start: 0, end: 4351, weight: 100 }, { start: 8192, end: 8205, weight: 100 }, { start: 8208, end: 8223, weight: 100 }, { start: 8242, end: 8247, weight: 100 }]
  },
  version3: {
    version: 3,
    maxWeightedTweetLength: 280,
    scale: 100,
    defaultWeight: 200,
    emojiParsingEnabled: true,
    transformedURLLength: 23,
    ranges: [{ start: 0, end: 4351, weight: 100 }, { start: 8192, end: 8205, weight: 100 }, { start: 8208, end: 8223, weight: 100 }, { start: 8242, end: 8247, weight: 100 }]
  },
  defaults: {
    version: 3,
    maxWeightedTweetLength: 280,
    scale: 100,
    defaultWeight: 200,
    emojiParsingEnabled: true,
    transformedURLLength: 23,
    ranges: [{ start: 0, end: 4351, weight: 100 }, { start: 8192, end: 8205, weight: 100 }, { start: 8208, end: 8223, weight: 100 }, { start: 8242, end: 8247, weight: 100 }]
  }
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var convertUnicodeIndices$2 = function (text, entities, indicesInUTF16) {
  if (entities.length == 0) {
    return;
  }

  var charIndex = 0;
  var codePointIndex = 0;

  // sort entities by start index
  entities.sort(function (a, b) {
    return a.indices[0] - b.indices[0];
  });
  var entityIndex = 0;
  var entity = entities[0];

  while (charIndex < text.length) {
    if (entity.indices[0] == (indicesInUTF16 ? charIndex : codePointIndex)) {
      var len = entity.indices[1] - entity.indices[0];
      entity.indices[0] = indicesInUTF16 ? codePointIndex : charIndex;
      entity.indices[1] = entity.indices[0] + len;

      entityIndex++;
      if (entityIndex == entities.length) {
        // no more entity
        break;
      }
      entity = entities[entityIndex];
    }

    var c = text.charCodeAt(charIndex);
    if (c >= 0xd800 && c <= 0xdbff && charIndex < text.length - 1) {
      // Found high surrogate char
      c = text.charCodeAt(charIndex + 1);
      if (c >= 0xdc00 && c <= 0xdfff) {
        // Found surrogate pair
        charIndex++;
      }
    }
    codePointIndex++;
    charIndex++;
  }
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var extractCashtags = function (text) {
  var cashtagsOnly = [],
      cashtagsWithIndices = extractCashtagsWithIndices(text);

  for (var i = 0; i < cashtagsWithIndices.length; i++) {
    cashtagsOnly.push(cashtagsWithIndices[i].cashtag);
  }

  return cashtagsOnly;
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var extractHashtags = function (text) {
  var hashtagsOnly = [];
  var hashtagsWithIndices = extractHashtagsWithIndices(text);
  for (var i = 0; i < hashtagsWithIndices.length; i++) {
    hashtagsOnly.push(hashtagsWithIndices[i].hashtag);
  }

  return hashtagsOnly;
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var extractMentionsWithIndices = function (text) {
  var mentions = [];
  var mentionOrList = void 0;
  var mentionsOrLists = extractMentionsOrListsWithIndices(text);

  for (var i = 0; i < mentionsOrLists.length; i++) {
    mentionOrList = mentionsOrLists[i];
    if (mentionOrList.listSlug === '') {
      mentions.push({
        screenName: mentionOrList.screenName,
        indices: mentionOrList.indices
      });
    }
  }

  return mentions;
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var extractMentions = function (text) {
  var screenNamesOnly = [],
      screenNamesWithIndices = extractMentionsWithIndices(text);

  for (var i = 0; i < screenNamesWithIndices.length; i++) {
    var screenName = screenNamesWithIndices[i].screenName;
    screenNamesOnly.push(screenName);
  }

  return screenNamesOnly;
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var validReply = regexSupplant(/^(?:#{spaces})*#{atSigns}([a-zA-Z0-9_]{1,20})/, { atSigns: atSigns, spaces: spaces });

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var extractReplies = function (text) {
  if (!text) {
    return null;
  }

  var possibleScreenName = text.match(validReply);
  if (!possibleScreenName || RegExp.rightContext.match(endMentionMatch)) {
    return null;
  }

  return possibleScreenName[1];
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var extractUrls = function (text, options) {
  var urlsOnly = [];
  var urlsWithIndices = extractUrlsWithIndices(text, options);

  for (var i = 0; i < urlsWithIndices.length; i++) {
    urlsOnly.push(urlsWithIndices[i].url);
  }

  return urlsOnly;
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var getCharacterWeight = function getCharacterWeight(ch, options) {
  var defaultWeight = options.defaultWeight,
      ranges = options.ranges;

  var weight = defaultWeight;
  var chCodePoint = ch.charCodeAt(0);
  if (Array.isArray(ranges)) {
    for (var i = 0, length = ranges.length; i < length; i++) {
      var currRange = ranges[i];
      if (chCodePoint >= currRange.start && chCodePoint <= currRange.end) {
        weight = currRange.weight;
        break;
      }
    }
  }

  return weight;
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var modifyIndicesFromUTF16ToUnicode = function (text, entities) {
  convertUnicodeIndices(text, entities, true);
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var invalidChars = regexSupplant(/[#{invalidCharsGroup}]/, {
  invalidCharsGroup: invalidCharsGroup
});

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var hasInvalidCharacters = function (text) {
  return invalidChars.test(text);
};

var regex = createCommonjsModule(function (module, exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  // Copyright Twitter Inc. Licensed under MIT
  // https://github.com/twitter/twemoji-parser/blob/master/LICENSE.md

  // This file is auto-generated
  exports.default = /(?:\ud83d[\udc68\udc69])(?:\ud83c[\udffb-\udfff])?\u200d(?:\u2695\ufe0f|\u2696\ufe0f|\u2708\ufe0f|\ud83c[\udf3e\udf73\udf93\udfa4\udfa8\udfeb\udfed]|\ud83d[\udcbb\udcbc\udd27\udd2c\ude80\ude92]|\ud83e[\uddb0-\uddb3])|(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75]|\u26f9)((?:\ud83c[\udffb-\udfff]|\ufe0f)\u200d[\u2640\u2642]\ufe0f)|(?:\ud83c[\udfc3\udfc4\udfca]|\ud83d[\udc6e\udc71\udc73\udc77\udc81\udc82\udc86\udc87\ude45-\ude47\ude4b\ude4d\ude4e\udea3\udeb4-\udeb6]|\ud83e[\udd26\udd35\udd37-\udd39\udd3d\udd3e\uddb8\uddb9\uddd6-\udddd])(?:\ud83c[\udffb-\udfff])?\u200d[\u2640\u2642]\ufe0f|(?:\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d[\udc68\udc69]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc68|\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d[\udc68\udc69]|\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83c\udff3\ufe0f\u200d\ud83c\udf08|\ud83c\udff4\u200d\u2620\ufe0f|\ud83d\udc41\u200d\ud83d\udde8|\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc6f\u200d\u2640\ufe0f|\ud83d\udc6f\u200d\u2642\ufe0f|\ud83e\udd3c\u200d\u2640\ufe0f|\ud83e\udd3c\u200d\u2642\ufe0f|\ud83e\uddde\u200d\u2640\ufe0f|\ud83e\uddde\u200d\u2642\ufe0f|\ud83e\udddf\u200d\u2640\ufe0f|\ud83e\udddf\u200d\u2642\ufe0f)|[#*0-9]\ufe0f?\u20e3|(?:[©®\u2122\u265f]\ufe0f)|(?:\ud83c[\udc04\udd70\udd71\udd7e\udd7f\ude02\ude1a\ude2f\ude37\udf21\udf24-\udf2c\udf36\udf7d\udf96\udf97\udf99-\udf9b\udf9e\udf9f\udfcd\udfce\udfd4-\udfdf\udff3\udff5\udff7]|\ud83d[\udc3f\udc41\udcfd\udd49\udd4a\udd6f\udd70\udd73\udd76-\udd79\udd87\udd8a-\udd8d\udda5\udda8\uddb1\uddb2\uddbc\uddc2-\uddc4\uddd1-\uddd3\udddc-\uddde\udde1\udde3\udde8\uddef\uddf3\uddfa\udecb\udecd-\udecf\udee0-\udee5\udee9\udef0\udef3]|[\u203c\u2049\u2139\u2194-\u2199\u21a9\u21aa\u231a\u231b\u2328\u23cf\u23ed-\u23ef\u23f1\u23f2\u23f8-\u23fa\u24c2\u25aa\u25ab\u25b6\u25c0\u25fb-\u25fe\u2600-\u2604\u260e\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262a\u262e\u262f\u2638-\u263a\u2640\u2642\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267b\u267f\u2692-\u2697\u2699\u269b\u269c\u26a0\u26a1\u26aa\u26ab\u26b0\u26b1\u26bd\u26be\u26c4\u26c5\u26c8\u26cf\u26d1\u26d3\u26d4\u26e9\u26ea\u26f0-\u26f5\u26f8\u26fa\u26fd\u2702\u2708\u2709\u270f\u2712\u2714\u2716\u271d\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u2764\u27a1\u2934\u2935\u2b05-\u2b07\u2b1b\u2b1c\u2b50\u2b55\u3030\u303d\u3297\u3299])(?:\ufe0f|(?!\ufe0e))|(?:(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75\udd90]|[\u261d\u26f7\u26f9\u270c\u270d])(?:\ufe0f|(?!\ufe0e))|(?:\ud83c[\udf85\udfc2-\udfc4\udfc7\udfca]|\ud83d[\udc42\udc43\udc46-\udc50\udc66-\udc69\udc6e\udc70-\udc78\udc7c\udc81-\udc83\udc85-\udc87\udcaa\udd7a\udd95\udd96\ude45-\ude47\ude4b-\ude4f\udea3\udeb4-\udeb6\udec0\udecc]|\ud83e[\udd18-\udd1c\udd1e\udd1f\udd26\udd30-\udd39\udd3d\udd3e\uddb5\uddb6\uddb8\uddb9\uddd1-\udddd]|[\u270a\u270b]))(?:\ud83c[\udffb-\udfff])?|(?:\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc65\udb40\udc6e\udb40\udc67\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc73\udb40\udc63\udb40\udc74\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc77\udb40\udc6c\udb40\udc73\udb40\udc7f|\ud83c\udde6\ud83c[\udde8-\uddec\uddee\uddf1\uddf2\uddf4\uddf6-\uddfa\uddfc\uddfd\uddff]|\ud83c\udde7\ud83c[\udde6\udde7\udde9-\uddef\uddf1-\uddf4\uddf6-\uddf9\uddfb\uddfc\uddfe\uddff]|\ud83c\udde8\ud83c[\udde6\udde8\udde9\uddeb-\uddee\uddf0-\uddf5\uddf7\uddfa-\uddff]|\ud83c\udde9\ud83c[\uddea\uddec\uddef\uddf0\uddf2\uddf4\uddff]|\ud83c\uddea\ud83c[\udde6\udde8\uddea\uddec\udded\uddf7-\uddfa]|\ud83c\uddeb\ud83c[\uddee-\uddf0\uddf2\uddf4\uddf7]|\ud83c\uddec\ud83c[\udde6\udde7\udde9-\uddee\uddf1-\uddf3\uddf5-\uddfa\uddfc\uddfe]|\ud83c\udded\ud83c[\uddf0\uddf2\uddf3\uddf7\uddf9\uddfa]|\ud83c\uddee\ud83c[\udde8-\uddea\uddf1-\uddf4\uddf6-\uddf9]|\ud83c\uddef\ud83c[\uddea\uddf2\uddf4\uddf5]|\ud83c\uddf0\ud83c[\uddea\uddec-\uddee\uddf2\uddf3\uddf5\uddf7\uddfc\uddfe\uddff]|\ud83c\uddf1\ud83c[\udde6-\udde8\uddee\uddf0\uddf7-\uddfb\uddfe]|\ud83c\uddf2\ud83c[\udde6\udde8-\udded\uddf0-\uddff]|\ud83c\uddf3\ud83c[\udde6\udde8\uddea-\uddec\uddee\uddf1\uddf4\uddf5\uddf7\uddfa\uddff]|\ud83c\uddf4\ud83c\uddf2|\ud83c\uddf5\ud83c[\udde6\uddea-\udded\uddf0-\uddf3\uddf7-\uddf9\uddfc\uddfe]|\ud83c\uddf6\ud83c\udde6|\ud83c\uddf7\ud83c[\uddea\uddf4\uddf8\uddfa\uddfc]|\ud83c\uddf8\ud83c[\udde6-\uddea\uddec-\uddf4\uddf7-\uddf9\uddfb\uddfd-\uddff]|\ud83c\uddf9\ud83c[\udde6\udde8\udde9\uddeb-\udded\uddef-\uddf4\uddf7\uddf9\uddfb\uddfc\uddff]|\ud83c\uddfa\ud83c[\udde6\uddec\uddf2\uddf3\uddf8\uddfe\uddff]|\ud83c\uddfb\ud83c[\udde6\udde8\uddea\uddec\uddee\uddf3\uddfa]|\ud83c\uddfc\ud83c[\uddeb\uddf8]|\ud83c\uddfd\ud83c\uddf0|\ud83c\uddfe\ud83c[\uddea\uddf9]|\ud83c\uddff\ud83c[\udde6\uddf2\uddfc]|\ud83c[\udccf\udd8e\udd91-\udd9a\udde6-\uddff\ude01\ude32-\ude36\ude38-\ude3a\ude50\ude51\udf00-\udf20\udf2d-\udf35\udf37-\udf7c\udf7e-\udf84\udf86-\udf93\udfa0-\udfc1\udfc5\udfc6\udfc8\udfc9\udfcf-\udfd3\udfe0-\udff0\udff4\udff8-\udfff]|\ud83d[\udc00-\udc3e\udc40\udc44\udc45\udc51-\udc65\udc6a-\udc6d\udc6f\udc79-\udc7b\udc7d-\udc80\udc84\udc88-\udca9\udcab-\udcfc\udcff-\udd3d\udd4b-\udd4e\udd50-\udd67\udda4\uddfb-\ude44\ude48-\ude4a\ude80-\udea2\udea4-\udeb3\udeb7-\udebf\udec1-\udec5\uded0-\uded2\udeeb\udeec\udef4-\udef9]|\ud83e[\udd10-\udd17\udd1d\udd20-\udd25\udd27-\udd2f\udd3a\udd3c\udd40-\udd45\udd47-\udd70\udd73-\udd76\udd7a\udd7c-\udda2\uddb4\uddb7\uddc0-\uddc2\uddd0\uddde-\uddff]|[\u23e9-\u23ec\u23f0\u23f3\u267e\u26ce\u2705\u2728\u274c\u274e\u2753-\u2755\u2795-\u2797\u27b0\u27bf\ue50a])|\ufe0f/g;
});

unwrapExports(regex);

var dist$1 = createCommonjsModule(function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.TypeName = undefined;
  exports.parse = parse;
  exports.toCodePoints = toCodePoints;

  var _regex2 = _interopRequireDefault(regex);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }

  var TypeName = exports.TypeName = 'emoji';
  // Copyright Twitter Inc. Licensed under MIT
  // https://github.com/twitter/twemoji-parser/blob/master/LICENSE.md
  function parse(text, options) {
    var assetType = options && options.assetType ? options.assetType : 'svg';
    var getTwemojiUrl = options && options.buildUrl ? options.buildUrl : function (codepoints, assetType) {
      return assetType === 'png' ? 'https://twemoji.maxcdn.com/2/72x72/' + codepoints + '.png' : 'https://twemoji.maxcdn.com/2/svg/' + codepoints + '.svg';
    };

    var entities = [];

    _regex2.default.lastIndex = 0;
    while (true) {
      var result = _regex2.default.exec(text);
      if (!result) {
        break;
      }

      var emojiText = result[0];
      var codepoints = toCodePoints(removeVS16s(emojiText)).join('-');

      entities.push({
        url: codepoints ? getTwemojiUrl(codepoints, assetType) : '',
        indices: [result.index, _regex2.default.lastIndex],
        text: emojiText,
        type: TypeName
      });
    }
    return entities;
  }

  var vs16RegExp = /\uFE0F/g;
  // avoid using a string literal like '\u200D' here because minifiers expand it inline
  var zeroWidthJoiner = String.fromCharCode(0x200d);

  var removeVS16s = function removeVS16s(rawEmoji) {
    return rawEmoji.indexOf(zeroWidthJoiner) < 0 ? rawEmoji.replace(vs16RegExp, '') : rawEmoji;
  };

  function toCodePoints(unicodeSurrogates) {
    var points = [];
    var char = 0;
    var previous = 0;
    var i = 0;
    while (i < unicodeSurrogates.length) {
      char = unicodeSurrogates.charCodeAt(i++);
      if (previous) {
        points.push((0x10000 + (previous - 0xd800 << 10) + (char - 0xdc00)).toString(16));
        previous = 0;
      } else if (char > 0xd800 && char <= 0xdbff) {
        previous = char;
      } else {
        points.push(char.toString(16));
      }
    }
    return points;
  }
});

unwrapExports(dist$1);
var dist_2 = dist$1.parse;

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var urlHasHttps = /^https:\/\//i;

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

// TODO: WEB-19861 Replace with public package after it is open sourced
/**
 * [parseTweet description]
 * @param  {string} text tweet text to parse
 * @param  {Object} options config options to pass
 * @return {Object} Fields in response described below:
 *
 * Response fields:
 * weightedLength {int} the weighted length of tweet based on weights specified in the config
 * valid {bool} If tweet is valid
 * permillage {float} permillage of the tweet over the max length specified in config
 * validRangeStart {int} beginning of valid text
 * validRangeEnd {int} End index of valid part of the tweet text (inclusive) in utf16
 * displayRangeStart {int} beginning index of display text
 * displayRangeEnd {int} end index of display text (inclusive) in utf16
 */
var parseTweet = function parseTweet() {
  var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : configs.defaults;

  var mergedOptions = Object.keys(options).length ? options : configs.defaults;
  var defaultWeight = mergedOptions.defaultWeight,
      emojiParsingEnabled = mergedOptions.emojiParsingEnabled,
      scale = mergedOptions.scale,
      maxWeightedTweetLength = mergedOptions.maxWeightedTweetLength,
      transformedURLLength = mergedOptions.transformedURLLength;

  var normalizedText = typeof String.prototype.normalize === 'function' ? text.normalize() : text;

  // Hash all entities by their startIndex for fast lookup
  var urlEntitiesMap = transformEntitiesToHash(extractUrlsWithIndices(normalizedText));
  var emojiEntitiesMap = emojiParsingEnabled ? transformEntitiesToHash(dist_2(normalizedText)) : [];
  var tweetLength = normalizedText.length;

  var weightedLength = 0;
  var validDisplayIndex = 0;
  var valid = true;
  // Go through every character and calculate weight
  for (var charIndex = 0; charIndex < tweetLength; charIndex++) {
    // If a url begins at the specified index handle, add constant length
    if (urlEntitiesMap[charIndex]) {
      var _urlEntitiesMap$charI = urlEntitiesMap[charIndex],
          url = _urlEntitiesMap$charI.url;

      weightedLength += transformedURLLength * scale;
      charIndex += url.length - 1;
    } else if (emojiParsingEnabled && emojiEntitiesMap[charIndex]) {
      var _emojiEntitiesMap$cha = emojiEntitiesMap[charIndex],
          emoji = _emojiEntitiesMap$cha.text;

      weightedLength += getCharacterWeight(emoji.charAt(0), mergedOptions);
      charIndex += emoji.length - 1;
    } else {
      charIndex += isSurrogatePair(normalizedText, charIndex) ? 1 : 0;
      weightedLength += getCharacterWeight(normalizedText.charAt(charIndex), mergedOptions);
    }

    // Only test for validity of character if it is still valid
    if (valid) {
      valid = !hasInvalidCharacters(normalizedText.substring(charIndex, charIndex + 1));
    }
    if (valid && weightedLength <= maxWeightedTweetLength * scale) {
      validDisplayIndex = charIndex;
    }
  }

  weightedLength = weightedLength / scale;
  valid = valid && weightedLength > 0 && weightedLength <= maxWeightedTweetLength;
  var permillage = Math.floor(weightedLength / maxWeightedTweetLength * 1000);
  var normalizationOffset = text.length - normalizedText.length;
  validDisplayIndex += normalizationOffset;

  return {
    weightedLength: weightedLength,
    valid: valid,
    permillage: permillage,
    validRangeStart: 0,
    validRangeEnd: validDisplayIndex,
    displayRangeStart: 0,
    displayRangeEnd: text.length > 0 ? text.length - 1 : 0
  };
};

var transformEntitiesToHash = function transformEntitiesToHash(entities) {
  return entities.reduce(function (map, entity) {
    map[entity.indices[0]] = entity;
    return map;
  }, {});
};

var isSurrogatePair = function isSurrogatePair(text, cIndex) {
  // Test if a character is the beginning of a surrogate pair
  if (cIndex < text.length - 1) {
    var c = text.charCodeAt(cIndex);
    var cNext = text.charCodeAt(cIndex + 1);
    return 0xd800 <= c && c <= 0xdbff && 0xdc00 <= cNext && cNext <= 0xdfff;
  }
  return false;
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var getTweetLength = function getTweetLength(text) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : configs.defaults;

  return parseTweet(text, options).weightedLength;
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

/**
 * Copied from https://github.com/twitter/twitter-text/blob/master/js/twitter-text.js
 */
var getUnicodeTextLength = function (text) {
  return text.replace(nonBmpCodePairs, ' ').length;
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

// this essentially does text.split(/<|>/)
// except that won't work in IE, where empty strings are ommitted
// so "<>".split(/<|>/) => [] in IE, but is ["", "", ""] in all others
// but "<<".split("<") => ["", "", ""]
var splitTags = function (text) {
  var firstSplits = text.split('<'),
      secondSplits = void 0,
      allSplits = [],
      split = void 0;

  for (var i = 0; i < firstSplits.length; i += 1) {
    split = firstSplits[i];
    if (!split) {
      allSplits.push('');
    } else {
      secondSplits = split.split('>');
      for (var j = 0; j < secondSplits.length; j += 1) {
        allSplits.push(secondSplits[j]);
      }
    }
  }

  return allSplits;
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var hitHighlight = function (text, hits, options) {
  var defaultHighlightTag = 'em';

  hits = hits || [];
  options = options || {};

  if (hits.length === 0) {
    return text;
  }

  var tagName = options.tag || defaultHighlightTag,
      tags = ['<' + tagName + '>', '</' + tagName + '>'],
      chunks = splitTags(text),
      i = void 0,
      j = void 0,
      result = '',
      chunkIndex = 0,
      chunk = chunks[0],
      prevChunksLen = 0,
      chunkCursor = 0,
      startInChunk = false,
      chunkChars = chunk,
      flatHits = [],
      index = void 0,
      hit = void 0,
      tag = void 0,
      placed = void 0,
      hitSpot = void 0;

  for (i = 0; i < hits.length; i += 1) {
    for (j = 0; j < hits[i].length; j += 1) {
      flatHits.push(hits[i][j]);
    }
  }

  for (index = 0; index < flatHits.length; index += 1) {
    hit = flatHits[index];
    tag = tags[index % 2];
    placed = false;

    while (chunk != null && hit >= prevChunksLen + chunk.length) {
      result += chunkChars.slice(chunkCursor);
      if (startInChunk && hit === prevChunksLen + chunkChars.length) {
        result += tag;
        placed = true;
      }

      if (chunks[chunkIndex + 1]) {
        result += '<' + chunks[chunkIndex + 1] + '>';
      }

      prevChunksLen += chunkChars.length;
      chunkCursor = 0;
      chunkIndex += 2;
      chunk = chunks[chunkIndex];
      chunkChars = chunk;
      startInChunk = false;
    }

    if (!placed && chunk != null) {
      hitSpot = hit - prevChunksLen;
      result += chunkChars.slice(chunkCursor, hitSpot) + tag;
      chunkCursor = hitSpot;
      if (index % 2 === 0) {
        startInChunk = true;
      } else {
        startInChunk = false;
      }
    } else if (!placed) {
      placed = true;
      result += tag;
    }
  }

  if (chunk != null) {
    if (chunkCursor < chunkChars.length) {
      result += chunkChars.slice(chunkCursor);
    }
    for (index = chunkIndex + 1; index < chunks.length; index += 1) {
      result += index % 2 === 0 ? chunks[index] : '<' + chunks[index] + '>';
    }
  }

  return result;
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var isInvalidTweet = function (text) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : configs.defaults;

  if (!text) {
    return 'empty';
  }

  var mergedOptions = _extends({}, configs.defaults, options);
  var maxLength = mergedOptions.maxWeightedTweetLength;

  // Determine max length independent of URL length
  if (getTweetLength(text, mergedOptions) > maxLength) {
    return 'too_long';
  }

  if (hasInvalidCharacters(text)) {
    return 'invalid_characters';
  }

  return false;
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var isValidHashtag = function (hashtag) {
  if (!hashtag) {
    return false;
  }

  var extracted = extractHashtags(hashtag);

  // Should extract the hashtag minus the # sign, hence the .slice(1)
  return extracted.length === 1 && extracted[0] === hashtag.slice(1);
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var VALID_LIST_RE = regexSupplant(/^#{validMentionOrList}$/, {
  validMentionOrList: validMentionOrList
});

var isValidList = function (usernameList) {
  var match = usernameList.match(VALID_LIST_RE);

  // Must have matched and had nothing before or after
  return !!(match && match[1] == '' && match[4]);
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var isValidTweetText = function (text, options) {
  return !isInvalidTweet(text, options);
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var validateUrlUnreserved = /[a-z\u0400-\u04FF0-9\-._~]/i;

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var validateUrlPctEncoded = /(?:%[0-9a-f]{2})/i;

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var validateUrlSubDelims = /[!$&'()*+,;=]/i;

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var validateUrlUserinfo = regexSupplant('(?:' + '#{validateUrlUnreserved}|' + '#{validateUrlPctEncoded}|' + '#{validateUrlSubDelims}|' + ':' + ')*', { validateUrlUnreserved: validateUrlUnreserved, validateUrlPctEncoded: validateUrlPctEncoded, validateUrlSubDelims: validateUrlSubDelims }, 'i');

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var validateUrlDomainSegment = /(?:[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?)/i;

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var validateUrlDomainTld = /(?:[a-z](?:[a-z0-9\-]*[a-z0-9])?)/i;

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var validateUrlSubDomainSegment = /(?:[a-z0-9](?:[a-z0-9_\-]*[a-z0-9])?)/i;

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var validateUrlDomain = regexSupplant(/(?:(?:#{validateUrlSubDomainSegment}\.)*(?:#{validateUrlDomainSegment}\.)#{validateUrlDomainTld})/i, {
  validateUrlSubDomainSegment: validateUrlSubDomainSegment,
  validateUrlDomainSegment: validateUrlDomainSegment,
  validateUrlDomainTld: validateUrlDomainTld
});

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var validateUrlDecOctet = /(?:[0-9]|(?:[1-9][0-9])|(?:1[0-9]{2})|(?:2[0-4][0-9])|(?:25[0-5]))/i;

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var validateUrlIpv4 = regexSupplant(/(?:#{validateUrlDecOctet}(?:\.#{validateUrlDecOctet}){3})/i, {
  validateUrlDecOctet: validateUrlDecOctet
});

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

// Punting on real IPv6 validation for now
var validateUrlIpv6 = /(?:\[[a-f0-9:\.]+\])/i;

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

// Punting on IPvFuture for now
var validateUrlIp = regexSupplant('(?:' + '#{validateUrlIpv4}|' + '#{validateUrlIpv6}' + ')', { validateUrlIpv4: validateUrlIpv4, validateUrlIpv6: validateUrlIpv6 }, 'i');

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var validateUrlHost = regexSupplant('(?:' + '#{validateUrlIp}|' + '#{validateUrlDomain}' + ')', { validateUrlIp: validateUrlIp, validateUrlDomain: validateUrlDomain }, 'i');

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var validateUrlPort = /[0-9]{1,5}/;

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var validateUrlAuthority = regexSupplant(
// $1 userinfo
'(?:(#{validateUrlUserinfo})@)?' +
// $2 host
'(#{validateUrlHost})' +
// $3 port
'(?::(#{validateUrlPort}))?', { validateUrlUserinfo: validateUrlUserinfo, validateUrlHost: validateUrlHost, validateUrlPort: validateUrlPort }, 'i');

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

// These URL validation pattern strings are based on the ABNF from RFC 3986
var validateUrlPchar = regexSupplant('(?:' + '#{validateUrlUnreserved}|' + '#{validateUrlPctEncoded}|' + '#{validateUrlSubDelims}|' + '[:|@]' + ')', { validateUrlUnreserved: validateUrlUnreserved, validateUrlPctEncoded: validateUrlPctEncoded, validateUrlSubDelims: validateUrlSubDelims }, 'i');

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var validateUrlFragment = regexSupplant(/(#{validateUrlPchar}|\/|\?)*/i, {
  validateUrlPchar: validateUrlPchar
});

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var validateUrlPath = regexSupplant(/(\/#{validateUrlPchar}*)*/i, {
  validateUrlPchar: validateUrlPchar
});

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var validateUrlQuery = regexSupplant(/(#{validateUrlPchar}|\/|\?)*/i, {
  validateUrlPchar: validateUrlPchar
});

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var validateUrlScheme = /(?:[a-z][a-z0-9+\-.]*)/i;

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

// Modified version of RFC 3986 Appendix B
var validateUrlUnencoded = regexSupplant('^' + // Full URL
'(?:' + '([^:/?#]+):\\/\\/' + // $1 Scheme
')?' + '([^/?#]*)' + // $2 Authority
'([^?#]*)' + // $3 Path
'(?:' + '\\?([^#]*)' + // $4 Query
')?' + '(?:' + '#(.*)' + // $5 Fragment
')?$', 'i');

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var validateUrlUnicodeSubDomainSegment = /(?:(?:[a-z0-9]|[^\u0000-\u007f])(?:(?:[a-z0-9_\-]|[^\u0000-\u007f])*(?:[a-z0-9]|[^\u0000-\u007f]))?)/i;

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var validateUrlUnicodeDomainSegment = /(?:(?:[a-z0-9]|[^\u0000-\u007f])(?:(?:[a-z0-9\-]|[^\u0000-\u007f])*(?:[a-z0-9]|[^\u0000-\u007f]))?)/i;

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

// Unencoded internationalized domains - this doesn't check for invalid UTF-8 sequences
var validateUrlUnicodeDomainTld = /(?:(?:[a-z]|[^\u0000-\u007f])(?:(?:[a-z0-9\-]|[^\u0000-\u007f])*(?:[a-z0-9]|[^\u0000-\u007f]))?)/i;

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

// Unencoded internationalized domains - this doesn't check for invalid UTF-8 sequences
var validateUrlUnicodeDomain = regexSupplant(/(?:(?:#{validateUrlUnicodeSubDomainSegment}\.)*(?:#{validateUrlUnicodeDomainSegment}\.)#{validateUrlUnicodeDomainTld})/i, {
  validateUrlUnicodeSubDomainSegment: validateUrlUnicodeSubDomainSegment,
  validateUrlUnicodeDomainSegment: validateUrlUnicodeDomainSegment,
  validateUrlUnicodeDomainTld: validateUrlUnicodeDomainTld
});

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var validateUrlUnicodeHost = regexSupplant('(?:' + '#{validateUrlIp}|' + '#{validateUrlUnicodeDomain}' + ')', { validateUrlIp: validateUrlIp, validateUrlUnicodeDomain: validateUrlUnicodeDomain }, 'i');

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var validateUrlUnicodeAuthority = regexSupplant(
// $1 userinfo
'(?:(#{validateUrlUserinfo})@)?' +
// $2 host
'(#{validateUrlUnicodeHost})' +
// $3 port
'(?::(#{validateUrlPort}))?', { validateUrlUserinfo: validateUrlUserinfo, validateUrlUnicodeHost: validateUrlUnicodeHost, validateUrlPort: validateUrlPort }, 'i');

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

function isValidMatch(string, regex, optional) {
  if (!optional) {
    // RegExp["$&"] is the text of the last match
    // blank strings are ok, but are falsy, so we check stringiness instead of truthiness
    return typeof string === 'string' && string.match(regex) && RegExp['$&'] === string;
  }

  // RegExp["$&"] is the text of the last match
  return !string || string.match(regex) && RegExp['$&'] === string;
}

var isValidUrl$1 = function (url, unicodeDomains, requireProtocol) {
  if (unicodeDomains == null) {
    unicodeDomains = true;
  }

  if (requireProtocol == null) {
    requireProtocol = true;
  }

  if (!url) {
    return false;
  }

  var urlParts = url.match(validateUrlUnencoded);

  if (!urlParts || urlParts[0] !== url) {
    return false;
  }

  var scheme = urlParts[1],
      authority = urlParts[2],
      path = urlParts[3],
      query = urlParts[4],
      fragment = urlParts[5];

  if (!((!requireProtocol || isValidMatch(scheme, validateUrlScheme) && scheme.match(/^https?$/i)) && isValidMatch(path, validateUrlPath) && isValidMatch(query, validateUrlQuery, true) && isValidMatch(fragment, validateUrlFragment, true))) {
    return false;
  }

  return unicodeDomains && isValidMatch(authority, validateUrlUnicodeAuthority) || !unicodeDomains && isValidMatch(authority, validateUrlAuthority);
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var isValidUsername = function (username) {
  if (!username) {
    return false;
  }

  var extracted = extractMentions(username);

  // Should extract the username minus the @ sign, hence the .slice(1)
  return extracted.length === 1 && extracted[0] === username.slice(1);
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var regexen = {
  astralLetterAndMarks: astralLetterAndMarks,
  astralNumerals: astralNumerals,
  atSigns: atSigns,
  bmpLetterAndMarks: bmpLetterAndMarks,
  bmpNumerals: bmpNumerals,
  cashtag: cashtag,
  codePoint: codePoint,
  cyrillicLettersAndMarks: cyrillicLettersAndMarks,
  endHashtagMatch: endHashtagMatch,
  endMentionMatch: endMentionMatch,
  extractUrl: extractUrl,
  hashSigns: hashSigns,
  hashtagAlpha: hashtagAlpha,
  hashtagAlphaNumeric: hashtagAlphaNumeric,
  hashtagBoundary: hashtagBoundary,
  hashtagSpecialChars: hashtagSpecialChars,
  invalidChars: invalidChars,
  invalidCharsGroup: invalidCharsGroup,
  invalidDomainChars: invalidDomainChars,
  invalidUrlWithoutProtocolPrecedingChars: invalidUrlWithoutProtocolPrecedingChars,
  latinAccentChars: latinAccentChars,
  nonBmpCodePairs: nonBmpCodePairs,
  punct: punct,
  rtlChars: rtlChars,
  spaces: spaces,
  spacesGroup: spacesGroup,
  urlHasHttps: urlHasHttps,
  urlHasProtocol: urlHasProtocol,
  validAsciiDomain: validAsciiDomain,
  validateUrlAuthority: validateUrlAuthority,
  validateUrlDecOctet: validateUrlDecOctet,
  validateUrlDomain: validateUrlDomain,
  validateUrlDomainSegment: validateUrlDomainSegment,
  validateUrlDomainTld: validateUrlDomainTld,
  validateUrlFragment: validateUrlFragment,
  validateUrlHost: validateUrlHost,
  validateUrlIp: validateUrlIp,
  validateUrlIpv4: validateUrlIpv4,
  validateUrlIpv6: validateUrlIpv6,
  validateUrlPath: validateUrlPath,
  validateUrlPchar: validateUrlPchar,
  validateUrlPctEncoded: validateUrlPctEncoded,
  validateUrlPort: validateUrlPort,
  validateUrlQuery: validateUrlQuery,
  validateUrlScheme: validateUrlScheme,
  validateUrlSubDelims: validateUrlSubDelims,
  validateUrlSubDomainSegment: validateUrlSubDomainSegment,
  validateUrlUnencoded: validateUrlUnencoded,
  validateUrlUnicodeAuthority: validateUrlUnicodeAuthority,
  validateUrlUnicodeDomain: validateUrlUnicodeDomain,
  validateUrlUnicodeDomainSegment: validateUrlUnicodeDomainSegment,
  validateUrlUnicodeDomainTld: validateUrlUnicodeDomainTld,
  validateUrlUnicodeHost: validateUrlUnicodeHost,
  validateUrlUnicodeSubDomainSegment: validateUrlUnicodeSubDomainSegment,
  validateUrlUnreserved: validateUrlUnreserved,
  validateUrlUserinfo: validateUrlUserinfo,
  validCashtag: validCashtag,
  validCCTLD: validCCTLD,
  validDomain: validDomain,
  validDomainChars: validDomainChars,
  validDomainName: validDomainName,
  validGeneralUrlPathChars: validGeneralUrlPathChars,
  validGTLD: validGTLD,
  validHashtag: validHashtag,
  validMentionOrList: validMentionOrList,
  validMentionPrecedingChars: validMentionPrecedingChars,
  validPortNumber: validPortNumber,
  validPunycode: validPunycode,
  validReply: validReply,
  validSubdomain: validSubdomain,
  validTcoUrl: validTcoUrl,
  validUrlBalancedParens: validUrlBalancedParens,
  validUrlPath: validUrlPath,
  validUrlPathEndingChars: validUrlPathEndingChars,
  validUrlPrecedingChars: validUrlPrecedingChars,
  validUrlQueryChars: validUrlQueryChars,
  validUrlQueryEndingChars: validUrlQueryEndingChars
};

// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

var index = {
  autoLink: autoLink,
  autoLinkCashtags: autoLinkCashtags,
  autoLinkEntities: autoLinkEntities,
  autoLinkHashtags: autoLinkHashtags,
  autoLinkUrlsCustom: autoLinkUrlsCustom,
  autoLinkUsernamesOrLists: autoLinkUsernamesOrLists,
  autoLinkWithJSON: autoLinkWithJSON,
  configs: configs,
  convertUnicodeIndices: convertUnicodeIndices$2,
  extractCashtags: extractCashtags,
  extractCashtagsWithIndices: extractCashtagsWithIndices,
  extractEntitiesWithIndices: extractEntitiesWithIndices,
  extractHashtags: extractHashtags,
  extractHashtagsWithIndices: extractHashtagsWithIndices,
  extractHtmlAttrsFromOptions: extractHtmlAttrsFromOptions,
  extractMentions: extractMentions,
  extractMentionsOrListsWithIndices: extractMentionsOrListsWithIndices,
  extractMentionsWithIndices: extractMentionsWithIndices,
  extractReplies: extractReplies,
  extractUrls: extractUrls,
  extractUrlsWithIndices: extractUrlsWithIndices,
  getTweetLength: getTweetLength,
  getUnicodeTextLength: getUnicodeTextLength,
  hasInvalidCharacters: hasInvalidCharacters,
  hitHighlight: hitHighlight,
  htmlEscape: htmlEscape,
  isInvalidTweet: isInvalidTweet,
  isValidHashtag: isValidHashtag,
  isValidList: isValidList,
  isValidTweetText: isValidTweetText,
  isValidUrl: isValidUrl$1,
  isValidUsername: isValidUsername,
  linkTextWithEntity: linkTextWithEntity,
  linkToCashtag: linkToCashtag,
  linkToHashtag: linkToHashtag,
  linkToMentionAndList: linkToMentionAndList,
  linkToText: linkToText,
  linkToTextWithSymbol: linkToTextWithSymbol,
  linkToUrl: linkToUrl,
  modifyIndicesFromUTF16ToUnicode: modifyIndicesFromUTF16ToUnicode,
  modifyIndicesFromUnicodeToUTF16: modifyIndicesFromUnicodeToUTF16,
  regexen: regexen,
  removeOverlappingEntities: removeOverlappingEntities,
  parseTweet: parseTweet,
  splitTags: splitTags,
  tagAttrs: tagAttrs
};

return index;

})));
