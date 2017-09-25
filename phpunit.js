/**
 * Created by brussell on 5/22/2017.
 */

(function() {

    var runningtest = false;
    var $spinner;

    function OnPageLoad() {
        $spinner = $('#Spinner');

        $('#OpenCoverage').attr('href', env.coveragepath);

        BindEvents();
        GetReport();
    }

    function LoadReport(data) {

        var $testset  = $('<div/>', { 'class': 'testset'}).html(data);
        $('#Tests').append($testset);
        BindTestEvents();
        SetupPreviews();

    }

    function LoadSingleReport(data, istestsuite) {
        $(data).find('.testsuite').each(function() {
            var $newsuite = $(this);
            if(istestsuite) {
                var suitename = $newsuite.attr('data-suitename');
                // If we ran a full test suite replace the whole suite
                var $oldsuite = $('.testsuite[data-suitename="' + suitename + '"]').html($newsuite.html());

                $oldsuite.attr('data-tests', $newsuite.attr('data-tests'));
                $oldsuite.attr('data-failures', $newsuite.attr('data-failures'));
                $oldsuite.attr('data-errors', $newsuite.attr('data-errors'));

                SetupSuiteEvents($oldsuite, $oldsuite.attr('data-suiteindex'));
            }
            else {
                // Otherwise replace each individual test
                $newsuite.find('.testcase').each(function() {
                    var testname = $(this).attr('data-testname');

                    $('.testcase[data-testname="' + testname + '"]').html($(this).html());
                });
            }
        });
        SetupPreviews();

    }

    function FailReport(data) {
        var $errorset = $('<div/>', { 'class': 'errorset'}).html("Error: " + data.responseText);
        $('#Tests').append($errorset);
        console.log('ReportFailed:', data);
        GetReport();
    }

    function GetReport() {
        $.get('testsreport.php')
            .done(LoadReport);
    }

    function GetSingleReport(istestsuite) {
        $.get('testsreport.php?single=single')
            .done(function(data) {
                LoadSingleReport(data, istestsuite);
            });
    }



    function RunTest(path) {
        if(runningtest) {
            return;
        }

        runningtest = true;
        $spinner.show();
        $.get(path)
            .done(GetReport)
            .fail(FailReport)
            .always(function() {
                runningtest = false;
                $spinner.hide();
            });

    }

    function RunSingleTest(testname, button) {
        if(runningtest) {
            return;
        }

        var istestsuite = $(button).attr('data-istestsuite') === 'true';

        runningtest = true;
        $(button).addClass('spinning');

        $.get('runtests.php?filter=' + testname)
            .always(function() {
                GetSingleReport(istestsuite);
                runningtest = false;
                $(button).removeClass('spinning');
            });
    }

    function BindTestEvents() {
        var suite = 0;
        $('.testsuite').each(function() {
            var $this = $(this);
            var index = suite++;

            SetupSuiteEvents($this, index);
        });
    }

    function SetupPreviews() {
        $('.preview-output[data-processed="false"]').each(function() {
            SetupPreview($(this));
        });
    }

    function SetupPreview($preview) {
        var output = $('<div/>').html($preview.html()).text();

        var openIndexHead = output.indexOf('<head>');
        var closeIndexHead = output.indexOf('</head>');

        var openIndexBody = output.indexOf('<body>');
        var closeIndexBody = output.indexOf('</body>');

        if(openIndexHead >= 0 && closeIndexHead >= 0 && openIndexBody >= 0 && closeIndexBody >= 0) {
            var outputhead = output.substring(openIndexHead, closeIndexHead + 7);
            var outputbody = output.substring(openIndexBody, closeIndexBody + 7);

            $preview.empty();
            var $iframe = $('<iframe />', {
                'class': 'preview-iframe'
            })
                .appendTo($preview);

            $iframe.contents()
                .find('head')
                .html(outputhead);

            $iframe.contents()
                .find('body')
                .html(outputbody);


            $iframe.contents().find('link').each(function() {
                var $this = $(this);
                $iframe.contents().find('head').append('<link rel="stylesheet" href="' + env.localpath + $this.attr('href') + '">');
            });

            $iframe.contents().find('img').each(function() {
                var $this = $(this);
                $this.attr('src', env.localpath + $this.attr('src'));
            });

            $preview.show();
        }
        $preview.attr('data-processed', true);
    }

    function SetupSuiteEvents($suite, index) {
        var id = 'accordian-' + index;
        var headerid = 'header-' + index;
        var collapseid = 'collapse-' + index;

        $suite.attr('data-suiteindex', index);
        $suite.attr('id', id);


        var $cardheader =
            $suite.find('.card-header').eq(0)
                .attr('id', headerid);

        $suite.find('.collapse')
            .attr('id', collapseid)
            .attr('aria-labelledby', headerid);

        $suite.find('.collapser').eq(0)
            .attr('data-parent', '#' + id)
            .attr('href', '#' + collapseid);

        var tests = $suite.attr('data-tests');
        var failures = $suite.attr('data-failures');
        var errors = $suite.attr('data-errors');

        if(failures != "0" || errors != "0") {
            $cardheader.addClass('bg-danger').addClass('text-white');
        }

    }

    function BindEvents() {
        $('#RunTests').on('click', function() {
            RunTest('runtests.php');
        });

        $('#RunTestsWCoverage').on('click', function() {
            RunTest('runtestswcoverage.php');
        });

        $('#Tests').on('click', '.test-rerun', function(e) {
            RunSingleTest( $(this).attr('data-testname'), e.target );
        });

        $('#JumpToFirst').on('click', function(e) {
            var $first = null;
            var $suites = $('.testset > .testsuite .testsuite');

            for(var i=0, iL=$suites.length; i<iL; i++) {
                var $this = $suites.eq(i);
                if($this.attr('data-failures') !== "0" || $this.attr('data-errors') !== "0") {
                    $first = $this;
                    break;
                }
            }

            if($first !== null) {
              //  $('.testset > .testsuite > .card > .card-header > .collapser').collapse('show');
                $first.find('.collapse').collapse('show');

                window.scrollTo(0, $first.offset().top);
            }


        });

    }


    $(function() {
        OnPageLoad();
    });
})();