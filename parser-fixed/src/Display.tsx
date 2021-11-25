import React from 'react';

import OutputRow, {OutputRowProps} from './OutputRow';
import OutputList from './OutputList';

interface DisplayProps {
    pattStr: string;
    testStr: string;
    setAddToList: (f: (props: OutputRowProps) => void) => void;

}

interface DisplayState {
    outputList: OutputRowProps[];
    addToList: (props: OutputRowProps) => void; 
}

class Display extends React.Component<DisplayProps, DisplayState> {
    constructor(props: any) {
        super(props);
        this.state = {
            outputList: [{
                pattStr: "test1",
                testStr: "okay", 
                success: true,
            },{
                pattStr: "tesaaaaat1",
                testStr: "aaaa", 
                success: false,
            },],
            addToList: (props: OutputRowProps) => 0,
        }
    }
    
    
    addToList (props: OutputRowProps) {
        return this.state.addToList(props);
    }
    
    render() {

        return (
            <OutputList setAddToList={((addToList: (props: OutputRowProps) => void) => {
                this.setState({addToList});
                this.props.setAddToList(addToList);
            }).bind(this)}/> 
        )
    }

}


export default Display;