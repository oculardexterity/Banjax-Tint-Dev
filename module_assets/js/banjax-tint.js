
        function buildDataStructure() {
           data =  $('input#test').val();
           return data;
        }

        $('button#submit').click(function(e) {
            var xmlData = buildDataStructure();
            Banjax.data.post('tint', xmlData, function(response) {console.log("Just got a response:", response)},
                function(response) {console.log("BAD REQUEST:", response.responseText)})
        });

