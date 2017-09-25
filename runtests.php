<?php
/**
 * Created by PhpStorm.
 * User: brussell
 * Date: 5/22/2017
 * Time: 2:47 PM
 */

$filter = isset($_GET['filter']) ? $_GET['filter'] : '';

if($filter)
{
    $output = shell_exec("./runtests ". $filter);
}
else
{
    $output = shell_exec("./runtests");
}

print_r($output);
if(substr($output, 0, 4) == "Done") {
    http_response_code(200);
}
else {
    http_response_code(500);
}