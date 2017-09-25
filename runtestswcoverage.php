<?php
/**
 * Created by PhpStorm.
 * User: brussell
 * Date: 5/22/2017
 * Time: 2:47 PM
 */

$output = shell_exec("./runtestswcoverage");
print_r($output);
if(substr($output, 0, 4) == "Done") {
    http_response_code(200);
}
else {
    http_response_code(500);
}