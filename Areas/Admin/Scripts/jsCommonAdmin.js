const buttonTypes = {
    'add': {
        icon: "fas fa-plus",
        label: "Thêm mới",
        id : "add-btn",
        action: function () { alert("Thêm mới được nhấn!"); }
    },
    'edit': {
        icon: "fas fa-edit",
        label: "Chỉnh sửa",
        id: "edit-btn",
        action: function () { alert("Chỉnh sửa được nhấn!"); }
    },
    'delete': {
        icon: "fas fa-trash",
        label: "Xóa",
        id: "delete-btn",
        action: function () { alert("Xóa được nhấn!"); }
    },
    'view': {
        icon: "fas fa-eye",
        label: "Xem",
        id: "view-btn",
        action: function () { alert("Xóa được nhấn!"); }
    },
    'save': {
        icon: "fas fa-save",
        label: "Lưu",
        id: "save-btn",
        action: function () { alert("Lưu được nhấn!"); }
    },
    'import': {
        icon: "fas fa-file-import",
        label: "Import",
        id: "import-btn",
        action: function () { alert("Import được nhấn!"); }
    },
    'export': {
        icon: "fas fa-file-export",
        label: "Export",
        id: "export-btn",
        action: function () { alert("Export được nhấn!"); }
    },
    'undo': {
        icon: "fas fa-undo",
        label: "Undo",
        id: "undo-btn",
        action: function () { alert("Hoàn tác"); }
    }
};

