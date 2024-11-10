////$(document).ready(function () {
////    CKEDITOR.replace('txtDetail', {
////        customConfig: '/content/ckeditor/config.js',
////        extraAllowedContent: 'span',
////    });
////});
Init();
function BrowseServer(field) {
    var finder = new CKFinder();
    finder.selectActionFunction = function (fileUrl) {
        document.getElementById(field).value = fileUrl;
        document.getElementById("_avatar").src = fileUrl;
    };
    finder.popup();
}

// xử lý zoom Avatar

function Init() {
    var modal = document.getElementById('myModalProfile');
    var img = document.getElementById('_avatar');
    var modalImg = document.getElementById("imgProfile");
    img.onclick = function () {
        modal.style.display = "block";
        modalImg.src = this.src;
    }
    var span = document.getElementsByClassName("close")[0];
    span.onclick = function () {
        modal.style.display = "none";
    }
}
