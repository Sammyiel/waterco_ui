// Modester_Samwel

var selectedRecord = null;
var selectedRecordID = null;
var selectedEmail = null;
var baseUrl = "https://waterco-api-and-database.herokuapp.com";

function addMember() {
    document.getElementById("hidden-field").style.visibility = "visible";
}

function viewAll() {
    document.getElementById("hidden-field").style.visibility = "visible";
    var loading = document.getElementById("content-here");
    loading.innerHTML = 'Loading...';
    $.ajax({
        type: "GET",
        url: baseUrl + "/premises",
        cache: false,
        success: function(response) {
            loading.innerHTML = '';
            var data = response.data;
            data.forEach((premise) => {
                addRecordToTable(premise);
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
        url: baseUrl + "/premises/" + myInput,
        cache: false,
        // crossDomain: true,
        success: function(response) {
            loading.innerHTML = '';
            var data = response.data;
            data.forEach((premise) => {
                addRecordToTable(premise);
            });
        }
    });
}

function addRecordToTable(data) {
    var premiseslist = document.getElementById("premiseslist").getElementsByTagName("tbody")[0];
    var newRecord = premiseslist.insertRow(premiseslist.length);

    cell1 = newRecord.insertCell(0);
    cell1.innerHTML = data.premise_id;
    cell2 = newRecord.insertCell(1);
    cell2.innerHTML = data.member_id;
    cell3 = newRecord.insertCell(2);
    cell3.innerHTML = data.meter_number;
    cell4 = newRecord.insertCell(3);
    cell4.innerHTML = data.tariff;
    cell5 = newRecord.insertCell(4);
    cell5.innerHTML = data.status;
    cell6 = newRecord.insertCell(5);
    cell6.innerHTML = `<a onClick="onEdit(this)">Edit</a>`;
}

function onFormSubmit() {
    var formData = {};
    formData["premise_id"] = document.getElementById("premise_id").value;
    formData["member_id"] = document.getElementById("member_id").value;
    formData["meter_number"] = document.getElementById("meter_number").value;
    formData["tariff_id"] = document.getElementById("tariff_id").value;
    formData["status"] = document.getElementById("status").value;

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
        url: baseUrl + "/premises",
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
    document.getElementById("member_id").value = selectedRecord.cells[1].innerHTML;
    document.getElementById("meter_number").value = selectedRecord.cells[2].innerHTML;
    document.getElementById("tariff_id").value = selectedRecord.cells[3].innerHTML;
    document.getElementById("status").value = selectedRecord.cells[4].innerHTML;
}

function updateFormRecord(data, td) {
    var updateData = JSON.stringify();
    selectedRecord = td.parentElement.parentElement;
    selectedRecordID = selectedRecord.cells[0].innerHTML;
    $.ajax({
        type: 'PUT',
        url: baseUrl + "/premises/" + selectedRecordID,
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
    selectedRecord.cells[1].innerHTML = data.member_id;
    selectedRecord.cells[2].innerHTML = data.meter_number;
    selectedRecord.cells[3].innerHTML = data.tariff_id;
    selectedRecord.cells[4].innerHTML = data.status;
}

function onDelete(td) {
    selectedRecord = td.parentElement.parentElement;
    selectedRecordID = selectedRecord.cells[0].innerHTML;
    if (confirm('Are you sure you want to delete this record?')) {
        row = td.parentElement.parentElement;
        document.getElementById("premiseslist").deleteRow(row.rowIndex);
        clearForm();
        $.ajax({
            type: 'DELETE',
            url: baseUrl + "/premises/" + selectedRecordID,
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
    document.getElementById("member_id").value = "";
    document.getElementById("meter_number").value = "";
    document.getElementById("tariff_id").value = "";
    document.getElementById("status").value = "";
}