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
    const [obj, setObj] = useState({ a: 1, b: 2});

    function handleChange(newValue) {
        //if (newValue === 'hola') throw new Error('I crashed!');
        setValue(newValue);
        obj["a"] = obj["a"]+1;
    }

    // We pass a callback to Child
    return (
        <>
            <Child {...{ onChange: handleChange }} value={value}  /> {/* onChange={handleChange} /> */}
            <p>Text is: {value}</p>
            <p>Text2 is: {obj.a}</p>
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

