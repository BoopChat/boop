import "../styles/buttons.css"

const TwitterButton = ({text="sign up with twitter", handler}) => {
    return (
        <button 
            className="twitter"
            type="button"
            onClick={handler}
            disabled
        >{text}</button>
    )
}

export default TwitterButton;