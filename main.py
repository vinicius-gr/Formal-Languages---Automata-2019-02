#!/usr/bin/python
# -*- coding: utf-8 -*-
import os

start_input = ""  # palavra
found = 0  # flag caso o AP aceitar a palavra (palavra vazia && pilha vazia) || (palavra vazia && estado final)
accepted_config = []  # configuração final aceitada pelo AP


# Regras de produção ("símbolo", "pop pilha", "push pilha", "próximo estado")
productions = {}

# Q
states = []

# Σ
symbols = []

# Γ
stack_symbols = []

# estado inicial
start_state = ""

# pilha inicial
stack_start = ""

# lista de estados finais
acceptable_states = []

# E - aceita por pilha vazia || F - aceita por estado final
accept_with = ""


# recursivamente gera toda a árvore de possibilidades e termina em caso de sucesso
def generate(state, input, stack, config):
    global productions
    global found

    total = 0

    # verifica se outro nó da árvore já chegou na solução
    if found:
        return 0

    # valida se encontrou a aceitação da palavra
    if is_found(state, input, stack):
        found = 1  # seta a flag de aceite para que outros nós saibam que já encontramos a solução e finalizem

        # add configuração de sucesso (caminho)
        accepted_config.extend(config)

        return 1

    # checa se existe movimentos restantes
    moves = get_moves(state, input, stack, config)
    if len(moves) == 0:
        return 0

    # para cada possível movimento gera outra árvore recursivamente
    for i in moves:
        total = total + generate(i[0], i[1], i[2],
                                 config + [(i[0], i[1], i[2])])

    return total


# retorna as possíveis transições a partir da tupla (estado, entrada, pilha, config)
def get_moves(state, input, stack, config):
    global productions

    moves = []

    for i in productions:

        if i != state:
            continue

        for j in productions[i]:
            # print j
            current = j
            new = []

            new.append(current[3])

            # leitura do símbolo caso houver algum
            if len(current[0]) > 0:
                if len(input) > 0 and input[0] == current[0]:
                    new.append(input[1:])
                else:
                    continue
            else:
                new.append(input)

            # leitura do topo da pilha
            if len(current[1]) > 0:
                if len(stack) > 0 and stack[0] == current[1]:
                    new.append(current[2] + stack[1:])
                else:
                    continue
            else:
                new.append(current[2])

            moves.append(new)

    return moves


# valida se os critérios de aceite foram atingidos
def is_found(state, input, stack):
    global accept_with
    global acceptable_states

    # confere se todos os símbolos foram lidos
    if len(input) > 0:
        return 0

    # aceitação por pilha vazia senão por estado final
    if accept_with == "E":
        if len(stack) < 1:  # aceita por pilha vazia
            return 1

        return 0

    else:
        for i in acceptable_states:
            if i == state:  # aceita por estado final
                return 1

        return 0


# printa a configuração atual
def print_config(config):
    for i in config:
        print i


def parse_file(filename):
    global productions
    global start_state
    global start_stack
    global acceptable_states
    global accept_with

    try:
        lines = [line.rstrip() for line in open(filename)]

    except:
        return 0

    # add estado inicial
    start_state = lines[3]

    # add símbolo inicial da pilha
    start_stack = lines[4]

    # lista de estados de aceitação
    acceptable_states.extend(lines[5].split())

    # E - aceita por pilha vazia F - aceita por estado final
    accept_with = lines[6]

    # add rules
    for i in range(7, len(lines)):
        production = lines[i].split()

        configuration = [(production[1], production[2],
                          production[4], production[3])]

        if not production[0] in productions.keys():
            productions[production[0]] = []

        configuration = [tuple(s if s != "e" else "" for s in tup) for tup in configuration]

        productions[production[0]].extend(configuration)

    printStatusQuo()

    return 1


# Aceite ou não da palavra
def done():
    if found:
        print "Uhul! Palavra \"" + start_input + "\" faz parte da linguagem."
    else:
        print "Eita! Palavra \"" + start_input + "\" não faz parte da linguagem."

def printStatusQuo():
    global productions
    global start_state
    global start_stack
    global acceptable_states
    global accept_with
    print productions
    print start_state
    print start_stack
    print acceptable_states
    print accept_with

def convertPDA():
    global productions
    global start_stack
    global acceptable_states
    global accept_with

    start_stack = ""
    start_stack = "ZX"
    if accept_with == "F":
        accept_with = "E"
        for state in acceptable_states:
            productions[state] = []
            productions[state].extend([('', '', '', 'E')])
        acceptable_states = []

    elif accept_with == "E":
        accept_with = "F"
        acceptable_states = ["F"]
        for (k,v) in productions.items():
            productions[k].extend([('', 'X', 'X', 'F')])

    printStatusQuo()
        
# UI
# Leitura do arquivo
filename = raw_input("Por favor, entre com o nome do arquivo:\n")
while not parse_file(filename):
    print "Arquivo não encontrado!"
    filename = raw_input("Por favor, entre com o nome do arquivo de novo:\n")
print "AP construído."

start_input = raw_input("Por favor, digite a palavra:\n")
print "Conferindo a palavra \"" + start_input + "\" ..."

while start_input != "fim":
    found = 0
    accepted_config = []
    if start_input == "converter":
        convertPDA()
    # A mágica comeca aqui!
    elif not generate(start_state, start_input, start_stack, [(start_state, start_input, start_stack)]):
        done()
    else:
        # printa lista de configurações de aceitação
        print_config(accepted_config)
        done()

    start_input = raw_input("Digite a próxima palavra, ou \'converter\' or \'fim\' para terminar o programa:\n")
    print "Conferindo a palavra \"" + start_input + "\" ..."
