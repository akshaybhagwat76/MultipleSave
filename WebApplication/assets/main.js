var addressItem = [];
var paymentItem = [];
var acnt = 2;

$(document).ready(function () {
    loadCustomers();
});

function loadCustomers() {
    $.ajax({
        type: "GET",
        url: "/Test/GetData",
        dataType: "json",
        success: function (response) {
            let cnt = 1;
            $.each(response, function (key, item) {
                $('#mytbl').append('<tr><td class="editableColumns" id="email_row' + cnt + '">' + item.cemail + '</td><td class="editableColumns" id="amt_row' + cnt + '">' + item.p_amount + '</td><td class="editableColumns" id="address_row' + cnt + '">' + item.c_address + '</td><td><input class="editValues" id="edit_button' + cnt + '" onclick="editFunction(' + item.c_id + ',' + cnt + ')" type="button" value="Edit"><input class="saveValues" id="save_button' + cnt + '" onclick="saveFunction(' + item.c_id + ',' + cnt + ',' + item.add_id + ',' + item.p_id + ')" type="button" style="display:none"    value="SAVE"></td></tr>');
                cnt++;
            });
        }
    })
}

function editFunction(cust_id, rowno) {
    document.getElementById("edit_button" + rowno).style.display = "none";
    document.getElementById("save_button" + rowno).style.display = "block";

    var emailr = document.getElementById("email_row" + rowno);
    var amtr = document.getElementById("amt_row" + rowno);
    var addrer = document.getElementById("address_row" + rowno);

    var emailr_data = emailr.innerHTML;
    var amtr_data = amtr.innerHTML;
    var addrer_data = addrer.innerHTML;

    emailr.innerHTML = "<input type='text' id='name_text" + rowno + "' value='" + emailr_data + "'>";
    amtr.innerHTML = "<input type='number' id='country_text" + rowno + "' value='" + amtr_data + "'>";
    addrer.innerHTML = "<input type='text' id='age_text" + rowno + "' value='" + addrer_data + "'>";

};

function saveFunction(cust_id, rowno, add_id, p_id) {
    var name_val = document.getElementById("name_text" + rowno).value;
    var country_val = document.getElementById("country_text" + rowno).value;
    var age_val = document.getElementById("age_text" + rowno).value;

    document.getElementById("email_row" + rowno).innerHTML = name_val;
    document.getElementById("amt_row" + rowno).innerHTML = country_val;
    document.getElementById("address_row" + rowno).innerHTML = age_val;

  
    $.ajax({
        dataType: 'json',
        type: "POST",
        url: "/Test/SaveMasterDetail",
        data: { c_email: name_val, p_amount: country_val, c_address: age_val, c_id: cust_id, add_id: add_id, p_id: p_id },
        success: function (response) {
            if (response) {
                document.getElementById("edit_button" + rowno).style.display = "block";
                document.getElementById("save_button" + rowno).style.display = "none";
            }
            else {
                alert('Failed');
            }
        }
    })
}


$('#btnAddress').click(function () {
    //if ($(this).val() != "") {
    //    var frsttxt = $('#txtadd').val();
    //    var lstText = $("#tblAddress tr:first input").val();
    //    var cnt = 0;
    //    $('#tblAddress tbody').append('<tr><td><input type="text" id="txtadd" value="' + frsttxt + '" /></td><td><input type="button" id="btnAremove" onclick="removeBtn(this,' + cnt + ');" value="remove" style="width:80px" class="btn btn-danger" /></td></tr>')
    //    $('#txtadd').val('');
    //    cnt++;
    //    addressItem.push({
    //        add_id: 0,
    //        c_address: frsttxt,
    //        c_id: 0
    //    })
    //}
    //else {
    //    alert("Please enter address");
    //}
    debugger;
    var newtextboxdiv = $(document.createElement('div')).attr('id', 'TextBoxDiv' + acnt);
    newtextboxdiv.after().html('<br /><input type="text" name="textbox' + acnt + '" id="textbox' + acnt + '" value="' + $('#textbox1').val() + '" />&nbsp;&nbsp;&nbsp;<input type="button" id="btnAremove" onclick="removeBtn(this,' + acnt + ');" value="remove" style="width:80px" class="btn btn-danger" />');
    newtextboxdiv.appendTo("#TextBoxesGroup");
    addressItem.push({
        add_id: 0,
        c_address: $('#textbox1').val(),
        c_id: 0
    });
    acnt++;
    $('#textbox1').val("");
});

$('#btnpayment').click(function () {
    //var closeadd = $(this).closest('input').html();
    if ($(this).val() != "") {
        let frstamt = $('#txtamt').val();
        var lstText = $("#tblPayment tr:first input").val();
        var cnt = 0;
        $('#tblPayment tbody').append('<tr><td><input type="number" id="txtamt" value="' + frstamt + '" /></td><td><input type="button" id="btnPremove" onclick="removeBtnpmt(this,' + cnt + ');" value="remove" style="width:80px" class="btn btn-danger" /></td></tr>')
        $('#txtamt').val('');
        cnt++;
        paymentItem.push({
            p_id: 0,
            p_amount: frstamt,
            c_id: 0
        })
    }
    else {
        alert("please enter payment");
    }
});

function removeBtn($this, cnt) {
    //addressItem.splice($.inArray($($this).parents("tr").find('input').val(), addressItem), 1);
    //$($this).parents('tr').remove();
    addressItem.splice($.inArray($($this).parents("div").find('input').val(), addressItem), 1);
    $($this).parent("div").remove()
}

function removeBtnpmt($this, cnt) {
    paymentItem.splice($.inArray($($this).parents("tr").find('input').val(), paymentItem), 1);
    $($this).parents('tr').remove();
}

$('.btnSaveOrder').click(function () {
    $.ajax({
        dataType: 'json',
        type: "POST",
        url: "/Test/SaveDetails",
        data: { cemail: $('#email').val(), cmobile: $('#mobile').val(), addressObj: addressItem, paymentObj: paymentItem },
        success: function (response) {
            if (response) {
                alert('Records Inserted Successfully');
                location.reload();
            }
            else {
                alert('Failed');
            }
        }
    })
});
