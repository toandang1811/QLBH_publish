
$(document).ready(function () {
    $('body').on('click', '#BtnDeleteAll', function (e) {
        e.preventDefault();
        var str = "";
        var checkbox = $(this).parents('.card').find('tr td input:checkbox');
        var i = 0;
        checkbox.each(function () {
            if (this.checked) {
                var _id = $(this).val();
                if (i === 0) {
                    str += _id;
                } else {
                    str += "," + _id;
                }
                i++;
            } else {
                checkbox.attr('selected', '');
            }
        });
        if (str.length > 0) {
            var conf = confirm('Bạn có muốn xóa các bản ghi này hay không?');
            if (conf === true) {
                $.ajax({
                    url: '/admin/news/deleteAll',
                    type: 'POST',
                    data: { ids: str },
                    success: function (rs) {
                        if (rs.success) {
                            location.reload();
                        }
                    }
                });
            }
        }
    });

    $('body').on('change', '#SelectAll', function () {
        var checkStatus = this.checked;
        var checkbox = $(this).parents('.card-body').find('tr td input:checkbox');
        checkbox.each(function () {
            this.checked = checkStatus;
            if (this.checked) {
                checkbox.attr('selected', 'checked');
            }
            else {
                checkbox.attr('selected', '');
            }
        });
    });

    $('body').on('click', '.btnDelete', function () {
        var id = $(this).data("id");
        var conf = confirm('Bạn có muốn xóa bản ghi này không?');
        if (conf === true) {
            $.ajax({
                url: '/admin/news/delete',
                type: 'POST',
                data: { id: id },
                success: function (rs) {
                    if (rs.success) {
                        $('#trow_' + id).remove();
                    }
                }
            });
        }
    });

    $('body').on('click', '.btnActive', function (e) {
        e.preventDefault();
        var btn = $(this);
        var id = btn.data("id");
        $.ajax({
            url: '/admin/news/IsActive',
            type: 'POST',
            data: {id: id },
            success: function (rs) {
                if (rs.success) {
                    if (rs.isAcive) {
                            btn.html("<i class='fa fa-check text-success'></i>");
                                    //$(this).find("i").removeClass("fas fa-times text-danger")
                                    //$(this).find("i").addClass("fa fa-check text-success");
                    }
                    else {
                        btn.html("<i class='fas fa-times text-danger'></i>");
                    }
                }

            }
        });
    });
});