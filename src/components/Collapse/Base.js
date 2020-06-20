import React, { Component } from 'react';
import 'antd/dist/antd.css';
//import './index.css';
import { Collapse } from 'antd';
import axios from 'axios';
import Demo from './Table';


const { Panel } = Collapse;

// const text = `
//   A dog is a type of domesticated animal.
//   Known for its loyalty and faithfulness,
//   it can be found as a welcome guest in many households across the world.
// `;



class Base extends Component{
  constructor(props) {
    super(props)
  
    this.state = {
       data: []
    }
  }

  componentWillMount(){
    axios.get('https://jsonplaceholder.typicode.com/posts')
    .then(res =>{
      console.log(res.data);
      
      this.setState({ data : res.data})
    })
  }

render(){
const {data} = this.state
  return(

    <Collapse accordion>

      {

       data.map(data => (
        <Panel header={data.title} key={data.id}>
          <p><Demo /></p>
       <p style = {{textAlign : "center", fontWeight : "bolder"}}>
        Net Amount Rs{data.id}</p>
        </Panel>
       ))

      }
  </Collapse>
  )
}
}

export default Base

