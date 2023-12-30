import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
export const successToastify = (msg) => {
	Toastify({
		text: msg,
		newWindow: true,
		close: true,
		gravity: "top", // `top` or `bottom`
		position: "right", // `left`, `center` or `right`
		stopOnFocus: true, // Prevents dismissing of toast on hover
		style: {
			background: "#55eb34",
		},
	}).showToast();
};

export const errorToastify = (msg) => {
	Toastify({
		text: msg,
		newWindow: true,
		close: true,
		gravity: "top", // `top` or `bottom`
		position: "right", // `left`, `center` or `right`
		stopOnFocus: true, // Prevents dismissing of toast on hover
		style: {
			background: "#ff2400",
		},
	}).showToast();
};
