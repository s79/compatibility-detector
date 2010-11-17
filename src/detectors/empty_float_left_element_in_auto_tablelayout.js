/*
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

addScriptToInject(function() {

chrome_comp.CompDetect.declareDetector(

'emptyFloatLeftElementInAutoTableLayout',

chrome_comp.CompDetect.ScanDomBaseDetector,

null, // constructor

function checkNode(node, context) {
  if (Node.ELEMENT_NODE != node.nodeType || context.isDisplayNone())
    return;
  function getTrWidth(td){   
  	if(td.parentNode ){
	  	if(td.parentNode.tagName == 'TR')
			return chrome_comp.getComputedStyle(td.parentNode).width
		else{
			if(td.parentNode.tagName == 'BODY')
				return false;
			else	
				getTrWidth(td.parentNode);
		}
	}
	else
		return  false;
 }
  
  var nodeFloatStyle = chrome_comp.getComputedStyle(node).float;
  var nodeWidthStyle = chrome_comp.getComputedStyle(node).width;
  var offsetParent = node.offsetParent;
 if (nodeFloatStyle == 'left' && nodeWidthStyle!=0 && node.childNodes.length == 0){
	 	if (offsetParent && offsetParent.tagName == 'TD'){
			var trOriginalWidth = getTrWidth(offsetParent);
			if(trOriginalWidth){
			originalDisplay = node.style.display;
			node.style.display = 'none !important';
			trChangedWidth = getTrWidth(offsetParent); 
			if (trOriginalWidth!=trChangedWidth)
				this.addProblem('RE8004', [node]);
			node.style.display = originalDisplay ? originalDisplay : null;
			}
 		}
			  
	}
}
						   
); // declareDetector

});
