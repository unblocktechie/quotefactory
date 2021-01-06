pragma solidity ^0.5.16;

import "./Quote.sol";

contract Trade {
  string public name = "Quote trade";
  Quote public quote;
  mapping(uint => Item) public quoteList;
  
  struct Item {
        bool forSell;
        uint price;
    }
  
  constructor(Quote _quote) public {
    quote = _quote;
  }
  
  function listQuote(uint _id, uint _price) public {
    address _owner = quote.ownerOf(_id);
    require(msg.sender == _owner);
    quoteList[_id] = Item(true,_price);
  }
  
  function buyQuote(uint _id) public payable{
     address _approved = quote.getApproved(_id);
     require(address(this) == _approved);
     require(quoteList[_id].forSell);
     require(quoteList[_id].price <= msg.value);
     address _owner = quote.ownerOf(_id);
     address payable wallet = address(uint160(_owner));
     wallet.transfer(msg.value);
     quote.transferFrom( _owner, msg.sender, _id);
     quoteList[_id] = Item(false,0);
  }

}