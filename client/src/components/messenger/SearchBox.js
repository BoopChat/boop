import React from "react";
import { useSearchContext } from "./hooks/SearchContext";

const SearchBox = ({ id }) => {
    const { search, setSearch } = useSearchContext();

    const updateSearch = e => setSearch(e.target.value);

    return (
        <div id={id}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" name="searchIcon">
                <path d="M500.3 443.7l-119.7-119.7c27.22-40.41 40.65-90.9 33.46-144.7C401.8 87.79 326.8
                    13.32 235.2 1.723C99.01-15.51-15.51 99.01 1.724 235.2c11.6 91.64 86.08 166.7 174.6
                    178.9c53.8 7.189 104.3-6.236 145.7-33.46l119.7 119.7c15.62 15.62 41.95 15.62 56.57
                    0C515.9 484.7 515.9 459.3 501.3 443.7zM79.1 208c0-70.58 57.42-128 128-128s128 57.42
                    128 128c0 70.58-57.42 127-128 128S79.1 278.6 79.1 208z" />
            </svg>
            <input type="text" placeholder="Search" value={search} onChange={updateSearch} className="searchBox" />
        </div>
    );
};

export default SearchBox;