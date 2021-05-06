// Modester_Samwel

var selectedRecord = null;
var selectedRecordID = null;
var selectedEmail = null;
var baseUrl = "http://localhost:5000";

function addMember() {
    document.getElementById("hidden-field").style.visibility = "visible";
}

function viewAll() {
    document.getElementById("hidden-field").style.visibility = "visible";
    var loading = document.getElementById("content-here");
    loading.innerHTML = 'Loading...';
    $.ajax({
        type: "GET",
        url: baseUrl + "/routes",
        cache: false,
        success: function(response) {
            loading.innerHTML = '';
            var data = response.data;
            data.forEach((route) => {
                addRecordToTable(route);
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
        url: baseUrl + "/routes/" + myInput,
        cache: false,
        // crossDomain: true,
        success: function(response) {
            loading.innerHTML = '';
            var data = response.data;
            data.forEach((route) => {
                addRecordToTable(route);
            });
        }
    });
}


function addRecordToTable(data) {
    var routeslist = document.getElementById("premiseslist").getElementsByTagName("tbody")[0];
    var newRecord = routeslist.insertRow(routeslist.length);

    cell1 = newRecord.insertCell(0);
    cell1.innerHTML = data.route_id;
    cell2 = newRecord.insertCell(1);
    cell2.innerHTML = data.sector_id;
    cell3 = newRecord.insertCell(2);
    cell3.innerHTML = data.zone_id;
    cell4 = newRecord.insertCell(3);
    cell4.innerHTML = data.number_of_clients;
    cell5 = newRecord.insertCell(4);
    cell5.innerHTML = `<a onClick="onEdit(this)">Edit</a>`;
}

function onFormSubmit() {
    var formData = {};
    formData["route_id"] = document.getElementById("route_id").value;
    formData["sector_id"] = document.getElementById("sector_id").value;
    formData["zone_id"] = document.getElementById("zone_id").value;
    formData["number_of_clients"] = document.getElementById("number_of_clients").value;

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
        url: baseUrl + "/routes",
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
    document.getElementById("sector_id").value = selectedRecord.cells[1].innerHTML;
    document.getElementById("zone_id").value = selectedRecord.cells[2].innerHTML;
    document.getElementById("number_of_clients").value = selectedRecord.cells[3].innerHTML;
}

function updateFormRecord(data, td) {
    var updateData = JSON.stringify();
    selectedRecord = td.parentElement.parentElement;
    selectedRecordID = selectedRecord.cells[0].innerHTML;
    $.ajax({
        type: 'PUT',
        url: baseUrl + "/routes/" + selectedRecordID,
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
    selectedRecord.cells[1].innerHTML = data.sector_id;
    selectedRecord.cells[2].innerHTML = data.zone_id;
    selectedRecord.cells[3].innerHTML = data.number_of_clients;
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
            url: baseUrl + "/routes/" + selectedRecordID,
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
    document.getElementById("route_id").value = "";
    document.getElementById("sector_id").value = "";
    document.getElementById("zone_id").value = "";
    document.getElementById("number_of_clients").value = "";
}