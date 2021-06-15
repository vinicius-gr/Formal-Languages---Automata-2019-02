import pydot
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
from shutil import copyfile


main = "main.dot"
runtime = "runtime.dot"

string_vazia = 'ε' 
def get_label(word, stack, newStack):
    if(word == ''):
        word=string_vazia
    if (stack == ''):
        stack = string_vazia
    if(newStack == ''):
        newStack = string_vazia
    return f"{word}, {stack}/{newStack}"

# Dado o arquivo construtor modificado, mostra o automato contido
def cria_imagem(image_name):
    image_path = f"{image_name}.png"
 
    (graph,) = pydot.graph_from_dot_file(runtime)
    graph.write_png(image_path)
 
    img = mpimg.imread(image_path)
    plt.imshow(img)
    plt.show()
    
# Gera o arquivo necessário para mostrar o automato que está sendo utilizado
def cria_automato_file(productions, estado_inicial, estado_final): 
    end_state = ''
 
    for estado in estado_final:
        end_state += f"{estado} "
 
    transicoes = ''
    for estado in productions:
        lista_transicoes = productions[estado]
        for transicao in lista_transicoes:
            pilha_final = "".join(transicao[2])
            transicoes += f"\n\t{estado} -> {transicao[3]} [label = \"{get_label(transicao[0],transicao[1],pilha_final)}\"]"
 
    func_transicao = transicoes
    # copia()
    copyfile(main, runtime)
    
    with open('runtime.dot', 'r+') as file:
        
        automato_builder = file.read()
        file.seek(0)
        automato_builder = automato_builder.replace("START_NODE", estado_inicial)
        if(end_state == ''):
            automato_builder = automato_builder.replace("END_NODE;", '')
        else:
            automato_builder = automato_builder.replace("END_NODE", end_state)
 
        automato_builder = automato_builder.replace("TRANSITIONS", func_transicao)

 
        file.write(automato_builder)
