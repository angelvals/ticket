let observaciones = [];
let peligros = [];

function getData(){
    $('#dataBody').html('');
    $.ajax({
        type: "GET",
        url: "/ticket",
        dataType: "json"
    })
    .done(function(response) {
        response.result.map((value) => {
            let peligro_v = "";
            value.id_peligro.forEach((value) => {
                peligro_v += (peligros.find(t => t.id_peligro == value.id_peligro).descripcion)+", ";
            });
            peligro_v = peligro_v.substring(0, peligro_v.length - 2);
            let $tr = $('<tr>');
            $tr.append(
                $('<td>').html(value.id),
                $('<td>').html(value.name),
                $('<td>').html(value.email),
                $('<td>').html(value.msg),
                $('<td>').html(value.ob_descripcion),
                $('<td>').html(peligro_v),
                $('<td>').html(
                    `<button class="btn btn-warning" onclick='ticketModal(${JSON.stringify(value)})'>Update</button>
                    <button class="btn btn-danger" onclick="deleteTicket(${value.id})">Delete</button>`
                ),
            );
            $('#dataBody').append($tr);
        });
    })
    .fail(function(response) {
        alert('Server error.');
    });
}

function clearDB() {
    $('#dataBody').html('');
}

function ticketModal(data){
    $('#update_peligro').selectpicker('deselectAll');
    $('#reportId').html(data.id);
    $('#name-text').val(data.name);
    $('#email-text').val(data.email);
    $('#issue-text').html(data.msg);
    $("#update_observacion").val(data.id_observacion);
    let peligro_v = [];
    data.id_peligro.forEach(value => peligro_v.push(value.id_peligro));
    $("#update_peligro").selectpicker('val', peligro_v);
    $('#update_peligro').selectpicker('render');
    $('#ticketModal').modal('show');
}

$('#ticketModal').on('hidden.bs.modal', function (e) {
    // Clear ticket modal data...
    $('#reportId').html('');
    $('#name-text').val('');
    $('#email-text').val('');
    $('#issue-text').html('');
    $("#update_observacion").val(''); // reset field after successful submission
    $("#update_peligro").val(''); // reset field after successful submission
})

function updateTicket(){
    var data = getBody({
        name: $('#name-text').val(),
        email: $('#email-text').val(),
        msg: $('#issue-text').val(),
        id_observacion: $("#update_observacion").val(),
        id_peligro: $("#update_peligro").val()
    });
    $.ajax({
        type: "PUT",
        url: `/ticket/${$('#reportId').html()}`,
        contentType: 'application/json',
        data: data
    })
    .done(function(response) {
        $('#ticketModal').modal('hide');
        //alert('Report updated!'); // show success message
        getData();
    })
    .fail(function(response) {
        alert('Error updating report.');
    });
}

function deleteTicket(id){
    $.ajax({
        type: "DELETE",
        url: `/ticket/${id}`,
        contentType: 'application/json',
    })
    .done(function(response) {
        getData();
    })
    .fail(function(response) {
        alert('Error deleting ticket.');
    });
}

$("#userForm").submit(function() {
    var data = getBody({
        name: $("#name").val(),
        email: $("#email").val(),
        msg: $("#msg").val(),
        id_observacion: $("#id_observacion").val(),
        id_peligro: $("#id_peligro").val()
    });

    $.ajax({
        type: "POST",
        url: "/ticket",
        contentType: 'application/json',
        data: data
    })
    .done(function(response) {
        alert('Your message has been sent. Thank you!'); // show success message
        $("#name").val(''); // reset field after successful submission
        $("#email").val(''); // reset field after successful submission
        $("#msg").val(''); // reset field after successful submission
        $("#id_observacion").val(''); // reset field after successful submission
        $("#id_peligro").val(''); // reset field after successful submission
        $('#id_observacion, #id_peligro').selectpicker('deselectAll');
        $('#id_observacion, #id_peligro').selectpicker('render');
        getData();
    })
    .fail(function(response) {
        alert('Error sending message.');
    });
    return false; // prevent page refresh
});

function getBody(body) {
    return JSON.stringify( body );
}