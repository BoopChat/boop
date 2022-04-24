import edit_icon from "../../assets/icons/icons8-edit.svg";
import copy_icon from "../../assets/icons/copy.svg";
import ClipboardCheck from "../../assets/icons/clipboardCheck.js";
import Check from "../../assets/icons/check";

import { useState, React } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUserInfo } from "../../redux-store/userSlice";

import { SettingsController } from "./controllers/Settings";
import { AlertType, useAlertDialogContext } from "./dialogs/AlertDialog";

const Settings = () => {
    // Updating the image url is still not yet implemented

    const dispatch = useDispatch();
    const token = useSelector((state) => state.user.token);
    const { userInfo } = useSelector((state) => state.user);
    const updateUser = (updatedInfo) => dispatch(setUserInfo({ ...updatedInfo }));

    const { display: displayDialog } = useAlertDialogContext();

    const [errors, setErrors] = useState({ firstname: "", lastname: "", displayname: "" });
    const [showCheck, setShowCheck] = useState(false);

    const [Name, setName] = useState({
        firstname: userInfo.firstName,
        lastname: userInfo.lastName,
        editing: false, // determines whether name is being edited
    });

    const handleNameChange = (e) => {
        const { name, value } = e.target;
        setName({ ...Name, [name]: value });
        const { reason, valid } = SettingsController.validateName(value);
        if (valid)
            setErrors({ ...errors, [name]: "" });
        else setErrors({ ...errors, [name]: reason });
    };

    const [displayName, setDisplayName] = useState({
        displayname: userInfo.displayName,
        editing: false, // determines whether displayname is being edited
    });

    const handleDNameChange = (e) => {
        const { name, value } = e.target;
        setDisplayName({ ...displayName, [name]: value });

        const { reason, valid } = SettingsController.validateDisplayName(value);
        if (valid)
            setErrors({ ...errors, [name]: "" });
        else setErrors({ ...errors, [name]: reason });
    };

    const handleEditName = async () => {
        if (!Name.editing)
            setName({ ...Name, editing: true });
        else {
            let result = SettingsController.validateName(Name.firstname);
            if (!result.valid) {
                displayDialog({ title: "Error", message: "First " + result.reason, type: AlertType.Error });
                return;
            }

            result = SettingsController.validateName(Name.lastname);
            if (!result.valid) {
                displayDialog({ title: "Error", message: "Last " + result.reason, type: AlertType.Error });
                return;
            }

            const { success, msg } = await SettingsController.updateUser({
                userInfo: { firstName: Name.firstname, lastName: Name.lastname }, token });

            if (success) {
                updateUser({ ...userInfo,   firstName: Name.firstname, lastName: Name.lastname });
                setName({ ...Name, editing: false });
                displayDialog({
                    title: "Success",
                    message: msg,
                    type: AlertType.Success
                });
            } else {
                displayDialog({
                    title: "Error",
                    message: msg || "An Error occurred updating your name",
                    type: AlertType.Error
                });
            }
        }
    };

    const handleEditDName = async () => {
        if (!displayName.editing)
            setDisplayName({ ...displayName, editing: true });
        else {
            let result = SettingsController.validateDisplayName(Name.firstname);
            if (!result.valid) {
                displayDialog({ title: "Error", message: result.reason, type: AlertType.Error });
                return;
            }

            const { success, msg } = await SettingsController.updateUser({
                userInfo: { displayName: displayName.displayname }, token });

            if (success) {
                updateUser({ ...userInfo,  displayName: displayName.displayname });
                setDisplayName({ ...displayName, editing: false });
                displayDialog({
                    title: "Success",
                    message: msg,
                    type: AlertType.Success
                });
            } else {
                displayDialog({
                    title: "Error",
                    message: msg || "An Error occurred updating your display name",
                    type: AlertType.Error
                });
            }
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(userInfo.displayName + "#" + userInfo.id);
        setShowCheck(true);
        setTimeout(() => setShowCheck(false), 1500);
    };

    return (
        <div id="settings_container">
            <h1>Settings</h1>
            <div className="setting_item">
                <div>
                    <span className="attribute">Name</span>
                    {Name.editing ? (
                        <div>
                            <div className="editInput">
                                <span className="error">{errors.firstname}</span>
                                <input value={Name.firstname} placeholder="First Name" name="firstname" type="text"
                                    onChange={(e) => handleNameChange(e)}/>
                            </div>
                            <div className="editInput">
                                <span className="error">{errors.lastname}</span>
                                <input value={Name.lastname} placeholder="Last Name" name="lastname" type="text"
                                    onChange={(e) => handleNameChange(e)}/>
                            </div>
                        </div>
                    ) : <span>
                        {Name.firstname + " " + Name.lastname}
                    </span>
                    }
                </div>
                <button title="edit name" className="edit" onClick={() => handleEditName()}>{
                    Name.editing ?
                        <Check className={errors.firstname.length > 0 || errors.lastname.length > 0 ? "red" : "green"}/>
                        : <img src={edit_icon} alt="edit"/>
                }</button>
            </div>

            <div className="setting_item">
                <div>
                    <span className="attribute">Display Name</span>
                    {displayName.editing ?
                        <div className="editInput">
                            <span className="error">{errors.displayname}</span>
                            <input
                                value={displayName.displayname}
                                placeholder="Display Name"
                                name="displayname"
                                type="text"
                                onChange={(e) => handleDNameChange(e)}
                            />
                        </div>
                        :   <span className="displayname">{userInfo.displayName}</span>
                    }
                    <span>#{userInfo.id}</span>
                </div>
                <div className="edit">
                    <button title="copy display name to clipboard" className="edit" onClick={copyToClipboard}>
                        { showCheck ? <ClipboardCheck className="green"/> : <img src={copy_icon} alt="copy" /> }
                    </button>
                    <button title="edit display name" className="edit" onClick={() => handleEditDName()}>{
                        displayName.editing ?
                            <Check className={errors.displayname.length > 0 ? "red" : "green"}/>
                            : <img src={edit_icon} alt="edit"/>
                    }</button>
                </div>
            </div>

            <div className="setting_item">
                <div>
                    <span className="attribute">Profile Image</span>
                    <img className="profile_img skeleton" src={userInfo.imageUrl} alt=""/>
                </div>
                <button className="edit">
                    <img src={edit_icon} alt="edit"/>
                </button>
            </div>
        </div>
    );
};

export default Settings;