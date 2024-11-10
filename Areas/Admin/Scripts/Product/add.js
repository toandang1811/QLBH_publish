var allowAdd = false;
$(document).ready(function () {
    actionScreen.setDefaultLayout();

    $('body').on('click', '.btnXoaAnh', function () {
        var _id = $(this).data('id');
        _common.ShowConfirm("Thông báo", "Bạn có muốn xóa ảnh này không?",
            function () {
                $('#trow_' + _id).fadeTo('fast', 0.5, function () {
                    $(this).slideUp('fast', function () {
                        $(this).remove();
                        var temp = parseInt($('#tCurrentId').val());
                        for (var i = _id + 1; i <= temp; i++) {
                            updateIndex(i);
                        }
                        var currentId = temp - 1;
                        $('#tCurrentId').val(currentId);
                    });
                });
            }
        );
    });

    $('body').on('click', '.chooseImg', function () {
        var _id = $(this).data('id')
        $('#image-' + _id).click();
    });

    $('body').on('change', '.input-image', function () {
        var _id = $(this).data('id')
        var file = this.files[0];
        if (file && file.type.startsWith("image/")) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $($(`#trow_${_id}`).children('td:nth-child(2)').children('.chooseImg')).remove();
                let src = e.target.result;
                let img = `<img class="chooseImg" data-id="${_id}" width="80" src="${src}" />`
                $($(`#trow_${_id}`).children('td:nth-child(2)')).prepend(img);
            }
            reader.readAsDataURL(file);
        }
    })

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        // Lấy thẻ a đang active
        var activeTab = $(e.target); // e.target là thẻ a được click
        if (activeTab.hasClass('active') && activeTab.data('id') === 2) {
            _common.disableButton([]);
            allowAdd = true;
        }
        else {
            _common.disableButton(['add']);
            allowAdd = false;
        }
    });
});

actionScreen = new function () {
    this.setDefaultLayout = function () {
        _common.createToolbar(
            [
                {
                    type: 'add',
                    action: actionScreen.actionAddImage
                },
                {
                    type: 'save',
                    action: actionScreen.actionSave
                }
                /*'add', 'delete'*/
            ],
            'card-taskbar'
        );

        _common.disableButton(['add']);

        $('.auto').autoNumeric('init');
        $('#demoPrice').bind('blur focusout keypress keyup', function () {
            var demoGet = $('#demoPrice').autoNumeric('get');
            $('#Price').val(demoGet);
            $('#Price').autoNumeric('set', demoGet);
        });
        $('#demoPriceSale').bind('blur focusout keypress keyup', function () {
            var demoGet = $('#demoPriceSale').autoNumeric('get');
            $('#PriceSale').val(demoGet);
            $('#PriceSale').autoNumeric('set', demoGet);
        });
        $('#demoOriginalPrice').bind('blur focusout keypress keyup', function () {
            var demoGet = $('#demoOriginalPrice').autoNumeric('get');
            $('#OriginalPrice').val(demoGet);
            $('#OriginalPrice').autoNumeric('set', demoGet);
        });
        CKEDITOR.replace('txtDetail', {
            customConfig: '/content/ckeditor/config.js',
            extraAllowedContent: 'span',
        });
    }
    this.actionSave = function () {
        $('#form-add-product').submit();
    }

    this.actionAddImage = function () {
        if (allowAdd) {
            var temp = $('#tCurrentId').val();
            var currentId = parseInt(temp) + 1;
            var str = "";
            if (currentId == 1) {
                str += `<tr id="trow_${currentId}">
                            <td class="text-center">${currentId}</td>
                            <td class="text-center">
                                <input class="chooseImg" data-id="${currentId}" type="button" value="..." />
                                <input class="input-image" id="image-${currentId}" data-id=${currentId} type="file" style="display: none" name="Images"/>
                            </td>
                            <td class="text-center"><input type="radio" name="rDefault" value="${currentId}" checked="checked"/></td>
                            <td class="text-center"><a href="#" data-id="${currentId}" class="btn btn-sm btn-danger btnXoaAnh">Xóa</a></td>
                        </tr>`;
            }
            else {
                str += `<tr id="trow_${currentId}">
                            <td class="text-center">${currentId}</td>
                            <td class="text-center">
                                <input class="chooseImg" data-id="${currentId}" type="button" value="..." />
                                <input class="input-image" id="image-${currentId}" data-id=${currentId} type="file" style="display: none" name="Images"/>
                            </td>
                            <td class="text-center"><input type="radio" name="rDefault" value="${currentId}"/></td>
                            <td class="text-center"><a href="#" data-id="${currentId}" class="btn btn-sm btn-danger btnXoaAnh">Xóa</a></td>
                        </tr>`;
            }
            $('#tbHtml').append(str);
            $('#tCurrentId').val(currentId);

            //var finder = new CKFinder();
            //finder.selectActionFunction = function (fileUrl) {
            //    addImageProduct(fileUrl);
            //};
            //finder.popup();
        }
    }
}

function updateIndex(idx) {
    var downIdx = idx - 1;
    $($(`#trow_${idx}`).children('td:nth-child(1)')).html(downIdx);
    $($(`#trow_${idx}`).children('td:nth-child(2) input:first')).attr('data-id', downIdx);
    $($(`#trow_${idx}`).children('td:nth-child(2) input:last')).attr('id', `image-${downIdx}`);
    $($(`#trow_${idx}`).children('td:nth-child(3) input:first')).val(downIdx);
    $($(`#trow_${idx}`).children('td:nth-child(4) a:first')).attr('data-id', downIdx);
    $(`#trow_${idx}`).attr('id', `trow_${downIdx}`);
}

function addImageProduct(url) {
    var temp = $('#tCurrentId').val();
    var currentId = parseInt(temp) + 1;
    var str = "";
    if (currentId == 1) {
        str += `<tr id="trow_${currentId}">
                    <td class="text-center">${currentId}</td>
                    <td class="text-center"><img width="80" src="${url}" /> <input type='hidden' value="${url}" name="Images"/></td>
                    <td class="text-center"><input type="radio" name="rDefault" value="${currentId}" checked="checked"/></td>
                    <td class="text-center"><a href="#" data-id="${currentId}" class="btn btn-sm btn-danger btnXoaAnh">Xóa</a></td>
                </tr>`;
    }
    else {
        str += `<tr id="trow_${currentId}">
                    <td class="text-center">${currentId}</td>
                    <td class="text-center"><img width="80" src="${url}" /> <input type='hidden' value="${url}" name="Images"/></td>
                    <td class="text-center"><input type="radio" name="rDefault" value="${currentId}"/></td>
                    <td class="text-center"><a href="#" data-id="${currentId}" class="btn btn-sm btn-danger btnXoaAnh">Xóa</a></td>
                </tr>`;
    }
    $('#tbHtml').append(str);
    $('#tCurrentId').val(currentId);
    //$('#tbHtml tr td a').each(function () {
    //    $(this).click(function () {
    //        var conf = confirm('Bạn có muốn xóa ảnh này không?');
    //        if (conf === true) {
    //            var _id = $(this).data('id');
    //            $('#trow_' + _id).fadeTo('fast',1, function () {
    //                $(this).slideUp('fast', function () { $(this).remove(); });
    //            });
    //            var temp = $('#tCurrentId').val();
    //            var currentId = parseInt(temp) - 1;
    //            $('#tCurrentId').val(currentId);
    //            }
    //        });
    //    });
}