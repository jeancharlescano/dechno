import React from "react";

const Header = React.memo(
  ({ onSearch }: { onSearch: (query: string) => void }) => {
    return (
      <header className="h-16 border-b border-white rounded-b flex items-center justify-center lg:justify-start lg:px-4 shadow-white shadow-sm px-4">
        <h1 className="hidden lg:block font-bold lg:w-1/3">Dechno</h1>

        <input
          id="search"
          type="text"
          onChange={(e) => onSearch(e.target.value)}
          className="rounded-xl p-2 text-sm w-1/3 max-w-lg border border-neutral-800 grow"
          placeholder="Rechercher un article ..."
        />
      </header>
    );
  }
);

export default Header;
