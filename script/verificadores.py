import math
import os
import random
import re
import sys

def forcaSenha(password):
    errors = []

    if not re.search(r'[0-9]', password):
        errors.append("num")
    if not re.search(r'[a-z]', password):
        errors.append("minLyr")
    if not re.search(r'[A-Z]', password):
        errors.append("maiLyr")
    if not re.search(r'[!@#$%^&*()\-+.,]', password):
        errors.append("exChar")
    if not (len(password) >= 6):
        errors.append("min")

    for x in errors:
        print(x)
def validCpf(cpf):
    cpf = ''.join(filter(str.isdigit, cpf))
    if len(cpf) != 11:
        return False

    if cpf == cpf[0] * 11:
        return False

    soma = sum(int(cpf[i]) * (10 - i) for i in range(9))
    primeiro_digito = (soma * 10 % 11) % 10
    soma = sum(int(cpf[i]) * (11 - i) for i in range(10))
    segundo_digito = (soma * 10 % 11) % 10

    return int(cpf[9]) == primeiro_digito and int(cpf[10]) == segundo_digito


password = input("Senha: ")
forcaSenha(password)
cpf = input("cpf: ")
print(validCpf(cpf))