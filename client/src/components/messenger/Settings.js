import edit_icon from "../../assets/icons8-edit.svg"

import { useState } from 'react';

// this is just test data
// this data should really be fetched
// and then posted when updated and validated
let user_data = {
    display_name: "Cassie",
    first_name: "Cassandra",
    last_name: "Stevens",
    image_url: "https://picsum.photos/200"
}

const Settings = () => {
    const [Name, setName] = useState({
        firstname: user_data.first_name,
        lastname: user_data.last_name,
        editing: false, // determines whether name is being edited
        editLock: false,
    });

    const handleNameChange = (e) => {
        const { name, value } = e.target
        Name[name] = value;
        // setName({ ...Name, [name]: value })
    }

    const [displayName, setDisplayName] = useState({
        displayname: user_data.display_name,
        editing: false, // determines whether displayname is being edited
        editLock: false, // locks if user has entered invalid data
    });

    const handleDNameChange = (e) => {
        const { name, value } = e.target
        setDisplayName({ ...displayName, [name]: value })
        console.log(displayName);
    }

    const handleEditName = () => {
        // get div containing name of attr and value
        let keyValue = document.getElementsByClassName("setting_item")[0].firstElementChild;

        if (!Name.editing) {
            Name.editing = true;

            // get ref to span containing name value
            let display_span = keyValue.firstChild.nextElementSibling;

            // temp remove span displaying name while editing
            keyValue.removeChild(display_span)

            // create inputs for user to edit their name
            let firstNameInput = document.createElement("input");
            let lastNameInput = document.createElement("input");

            // prepare inputs for user
            firstNameInput.value = Name.firstname;
            firstNameInput.placeholder = "First Name";
            firstNameInput.name = "firstname";
            firstNameInput.type = "text";
            firstNameInput.addEventListener("change", (e) => handleNameChange(e));
            lastNameInput.value = Name.lastname;
            lastNameInput.placeholder = "Last Name";
            lastNameInput.name = "lastname";
            lastNameInput.type = "text";
            lastNameInput.addEventListener("change", (e) => handleNameChange(e));

            // add inputs to ui for user to edit name
            keyValue.appendChild(firstNameInput)
            keyValue.appendChild(lastNameInput)
        } else {
            if (!Name.editLock) { // ignore validation for now
                // remove inputs
                keyValue.removeChild(keyValue.firstChild.nextElementSibling)
                keyValue.removeChild(keyValue.firstChild.nextElementSibling)

                // commit changes
                user_data.first_name = Name.firstname
                user_data.last_name = Name.lastname

                // update and replace display span
                let display_span = document.createElement("span");
                display_span.innerText = user_data.first_name + " " + user_data.last_name;
                keyValue.appendChild(display_span)
                Name.editing = false;
            }
        }
    }

    const handleEditDName = () => {
        // get div containing name of attr and value
        let keyValue = document.getElementsByClassName("setting_item")[1].firstElementChild;

        if (!displayName.editing) {
            displayName.editing = true;
            // get ref to span containing displayname value
            let display_span = keyValue.firstChild.nextElementSibling;

            // temp remove span displaying name while editing
            keyValue.removeChild(display_span)

            // create input for user to edit their display name
            let displayNameInput = document.createElement("input");

            // prepare inputs for user
            displayNameInput.value = displayName.displayname;
            displayNameInput.placeholder = "Display Name";
            displayNameInput.name = "displayname";
            displayNameInput.type = "text";
            displayNameInput.addEventListener("change", (e) => handleDNameChange(e));

            keyValue.appendChild(displayNameInput)
        } else {
            if (!displayName.editLock) { // ignore validation for now
                // remove input
                keyValue.removeChild(keyValue.firstChild.nextElementSibling)

                // commit changes
                user_data.display_name = displayName.displayname

                // update and replace display span
                let display_span = document.createElement("span");
                display_span.innerText = user_data.display_name
                keyValue.appendChild(display_span)
                displayName.editing = false;
            }
        }
    }

    return (
        <div>
            <h1>Settings</h1>
            <div className="setting_item">
                <div>
                    <span className="attribute">Name</span>
                    <span>{user_data.first_name + " " + user_data.last_name}</span>
                </div>
                <button title="edit name" className="edit" onClick={() => handleEditName()}>
                    <img src={edit_icon} alt="edit"/>
                </button>
            </div>

            <div className="setting_item">
                <div>
                    <span className="attribute">Display Name</span>
                    <span>{user_data.display_name}</span>
                </div>
                <button title="edit display name" className="edit" onClick={() => handleEditDName()}>
                    <img src={edit_icon} alt="edit"/>
                </button>
            </div>

            <div className="setting_item">
                <div>
                    <span className="attribute">Profile Image</span>
                    <img className="profile_img" src={user_data.image_url} alt="profile"/>
                </div>
                <button className="edit">
                    <img src={edit_icon} alt="edit"/>
                </button>
            </div>
        </div>
    )
}

export default Settings;