import React from "react"
import "./Styles/deleteModal.css"

export default function DeleteModal(props) {
    return (
        <section id="backdrop-blur" onClick={props.onClose}>
            <section className="delete-modal">
                <section className="modal-wrapper">
                    <h4>
                        {props.props.text} {props.props.name}?
                    </h4>
                    <section id="delete-buttons-container">
                        <button id="delete-yes" onClick={props.onDelete}>
                            Kyllä
                        </button>
                        <button id="delete-no">En</button>
                    </section>
                    <button id="modal-close-button" onClick={props.onClose}>
                        X
                    </button>
                </section>
            </section>
        </section>
    )
}
