
function buildDataStructure() {
	// Nothing here yet.

  data = '';
	return data;
}

function current_item() {
	var itemloaded = window.location.href.split('/');
	itemloaded = itemloaded[itemloaded.length -1]
	console.log(itemloaded);
	return itemloaded
}



$('button#submit').click(function(e) {
    var xmlData = buildDataStructure();
    Banjax.data.post(current_item(), xmlData, function(response) {console.log("Just got a response:", response)},
        function(response) {console.log("BAD REQUEST:", response.responseText)})
});




var item = `<li class="ui-state-default draggable resizable paragraph">
          <div class="divlabel">paragraph</div>

          <div class="toolbar">
      

          <button href="#" class="button small" data-command="foreign">Foreign</button>
          <button href="#" class="button small" data-command="add">+</button>
          <button href="#" class="button small" data-command="del">-</button>
          <button href="#" class="button small" data-command="unclear">?</button>
          <button href="#" class="button small" data-command="u"><u>u</u></button>
          <button href="#" class="button small" data-command="sup"><sup>super</sup></button>
           <button href="#" class="button small" data-command="sic">[sic]</button>
           <button href="#" class="button small" data-command="gap">[gap]</button>
           
          </div>
            
          <div class="editor" contenteditable="true">

              <br>
          </div>


        </li>`;



// Build all sortable things
// Buiild this properly into some initialistion function
$( function() {
    $( "#sortable" ).sortable({cancel : '.editor'});
  	$(".resizable").resizable()


  	$('#main_add_item').click(function() {
  		var tb = $(item);

      $('#sortable').append(tb);

      tb.find('.toolbar button').click(bindToolbarButtons);
      console.log();
  	});


} );



// Not necessary I don't think?
function remove_tags() {
	document.execCommand("RemoveFormat", false, null);

}



function bindToolbarButtons(e) {
     
  // Grab command type from data-command attribute of element.   
  var command = $(this).data('command');
   

   // This should not be necessary.
  if (command == 'h1' || command == 'h2' || command == 'p') {
    document.execCommand('formatBlock', false, command);
  }
   
//BUSINESS SECTION
   // Find a better way to do this generically?
  if (command == 'foreign' || command == 'add' || command == 'del' || command == 'unclear' || command == 'u'
    || command == 'sup' || command == 'sic') {
    console.log(getSelectedNode().nodeName);

    // Case where element already applied
    if (getSelectedNode().nodeName == command.toUpperCase()) {
      var node = getSelectedNode();
      var contents = $(node).contents();
      $(node).replaceWith(contents);
      //Resets the buttons after removal.
      $('button[data-command]').removeClass('hollow');
    }

    // Adds new element provided something is selected (length check)
     else if (getSelectionHtml().length > 0) {
        document.execCommand("insertHTML", false, "<"+command+">" + getSelectionHtml() +"</"+command+">");
    }
  }
  if (command == 'gap') {
    var sel = document.getSelection();
      range = sel.getRangeAt(0);
      newNode = document.createElement("gap");
      newNode.appendChild(document.createTextNode(' '));
      range.insertNode(newNode);
  }
   
  // Do generic button... probably not worth it? 
  //else document.execCommand($(this).data('command'), false, null);
   
}





$('.toolbar button').click(bindToolbarButtons);


// Adds <br> on enter press.
$('div[contenteditable]').keydown(function(e) {
    // trap the return key being pressed
    e = e || window.event;
    if (e.keyCode === 13) {

      var sel = document.getSelection();
      range = sel.getRangeAt(0);
      newNode = document.createElement("br");
			range.insertNode(newNode);
		
            //move the cursor
      range.setStartAfter(newNode);
			range.setEndAfter(newNode); 
			sel.removeAllRanges();
			sel.addRange(range);

      return false;
  }
});






// GET SELECTED TEXT/ELEMENTS
var getSelectionHtml = function() {
    var html = "";
    if (typeof window.getSelection != "undefined") {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var container = document.createElement("div");
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                container.appendChild(sel.getRangeAt(i).cloneContents());
            }
            html = container.innerHTML;
        }
    } else if (typeof document.selection != "undefined") {
        if (document.selection.type == "Text") {
            html = document.selection.createRange().htmlText;
        }
    }
    return html;
}

// THIS IS AN EVENT LISTENER... put it somewhere else
document.onselectionchange = function() { //console.log(); 
	   var parentNode = getSelectedNode().nodeName.toLowerCase();
     $('button[data-command]').removeClass('hollow');
  	 $('button[data-command="'+ parentNode +'"]').addClass('hollow');

};


// Gets the node in which caret rests... RETURNS NODE 
var getSelectedNode = function() {
    var node,selection;
    if (window.getSelection) {
      selection = getSelection();
      node = selection.anchorNode;
    }
    if (!node && document.selection) {
        selection = document.selection
        var range = selection.getRangeAt ? selection.getRangeAt(0) : selection.createRange();
        node = range.commonAncestorContainer ? range.commonAncestorContainer :
               range.parentElement ? range.parentElement() : range.item(0);
    }
    if (node) {
      return (node.nodeName == "#text" ? node.parentNode : node);
    }
};


