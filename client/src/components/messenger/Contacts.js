import ContactItem from "./ContactItem"

let contacts = [
    {
        user_id: "6dT324",
        username: "Forest",
        img: "https://picsum.photos/200?random=1",
        status: "online"
    }, {
        user_id: "6dT324",
        username: "John_is_number_1",
        img: "https://picsum.photos/200?random=2",
        status: "offline"
    }, {
        user_id: "6dT324",
        username: "Amy",
        img: "https://picsum.photos/200?random=3",
        status: "away"
    }, {
        user_id: "6dT324",
        username: "Jenny",
        img: "https://picsum.photos/200?random=4",
        status: "dnd"
    }
]

const Contacts = () => {
    return (
        <div id="contact_container">
            <h1>Contacts</h1>
            <div id="contacts">
                {contacts.map((contact, i) =>
                    <ContactItem
                        img={contact.img}
                        username={contact.username}
                        user_id={contact.user_id}
                        status={contact.status}
                        key={i}
                    />
                )}
            </div>
        </div>
    )
}

export default Contacts;