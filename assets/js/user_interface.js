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
        url: baseUrl + "/users",
        cache: false,
        success: function(response) {
            loading.innerHTML = '';
            var data = response.data;
            data.forEach((member) => {
                addRecordToTable(member);
            });
        }
    });
}

function addRecordToTable(data) {
    var userslist = document.getElementById("userslist").getElementsByTagName("tbody")[0];
    var newRecord = userslist.insertRow(userslist.length);

    cell1 = newRecord.insertCell(0);
    cell1.innerHTML = data.user_id;
    cell2 = newRecord.insertCell(1);
    cell2.innerHTML = data.email_address;
    cell3 = newRecord.insertCell(2);
    cell3.innerHTML = data.user_name;
    cell4 = newRecord.insertCell(3);
    cell4.innerHTML = data.user_gender;
    cell5 = newRecord.insertCell(4);
    cell5.innerHTML = data.date_of_birth;
    cell6 = newRecord.insertCell(5);
    cell6.innerHTML = data.telephone_number;
    cell7 = newRecord.insertCell(6);
    cell7.innerHTML = data.address;
    cell8 = newRecord.insertCell(7);
    cell8.innerHTML = `<a onClick="onEdit(this)">Edit</a>&nbsp
                        <a onClick="onDelete(this)">Delete</a>`;
}

function onFormSubmit() {
    var formData = {};
    formData["user_id"] = document.getElementById("user_id").value;
    formData["email_address"] = document.getElementById("email_address").value;
    formData["user_name"] = document.getElementById("user_name").value;
    formData["user_gender"] = document.getElementById("user_gender").value;
    formData["date_of_birth"] = document.getElementById("date_of_birth").value;
    formData["telephone_number"] = document.getElementById("telephone_number").value;
    formData["address"] = document.getElementById("address").value;

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
        url: baseUrl + "/users",
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
    document.getElementById("email_address").value = selectedRecord.cells[1].innerHTML;
    document.getElementById("user_name").value = selectedRecord.cells[2].innerHTML;
    document.getElementById("user_gender").value = selectedRecord.cells[3].innerHTML;
    document.getElementById("date_of_birth").value = selectedRecord.cells[4].innerHTML;
    document.getElementById("telephone_number").value = selectedRecord.cells[5].innerHTML;
    document.getElementById("address").value = selectedRecord.cells[6].innerHTML;
}

function updateFormRecord(data, td) {
    var updateData = JSON.stringify();
    selectedRecord = td.parentElement.parentElement;
    selectedRecordID = selectedRecord.cells[0].innerHTML;
    $.ajax({
        type: 'PUT',
        url: baseUrl + "/users/" + selectedRecordID,
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
    selectedRecord.cells[1].innerHTML = data.email_address;
    selectedRecord.cells[2].innerHTML = data.user_name;
    selectedRecord.cells[3].innerHTML = data.user_gender;
    selectedRecord.cells[4].innerHTML = data.date_of_birth;
    selectedRecord.cells[5].innerHTML = data.telephone_number;
    selectedRecord.cells[6].innerHTML = data.address;
}

function onDelete(td) {
    selectedRecord = td.parentElement.parentElement;
    selectedRecordID = selectedRecord.cells[0].innerHTML;
    if (confirm('Are you sure you want to delete this record?')) {
        row = td.parentElement.parentElement;
        document.getElementById("userslist").deleteRow(row.rowIndex);
        clearForm();
        $.ajax({
            type: 'DELETE',
            url: baseUrl + "/users/" + selectedRecordID,
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
    document.getElementById("user_id").value = "";
    document.getElementById("user_name").value = "";
    document.getElementById("user_gender").value = "";
    document.getElementById("email_address").value = "";
    document.getElementById("telephone_number").value = "";
    document.getElementById("date_of_birth").value = "";
    document.getElementById("address").value = "";
}