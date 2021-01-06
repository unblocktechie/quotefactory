import React, { useState, useEffect } from "react";
import Quote from '../abis/Quote.json';
import Trade from '../abis/Trade.json';
import Web3 from 'web3';
import { Button, Segment, Card, Loader, Message } from 'semantic-ui-react';
import Masonry from "react-masonry-css";

function Home(){
    const [loadind,setLoading] = useState(false);
    const [quote,setQuote] = useState([]); 
    const [trade,setTrade] = useState({}); 
    const [account,setAccount] = useState('');
    const breakpointColumnsObj = {
      default: 4,
      1100: 3,
      700: 2,
      500: 1
      };

    async function loadWeb3() {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum)
        await window.ethereum.enable()
      }
      else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider)
      }
      else {
        window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }
    }

    async function loadBlockchainData(){
      const web3 = window.web3;
      setLoading(true);
      web3.eth.getAccounts()
        .then(res=>{
            setAccount(res[0]);
        })
        .catch(err=>{window.alert("please select your ethereum account")})    

      const networkId = await web3.eth.net.getId();
      const quoteData = Quote.networks[networkId];
          if(quoteData) {
            const contract = new web3.eth.Contract(Quote.abi, quoteData.address);

            const totalSupply = await contract.methods.totalSupply().call();
            
            const tradeData = Trade.networks[networkId];
            if(tradeData) {
              const trd = new web3.eth.Contract(Trade.abi, tradeData.address);
              setTrade(trd);
              for (var i = totalSupply; i > 0; i--) {
                let cnt = i-1;
                let _id = cnt+1;
                const qt = await contract.methods.quotes(cnt).call();
                const td = await trd.methods.quoteList(_id).call();
                let amount = web3.utils.fromWei(td.price.toString(),'Ether');
                  setQuote(prevquote => {
                    return [...prevquote, {name:qt,id:_id,price:amount,listed:td.forSell}];
                  });   
              }
              setLoading(false);
            }
          } else {
            window.alert('Smart contract not deployed to detected network.');
            setLoading(false);
          }   
    } 
    
      useEffect(() => {
        loadWeb3();  
        loadBlockchainData();
      },[])

      function buyQuote(event){
        setLoading(true);
        const _index = event.target.value;
        const _id = quote[_index].id;
        const _price = quote[_index].price;
        const etherAmount = window.web3.utils.toWei(_price, 'Ether');
        trade.methods.buyQuote(_id).send({value:etherAmount , from:account})
        .on('confirmation', (confirmation) => {
          window.location.assign("/quotefactory/#/mint");
          setLoading(false);
        })
        .on('error', (error) => {
            window.alert("Transaction failed. Try again!");
            setLoading(false);
        });
      }

    return(
        <>
        <Segment basic textAlign="center">
         <Message compact>
         This project runs on Ropsten Test Network.
         </Message>
        </Segment>
        {loadind?<Loader active inline='centered' />:
        <Segment basic textAlign="center">
        {(quote.length===0)&&<p>No quotes yet!</p>}
          <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column">
          
            {quote.map((item, index) => {
            return (
              <div className="note" key={index}>
                <Card fluid>
                  <Card.Content>
                    <Card.Description>
                      <div className = "wrap">
                      <h1> “ {item.name} ” </h1>
                      <p> token Id : {item.id} </p>
                      </div> 
                    </Card.Description>
                  </Card.Content>
                  {(item.listed)&&(
                    <Card.Content extra>
                    <Button onClick={buyQuote} 
                    value={index}
                    color="red" fluid> Buy @ {item.price} ETH </Button>
                    </Card.Content>
                  )}    
                </Card> 
              </div>           
            );
            })}
        </Masonry>    
        </Segment>
        }
        </>
    );
}

export default Home;