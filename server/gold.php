<?php

const REDDIT_GOLD_ONE_MONTH = 3.99;
const REDDIT_GOLD_ONE_YEAR = 29.99;

$private_key = file_get_contents('private.key');

require_once __DIR__ . '/vendor/autoload.php';

use GuzzleHttp\Client;

$months = $_GET['months'];
$toUsername = $_GET['toUsername'];
$fromAddress = $_GET['fromAddress'];
$id = $_GET['id'];

$priceInUsd = intdiv($months, 12) * REDDIT_GOLD_ONE_YEAR + ($months % 12) * REDDIT_GOLD_ONE_MONTH;

$client = new Client();
$request = $client->get('https://api.kraken.com/0/public/Spread?pair=ETHUSD');
$ethPrices = array_slice(json_decode((string)$request->getBody(), true)['result']['XETHZUSD'], 170);

$count = 0;
$sum = 0;
foreach ($ethPrices as $ethPrice) {
    $sum += floatval($ethPrice[1]);
    $sum += floatval($ethPrice[2]);
    $count += 2;
}

$ethPrice = $sum/$count;

$priceInEth = $priceInUsd / $ethPrice;
$nonce = rand();

$data = $priceInEth . '-' . $toUsername. '-' . $fromAddress . '-' . $id . '-' . $months . '-' . $priceInUsd . '-' . $nonce;

@openssl_sign($data, $signature, $private_key, OPENSSL_ALGO_SHA256);

echo json_encode([
    'priceInEth' => $priceInEth,
    'toUsername' => $toUsername,
    'fromAddress' => $fromAddress,
    'months' => $months,
    'priceInUsd' => $priceInUsd,
    'nonce' => $nonce,
    'id' => $id,
    'signature' => base64_encode($signature),
]);
