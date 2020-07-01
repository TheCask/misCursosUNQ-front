import React,{ useState, Component } from 'react';
import ErrorBoundary from '../errorHandling/ErrorBoundary';

export default function Parent(props) {

    const [course, setCourse] = useState({ 
        evaluations: [{
            evaluationId: 1, 
            name: "Test", 
            califications: [
                {
                    "calificationId": 1,
                    "student": {
                        "fileNumber": 14111
                    },
                    "note": 4.0
                }
            ] 
        }] 
    })
    //const [eval, setEval] = useState(course.evaluations[0]);
    //const [eval, setEval] = useState(course.evaluations[0]);

/*     function createStudentListCalifications(students, califications){
        // Uses student list and existing califications to create califications for all 
        return students.map( st => {
            const calificationFound = califications.find( cal => cal.student.fileNumber === st.fileNumber);
            return ( calificationFound ? calificationFound : createCalif(st) );
        })
    }

    function createCalif(student){
        return {
            calificationId: '',
            student: { fileNumber: student.fileNumber},
            note: ''
            }
    }

    function filterNonEmptyCalifications(califications){
        califications.filter( cal => cal.note !== '' && isNaN(cal.note))
    } */

/*     return (
        <>
            <Eval evaluations={course.evaluations} onSaveEval={onSaveEval} onChangeEval={onChangeEval} />
            <Calif califications={props.evaluations.califications} onSaveCalif={onSaveCalif}  />
        </>
    ); */
}



/* function Eval(props) {

    const [eval, setEval] = useState({});

    function onSelectionChange() {

    }
    
    

     return (
       
    ); 
} */
/* 
function Calif(props) {
    
    return <input value={props.value} onChange={handleChange} />
}

 */