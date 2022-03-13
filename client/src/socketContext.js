// Sets up a "socket context" which can be imported into any component
// to access the socket instance.
import React from "react";
const SocketContext = React.createContext();
export default SocketContext;