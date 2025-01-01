<?php

require 'vendor/autoload.php'; // Inclui autoload do Composer para PHPMailer e Slim

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Slim\Factory\AppFactory;

$app = AppFactory::create();

$app->addBodyParsingMiddleware(); // Suporte para JSON no corpo das requisições

$app->post('/sms_gmail/{option}', function ($request, $response, $args) {
    $option = $args['option'];
    $emails = $request->getParsedBody();

    $mail = new PHPMailer(true);

    // Configurações do SMTP
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'wallondolaila@gmail.com';
    $mail->Password = 'yiag baer tkdl ajco'; // Insira a senha do aplicativo
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;

    $mail->setFrom('wallondolaila@gmail.com', 'Seu Nome');

    $sended = [];
    $errors = [];

    function delay($milliseconds)
    {
        usleep($milliseconds * 1000); // Converte milissegundos para microssegundos
    }

    if ($option == 2) {
        foreach ($emails as $emailData) {
            try {
                $mail->addAddress($emailData['to']);
                $mail->Subject = $emailData['tema'];
                $mail->Body = '<h4>' . $emailData['conteudo'] . '</h4>';
                $mail->AltBody = $emailData['conteudo'];
                $mail->isHTML(true);

                $mail->send();
                $sended[] = [
                    'destino' => $emailData['to'],
                    'conteudo' => $emailData['conteudo'],
                    'tema' => $emailData['tema']
                ];
                $mail->clearAddresses(); // Limpa os destinatários para evitar problemas no próximo loop
                delay(500); // Adiciona delay para evitar limitação de envio
            } catch (Exception $e) {
                $errors[] = [
                    'destino' => $emailData['to'],
                    'erro' => $mail->ErrorInfo
                ];
            }
        }

        $responseData = [
            'status' => 'finalizado',
            'enviados' => $sended,
            'erros' => $errors
        ];
        return $response->withJson($responseData, 201);
    }

    if ($option == 1) {
        $emailData = $emails[0];
        try {
            $mail->addAddress($emailData['email']);
            $mail->Subject = $emailData['tema'];
            $mail->Body = '<h4>' . $emailData['conteudo'] . '</h4>' . '<br><a href="' . $emailData['cliente'] . '">Explorar</a>';
            $mail->AltBody = $emailData['conteudo'];
            $mail->isHTML(true);

            $mail->send();
            $sended[] = [
                'destino' => $emailData['email'],
                'conteudo' => $emailData['conteudo'],
                'tema' => $emailData['tema']
            ];

            return $response->withJson(['sms' => 'tudo feito', 'enviado' => $sended], 201);
        } catch (Exception $e) {
            return $response->withJson(['sms' => 'erro ao enviar', 'erro' => $mail->ErrorInfo], 400);
        }
    }

    return $response->withJson(['sms' => 'opção inválida'], 400);
});

$app->run();

