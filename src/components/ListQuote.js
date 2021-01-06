import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Button, Modal, Form, Message } from "semantic-ui-react";

function ListQuote(props){
  const [open, setOpen] = useState(false);
  const [ipData, setIpData] = useState({price : "" });
  const [loadind,setLoading] = useState(false);
  const [message,setMessage] = useState(false);

 function handleChange(event) {
  const { name, value } = event.target;

  setIpData(prevIpData => {
    return {
      ...prevIpData,
      [name]: value
    };
  });
  }   

  function update(){
    setLoading(true);

    let etherAmount;
    etherAmount = ipData.price.toString();
    etherAmount = window.web3.utils.toWei(etherAmount, 'Ether');

    props.quote.methods.approve(props.address,props.id).send({from:props.account})
    .once('confirmation',((confirmation)=>{
        props.trade.methods.listQuote(props.id, etherAmount).send({from:props.account})
        .once('confirmation',(confirmation)=>{
            setMessage(true);
            setLoading(false);
        })
        .on('error',(error)=>{
            window.alert("something went wrong. please try again.");
            setOpen(false);
            setLoading(false);
        });
    }))
    .on('error',(error)=>{
        window.alert("something went wrong. please try again.");
        setLoading(false);
    });
  }

  return (
    <Modal
      closeIcon
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button color="grey" fluid>
                List for Sale</Button>}
    >
      <Modal.Header>List Quote For Sale!!!</Modal.Header>
      <Modal.Content>
      {loadind?<p>loading...please wait...It may take 5-10 minutes...</p>
      :message?<Message>
                  <Message.Header>Quote successfully listed for sell</Message.Header>
                  <p>
                    Your Quote Purchase Link : 
                    <NavLink to={"/quotefactory/purchase?id=".concat(props.id)}>"/purchase?id={props.id}"</NavLink>
                  </p>
              </Message> 
      :<Modal.Description>
        <Form>
        <Form.Input 
            placeholder='Add price in ETH'
            name='price'
            value={ipData.price}
            onChange={handleChange} /> 
        <Button onClick={update} color='red' fluid>
          List Quote
        </Button>       
        </Form>
        </Modal.Description>
        }
      </Modal.Content>
    </Modal>
  );
}

export default ListQuote;