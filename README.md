# sms_gmail_api
## Descrição sobre a API
Ela consiste em uma automação de desparos de sms via gmail , provenientes da sua conta!
Com a finalidade de ser incorporada a projetos de CRM e não só....
## Estado de desenvolvimento
Enbora ela se encontra funcional e online até ao mometo, 
ainda resta inplementar alguma funcionalidades, no intuito de dixa-lá mais segura
## Instruções de uso
A mesma recebe uma requisição via post com um arrey contendo um objecto com os dados necessários como :  
1:Nome do Emissor  
2:A chave de acesso. (Chve gerada pelo GOogle que permite o uso de APIs de terceiros)  
3:Email do emissor  
4:Nome do receptor  
5:Email do destinatario  
6:Tema da sms  
7: A sms do email  
## Estrutura de envio
#### Via fetch : 
ATT:os nomes das propriedades são orbigatórios
```
async function enviarDados() {
  try {
    const response = await fetch("https://sms-gmail-api.vercel.app/body" , {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Maria',
        chave:chave_da_conta_do_email,
        meu_email:email_emissor,
        destinatario:Nome_receptor,
        email_dest:email_destinatario,
        tema:Tema do email,
        sms:corpo_da_mensagem
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const data = await response.json();
    console.log('Resposta do servidor:', data);
  } catch (error) {
    console.error('Erro:', error);
  }
}

enviarDados();  
```
### Via formulário
ATT: os nomes dos formulários são obrigatórios
```
 <form id="form" action="https://sms-gmail-api.vercel.app/body" method="post">
            <span class="em" id="em"><img src="./public/e1.jpg" alt=""></span>
            <div>
                <label for="name">Nome </label>
                <input name="name" type="text" id="name" class="name" placeholder="Seu nome :  ">
            </div>
            <div>
                <label for="chave">Chave de acesso</label>
                <input name="chave" type="text" id="chave" class="chave" placeholder="Chave de acesso : ">
            </div>
            <div>
                <label for="meu_email">Seu email</label>
                <input name="meu_email" type="email" required class="meu_email" id="meu_email" placeholder="Seu email">
            </div>
            <div>
                <label for="destinatario">Nome do Destinatário</label>
                <input name="destinatario" type="text" id="destinatario" class="destinatario" required placeholder="Nome do receptor : ">
            </div>
            <div>
                <label for="email_dest">Email Destinatário</label>
                <input name="email_dest" type="email" required class="email_dest" id="email_dest" placeholder="Email de destino : ">
            </div>
            <div>
                <label for="assunto">Tema</label>
                <input name="tema" type="text" required class="assunto" id="assunto" placeholder="Tema do assunto em questão : ">
            </div>
            <div>
                <label for="sms">Mensagem</label>
                <input name="sms" type="text" required id="sms" class="sms" placeholder="Mensagem a enviar : ">
            </div>

            <div>
                <input type="submit" name="send_email" id="send_email" class="send_email">
            </div>
        </form>
```


## Autor
Jose 
## Contacto
whats : 941137038




