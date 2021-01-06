import React, {useState, useEffect} from 'react';
import Quote from '../abis/Quote.json';
import Trade from '../abis/Trade.json';
import Web3 from 'web3';
import { Button, Card, Segment, Loader } from 'semantic-ui-react';

function Purchase(props){
  const id = (props.location.search).slice(4);
  const [loadind,setLoading] = useState(false);
  const [quote,setQuote] = useState({}); 
  const [trade,setTrade] = useState({}); 
  const [account,setAccount] = useState('');

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
            const tradeData = Trade.networks[networkId];
            if(tradeData) {
              const trd = new web3.eth.Contract(Trade.abi, tradeData.address);
              setTrade(trd);
                const cnt = id-1;
                const qt = await contract.methods.quotes(cnt).call();
                const td = await trd.methods.quoteList(id).call();
                let amount = web3.utils.fromWei(td.price.toString(),'Ether');
                setQuote( {name:qt, price:amount, listed:td.forSell});
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

      function buyQuote(){
        setLoading(true);
        const _id = id;
        const _price = quote.price;
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
    
    <div className="mint"> 
    {loadind?<Loader active inline='centered' />:
    <Segment basic textAlign="center">
    <div className="note">
      <Card fluid>
        <Card.Content>
          <Card.Description>
            <div className = "wrap">
              <h1> “ {quote.name} ” </h1>
              <p> token Id : {id} </p>
            </div> 
          </Card.Description>
        </Card.Content>
        {(quote.listed)?(
                    <Card.Content extra>
                    <Button onClick={buyQuote} 
                    color="red" fluid> Buy @ {quote.price} ETH </Button>
                    </Card.Content>
                    ):<Card.Content extra>
                    <Button 
                    color="grey" fluid> Not for Sell </Button>
                    </Card.Content>}  
      </Card> 
    </div>
    </Segment>
    }
    </div>

  );
}

export default Purchase;
