---
 title: "Ournote"
 author: [ Artur Queiroz , Luis Albuquerque ]
 date: ""
 subject: "Trabalho prático de Desemvolvimento Web"
 keywords: [NodeJs, Pug, Rede Social, Grupos]
 subtitle: "Rede Social"
 lang: "pt"
 titlepage: true
 abstract: Trabalho prático de Desemvolvimento Web
---
\newpage

\tableofcontents

\newpage

# Introdução
Já existem muitas redes sociais, umas mais voltadas para partilhar fotos, outras para partilhar o estado das pessoas, e outras até mais
focadas no mundo de trabalho, no entanto não existem assim tantas focadas em desemvolvimento e partilha de notas entre alunos.
Com isso em conta, desemvolvemos Ournote, que é uma rede social focada em alunos, organizada em grupos e em páginas, onde o contéudo pode 
ser organizado como num caderno, mas com a vantagem de aqui ser permitido facilmente trocar a ordem dos textos, imagens, ficheiros, etc.
Os grupos são constituidos por páginas, e uma página esta organizada por uma meta linguagem, desemvolvida por nós, que permite distingir 
títulos de difrentes importâncias, criar paragrafos, listas de paragrafos. imagens, eventos, pdfs, e até ficheiros distintos para fazer download.

# Modelo
No nosso modelo os nossos modelos foram distingidos em duas classes, users e groups.

## Users
TODO: COMENTARIOS



    name: String, 
    email : { 
             type: String,
             unique: true,
             lowercase: true,
             required: true 
           },
    password: { 
            type: String,
            required: true 
            },
    favourite: [ String ],

## Groups
TODO: COMENTARIOS



    var eventSchema = new mongoose.Schema({
        title : String,
        data  : String
    });
    var card_Schema = new mongoose.Schema({
        p: String,
        img: String,
        pdf: String,
        h1: String,
        h2: String,
        h3: String,
        a: String,
        file : String,
        list : [String],
        comment : [String],
        event : eventSchema,
        tags : [String]
    });

    var PATH  = String;
    var EMAIL = String;

    var groupSchema = new mongoose.Schema({
        path : { //id
                type :String, 
                unique: true,
                required: true
            },
        id_creator: EMAIL,
        name: { 
                 type: String,
                 required: true 
               },
        tags : [String],
        sub_groups : [ PATH ],
        read_perm  : [ EMAIL ],
        write_perm : [ EMAIL ],
        page       : [ card_Schema ],
      });


# Esquema 
Nós dividimos o trabalho em dois servidores (API e Interface) e clientes.
## API
### GET


    /root/*?token=TOKEN
    /profile?token=TOKEN&email=EMAIL
    /profile?token=TOKEN&email=EMAIL&tag=TAG
    /user/:email?token=TOKEN


### POST


    /root/*?token=TOKEN&update=comment
    /root/*?token=TOKEN&update=add
    /root/*?token=TOKEN&update=remove
    /root/*?token=TOKEN&type=file
    /root/*?token=TOKEN // add group

    /login?token=TOKEN&user=USER
    /favourite?token=TOKEN&email=EMAIL&path=PATH
    /register



### PUT


    /root/*?token=TOKEN&type=TYPE

### DELETE


    /root/*?token=TOKEN




## Interface

### GET


    / 
    /register 
    /profile?tag=TAG
    /logout
    /root/* 

    



### POST


    /add_favourite?path=PATH
    /register
    /login
    root/*?update=add
    root/*?update=remove
    root/*?update=comment
    root/*?type=TYPE




### PUT


    root/*

### DELETE


    root/*



## Cliente

# Niveis de permissão

# Conclusão
Ao longo desta jornada, encontramos diversos desafios, quer na discucão e esquematização da solução, como na própria 
implementação, como decidir qual seria a nossa abordgem e ao facto de termos usado javascript, e isso nos trazer muitos problemas
na hora de debugging, uma vez que os erros muitas vezes ficam perdidos entre a API e a Interface, mas tendo o postman podemos
testar individualmente a API, e com isso identificar mais facilmente a razão do problema.
No fim de contas, conseguimos apresentar uma rede social funcional, com uma proposta bem original, que acreditamos que consiga ser utíl
para estudantes organizarem seus trabalhos, e a sua vida escolar.

## Trabalho futuro
No nosso trabalho, usamos uma meta linguagem para representar as páginas dos grupos, uma boa adição, seria adicionarmos
elementos recursivas e outras funcionalidades, como canvas e suporte de videos, etc.
Podiamos criar um parser, e com ajuda do pandoc convertermos as páginas em pdf, powerpoint, word, epub, etc.
Infelizmente, não conseguimos fazer autênticação de ficheiros, apesar de termos tentado de diversas formas, acrescentar isso, seria 
fulcral para um bom funcionamento da aplicação.
Outra coisa, menos importante, mas que seria mais conveniente para o utilizador, era ocultarmos as páginas que o utilizador não tem premissão
de leitura.
Neste momento, é possivel acrescentar favoritos, mas não elimina-los, isso seria uma boa adição.