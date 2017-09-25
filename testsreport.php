<?php

$xml = new DOMDocument();

$runsingle = isset($_GET['single']) && $_GET['single'] == 'single';
$resultsxml = $runsingle ? 'junit_results_single.xml' : 'junit_results.xml';
$junitxsl = 'junit.xsl';

if (!file_exists($junitxsl)) {
    print_r("{$junitxsl} is missing...");
    exit();
}
if (!file_exists($resultsxml)) {
    print_r('No result to be shown yet. Please run a test.');
    exit();
}

$xml->load($resultsxml);

$xsl = new DOMDocument();
$xsl->load('junit.xsl');

$processor = new XSLTProcessor();
$processor->importStylesheet($xsl);

$result = $processor->transformToXml($xml);

print_r($result);