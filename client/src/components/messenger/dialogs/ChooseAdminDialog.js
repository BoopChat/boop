import { React, useEffect, useState } from "react";

import Modal from "./Modal";

const ChooseAdminDialog = ({ onClose, participants, id }) => {
    const [choosen, setChoosen] = useState(null);
    const [candidates, setCandidates] = useState([]);

    useEffect(() => {
        // filter out user as a candidate to be the new admin
        setCandidates(participants.filter(p => p.id !== id));
    }, []);

    const handleClose = btnClicked => {
        onClose({ choosen, btnClicked });
        setChoosen(null);
    };

    const handleListChange = (e) => {
        // if checkbox is checked then add it to the list else remove it from the list
        setChoosen(e.target.value);
    };

    return (
        <Modal onClose={() => handleClose(false)} center>
            <div id="add-convo-dialog">
                <header>Select a new admin user</header>
                <main>
                    <ul className="add_participants">
                        {candidates.map((participant) => (
                            <li key={participant.id} title={`${participant.displayName} (${participant.booptag})`}>
                                <div className="img_and_name">
                                    <img src={participant.imageUrl} alt="contact_img" />
                                    <div>
                                        <span className="displayName">{participant.displayName}</span>
                                        <span className="booptag">{`(${participant.booptag})`}</span>
                                    </div>
                                </div>
                                <input
                                    type="radio"
                                    name="choices"
                                    value={participant.id}
                                    onChange={handleListChange}
                                />
                            </li>
                        ))}
                    </ul>
                </main>
                <footer>
                    <button onClick={() => handleClose(true)} name="update" className="addConversation">Choose</button>
                </footer>
            </div>
        </Modal>
    );
};

export default ChooseAdminDialog;