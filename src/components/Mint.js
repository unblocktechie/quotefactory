import React, {useState, useEffect} from 'react';
import { Input, Button, Segment, Form, Card } from 'semantic-ui-react';
import Quote from '../abis/Quote.json';
import Trade from '../abis/Trade.json';
import Web3 from 'web3';
import ListQuote from "./ListQuote";
import Masonry from "react-masonry-css";

function Mint(){
    const [loadind,setLoading] = useState(false);
    const [inp, setInp] = useState("");
    const [account,setAccount] = useState('');
    const [contract,setContract] = useState({});
    const [trade,setTrade] = useState({});
    const [address,setAddress] = useState();
    const [quote,setQuote] = useState([]);
    const breakpointColumnsObj = {
      default: 4,
      1100: 3,
      700: 2,
      500: 1
      };

    function loadBlockchainData(){
        const web3 = window.web3;

        web3.eth.getAccounts()
        .then(res=>{
            const acc = res[0];
            setAccount(res[0]);

            web3.eth.net.getId().then((response)=>{
                const quoteData = Quote.networks[response];
                if(quoteData) {
                  const qtm = new web3.eth.Contract(Quote.abi, quoteData.address);
                  setContract(qtm);  

                    qtm.methods.balanceOf(acc).call()
                    .then(res=>{
                        let count = res.toString()-1;
                        for (var i = count; i >= 0; i--) {
                           qtm.methods.tokenOfOwnerByIndex(acc,i).call()
                           .then(response=>{
                            let _id = response.toString();   
                            let cnt = _id-1;   
                            qtm.methods.quotes(cnt).call()
                            .then(res=>{
                                setQuote(prevquote => {
                                    return [...prevquote, {name:res,id:_id}];
                                });
                            })
                            .catch(err=>{console.log(err)});
                           })
                           .catch(err=>{console.log(err)});
                        }
                    })
                    .catch(err=>{console.log(err)});

                } else {
                  window.alert('Quote contract not deployed to detected network.');
                }

                //trade contract

                const tradeData = Trade.networks[response];
                if(tradeData) {
                const trd = new web3.eth.Contract(Trade.abi, tradeData.address);
                setTrade(trd);
                setAddress(tradeData.address);
                } else {
                window.alert('Trade contract not deployed to detected network.');
                }

              }).catch((err)=>{
                window.alert("something went wrong, try again");
            });
        })
        .catch(err=>{console.log(err)});
        
      }
      
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
    
      useEffect(() => {
        loadWeb3();  
        loadBlockchainData();
      },[])

    function handleChange(event){
        setInp(event.target.value);
    }

    function mintQuote(){
        setLoading(true);
        contract.methods.mint(inp).send({ from: account })
        .on('confirmation', (confirmation) => {
            window.location.reload();
        })
        .on('error', (error) => {
            window.alert("Quote already exist. Please choose another one");
            setLoading(false);
        });
    }
    
    return(
      <>
        <div className="mint"> 
         <Segment basic textAlign="center">
            <Form>
            <Form.Field>
            <Input placeholder=" Add Quote... " onChange={handleChange} size="massive" fluid />
            </Form.Field>
            <Form.Field>
            {loadind?<p>Mint in progress...</p>:
            <Button color="red" size="big" fluid onClick={mintQuote} >Mint</Button>
            }
            </Form.Field>
            </Form>
         </Segment>
         </div>
         <Segment basic textAlign="center">
        {(quote.length===0)&&<p>No quotes loaded yet!</p>}
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
                    <Card.Content extra>
                    <ListQuote id={item.id} trade={trade}
                     address={address} quote={contract} account={account} />
                    </Card.Content>
                </Card> 
              </div>
            );
            })}
        </Masonry>    
        </Segment>
      </>
  );
}

export default Mint;
