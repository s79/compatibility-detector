// One detector implementation for checking 'undetectable document.all' problems
// @author : jnd@chromium.org
// @bug: http://b/hotlist?id=10048
//
// All web pages caught by this detector do not mean that those pages have real
// problems, but at least, they have potential compatibility problems since
// they try to detect document.all.  The following is detail explaination.
//
// Too many sites check for support of document.all and assume that the browser
// is Internet Explorer. As a result, they often give Chrome the way designed to
// only work with Internet Explorer, which might casue page unworkable. If they
// fail to detect it, either they use standards compliant code or they will
// abandon the effort of making page workable.  Chrome implement the
// 'undetectable document.all', which means you couldn't test for it and decide
// to go down the IE branch of a script, but you still could use
// document.all[index] or document.all[element's id] , which allow the page to
// continue working. It might make huge legacy pages workable if there are no
// other non-standard js codes to use.
// However supporting document.all caused problems (It still does), especially
// using this to detect Firefox, Chrome, Safari and Opera.
// Also W3C has provided its successors document.getElementById and
// getElementsByTagName to replace the obsolete 'document.all'. So I think it's
// time to measure how impact this problem is and educate webmasters to use
// standard method.
// There are two ways to check 'documet.all'
// First One is only check whether the code checks 'document.all', if it does,
// it might mean the page uses this to guess browser
// type.  It's pretty dangerous (see bug http://b/issue?id=954012).
// The second way is all 'document.all' usages, such as 'document.all[]',
// 'document.all.xx'. We should collect all sites which use this
// non-standard approach and tell the webmaster of those sites that they should
// use document.getElementById and
// getElementsByTagName.
// For now, I use the first way.
addScriptToInject(function() {

chrome_comp.CompDetect.declareDetector(

'detectorForBomDocumentAll',

chrome_comp.CompDetect.ScanDomBaseDetector,

function constructor(rootNode) {
  this.gatherAllProblemNodes_ = false;
  //fix document.all and document['all']
  this.documentAllFilterShortSyntaxRegexp_ =  /\b(?:[^||&&])\s*document(([.]all)|(\[["']all["']\]))\s?[\(\.\[\w$]/g;
  this.documentAllRegexp_ =  /[^\w$]*document(([.]all)|(\[["']all["']\]))\s?[\(\.\[\w$]/g;
  this.documentAllTernaryRegexp_ = /document(([.]all)|(\[["']all["']\]))\s*((\)\s*\?)|(\?))/g;
  this.multiLineScriptCommentsRegexp_ = /\/\*([\S\s]*?)\*\//g;
  this.oneLineScriptCommentsRegexp_ = /[^:\/]\/\/[^\n\r]*/gm;
},

function checkNode(node, context) {
  // Do not check page's root node(HTML tag).
  if (Node.ELEMENT_NODE != node.nodeType)
    return;

  //check script node
  var This = this,
      scriptData = '',
      testResults = {documentAllRegexp_:false,
                     documentAllFilterShortSyntaxRegexp_:false,
                     documentAllTernaryRegexp_:false};

  if (node.tagName == 'SCRIPT') {
    if (node.src && node.src != '') {
      scriptData = (node.src in context) ? context[node.src] : '';
    } else {
      scriptData = node.text;
    }

   //delete script comment
   scriptData = removeScriptComments(scriptData);
   setTestResults(scriptData);
    if (getTestDetectorResult()) {
      this.addProblem('BX9002', [node]);
    }

  //check inline events of other node
  }else{
    for (var i = 0,l = node.attributes.length; i<l; i++){
      if ( node.attributes[i].name.toLowerCase().indexOf('on') == 0 ){
       scriptData = removeScriptComments(node.attributes[i].value)
	setTestResults(scriptData);
        if (getTestDetectorResult()) {
           this.addProblem('BX9002', [node]);
         }
      }
    }
  }

  function removeScriptComments(scriptData){
	return scriptData
	       .replace(this.oneLineScriptCommentsRegexp_,'')
	       .replace(this.multiLineScriptCommentsRegexp_,'');
  }

  function getTestDetectorResult(){
    return testResults.documentAllRegexp_ &&
           testResults.documentAllFilterShortSyntaxRegexp_ &&
           testResults.documentAllTernaryRegexp_;
  }

  function setTestResults(scriptData){
     This.documentAllRegexp_.test('');
     testResults.documentAllRegexp_= This.documentAllRegexp_.test(scriptData);
     This.documentAllRegexp_.test('');
     testResults.documentAllFilterShortSyntaxRegexp_ = !This.documentAllFilterShortSyntaxRegexp_.test(scriptData);
     This.documentAllFilterShortSyntaxRegexp_.test('');
     testResults.documentAllTernaryRegexp_ = !This.documentAllTernaryRegexp_.test(scriptData);
     This.documentAllTernaryRegexp_.test('');
  }

}
); // declareDetector

});
