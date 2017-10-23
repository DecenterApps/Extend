<?php

require_once __DIR__ . '/vendor/autoload.php';
use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;

const PRIVATE_KEY =
'MIIEowIBAAKCAQEAmD6mw7Wh3ymzoBHyH1a3A6+cUTw8vGT8grKb4059HplTN5UI
VBIo3jpSfE3dx8rEEB/jdnotrCxPj4b1+WxaMly7d2LmsGJny8DZ8ee45fq8ZCMj
5IRpH7OwzuGo7gHyHdlUZykhMP19obVutNL/vuQXfha1k8cQh0jh4bN0bmCXdctg
F+Q+OIWerbOJu40QahvOP0hsmIY1AniItUWmhGcNJ8gGZ+dvj/I9A0iOE6vfjpiB
e9cLhTCkn3kZ/4hsOSTDBR89wB5tw0aL6Lu/gEH12u92LB58pOm4boOQsFk6aIue
WYZEHKmHPY3r+bm5Mt6rFZPN7j1SDTfNm4RowQIDAQABAoIBAEYNrhan4RAa1Dh3
iX26HQRpLfiDSz81CKvrG6gAWbpWut/8h5SHtp5rH8Fq4v4n4we4ZKYDmjh7OzDD
3TMkFGzQFsLck2HeJfyvhJm3EnFgaod5U+62rtiTimvnkh/SbWImuputZURxn/lk
zsgNvvhLZDP0pyCUnJpjguyj8pNG0Tu9VcyZq03BpD50c6dmYAU19MkDI/LTL8Xe
sZDauAobWr3EWCdCKGcvnasLTfw2iW9Y1VdYshYD+XZhul0V+m4Kk8jKEM3BPkMp
9XiDrfjmcrxwc148Nx9SDJXeHv1Ew3TTy70rux7aQFhxG8VMyKwPJ9JiCIyjAdMQ
cZpgOPECgYEAxbu3er5X9LK9ts839+3g8U2HuINjSfezc8OnaefEGr6b2FtVPOMY
EnY8lCKZgPH69s4+2te1+KShMd5RuLbceurVxBFbk0OMIwZQl8dxUz6t32qDSvH8
64EbAZYbDZ8eVXgpCfAYn1bYCh4eRQNAPbFCU22FdMIHak9Q1cCdK4MCgYEAxRtx
oy+DmFdR7EhanRQMJ/pVUNyHM+VA43b+jytk4P9A9gl5+D8lJC1wNfq4aiSswKHn
2yMCIIE56mXrPHwc/R9n3ucDy/gwzUxkaNo1nsdmAuxn0vNeZ+uZXnTkWFIoUFSq
bWvX/mWKDPDVytWq6CB2PnKO856L9viGuqQdk2sCgYACqgPP2I6w0lOyCdq0MXVN
awEAIG0PCxJU5fb0e1XuElFhOeHNHzYs0YEBcfHlhd0exCqeojdmcTlmxZsORRB1
a4KT0LQOKOPTePtPADXrrDWFhBbexKHmvmeRvucAaPtspWDQLHb4dqAUitFXlrKf
4iqFmz0oFJErAoSRTLYRZwKBgFLv0UkQ3RZk55u8diRSIytPMkbsBBfaBwuvLj2f
zLq/rN3Z7vB94Wrvk5+i96Xx+J61gZG7kVGMDoqKiAjTUH9Rj6tDGV3h+ObplfZo
mtdMn6frQWSJ8tdXUxljphFjwILMnUmdby0kHIqFa/AFJ/y0bAyqt2va8pngyRAP
rkIxAoGBAIaZEAH3XnBlSVV3hNpaHPhoziZVN4gE14+wKd/4BnqfIktbcU7a78Bm
u7adMwoiZIhuSfJjvy9XAsqLX+3KuW2A/ADeJksflA7tKDyXL4tbfcIK0g3bTRKQ
u/IsJYy7Ea+YIrnD3o9m5fj+xsyAVzpnWsTosnTyGxstCESCdnzW';

$connection = new AMQPStreamConnection('localhost', 5672, 'guest', 'guest');
$channel = $connection->channel();

$channel->queue_declare('message', false, false, false, false);

$decrypt = openssl_private_decrypt($_POST['encryptedUsername'], $decrypted, PRIVATE_KEY);

if ($decrypt === false) {
    echo "Unsuccessful decryption'\n";
} else {
    $msg = new AMQPMessage($decrypted);
    $channel->basic_publish($msg, '', 'message');

    echo "Message produced'\n";
}

$channel->close();
$connection->close();