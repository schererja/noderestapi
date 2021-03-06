var messageListData = [];

//DOM Ready
//
$(document).ready(function(){
    populateTable();
});
$('#btnAddMessage').on('click', addMessage);
$('#btnSearchMessages').on('click', searchMessage);
//
//
//Fills table

function populateTable(){
    var tableContent = '';
    $('#messagesTable tr').not(':first').remove();
    $.getJSON('/api/messages', function(data){
        messageListData = data;
        var i=0;
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td>'+ this.message_s +'</td>';
            tableContent += '<td>'+ this.date_s + '</td>';
            tableContent += '</tr>';
        });
        $('#messagesTable tbody:last').append(tableContent);
        var numOfRecords = messageListData.length;
        $('#foundRecords').replaceWith("<p id='foundRecords'>Records Found:"+ numOfRecords + "</p>");
    });
};

function addMessage(event){
    event.preventDefault();
    //Basic Validation
    var errorCount = 0;
    $('#addMessage input').each(function(index, val){
        if($(this).val() === ''){ errorCount++;}
    });
    if(errorCount === 0){
        var dateTime = new Date();
        var dateTimeStr = dateTime.toLocaleDateString() + ' ' + dateTime.toLocaleTimeString();
        var newMessage = {
            'message_s': $('#addMessage fieldset input#inputMessage').val(),
            'date_s': dateTimeStr
        }
        $.ajax({
            type: 'POST',
            data: newMessage,
            url: '/api/messages',
            dataType: 'JSON'
        }).done(function(response){
            if (response.message === 'New Message Created'){

                //Clears the form inputs
                $('#addMessage fieldset input').val('');

                //Repopulate table
                populateTable();
            }
            else {
                alert('Error: ' + response.msg);
            }
        });
    }
    else {
        return false;
    }
};
function searchMessage(event){
    event.preventDefault();
    var thisResult = '';
    //Basic Validation
    var errorCount = 0;
    $('#resultsTable tr').not(':first').remove();
    $('#numOfResults p').remove();
    $('#searchMessage input').each(function(index, val){
        if($(this).val() === ''){ errorCount++;}
    });
    if(errorCount === 0){
        var newMessage =  $('#searchMessage input#searchMessage').val()
        var resultUrl = 'http://172.16.7.237:8080/solr/collection1/query?q=message_s:*'+newMessage+'*&fl=message_s, date_s&wt=json&json.wrf=?&rows=1000';
        $.getJSON(resultUrl, function(result){
            var Parent = document.getElementById('resultsTable');
            //var thisResult = 'Results found:' + result.response.numFound + '<br/>';
            for (var i=0; i < result.response.docs.length; i++){
                if (result.response.docs.length > 5){
                }
                thisResult += '<tr>';
                thisResult += '<td>' + result.response.docs[i].message_s + '</td>';
                thisResult += '<td>' + result.response.docs[i].date_s + '</td>';
                thisResult += '</tr>';
            }
           /* thisResult += '<tr>';
            thisResult += '<td>Results Found:</td>';
            thisResult += '<td align=right><b>' + result.response.numFound +'</b></td>';
            thisResult += '</tr>';*/
            $('#resultsTable tbody:last').append(thisResult);
          //  paginationTable();
            $('#numOfResults').append('<p>Results found: '+result.response.numFound.toString()+'</p>');
        });

    }
    else {
        return false;
    }
};


function paginationTable(){
    var maxRows = 10;
    $('#resultsTable').each(function(){
       /* var cTable = $(this);
        var cRows = cTable.find('tr:gt(0)');
        var cRowCount cRows.size();

        if(cRowCount < maxRows){
            return;
        };
        cRows.each(function(i){
            $(this).find('td:first').text(fcuntion(j, val){
                return (i + 1) + " - " + val;
            });
        });
        cRows.filter(':gt(' + (maxRows - 1) +')').hide();

        var cPrev = cTable.siblings('.prev');
        var cNext = cTable.siblings('.next');

        cPrev.addClass('disabled');*/
        });

};
