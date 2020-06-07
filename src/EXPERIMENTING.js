import React,{ useState, Component } from 'react';
import ErrorBoundary from './errorHandling/ErrorBoundary';

export default class GrandParent extends Component {

    constructor(props){
        super(props);
        this.state={hasError:false}
      }
    // We pass a callback to Child
    render (){ 
    return <ErrorBoundary>
        <Parent />
    </ErrorBoundary>   
    };
}




function Parent() {
    const [value, setValue] = useState("bla");

    function handleChange(newValue) {
        //if (newValue === 'hola') throw new Error('I crashed!');
        setValue(newValue);
    }

    // We pass a callback to Child
    return (
    <>
        <Child value={value} onChange={handleChange} />
        <p>Text is: {value}</p>
        {value === 'hola'? value.map() : null}
    </>   
    );
}

function Child(props) {
    function handleChange(event) {
        // Here, we invoke the callback with the new value
        props.onChange(event.target.value);
    }
  
    return <input value={props.value} onChange={handleChange} />
}

