
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

