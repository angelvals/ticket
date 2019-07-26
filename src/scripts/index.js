$(document).ready(function(){
    fillCombo();
    getData();
});

function fillCombo(){
    $.ajax({
        type: "GET",
        url: "/category",
        dataType: "json"
    })
    .done(function(response) {
        if(response.success){
            $('#id_cat, #update_cat').html('');
            response.result.map((value) => {
                $('#id_cat, #update_cat').append(
                    $(`<option value="${value.id}">`).html(value.nombre)
                );
            });
        }
    })
    .fail(function(response) {
        alert('Server error.');
    });
}

function getData(){
    $('#dataBody').html('');
    $.ajax({
        type: "GET",
        url: "/products",
        dataType: "json"
    })
    .done(function(response) {
        response.result.map((value) => {
            let $tr = $('<tr>');
            $tr.append(
                $('<td>').html(value.id),
                $('<td>').html(value.nombre),
                $('<td>').html(value.descripcion),
                $('<td>').html(value.cat_lbl),
                $('<td>').html(
                    `<button class="btn btn-warning" onclick='productModal(${JSON.stringify(value)})'>Actualizar</button>
                    <button class="btn btn-danger" onclick="deleteProduct(${value.id})">Borrar</button>`
                ),
            );
            $('#dataBody').append($tr);
        });
    })
    .fail(function(response) {
        alert('Server error.');
    });
}

function productModal(data){
    $("#productoId").html(data.id);
    oFormObject = document.forms['productUForm'];
    oFormObject.elements[0].value = data.nombre
    oFormObject.elements[1].value = data.descripcion
    oFormObject.elements[2].value = data.category_id
    $('#productModal').modal('show');
}

$('#productModal').on('hidden.bs.modal', function (e) {
    // Clear ticket modal data...
    $('#reportId').html('');
    $('#name-text').val('');
    $('#email-text').val('');
    $('#issue-text').html('');
    $("#update_observacion").val(''); // reset field after successful submission
    $("#update_peligro").val(''); // reset field after successful submission
})

function updateTicket(data) {
    const id = $("#productoId").html();
    oFormObject = document.forms['productUForm'];
    var data = getBody({
        name: oFormObject.elements[0].value,
        msg: oFormObject.elements[1].value,
        id_cat: oFormObject.elements[2].value
    });
    $.ajax({
        type: "PUT",
        url: "/products/"+id,
        contentType: 'application/json',
        data: data
    })
    .done(function(response) {
        oFormObject.elements[0].value = "";
        oFormObject.elements[1].value = "";
        oFormObject.elements[2].value = "";
        $('#productModal').modal('hide');
        getData();
    })
    .fail(function(response) {
        alert('Error saving data.');
    });
}

function deleteProduct(id){
    $.ajax({
        type: "DELETE",
        url: `/products/${id}`,
        contentType: 'application/json',
    })
    .done(function(response) {
        getData();
    })
    .fail(function(response) {
        alert('Error deleting ticket.');
    });
}

$("#productForm").submit(function(event) {
    var data = getBody({
        name: event.currentTarget[0].value,
        msg: event.currentTarget[1].value,
        id_cat: event.currentTarget[2].value
    });
    $.ajax({
        type: "POST",
        url: "/products",
        contentType: 'application/json',
        data: data
    })
    .done(function(response) {
        alert('Producto almacenado');
        event.currentTarget[0].value = "";
        event.currentTarget[1].value = "";
        event.currentTarget[2].value = "";
        getData();
    })
    .fail(function(response) {
        alert('Error saving data.');
    });
    return false; // prevent page refresh
});

$("#categoryForm").submit(function(event) {
    var data = getBody({
        name: event.currentTarget[0].value,
        msg: event.currentTarget[1].value
    });
    $.ajax({
        type: "POST",
        url: "/category",
        contentType: 'application/json',
        data: data
    })
    .done(function(response) {
        alert('Categoria almacenada');
        event.currentTarget[0].value = "";
        event.currentTarget[1].value = "";
        fillCombo();
    })
    .fail(function(response) {
        alert('Error saving data.');
    });
    return false; // prevent page refresh
});

function getBody(body) {
    return JSON.stringify( body );
}