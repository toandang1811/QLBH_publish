$(document).ready(function () {
    _common.createToolbar(
        [
            {
                type: 'add',
                action: actionScreen.ActionAdd
            }
            /*'add', 'delete'*/
        ],
        'card-taskbar'
    );
});

actionScreen = new function () {
    this.ActionAdd = function () {
        window.open('/admin/accounts/create', '_self');
    }
}