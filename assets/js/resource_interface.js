var selectedRecord = null;
var selectedRecordID = null;
var baseUrl = "https://book-club-api1.herokuapp.com";

$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: baseUrl + "/books",
        cache: false,
        success: function(response) {
            var data = response.data;
            data.forEach((resource) => {
                addRecordToTable(resource);
            });
        }
    });
});

function addRecordToTable(data) {
    var resourcesList = document.getElementById("resourceslist").getElementsByTagName("tbody")[0];
    var newRecord = resourcesList.insertRow(resourcesList.length);

    // if (data.resource_link == null) {
    //     var theLink = "Link not available";
    // } else {
    //     var theLink = `<a href="${data.resource_link}">Link</a>`;
    // }

    cell1 = newRecord.insertCell(0);
    cell1.innerHTML = data.book_id;
    cell2 = newRecord.insertCell(1);
    cell2.innerHTML = data.title;
    cell3 = newRecord.insertCell(2);
    cell3.innerHTML = data.author;
    cell4 = newRecord.insertCell(3);
    cell4.innerHTML = data.publish_date;
    cell5 = newRecord.insertCell(4);
    cell5.innerHTML = data.isbn;
    cell6 = newRecord.insertCell(5);
    cell6.innerHTML = data.no_of_copies;
    cell7 = newRecord.insertCell(6);
    cell7.innerHTML = data.genre;
    cell8 = newRecord.insertCell(7);
    cell8.innerHTML = `<a onClick="onEdit(this)">Edit</a>&nbsp
                        <a onClick="onDelete(this)">Delete</a>`;
}

function onFormSubmit() {
    var formData = {};
    formData["book_id"] = document.getElementById("book_id").value;
    formData["title"] = document.getElementById("title").value;
    formData["author"] = document.getElementById("author").value;
    formData["isbn"] = document.getElementById("isbn").value;
    formData["publish_date"] = document.getElementById("publish_date").value;
    formData["no_of_copies"] = document.getElementById("no_of_copies").value;
    formData["genre"] = document.getElementById("genre").value;

    if (selectedRecord == null) {
        saveFormData(formData);
    } else {
        updateFormRecord(formData);
    }
    clearForm();
}

function saveFormData(data) {
    var postData = JSON.stringify(data);
    $.ajax({
        type: "POST",
        url: baseUrl + "/books",
        dataType: 'json',
        data: postData,
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function(response) {
            addRecordToTable(response.data);
        }
    });
}

function onEdit(td) {
    selectedRecord = td.parentElement.parentElement;
    selectedRecordID = selectedRecord.cells[0].innerHTML;
    document.getElementById("title").value = selectedRecord.cells[1].innerHTML;
    document.getElementById("author").value = selectedRecord.cells[2].innerHTML;
    document.getElementById("publish_date").value = selectedRecord.cells[3].innerHTML;
    document.getElementById("isbn").value = selectedRecord.cells[4].innerHTML;
    document.getElementById("no_of_copies").value = selectedRecord.cells[5].innerHTML;
    document.getElementById("genre").value = selectedRecord.cells[6].innerHTML;
}

function updateFormRecord(data) {
    var updateData = JSON.stringify(data);
    $.ajax({
        type: 'PUT',
        url: baseUrl + "/books/" + selectedRecordID,
        dataType: 'json',
        data: updateData,
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function() {
            updateTableRecord(data);
        }
    });

}

function updateTableRecord(data) {
    selectedRecord.cells[0].innerHTML = selectedRecordID;
    selectedRecord.cells[1].innerHTML = data.title;
    selectedRecord.cells[2].innerHTML = data.author;
    selectedRecord.cells[3].innerHTML = data.publish_date;
    selectedRecord.cells[4].innerHTML = data.isbn;
    selectedRecord.cells[5].innerHTML = data.no_of_copies;
    selectedRecord.cells[6].innerHTML = data.genre;
}

function onDelete(td) {
    selectedRecord = td.parentElement.parentElement;
    selectedRecordID = selectedRecord.cells[0].innerHTML;
    if (confirm('Are you sure you want to delete this record?')) {
        row = td.parentElement.parentElement;
        document.getElementById("resourceslist").deleteRow(row.rowIndex);
        clearForm();
        $.ajax({
            type: 'DELETE',
            url: baseUrl + "/books/" + selectedRecordID,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            cache: false,
            // success: function() {
            //     updateTableRecord(data);
            // }
        });
    }

}

function clearForm() {
    document.getElementById("book_id").value = "";
    document.getElementById("title").value = "";
    document.getElementById("genre").value = "";
    document.getElementById("author").value = "";
    document.getElementById("publish_date").value = "";
    document.getElementById("isbn").value = "";
    document.getElementById("no_of_copies").value = "";
}