const nodemail = require("nodemailer");
const express = require("express");
const cors = require("cors");
const path = require("path");
const body = require("body-parser");
const { console } = require("inspector");

const server = express();
server.use(cors());
server.use(express.json())
server.use(body.urlencoded({extended:false}))
server.use(body.json())

server.use(express.static(path.join(__dirname,"public")))
server.get("/",async(req,resp)=>{
    server.use(cors());
    return  resp.status(200).sendFile(path.join(__dirname,"public","home.html"))
})
server.post("/body",async(req,resp)=>{
    server.use(cors());
    
    console.log("entrou e os dados estão a chegar........")

    const sender = nodemail.createTransport({
        host:"smtp.gmail.com",
        port:"465",
        secure:true,
        auth:{

            user:req.body.meu_email,
        
            pass:req.body.chave
        },
        connectionTimeout: 300000,  // Ajuste o tempo de conexão
        greetingTimeout: 300000,    // Ajuste o tempo de saudação
        socketTimeout: 300000
    })

    await sender.sendMail({
        from:req.body.meu_email,
        to:req.body.email_dest,
        subject:req.body.tema,
        html:"<h4>"+req.body.sms+"</h4>", 
        text:req.body.sms
    }) 
    .then((response)=>{
        console.log(response)
        console.log("tudo ok e o emal foi enviado")
        return  resp.status(200).send({sms:"tudo ok no envio",response:JSON.stringify(req.body)})
    })
    .catch((err)=>{
        console.log(err)
        console.log("sinto muito mais houve um erro")
        if(err.code=="EAUTH"){
            return  resp.status(400).send({sms:"Falha de autenticação",error:err})
        }
        return  resp.status(400).send({sms:"erro ao enviar",error:err})
    })

    // console.log(req.body)
    // console.log(req.body.name)

})
server.post("/sms_gmail/:option",async(req,resp)=>{
    server.use(cors())
    const sender = nodemail.createTransport({
        host:"smtp.gmail.com",
        port:"465",
        secure:true,
        auth:{
            // user:"wallondolaila@gmail.com",
            //pass:"laila0101*"
            // pass:"yiag baer tkdl ajco"
            user:req.body.meu_email,
            // pass:"laila0101*"
            pass:req.body.chave
        },
        connectionTimeout: 300000,  // Ajuste o tempo de conexão
        greetingTimeout: 300000,    // Ajuste o tempo de saudação
        socketTimeout: 300000
    })
    
    console.log(req.params.option) 
    console.log(req.body)
    server.use(cors())
    
    let emails = [...req.body]
    let num=0;
    var dune = null;
    var sended = [];

   async function sender1(tos,nome,conteudos,temas){
        if(req.params.option==1){
            server.use(cors())
            let tema = temas;
            let cliente = nome;
            let email = tos;
            let conteudo = conteudos;
            console.log(cliente)
            await sender1.sendMail({
                // de momento tá fixo , depois vai ser dinamico , se aceitarem , mas eu vou faze-lo 
                //só pra teste e agregação de conhecimento
                from:"wallondolaila@gmail.com",
                to:email,
                subject:tema,
                html:"<h4>"+conteudo+"</h4>"+"</br>"+`<a href=${cliente}> Esplorar </a>`, 
                text:conteudo
            }) 
            //teste de acrescimo
            .then((response)=>{
            console.log("tudo fine aqui")
                console.log("enviado com exito a : "+tos)
            return  resp.status(201).send({sms:"tudo feito",gmail:tema+"/"+cliente+"/"+conteudo})
            })
            .catch((err)=>{
            console.log(err)
            console.log("deu erro aqui")

            return  resp.status(400).send({sms:"erro ao enviar pra um o de envio",erro:err})
            })
        }
    }

    async  function send2(tos,temas,conteudos){
        let email = tos;
        let tema = temas;
        let conteudo = conteudos;
        await sender.sendMail({
            // de momento tá fixo , depois vai ser dinamico , se aceitarem , mas eu vou faze-lo 
            //só pra teste e agregação de conhecimento
            from:"wallondolaila@gmail.com",
            to:email,
            subject:tema,
            html:"<h4>"+conteudo+"</h4>"+"</br>", 
            text:conteudo
        }) 
        //teste de acrescimo
        .then((response)=>{
            console.log("Email enviado para : "+tos)
            sended.unshift({destino:tos,conteudo:conteudos,tema:temas})
            dune = true;
            num++;
            console.log(num)
            // aqui está o teste pra ver se enviou tudo , baseando na quantidade do enviado pra cá pelo front
            if(num>=gmails.length){
                if(dune==false){
                    console.log("deu erro ao enviar");
                    return  resp.status(400).send({sms:"err o de envio"})
                }else if(dune==true){
                    console.log("saiu")
                    console.log("saiu do loop e entregou tudo")
                    
                    return  resp.status(201).send({sms:"tudo feito",sended})
                }
            }
        })
        .catch((err)=>{
            console.log(err)
            console.log("deu erro aqui")

            dune=false;
        })
        console.log("saiu")
    }
    var gmails = [...req.body]
    // baseando-se no parametro , ele ve se é pra multiplos ou se é só pra um destinatário
    if(req.params.option==2){
        gmails.map( async(email,pos)=>{
            send2(email.to,email.tema,email.conteudo)
            await delay(500)
            console.log("saiu do loop")
        })
        console.log("saiu e chegou ao fim de tudo")
    }
    // falta de 1 destinatário
   if(req.params.option==1){
            //para um destinatário pegaremos os dados do formulário , mas amanhã
        //     tema:tema.current.value,cliente:cliente.current.value,
        //     conteudo:conteudo.current.value,email:email.current.value}])
           sender1(emails[0].email,emails[0].cliente,emails[0].conteudo,emails[0].tema)
           console.log(gmails);
            await delay(500) 
    }
    function delay(params) {
        return new Promise((resolve)=>{
            setTimeout(resolve,params)
        })
        
    }
})

server.listen(3001,()=>{
    console.log("server sms_gmail rodando na porta 3001")
})
