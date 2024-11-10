$(document).ready(function () {
    ShowCount();
    $('body').on('click', '.btnAddToCart', function (e) {
        e.preventDefault();
        var id = $(this).data('id');
        var quatity = 1;
        var tQuantity = $('#quantity_value').text();
        if (tQuantity != '') {
            quatity = parseInt(tQuantity);
        }

        //alert(id + " " + quatity);
        $.ajax({
            url: '/shoppingcart/addtocart',
            type: 'POST',
            data: { id: id, quantity: quatity },
            success: function (rs) {
                if (rs.Success) {
                    $('#checkout_items').html(rs.Count);
                    showMessageDialog(rs.msg);
                }
            }
        });
    });
    $('body').on('change', '.value_quantity', function (e) {
        e.preventDefault();
        var id = $(this).data("id");
        var quantity = $(this).val();
        Update(id, quantity);

    });
    $('body').on('click', '.btnDeleteAll', function (e) {
        e.preventDefault();
        //var conf = confirm('Bạn có chắc muốn xóa hết sản phẩm trong giỏ hàng?');
        ////debugger;
        //if (conf == true) {
        //    DeleteAll();
        //}
        showConfirmDialog("Bạn có chắc muốn xóa hết sản phẩm trong giỏ hàng?", function () {
            DeleteAll();
        }, null);

    });

    $('body').on('click', '.btnDelete', function (e) {
        e.preventDefault();
        var id = $(this).data('id');
        //var conf = confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?');
        //if (conf == true) {
        //    $.ajax({
        //        url: '/shoppingcart/Delete',
        //        type: 'POST',
        //        data: { id: id },
        //        success: function (rs) {
        //            if (rs.Success) {
        //                $('#checkout_items').html(rs.Count);
        //                $('#trow_' + id).remove();
        //                LoadCart();
        //            }
        //        }
        //    });
        //}

        showConfirmDialog("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?", function () {
            $.ajax({
                url: '/shoppingcart/Delete',
                type: 'POST',
                data: { id: id },
                success: function (rs) {
                    if (rs.Success) {
                        $('#checkout_items').html(rs.Count);
                        $('#trow_' + id).remove();
                        LoadCart();
                    }
                }
            });
        }, null);

    });
});



function ShowCount() {
    $.ajax({
        url: '/shoppingcart/ShowCount',
        type: 'GET',
        success: function (rs) {
            $('#checkout_items').html(rs.Count);
        }
    });
}
function DeleteAll() {
    $.ajax({
        url: '/shoppingcart/DeleteAll',
        type: 'POST',
        success: function (rs) {
            if (rs.Success) {
                LoadCart();
            }
        }
    });
}
function Update(id, quantity) {
    $.ajax({
        url: '/shoppingcart/Update',
        type: 'POST',
        data: { id: id, quantity: quantity },
        success: function (rs) {
            if (rs.Success) {
                LoadCart();
            }
        }
    });
}

function LoadCart() {
    $.ajax({
        url: '/shoppingcart/Partial_Item_Cart',
        type: 'GET',
        success: function (rs) {
            $('#load_data').html(rs);
        }
    });
}

