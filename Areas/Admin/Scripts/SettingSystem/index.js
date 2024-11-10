$(document).ready(function () {
    _common.createToolbar(
        [
            {
                type: 'save',
                action: actionScreen.actionSave
            }
        ],
        'card-taskbar'
    );
});

actionScreen = new function () {
    this.actionSave = function () {
        $('#form-save-settingsystem').submit();
    }
}

function OnBegin() {
    _common.StartLoading('card-action');
}
function OnSuccess(rs) {
    _common.StopLoading('card-action');
    _common.ShowToastSuccess("Lưu thành công.");
}
function OnFailure(rs) {
    _common.StopLoading('card-action');
    _common.ShowMessageBoxError("Thông báo", "Đã xảy ra lỗi trong quá trình xử lý.");
    console.log(rs);
}