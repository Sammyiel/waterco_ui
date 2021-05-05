var selectedRecord = null;
var selectedRecordID = null;
var baseUrl = "https://book-club-api1.herokuapp.com";

$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: baseUrl + "/borrowings",
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
    cell1.innerHTML = data.borrow_id;
    cell2 = newRecord.insertCell(1);
    cell2.innerHTML = data.book_title;
    cell3 = newRecord.insertCell(2);
    cell3.innerHTML = data.isbn;
    cell4 = newRecord.insertCell(3);
    cell4.innerHTML = data.borrowing_date;
    cell5 = newRecord.insertCell(4);
    cell5.innerHTML = data.member_id;
    cell6 = newRecord.insertCell(5);
    cell6.innerHTML = data.member_name;
    cell7 = newRecord.insertCell(6);
    cell7.innerHTML = `<a onClick="onEdit(this)">Edit</a>&nbsp
                        <a onClick="onDelete(this)">Delete</a>`;
}

function onFormSubmit() {
    var formData = {};
    formData["borrow_id"] = document.getElementById("borrow_id").value;
    formData["book_title"] = document.getElementById("book_title").value;
    formData["isbn"] = document.getElementById("isbn").value;
    formData["borrowing_date"] = document.getElementById("borrowing_date").value;
    formData["member_id"] = document.getElementById("member_id").value;
    formData["member_name"] = document.getElementById("member_name").value;
    // formData["genre"] = document.getElementById("genre").value;

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
        url: baseUrl + "/borrowings",
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
    document.getElementById("book_title").value = selectedRecord.cells[1].innerHTML;
    document.getElementById("isbn").value = selectedRecord.cells[2].innerHTML;
    document.getElementById("borrowing_date").value = selectedRecord.cells[3].innerHTML;
    document.getElementById("member_id").value = selectedRecord.cells[4].innerHTML;
    document.getElementById("member_name").value = selectedRecord.cells[5].innerHTML;
    // document.getElementById("genre").value = selectedRecord.cells[6].innerHTML;
}

function updateFormRecord(data) {
    var updateData = JSON.stringify(data);
    $.ajax({
        type: 'PUT',
        url: baseUrl + "/borrowings/" + selectedRecordID,
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
    selectedRecord.cells[1].innerHTML = data.book_title;
    selectedRecord.cells[2].innerHTML = data.isbn;
    selectedRecord.cells[3].innerHTML = data.borrowing_date;
    selectedRecord.cells[4].innerHTML = data.member_id;
    selectedRecord.cells[5].innerHTML = data.member_name;
    // selectedRecord.cells[6].innerHTML = data.genre;
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
            url: baseUrl + "/borrowings/" + selectedRecordID,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            cache: false,
            success: function() {
                updateTableRecord(data);
            }
        });
    }

}

function clearForm() {
    document.getElementById("borrow_id").value = "";
    document.getElementById("book_title").value = "";
    document.getElementById("isbn").value = "";
    document.getElementById("member_id").value = "";
    document.getElementById("borrowing_date").value = "";
    document.getElementById("member_name").value = "";
    // document.getElementById("no_of_copies").value = "";
}