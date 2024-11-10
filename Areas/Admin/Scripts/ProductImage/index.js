var listAction = []
var idx = 0;
var isDelete = false;
$(document).ready(function () {
    _common.createToolbar(
        [
            {
                type: 'add',
                action: actionScreen.addHandler
            },
            {
                type: 'save',
                action: actionScreen.saveHandler
            },
            {
                type: 'undo',
                action: actionScreen.undoHandler
            }
        ], 'card-taskbar');

    actionScreen.loadDefault();

    $('#fileInput').change(function () {
        var file = this.files[0];
        if (file && file.type.startsWith("image/")) {
            actionScreen.addImage(file);
        }
    })

    $('body').on('click', '.close', function () {
        var id = $(this).data('id');
        actionScreen.deleteImage(id);
    });

    $('body').on('click', '.gallery .line-img', function () {
        if (isDelete) {
            isDelete = false;
            return;
        }
        if (!$(this).hasClass('check-default')) {
            var id = $(this).attr('id');
            var itemsCheck = $('.line-img.check-default');
            var action = new Action();
            if (itemsCheck && itemsCheck.length == 1 && itemsCheck.eq(0).attr('id') != id) {
                itemsCheck.eq(0).removeClass('check-default');
                action.prevNodeId = itemsCheck.eq(0).attr('id');
            }
            $(this).addClass('check-default');
            action.actionType = 'edit';
            action.id = id;
            action.nextNodeId = null;
            if (id.startsWith('image-add')) {
                var item = listAction.find(x => x.id == id);
                if (item != null) {
                    action.url = null;
                    action.docType = 0;
                    action.file = item.file;
                    action.publicId = null;
                }
            }
            else {
                action.url = $(`#src-${id}`).attr('src');
                action.docType = 1;
                action.file = null;
                action.publicId = $(`#public-id-${id}`).val();
            }
            addAction(action);
        }
    })
});

