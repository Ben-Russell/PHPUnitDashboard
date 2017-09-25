<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" encoding="UTF-8" indent="yes"/>

    <xsl:template match="/testsuites">
        <!-- <xsl:text disable-output-escaping='yes'>&lt;!DOCTYPE html></xsl:text> -->

                    <xsl:apply-templates select="testsuite" />

    </xsl:template>

    <xsl:template match="testsuite">
        <xsl:variable name="testsuite" select="@name"/>
        <div class="testsuite" role="tablist" aria-multiselectable="true"
             data-suitename="{@name}"
             data-tests="{@tests}"
             data-failures="{@failures}"
             data-errors="{@errors}">
            <div class="card">
                <div class="card-header" role="tab">
                    <a class="collapser" href="" data-toggle="collapse">
                        <h6>
                            Testsuite: <xsl:value-of select="@name" />
                            <xsl:text>Tests run: </xsl:text>
                            <xsl:value-of select="@tests" />
                            <xsl:text>, Failures: </xsl:text>
                            <xsl:value-of select="@failures" />
                            <xsl:text>, Errors: </xsl:text>
                            <xsl:value-of select="@errors" />
                            <xsl:text>, Time elapsed: </xsl:text>
                            <xsl:value-of select="@time" />
                            <xsl:text> sec</xsl:text>
                            &#160;
                            <button class="btn btn-primary btn-sm test-rerun"
                                    data-testname="{@name}"
                                    data-istestsuite="true">Re-run Test</button>
                        </h6>
                    </a>
                </div>
                <div class="collapse" role="tabpanel">
                    <div class="card-block">
                        <xsl:apply-templates select="testsuite" />


                        <xsl:apply-templates select="system-out" />
                        <xsl:apply-templates select="system-err" />
                        <xsl:apply-templates select="testcase">
                            <xsl:with-param name="testsuite" select="@name" />
                        </xsl:apply-templates>

                    </div>
                </div>
            </div>

        </div>

    </xsl:template>

    <xsl:template match="testcase">
        <xsl:param name="testsuite"/>
        <div class="testcase" data-testname="{$testsuite}::{@name}">

            <p>
                <xsl:text>
                Testcase: </xsl:text>
                <xsl:value-of select="@name" />
                <xsl:text> took </xsl:text>
                <xsl:value-of select="@time" />
                &#160;
                <button class="btn btn-primary btn-sm test-rerun"
                        data-testname="{$testsuite}::{@name}">Re-run Test</button>
            </p>
            <xsl:apply-templates select="failure" />
            <xsl:apply-templates select="error" />
        </div>
    </xsl:template>

    <xsl:template match="failure">
        <div class="failure">
            <span style="color: #ff4136;">
                <xsl:text>
                    Failure:
                </xsl:text>
                <xsl:value-of select="@type" />
            </span>
            <pre class="failure-output">
                <xsl:value-of select="." />
            </pre>
            <div class="preview-output" data-processed="false">
                <xsl:value-of select="." />
            </div>
        </div>
    </xsl:template>

    <xsl:template match="error">
        <div class="error">
            <span style="color: #F00;">
                <xsl:text>
                    Error:
                </xsl:text>
                <xsl:value-of select="@type" />
            </span>
            <pre>
                <xsl:value-of select="." />
            </pre>
        </div>
    </xsl:template>

    <xsl:template match="system-out">
        <div>
            <xsl:text>
            ------ Standard output ------
            </xsl:text>
            <pre>
                <xsl:value-of select="." />
            </pre>
        </div>
    </xsl:template>

    <xsl:template match="system-err">
        <div>
            <xsl:text>
            ------ Error output ------
            </xsl:text>
            <pre>
                <xsl:value-of select="." />
            </pre>
        </div>
    </xsl:template>

</xsl:stylesheet>