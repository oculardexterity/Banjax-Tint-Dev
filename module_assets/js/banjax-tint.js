
function buildDataStructure() {
	data =  $('textarea#test').val();
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

var item = '<li class="ui-state-default draggable resizable"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span><textarea>Type in me</textarea></li>'


$( function() {
    $( "#sortable" ).sortable({cancel : '.editable'});
  	$(".resizable").resizable()


  	$('#main_add_item').click(function() {
  		$('#sortable').append(item);
  	});


  } );


function add_tags()
{
  

   document.execCommand("insertHTML", false, "<span class='foreign'>"+ document.getSelection()+"</span>");

   
}

function remove_tags() {
	document.execCommand("RemoveFormat", false, null);

}

function get_content(div) {

	var content = $(div).html();
	console.log(content);
	content = content.replace('</div><div>', '<lb/>');
	content = content.replace('<div>', '').replace('</div>', '');
	console.log(content);

}