actionScreen = new function () {
    /**
     * Load mặc định
     */
    this.loadDefault = function () {
        _common.disableButton(['undo']);
    }

    /**
     * action add handler
     */
    this.addHandler = function () {
        $("#fileInput").click();
    }

    /**
     * action save handle
     */
    this.saveHandler = function () {
        _common.ShowConfirm("Thông báo", "Bạn có chắc chắn muốn lưu thay đổi?",
            function () {
                var formData = new FormData();
                var requestIndex = 0;
                listAction.forEach(item => {
                    if (item.actionType == 'add') {
                        formData.append(`request[${requestIndex}].Id`, item.id);
                        formData.append(`request[${requestIndex}].httpPostedFileBase`, item.file);
                        requestIndex++;
                    }

                    if (item.actionType == 'delete' && !item.id.startsWith('image-add')) {
                        var id = item.id.split('-').slice(-1)[0];
                        formData.append('deleteIds', Number(id));
                    }
                })
                var itemsCheck = $('.line-img.check-default');
                if (itemsCheck && itemsCheck.length == 1) {
                    formData.append('idDefault', itemsCheck.eq(0).attr('id'))
                }
                formData.append('productId', Number($('#product-id').val()));

                _common.StartLoading("card-action");
                _common.PostWithFormData("/ProductImage/Update", formData,
                    function (res) {
                        if (res && !res.IsError) {
                            $('#container-product-image').empty();
                            if (res.Data && res.Data.length > 0) {
                                for (var i = 0; i < res.Data.length; i++) {
                                    var item = res.Data[i];
                                    var classCheck = item.IsDefault ? 'check-default' : '';
                                    var element = `<div class="col-sm-2 line-img ${classCheck}" id="image-${item.Id}">
                                    <button class="close" data-id="image-${item.Id}"><i class="fas fa-times"></i></button>
                                    <input type="hidden" id="public-id-image-${item.Id}" value="${item.PublicId}"/>
                                    <img src="${item.Image}" id="src-image-${item.Id}" class="img-fluid mb-2" alt="white sample" />
                                </div>`;
                                    $('#container-product-image').append(element);
                                }
                                _common.ShowToastSuccess("Lưu thành công");
                            }
                        }
                        _common.StopLoading("card-action");
                    },
                    function (xhr, status, error) {
                        _common.ShowMessageBoxError("Thông báo", "Đã xảy ra lỗi trong quá trình xử lý.\nError: " + error);
                        _common.StopLoading("card-action");
                    }
                );
            }
        )
    }

    /**
     * action undo handle
     * @returns
     */
    this.undoHandler = function () {
        if (listAction.length == 0) return;

        var item = getAction();
        switch (item.actionType) {
            case 'add':
                if (!IsNullOrEmpty(item.id)) {
                    $("#" + item.id).remove();
                }
                break;
            case 'delete':
                var element = `<div class="col-sm-2 line-img" id="image-add-${item.id}">
                                    <button class="close" data-id="image-add-${item.id}"><i class="fas fa-times"></i></button>
                                    <input type="hidden" id="public-id-image-${item.id}" value=""/>
                                    <img src="{0}" id="src-image-add-${item.id}" class="img-fluid mb-2" alt="white sample" />
                                </div>`;
                if (!IsNullOrEmpty(item.prevNodeId)) {
                    var prevNode = $('#' + item.prevNodeId)
                    if (item.docType == 0) {
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            let src = e.target.result;
                            prevNode.after(formatString(element, src));
                        }
                        reader.readAsDataURL(item.file);
                    }
                    else {
                        prevNode.after(formatString(element, item.url));
                    }
                }
                else if (!IsNullOrEmpty(item.nextNodeId)) {
                    var nextNode = $('#' + item.nextNodeId);
                    if (item.docType == 0) {
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            let src = e.target.result;
                            nextNode.before(formatString(element, src));
                        }
                        reader.readAsDataURL(item.file);
                    }
                    else {
                        nextNode.before(formatString(element, item.url));
                    }
                }
                else {
                    if (item.docType == 0) {
                        actionScreen.addImage(item.file);
                    }
                    else {
                        $('#container-product-image').append(formatString(element, item.url));
                    }
                }
                break;
            case 'edit':
                if (!IsNullOrEmpty(item.prevNodeId)) {
                    var prevNode = $(`#${item.prevNodeId}`);
                    if (!prevNode.hasClass('check-default')) {
                        prevNode.addClass('check-default');
                    }
                }
                $(`#${item.id}`).removeClass('check-default');
                break;
            default: break;
        }
    }

    /**
     * thêm 1 ảnh vào collections của sản phẩm
     * @param {any} file
     */
    this.addImage = function (file) {
        var firstChildId = $('#container-product-image').children().first().attr('id');
        var action = new Action('add', 'image-add-' + idx, file, null, 0, null, firstChildId, null);
        addAction(action);
        var reader = new FileReader();
        reader.onload = function (e) {
            let src = e.target.result;
            let element = `<div class="col-sm-2 line-img" id="image-add-${idx}">
                                    <button class="close" data-id="image-add-${idx}"><i class="fas fa-times"></i></button>
                                    <input type="hidden" id="public-id-image-${idx}" value=""/>
                                    <img src="${src}" id="src-image-add-${idx}" class="img-fluid mb-2" alt="white sample" />
                                </div>`;
            $('#container-product-image').append(element);
            idx++;
        }
        reader.readAsDataURL(file);
    }

    this.deleteImage = function (id) {
        var action = new Action();
        action.actionType = 'delete';
        action.id = id;
        action.prevNodeId = $(`#${id}`).prev('div')?.attr('id');
        action.nextNodeId = $(`#${id}`).next('div')?.attr('id');
        if (id.startsWith('image-add')) {
            var item = listAction.find(x => x.id == id);
            if (item != null) {
                action.url = null;
                action.docType = 0;
                action.file = item.file;
                action.publicId = null;
            }
        }
        else {
            action.url = $(`#src-${id}`).attr('src');
            action.docType = 1;
            action.file = null;
            action.publicId = $(`#public-id-${id}`).val();
        }
        $(`#${id}`).remove();
        addAction(action);
        isDelete = true;
    }
}

function addAction(action) {
    listAction.push(action);
    $('#undo-btn').attr("aria-disabled", false);
}

function getAction() {
    if (listAction.length == 0) {
        $('#undo-btn').attr("aria-disabled", true);
    }
    return listAction.pop();
}

/**
 * lưu giá trị vừa hành động để undo
 */
class Action {
    /**
     * Hàm khởi tạo với đầy đủ properties
     * @param {any} actionType - loại hành động: add, delete
     * @param {any} id - id của thẻ div project
     * @param {any} file - file
     * @param {any} url - url
     * @param {any} docType - file: 0, url: 1
     * @param {any} prevNodeId - mặc định id của node trước đó (Nếu action type là 'edit' thì prevNodeId là thẻ được check default trước đó)
     * @param {any} nextNodeId - id của node sau đó
     */
    constructor(actionType = null, id = null, file = null, url = null, docType = null, prevNodeId = null, nextNodeId = null, publicId = null) {
        this.actionType = actionType; 
        this.id = id;
        this.file = file;
        this.url = url;
        this.docType = docType;
        this.prevNodeId = prevNodeId;
        this.nextNodeId = nextNodeId;
        this.publicId = publicId;
    }
}