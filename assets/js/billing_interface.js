// Modester_Samwel

var selectedRecord = null;
var selectedRecordID = null;
var selectedEmail = null;
var baseUrl = "http://localhost:5000";

$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: baseUrl + "/billing",
        cache: false,
        // crossDomain: true,
        success: function(response) {
            var data = response.data;
            data.forEach((billing) => {
                addRecordToTable(billing);
            });
        }
    });
});


function addRecordToTable(data) {
    var billinglist = document.getElementById("paymentslist").getElementsByTagName("tbody")[0];
    var newRecord = billinglist.insertRow(billinglist.length);

    cell1 = newRecord.insertCell(0);
    cell1.innerHTML = data.billing_id;
    cell2 = newRecord.insertCell(1);
    cell2.innerHTML = data.premise_id;
    cell3 = newRecord.insertCell(2);
    cell3.innerHTML = data.previous_reading;
    cell4 = newRecord.insertCell(3);
    cell4.innerHTML = data.reading_date;
    cell5 = newRecord.insertCell(4);
    cell5.innerHTML = data.current_reading;
    cell6 = newRecord.insertCell(5);
    cell6.innerHTML = data.total_charges;
    cell7 = newRecord.insertCell(6);
    cell7.innerHTML = `<a onClick="onEdit(this)">Edit</a>&nbsp
                        <a onClick="onDelete(this)">Delete</a>`;
}

function onFormSubmit() {
    var formData = {};
    formData["billing_id"] = document.getElementById("billing_id").value;
    formData["premise_id"] = document.getElementById("premise_id").value;
    formData["previous_reading"] = document.getElementById("previous_reading").value;
    formData["reading_date"] = document.getElementById("reading_date").value;
    formData["total_charges"] = document.getElementById("total_charges").value;
    formData["current_reading"] = document.getElementById("current_reading").value;

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
        url: baseUrl + "/billing",
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
    document.getElementById("premise_id").value = selectedRecord.cells[1].innerHTML;
    document.getElementById("previous_reading").value = selectedRecord.cells[2].innerHTML;
    document.getElementById("reading_date").value = selectedRecord.cells[3].innerHTML;
    document.getElementById("total_charges").value = selectedRecord.cells[4].innerHTML;
    document.getElementById("current_reading").value = selectedRecord.cells[5].innerHTML;
}

function updateFormRecord(data, td) {
    var updateData = JSON.stringify();
    selectedRecord = td.parentElement.parentElement;
    selectedRecordID = selectedRecord.cells[0].innerHTML;
    $.ajax({
        type: 'PUT',
        url: baseUrl + "/billing/" + selectedRecordID,
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
    selectedRecord.cells[1].innerHTML = data.premise_id;
    selectedRecord.cells[2].innerHTML = data.previous_reading;
    selectedRecord.cells[3].innerHTML = data.reading_date;
    selectedRecord.cells[4].innerHTML = data.current_reading;
    selectedRecord.cells[5].innerHTML = data.total_charges;
}

function onDelete(td) {
    selectedRecord = td.parentElement.parentElement;
    selectedRecordID = selectedRecord.cells[0].innerHTML;
    if (confirm('Are you sure you want to delete this record?')) {
        row = td.parentElement.parentElement;
        document.getElementById("billinglist").deleteRow(row.rowIndex);
        clearForm();
        $.ajax({
            type: 'DELETE',
            url: baseUrl + "/billing/" + selectedRecordID,
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
    document.getElementById("premise_id").value = "";
    document.getElementById("billing_id").value = "";
    document.getElementById("previous_reading").value = "";
    document.getElementById("reading_date").value = "";
    document.getElementById("total_charges").value = "";
    document.getElementById("current_reading").value = "";
}