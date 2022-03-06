import React, { useContext, useState } from "react";

const SearchContext = React.createContext();
export const useSearchContext = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
    const [search, setSearch] = useState("");

    return (
        <SearchContext.Provider value={{ search, setSearch }}>
            { children }
        </SearchContext.Provider>
    );
};