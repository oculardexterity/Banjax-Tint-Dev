Banjax.tint = (function(be) {


    // Builds data structure from fields
    function buildDataStructure() {
        // Nothing here yet.
        data = '';
        return data;
    }

    // Gets the current loaded item by splitting URL
    function current_item() {
        var itemloaded = window.location.href.split('/');
        itemloaded = itemloaded[itemloaded.length -1]
        
        return itemloaded
    }

    // Gets the node in which caret rests... RETURNS NODE 
    function getSelectedNode() {
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



    // GET SELECTED TEXT/ELEMENTS
    function getSelectionHtml() {
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


    // Binds submit button -- INJECT SELECTOR
    $(be.submit_data_button).click(function(e) {
        var xmlData = buildDataStructure();
        Banjax.data.post(current_item(), xmlData, function(response) {console.log("Just got a response:", response)},
            function(response) {console.log("BAD REQUEST:", response.responseText)});
    });

    // Does the main business of clicking button/inserting/removing inline elements (break up a little)
    function toolBarButtonOnClick(e) {
     
        // Grab command type from data-command attribute of element.   
        var command = $(this).data('command');
        // Lose this fugly if!!
        if (command == 'foreign' || command == 'add' || command == 'del' || command == 'unclear' || command == 'u'
            || command == 'sup' || command == 'sic') 
        {
            
            // Case where element already applied
            if (getSelectedNode().nodeName == command.toUpperCase()) {
                var node = getSelectedNode(); // Get node at caret position
                var contents = $(node).contents(); // Get contents of node
                $(node).replaceWith(contents); // Replace whole node with content
               
                $('button[data-command]').removeClass('hollow');  //Resets the buttons after removal.
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
   
    }

    // SETUP --- bind event listeners

    // Adds <br> on enter press. 
    $('div[contenteditable]').keydown(function(e) {
        // trap the return key being pressed
        e = e || window.event;
        if (e.keyCode === 13) {

            /// MAKE THIS CODE GENERIC `INSERT EMPTY ELEMENT` FUNCTION:
        // ---should return decorated function with options (i.e. move cursor to after, true/false)
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
 
    // More event bindings
    $(be.toolbar_buttons).click(toolBarButtonOnClick); // Bind toolbar button
    $(be.main_sortable).sortable({cancel : be.block_editor}); // Setup sortable elements
    $(be.resizable_container).resizable(); // Setup resizable elements (not necessary?)
    $(be.add_paragraph_button).click(function() {
        var tb = $(editable_block_template('paragraph', '[Delete me]', true));
        $(be.main_sortable).append(tb);
        tb.find(be.toolbar_buttons).click(toolBarButtonOnClick);
    });

    $(be.add_header_button).click(function() {
        var tb = $(header_block_template());
        $(be.main_sortable).prepend(tb);
        $('.header ul.sortable').sortable({cancel : be.block_editor});
        tb.find(be.toolbar_buttons).click(toolBarButtonOnClick);
    });

    document.onselectionchange = function() {
        var parentNode = getSelectedNode().nodeName.toLowerCase();
        $(be.toolbar_buttons + '[data-command]').removeClass('hollow');
        $(be.toolbar_buttons + '[data-command="'+ parentNode +'"]').addClass('hollow');
    };

});


var bind_elements = {
    main_sortable: ".main_sortable",
    sortable_container: ".sortable",
    resizable_container: ".resizable",
    block_editor: ".editor",

    toolbar_buttons: ".toolbar button",
    add_paragraph_button: ".add_paragraph",
    add_header_button: ".add_header",
    submit_data_button: ".submit_data"

};


Banjax.tint(bind_elements);







var header_block_template = function() {
    return `
        <li class="ui-state-default draggable header sortable">
                <div class="divlabel">header</div>
                <ul class="sortable">
                    ${editable_block_template('date line', '(e.g. "Dublin, 17 March 1916")', true)}
                    ${editable_block_template('address', 'ADDRESS', true)}
                    ${editable_block_template('salute ("dear sir")', 'SALUTE', true)}
                </ul>

            </div>

        </li>

    `
}





var editable_block_template = function(block_type, content, block_buttons) {




    var template =  `<li class="ui-state-default draggable resizable ${block_type}">
          <div class="divlabel">${block_type}</div>

          <div class="toolbar">` 
      
    if (block_buttons) {

        template += `<button href="#" class="button small" data-command="foreign">Foreign</button>
          <button href="#" class="button small" data-command="add">+</button>
          <button href="#" class="button small" data-command="del">-</button>
          <button href="#" class="button small" data-command="unclear">?</button>
          <button href="#" class="button small" data-command="u"><u>u</u></button>
          <button href="#" class="button small" data-command="sup"><sup>super</sup></button>
          <button href="#" class="button small" data-command="sic">[sic]</button>
          <button href="#" class="button small" data-command="gap">[gap]</button>`
    }

    template += `
          </div>
            
          ${editor_template(content)}


        </li>`;

    return template;
}


var editor_template = function(content) {
    return `<div class="editor" contenteditable="true">
                ${content}
              <br>
            </div>`
}