_common = new function () {
    this.createToolbar = function (buttonConfigs, containerId) {
        // Xóa toolbar cũ nếu có
        $(`#${containerId}`).empty();

        var taskbar = $('<div class="taskbar"></div>');

        // Duyệt qua từng nút trong cấu hình đầu vào
        buttonConfigs.forEach(function (config) {
            let buttonType, buttonAction;

            if (typeof config === 'string') {
                buttonType = config;
                buttonAction = buttonTypes[buttonType].action;
            } else {
                buttonType = config.type;
                buttonAction = config.action || buttonTypes[buttonType].action;
            }

            if (buttonTypes[buttonType]) {
                var buttonElement = $(`<a href="javascript:void(0);" class="taskbar-button" id="${buttonTypes[buttonType].id}" title="${buttonTypes[buttonType].label}">
                                                <i class="${buttonTypes[buttonType].icon}"></i>
                                            </a>`);

                buttonElement.click(buttonAction);

                taskbar.append(buttonElement);
            }
        });

        $(`#${containerId}`).append(taskbar);
    }

    this.disableButton = function (buttons) {
        Object.keys(buttonTypes).forEach(function (key) {
            $(`#${buttonTypes[key].id}`).attr("aria-disabled", false);
        });
        buttons.forEach(function (btnType) {
            if (buttonTypes.hasOwnProperty(btnType)) {
                $(`#${buttonTypes[btnType].id}`).attr("aria-disabled", true);
            }
        });
    }

    this.PostWithJsonData = function (url, data, contentType, successFunc, errorFunc) {
        $.ajax({
            type: 'POST',
            url: url,
            contentType: contentType,
            data: data,
            //processData: false,
            success: function (res) {
                successFunc(res);
            },
            error: function (xhr, status, error) {
                console.error("Error: ", xhr.responseText);
                if (errorFunc != null && typeof (errorFunc) == 'function')
                    errorFunc(xhr, status, error);
            }
        });
    }

    this.PostWithFormData = function (url, data, successFunc, errorFunc = null) {
        $.ajax({
            type: 'POST',
            url: url,
            data: data,
            contentType: false,
            processData: false,
            success: function (res) {
                successFunc(res);
            },
            error: function (xhr, status, error) {
                console.error("Error: ", xhr.responseText);
                if (errorFunc != null && typeof (errorFunc) == 'function')
                    errorFunc(xhr, status, error);
            }
        });
    }

    /**
     * sử dụng cho các màn hình thao tác và nội dung xử lý bên trong thẻ có id là: card-action
     */
    this.StartLoading = function (id) {
        if ($('#' + id).find('.overlay').length == 0) {
            $('#' + id).append(`<div class="overlay">
                                  <i class="fas fa-2x fa-sync-alt fa-spin"></i>
                                </div>`);
        }
    }

    this.StopLoading = function (id) {
        if ($('#' + id).find('.overlay').length != 0) {
            $('#' + id).find('.overlay').remove();
        }
    }

    /**
     * Hiển thị message box thông báo lỗi
     * @param {any} title
     * @param {any} content
     */
    this.ShowMessageBoxError = function (title, content) {
        Swal.fire({
            title: title,
            text: content,
            icon: "error"
        });
    }

    /**
     * Hiển thị message box xác nhận hoặc hủy
     * @param {any} title Tiêu đề box
     * @param {any} content Nội dung message
     * @param {any} funcOk Hàm xử lý nếu chọn Xác nhận
     * @param {any} funcCancel Hàm xử lý nếu chọn hủy
     */
    this.ShowConfirm = function (title, content, funcOk, funcCancel = null) {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-confirm",
                cancelButton: "btn btn-confirm"
            },
            buttonsStyling: false
        });
        swalWithBootstrapButtons.fire({
            title: title,
            text: content,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Xác nhận",
            cancelButtonText: "Hủy",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                funcOk();
            } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
                && funcCancel != null && typeof (funcCancel) == 'function'
            ) {
                funcCancel();
            }
        });
    }

    this.ShowToastSuccess = function (content, timer = 3000) {
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: timer,
            timerProgressBar: false,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        });
        Toast.fire({
            icon: "success",
            title: content
        });
    }

    this.ShowToastError = function (content, timer = 3000) {
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: timer,
            timerProgressBar: false,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        });
        Toast.fire({
            icon: "error",
            title: content
        });
    }

    this.ShowToastInfo = function (content, timer = 3000) {
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: timer,
            timerProgressBar: false,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        });
        Toast.fire({
            icon: "info",
            title: content
        });
    }

    /**
     * 
     * @param {any} tableId
     */
    this.LoadTableAndData = function (tableId, postDataJson, url, isShowCheck = true, isShowOrders = true, buttons = null) {
        var table = $(`#${tableId}`);
        table.find('thead').empty();
        table.find('tbody').empty();
        _common.PostWithJsonData(url, postDataJson, 'application/json',
            function (res) {
                if (res != null && !res.IsError) {
                    var dataColumns = res.Data.DataColumns.sort((a, b) => {
                        return a.Orders - b.Orders;
                    });
                    var dataRows = res.Data.DataRows;
                    var primaryKey = "";

                    // Tạo tiêu đề cột
                    var headerRow = $("<tr></tr>");
                    var th = null;

                    if (isShowCheck) {
                        th = $("<th data-col='col-check' style='text-align: center;'></th>").html(`<input type='checkbox' id='checkall-${tableId}' />`);
                        headerRow.append(th);
                    }

                    if (isShowOrders) {
                        th = $("<th data-col='col-order'></th>").text("STT");
                        headerRow.append(th);
                    }

                    $.each(dataColumns, function (index, col) {
                        th = $(`<th data-col="col-${col.FieldId}" class="sorting" aria-controls="${tableId}" tabindex="0" rowspan="1" colspan="1" aria-sort="ascending"></th>`).text(col.FieldName);
                        headerRow.append(th);
                        if (col.IsPrimaryKey) {
                            primaryKey = col.FieldId;
                        }
                    });

                    if (buttons && buttons.length > 0) {
                        th = $("<th data-col='col-action'></th>");
                        headerRow.append(th);
                    }

                    table.find("thead").append(headerRow);

                    $.each(dataRows, function (index, rowData) {
                        var classRow = index % 2 == 0 ? "even" : "odd";
                        var row = $(`<tr class="${classRow}"></tr>`);
                        var cell = null;
                        var data = "";

                        if (isShowCheck) {
                            cell = $(`<td style='text-align: center;'><input type='checkbox' data-id='${rowData[primaryKey]}' class='inp-check'/></td>`)
                            row.append(cell);
                        }

                        if (isShowOrders) {
                            cell = $("<td></td>").text(index);
                            row.append(cell);
                        }

                        $.each(dataColumns, function (index, col) {
                            var cellValue = rowData[col.FieldId] || "";  // Lấy giá trị từ rowData theo colName
                            cell = $("<td></td>").text(cellValue);
                            row.append(cell);
                            data += ` data-${col.FieldId}="${rowData[col.FieldId]}"`
                        });

                        if (buttons && buttons.length > 0) {
                            cell = $("<td class='col-action'></td>");
                            $.each(buttons, function (index, btn) {
                                let buttonType, buttonAction;

                                if (typeof btn === 'string') {
                                    buttonType = btn;
                                    buttonAction = buttonTypes[buttonType].action;
                                } else {
                                    buttonType = btn.type;
                                    buttonAction = btn.action || buttonTypes[buttonType].action;
                                }

                                if (buttonTypes[buttonType]) {
                                    var buttonElement = $(`<a href="javascript:void(0);" class="btn btn-info" style="border-radius: .2rem;" id="${buttonTypes[buttonType].id}-${rowData[primaryKey]}" ${data} data-id="${rowData[primaryKey]}" title="${buttonTypes[buttonType].label}">
                                                <i class="${buttonTypes[buttonType].icon}"></i>
                                            </a>`);

                                    buttonElement.click(buttonAction);

                                    cell.append(buttonElement);
                                }
                            })
                            row.append(cell);
                        }

                        table.find("tbody").append(row);
                    });
                    

                    $(`#checkall-${tableId}`).bind("change", function () {
                        var checkStatus = this.checked;
                        var checkbox = $(this).parents(`#${tableId}`).find('tr td:nth-child(1) input:checkbox');
                        checkbox.each(function () {
                            this.checked = checkStatus;
                            if (this.checked) {
                                checkbox.attr('selected', 'checked');
                            } else {
                                checkbox.attr('selected', '');
                            }
                        });
                    });
                }
            },
            function (xhr, status, error) {

            }
        );
    }

    this.LoadGridView = function (gridId, objectId) {
        _common.StartLoading(gridId);
        _common.PostWithJsonData('/admin/uiconfigs/get-fields-object', { objectId: objectId },
            function (res) {
                if (!res.IsError) {
                    if (res.Data.length > 0) {
                        var items = res.Data;
                        var fieldsConfig = items.map(createFieldConfig);

                        var colCombo = fieldsConfig.filter(field => field.type === 'select');
                        var selectDataPromises = colCombo.map(field => {
                            var item = items.find(c => c.FieldId === field.name)
                            return $.ajax({
                                url: '/admin/uiconfigs/get-combobox',
                                data: { comboboxId: item.ComboboxId },
                                type: 'POST',
                                dataType: "application/json"
                            }).then(data => {
                                if (data && !data.IsError) {
                                    var combobox = data.Combobox;
                                    var fieldsCombobox = data.FieldsCombobox
                                    if (combobox.IsUseText) {
                                        field.items = JSON.parse(combobox.TextDataLoad);
                                    }
                                    else {

                                    }
                                }
                            });
                        });
                    }

                }
            },
            function () {

            }
        );
    }

    this.LoadGridData = function (gridId) {

    }

    this.GetDataComboxBox = function (cbxId) {

    }
}

function createFieldConfig(column) {
    if (column.DataTypeName === "select") {
        return {
            name: column.FieldId,
            type: "select",
            title: column.FieldName,
            width: column.Width,
            items: [],
            valueField: "",
            textField: ""
        };
    } else {
        return {
            name: column.FieldId,
            type: column.DataTypeName,
            title: column.FieldName,
            width: column.Width
        };
    }
}

/**
 * 
 * @param {any} value
 * @param {any} style
 * @param {any} language
 * @param {any} currency
 * @param {any} numberZero
 * @returns
 */
function NumberFormat(value, style, language, currency, numberZero) {
	var gasPrice = new Intl.NumberFormat(language, {
		style: style,
		currency: currency,
		minimumFractionDigits: numberZero
	});

	if (typeof value == "string") {
		return gasPrice.format(0);
	}
	return gasPrice.format(value);
}

function formatString(template, ...args) {
    return template.replace(/{(\d+)}/g, (match, index) => {
        return typeof args[index] !== 'undefined' ? args[index] : match;
    });
}

function IsNullOrEmpty(value) {
    if (value == null || value == "" || value == undefined) {
        return true;
    }
    return false;
}