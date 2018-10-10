/**
 * Copyright 2018 Twitter, Inc.
 * Licensed under the Apache License, Version 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 */
// Generates compact regex fragments to simulate the functionality of Objective C in other languages

import scala.io.Source
    
def allMatches(re: scala.util.matching.Regex) = ((0 to 0xD7FF)++(0xE000 to 0x10FFFF)).filterNot(i => re.findFirstIn(new String(Array(i), 0, 1)).isEmpty)  

def charRanges(ccs: Seq[Int]) = ccs.foldLeft(Seq[(Int, Int)]()) { case (((r1, r2) :: t), i) => if (i == r2 + 1) (r1, i) :: t else (i,i) :: (r1,r2) :: t; case (Nil, i) => (i,i) :: Nil }.reverse
def utf16Pair(cc: Int) = if (cc < 0x10000) Seq(cc) else Seq(0xd800 + (((cc - 0x10000) >> 10) & 0x3ff), 0xdc00 + (cc & 0x3ff))    
def isPrintableChar(cc: Int) = cc < 0xff && "\\w".r.findFirstIn("%c".format(cc)).isDefined
def escJavaChar(cc: Int) = utf16Pair(cc).map { case cu => (if (isPrintableChar(cu)) "%c" else if (cu < 0x100) "\\\\x%02x" else "\\\\u%04x").format(cu) }.mkString
def escJavaScriptChar(cc: Int) = utf16Pair(cc).map { case cu => (if (isPrintableChar(cu)) "%c" else if (cu < 0x100) "\\x%02x" else "\\u%04x").format(cu) }.mkString
def escRubyChar(cc: Int) = (if (isPrintableChar(cc)) "%c" else if (cc < 0x10000) "\\u%04x" else "\\u{%x}").format(cc)
def escObjCChar(cc: Int) =  (if (isPrintableChar(cc)) "%c" else if (cc < 0x100) "\\x%02x" else if (cc < 0x10000) "\\u%04x" else "\\U%08x").format(cc)
def joinCharClass(items: Seq[String]) = items.mkString(if (items.length > 1) "[" else "", "", if (items.length > 1) "]" else "") 
def joinGroup(items: Seq[String]) = items.mkString(if (items.length > 1) "(?:" else "", "|", if (items.length > 1) ")" else "") 

def formatRanges(rs: Seq[(Int, Int)], esc: Int => String) = rs.flatMap { case (r1, r2) => if (r1 == r2) Seq(esc(r1)) else if (r1 == r2 - 1) Seq(esc(r1), esc(r2)) else Seq(esc(r1), "-", esc(r2)) }
def groupByUtf16(ccs: Seq[Int]) = ccs.map { utf16Pair(_).+:(-1).takeRight(2) }.groupBy { _.head }.toList.sortBy { _._1 }.map { case (g, items) => Seq(if (g < 0) Nil else Seq(g), items.map { _.last} ) }

def regexForJava(ccs: Seq[Int]) = formatRanges(charRanges(ccs), escJavaChar).mkString
def regexForJavaScript(ccs: Seq[Int]) = groupByUtf16(ccs).map { _.map { case cs => joinCharClass(formatRanges(charRanges(cs), escJavaScriptChar))}.mkString}.mkString("|")
def regexForRuby(ccs: Seq[Int]) = formatRanges(charRanges(ccs), escRubyChar).mkString
def regexForObjC(ccs: Seq[Int]) = joinCharClass(formatRanges(charRanges(ccs), escObjCChar))             

def formatMultilineJavaString(emojiRegex: String): String = {
  val lineRegex = ".{1,80}\\\\{0,2}[^\\\\]{0,5}(\\\\\\\\ud[c-f]\\\\w\\\\w)?".r
  val matches = lineRegex.findAllIn(emojiRegex)
  matches.mkString("\"", "\" +\n      \"", "\"")
}

def formatMultilineRubyRegex(emojiRegex: String): String = {
  val lineRegex = ".{1,92}[^\\\\]{0,9}".r
  val matches = lineRegex.findAllIn(emojiRegex)
  matches.mkString("\"", "\" +\n      \"", "\"")
}

def isAstral(n: Int): Boolean = n >= 0x10000
def hexToInt(s: String): Option[Int] = { try { Some(Integer.parseInt(s, 16)) } catch { case e: NumberFormatException => None }}

val lettersAndMarks = Source.fromFile("letters_and_marks_objc.txt").getLines.toList.flatMap(hexToInt)
val decimalNumbers = Source.fromFile("decimal_numbers_objc.txt").getLines.toList.flatMap(hexToInt)
val lettersAndMarksBasic = Source.fromFile("letters_and_marks_java_1_7_and_ruby_1_9.txt").getLines.toList.flatMap(hexToInt)
val decimalNumbersBasic = Source.fromFile("decimal_numbers_java_1_7_and_ruby_1_9.txt").getLines.toList.flatMap(hexToInt)
val additionalLettersAndMarks = lettersAndMarks.diff(lettersAndMarksBasic)
val additionalDecimalNumbers = decimalNumbers.diff(decimalNumbersBasic)


println("Regexes for Java/Scala\n")
println("  // Generated from unicode_regex/unicode_regex_groups.scala, more inclusive than Java's \\p{L}\\p{M}")
println(s"""  private static final String HASHTAG_LETTERS_AND_MARKS = "\\\\p{L}\\\\p{M}" +\n      ${formatMultilineJavaString(regexForJava(additionalLettersAndMarks))};\n""")
println("  // Generated from unicode_regex/unicode_regex_groups.scala, more inclusive than Java's \\p{Nd}")
println(s"""  private static final String HASHTAG_NUMERALS = "\\\\p{Nd}" +\n      ${formatMultilineJavaString(regexForJava(additionalDecimalNumbers))};\n""")

println("Regexes for Ruby\n")
println("    # Generated from unicode_regex/unicode_regex_groups.scala, more inclusive than Ruby's \\p{L}\\p{M}")
println(s"""    HASHTAG_LETTERS_AND_MARKS = "\\\\p{L}\\\\p{M}" +\n      ${formatMultilineRubyRegex(regexForRuby(additionalLettersAndMarks))}\n""")
println("    # Generated from unicode_regex/unicode_regex_groups.scala, more inclusive than Ruby's \\p{Nd}")
println(s"""    HASHTAG_NUMERALS = "\\\\p{Nd}" +\n      ${formatMultilineRubyRegex(regexForRuby(additionalDecimalNumbers))}\n""")

println("Regexes for JavaScript\n")
println("  // Generated from unicode_regex/unicode_regex_groups.scala, same as objective c's \\p{L}\\p{M}")
println(s"""  twttr.txt.regexen.bmpLetterAndMarks = /${regexForJavaScript(lettersAndMarks.filterNot(isAstral)).stripPrefix("[").stripSuffix("]")}/;""")
println(s"""  twttr.txt.regexen.astralLetterAndMarks = /${regexForJavaScript(lettersAndMarks.filter(isAstral))}/;""")
println("\n  // Generated from unicode_regex/unicode_regex_groups.scala, same as objective c's \\p{Nd}")
println(s"""  twttr.txt.regexen.bmpNumerals = /${regexForJavaScript(decimalNumbers.filterNot(isAstral)).stripPrefix("[").stripSuffix("]")}/;""")
println(s"""  twttr.txt.regexen.astralNumerals = /${regexForJavaScript(decimalNumbers.filter(isAstral))}/;""")

