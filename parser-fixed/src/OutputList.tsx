//  Author justin lee
import React from 'react';
import OutputRow, {OutputRowProps} from './OutputRow';

interface OutputListProps {    
    setAddToList: (f: (props: OutputRowProps) => void) => void;
}

interface OutputListState {
    propsList: OutputRowProps[];
}

class OutputList extends React.Component<OutputListProps, OutputListState> {
    constructor(props: any) {
        super(props);
        this.state = {
            propsList: [],
        }
        this.addToList = this.addToList.bind(this);
        this.props.setAddToList(this.addToList);
    }
    
    addToList(props: OutputRowProps) {
        
        const propsList = this.state.propsList;
        propsList.unshift(props);
        this.setState({ propsList });
    }

    render() {
        return this.state.propsList.map(({pattStr, testStr, success}) => 
        <OutputRow pattStr={pattStr} testStr={testStr} success={success} />
        )
    }    
}

export default OutputList