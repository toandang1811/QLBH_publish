var isUpdate = false;
var listPermission = []
$(document).ready(function () {
    _common.createToolbar(
        [
            {
                type: 'add',
                action: actionScreen.ActionAdd
            },
            {
                type: 'delete',
                action: actionScreen.ActionDelete
            }
            /*'add', 'delete'*/
        ],
        'card-taskbar'
    );

    actionScreen.LoadGridData();

    $("body").on('change', '#cbxModuleId', function () {
        
    })
    
});

// Tạo bảng dropdown động


actionScreen = new function () {
    this.LoadGridData = function () {
        var buttons = [
            {
                type: 'view',
                action: actionScreen.ActionViewGridItem
            }
        ]
        _common.LoadTableAndData('gridRoles', null, '/admin/permissions/GetRoles', true, true, buttons);
    }

    this.ActionAdd = function () {
        isUpdate = false;
    }

    this.ActionDelete = function () {
        var str = "";
        var checkbox = $('#gridRoles').find('tr td input.inp-check:checkbox');
        var i = 0;
        checkbox.each(function () {
            if (this.checked) {
                var _id = $(this).data("id");
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

        _common.ShowConfirm("Xác nhận xóa", "Xác nhận xóa những bản ghi này.", () => deleteRecords(str))
    }

    this.ActionViewGridItem = function () {
        isUpdate = true;
        var e = $(this).data('id');
        console.log(e);
    }
}

function deleteRecords(str) {
    _common.StartLoading('card-action');
    _common.PostWithJsonData('/admin/role/Delete', JSON.stringify({ ids: str }), 'application/json',
        function (res) {
            if (res) {
                if (!res.IsError && res.Data) {
                    res.ErrorItems.forEach(function (err) {
                        _common.ShowToastError(err);
                    })
                    actionScreen.LoadGridData();
                }
                else {
                    _common.ShowMessageBoxError("Thông báo", "Xóa không thành công.");
                }
            }
            else {
                _common.ShowMessageBoxError("Thông báo", "Đã xảy ra lỗi trong quá trình xử lý.");
            }
            _common.StopLoading('card-action')
        },
        function (xhr, status, error) {
            _common.ShowMessageBoxError("Thông báo", "Error: " + status + " - " + error);
            _common.StopLoading('card-action')
        }
    )
}