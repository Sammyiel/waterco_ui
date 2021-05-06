// Modester_Samwel

var selectedRecord = null;
var selectedRecordID = null;
var selectedEmail = null;
var baseUrl = "https://waterco-api-and-database.herokuapp.com/";

function addMember() {
    document.getElementById("hidden-field").style.visibility = "visible";
}

function viewAll() {
    document.getElementById("hidden-field").style.visibility = "visible";
    var loading = document.getElementById("content-here");
    loading.innerHTML = 'Loading...';
    $.ajax({
        type: "GET",
        url: baseUrl + "/payments",
        cache: false,
        success: function(response) {
            loading.innerHTML = '';
            var data = response.data;
            data.forEach((payment) => {
                addRecordToTable(payment);
            });
        }
    });
}

function searchDatabase() {
    var myInput = document.getElementById("myInput").value;
    document.getElementById("hidden-field").style.visibility = "visible";
    var loading = document.getElementById("content-here");
    loading.innerHTML = 'Loading...';
    $.ajax({
        type: "GET",
        url: baseUrl + "/payments/premise_id/" + myInput,
        cache: false,
        // crossDomain: true,
        success: function(response) {
            loading.innerHTML = '';
            var data = response.data;
            data.forEach((payment) => {
                addRecordToTable(payment);
            });
        }
    });
}

function addRecordToTable(data) {
    var paymentslist = document.getElementById("paymentslist").getElementsByTagName("tbody")[0];
    var newRecord = paymentslist.insertRow(paymentslist.length);

    cell1 = newRecord.insertCell(0);
    cell1.innerHTML = data.premise_id;
    cell2 = newRecord.insertCell(1);
    cell2.innerHTML = data.meter_reading;
    cell3 = newRecord.insertCell(2);
    cell3.innerHTML = data.charges_paid;
    cell4 = newRecord.insertCell(3);
    cell4.innerHTML = data.balance;
    cell5 = newRecord.insertCell(4);
    cell5.innerHTML = data.date_paid;
    cell6 = newRecord.insertCell(5);
    cell6.innerHTML = `<a onClick="onEdit(this)">Edit</a>&nbsp
                        <a onClick="onDelete(this)">Delete</a>`;
}

function onFormSubmit() {
    var formData = {};
    formData["payment_id"] = document.getElementById("payment_id").value;
    formData["meter_reading"] = document.getElementById("meter_reading").value;
    formData["charges_paid"] = document.getElementById("charges_paid").value;
    formData["balance"] = document.getElementById("balance").value;
    formData["date_paid"] = document.getElementById("date_paid").value;

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
        url: baseUrl + "/payments",
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
    document.getElementById("meter_reading").value = selectedRecord.cells[2].innerHTML;
    document.getElementById("charges_paid").value = selectedRecord.cells[3].innerHTML;
    document.getElementById("balance").value = selectedRecord.cells[4].innerHTML;
    document.getElementById("date_paid").value = selectedRecord.cells[5].innerHTML;
}

function updateFormRecord(data, td) {
    var updateData = JSON.stringify();
    selectedRecord = td.parentElement.parentElement;
    selectedRecordID = selectedRecord.cells[0].innerHTML;
    $.ajax({
        type: 'PUT',
        url: baseUrl + "/payments/" + selectedRecordID,
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
    selectedRecord.cells[1].innerHTML = data.meter_reading;
    selectedRecord.cells[2].innerHTML = data.charges_paid;
    selectedRecord.cells[3].innerHTML = data.balance;
    selectedRecord.cells[4].innerHTML = data.date_paid;
}

function onDelete(td) {
    selectedRecord = td.parentElement.parentElement;
    selectedRecordID = selectedRecord.cells[0].innerHTML;
    if (confirm('Are you sure you want to delete this record?')) {
        row = td.parentElement.parentElement;
        document.getElementById("paymentslist").deleteRow(row.rowIndex);
        clearForm();
        $.ajax({
            type: 'DELETE',
            url: baseUrl + "/payments/" + selectedRecordID,
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
    document.getElementById("meter_reading").value = "";
    document.getElementById("charges_paid").value = "";
    document.getElementById("balance").value = "";
    document.getElementById("date_paid").value = "";
}