import { useDispatch } from "react-redux";
import { logOut } from "../login/userSlice";

const Messenger = () => {
  //used to send actions to the redux store to change its state
  const dispatch = useDispatch();
  return (
    <div className="container center">
      <div>
        <h2>Welcome, You are logged in</h2>
        <button className="btn" onClick={() => dispatch(logOut())}>
          LogOut
        </button>
      </div>
    </div>
  );
};

export default Messenger;
