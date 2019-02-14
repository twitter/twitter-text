# Copyright 2019 Robert Sayre
# Licensed under the Apache License, Version 2.0
# http://www.apache.org/licenses/LICENSE-2.0

import patricia
import yaml
from sets import Set

import codecs
import sys

UTF8Writer = codecs.getwriter('utf8')
sys.stdout = UTF8Writer(sys.stdout)

with open("tld_lib.yml", 'r') as stream:
    try:
        tld_structure = yaml.load(stream)
    except yaml.YAMLError as exc:
        print(exc)

    tlds = Set()
    for kind in tld_structure.values():
        for element in kind:
            idna = element.encode('idna')
            if idna != element:
                tlds.add(idna)
            tlds.add(element)

t = patricia.trie()
for word in tlds:
    t[word] = True

def values(node, edges):
    if node._value is not patricia.__NON_TERMINAL__:
        yield edges, node._value
    for edge, child in node._edges.values():
        for edge, value in values(child, edges + [edge]):
            yield edge, value

root = dict()
terminal = "_terminal_"
for edges, value in values(t, []):
    current_dict = root
    for edge in edges:
        current_dict = current_dict.setdefault(edge, {})
    current_dict[terminal] = True

def gen_prelude(prefix, indent, has_children):
    prelude = ""
    if prefix != "":
        prelude = indent + prefix
        if has_children:
            prelude += " ~" + "\n" + indent + "  ("
    return prelude

def is_ascii(s):
    return all(ord(c) < 128 for c in s)

def gen_literal(s):
    literal = ""
    if is_ascii(s):
        literal += "^"
    return literal + '"%s"' % s

def print_pest(prefix, node, indent):
    is_terminal = node.pop(terminal, False)
    has_children = len(node.keys()) > 0
    prelude = gen_prelude(prefix, indent, has_children)
    if prelude != "":
        print(prelude)

    # Make sure ascii is at the top of the list,
    # because Pest has an ordered-choice operator.
    keys = node.keys()
    keys.sort()

    for idx, k in enumerate(keys):
        literal = gen_literal(k)
        if idx > 0:
            literal = "| " + literal
        print_pest(literal, node[k], indent + "   ")

    if is_terminal and has_children:
        print(indent + "  )?")
    elif prelude != "" and has_children:
        print(indent + "  )")

print("tld = _{")
print_pest("", root, "  ")
print("}")
