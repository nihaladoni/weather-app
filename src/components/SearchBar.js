const SearchBar = ({ onSubmit, term, setTerm }) => {
  return (
    <form action="" className="search" onSubmit={onSubmit}>
      <div className="search__input">
        <div className="search__input--icon">
          <span className="material-icons-outlined material-icons">search</span>
        </div>

        <div className="search__input--input">
          <input
            type="text"
            placeholder="search location"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="search__button">
        <button id="searchButton">Search</button>
      </div>
    </form>
  );
};

export default SearchBar;
