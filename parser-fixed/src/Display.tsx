import React from 'react';

import OutputRow, {OutputRowProps} from './OutputRow';
import OutputList from './OutputList';

interface DisplayProps {
    pattStr: string;
    testStr: string;
    success: boolean;
    setAddToList: (f: (props: OutputRowProps) => void) => void;

}

interface DisplayState {
    outputList: OutputRowProps[];
    addToList: (props: OutputRowProps) => void; 
}

class Display extends React.Component<DisplayProps, DisplayState> {
    constructor(props: DisplayProps) {
        super(props);
        const {pattStr, testStr, success} = props;
        this.state = {
            outputList: [{
                pattStr, testStr, success,
            }],
            addToList: (props: OutputRowProps) => 0,
        }
    }
    
    
    addToList (props: OutputRowProps) {
        return this.state.addToList(props);
    }
    
    render() {

        const {pattStr, testStr, success} = this.props;

        return (
            <table id="displayTable">
            <OutputRow pattStr={pattStr} testStr={testStr} success={success} />
            <OutputList setAddToList={(addToList: (props: OutputRowProps) => void) => {
                this.setState({addToList});
                this.props.setAddToList(addToList);
            }}/> 
            </table>
        )
    }

}


export default Display;