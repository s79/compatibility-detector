/**
 * Copyright 2010 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview: One detector implementation for checking 'Font tag set color
 * feature may affect text-decoration color of ancestor element' problems
 * @bug: https://code.google.com/p/compatibility-detector/issues/detail?id=25

 * First if the ancestor element has no feature of text-decoration ,
 * there will be no problem.
 * Otherwise , the color of node is not equal the color of it's ancestor while
 * in standard mode, color attribute causes problem in IE6 and IE7 and
 * in quirks mode, color attribute causes problem in Chrome and Safari.
 *
 */

addScriptToInject(function() {

chrome_comp.CompDetect.declareDetector(

'decoration_font_color',

chrome_comp.CompDetect.ScanDomBaseDetector,

null, // constructor

function checkNode(node, context) {
  if (Node.ELEMENT_NODE != node.nodeType ||
      context.isDisplayNone() || node.tagName != 'FONT')
    return;

  var parentStyle = chrome_comp.getComputedStyle(node.parentNode);
  if (parentStyle.webkitTextDecorationsInEffect == 'none')
    return;

  // In standard mode, color attribute causes problem in IE6 and IE7;
  // In quirks mode, color style causes problem in Chrome and Safari.
  if (chrome_comp.getComputedStyle(node).color != parentStyle.color &&
      chrome_comp.inQuirksMode() != node.hasAttribute('color'))
    this.addProblem('RX3011', [node]);
}
); // declareDetector

});
