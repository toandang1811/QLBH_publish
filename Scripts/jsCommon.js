/**
 * show confirm dialog
 * @param {any} message
 * @param {Function} yesClick
 * @param {Function} noClick
 */
function showConfirmDialog(message, yesClick, noClick) {
	$('#modal-confirm').modal('show');
	$("#msg-confirm-data").text(message);

	$("#btnYes").click(function () {
		if (yesClick && typeof yesClick === "function") {
			yesClick();
		}
		$("#btnCacelConfirm").click();
	});

	$("#btnCloseConfirm").click(function () {
		if (noClick && typeof noClick === "function") {
			noClick();
		}
	});
}

/**
 * show message dialog
 * @param {any} message
 */
function showMessageDialog(message) {
	$('#modal-message').modal('show');
	$("#msg-data").text(message);
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
	if (typeof value == "")
	var gasPrice = new Intl.NumberFormat(language, {
		style: style,
		currency: currency,
		minimumFractionDigits: numberZero
	});
	return gasPrice.format(value);
}