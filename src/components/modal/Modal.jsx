import React, { useContext, useState } from "react";
import AppContext from "../../context/AppContext";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import "./Modal.css";

export const CustomModal = (props) => {
	const {
		states: { openhModal },
		handler: { onCloseModal },
	} = useContext(AppContext);
	return (
		<Modal
			open={openhModal}
			onClose={onCloseModal}
			center
			classNames={{
				overlay: "customOverlay",
				modal: "customModal",
				closeButton: "closeBtn",
				closeIcon: "closeIcon",
			}}
		>
			{props.children}
		</Modal>
	);
};
