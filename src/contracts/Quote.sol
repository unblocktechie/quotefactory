pragma solidity 0.5.16;

import "./ERC721Full.sol";

contract Quote is ERC721Full {
  string[] public quotes;
  mapping(string => bool) quoteExists;
  

  constructor() ERC721Full("Quote", "QUOTE") public {
  }

  function mint(string memory _quote) public {
    require(!quoteExists[_quote]);
    uint _id = quotes.push(_quote);
    _mint(msg.sender, _id);
    quoteExists[_quote] = true;
  }

}
