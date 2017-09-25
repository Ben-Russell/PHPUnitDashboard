        <?php

            $xml = new DOMDocument();

            $runsingle = isset($_GET['single']) && $_GET['single'] == 'single';

            if($runsingle)
            {
                $xml->load('junit_results_single.xml');
            }
            else {
                $xml->load('junit_results.xml');
            }


            $xsl = new DOMDocument();
            $xsl->load('junit.xsl');

            $processor = new XSLTProcessor();
            $processor->importStylesheet($xsl);

            $result =  $processor->transformToXml($xml);

            print_r($result);

        ?>
