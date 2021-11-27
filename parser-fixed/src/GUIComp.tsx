//GUI .tsx
// author Justin Lee november 24 2021.. late :)

import React from 'react';
import FancyTextarea from './FancyTextarea';
import { OutputRowProps } from './OutputRow';
import Display from './Display';
import { convertRegexToNFAFunction } from './regex';
import Intro from './Intro';

interface GUIProps { }

interface GUIState {
    pattStr: string;
    testStr: string;
    success: boolean;
    addToList: (props: OutputRowProps) => void;
    evalFunction: (test: string) => boolean; 
}
class GUI extends React.Component<GUIProps, GUIState> {
    constructor(props: any) {
        super(props);
        this.state = {
            pattStr: "",
            testStr: "",
            addToList: (props: OutputRowProps) => 0,
            success: false,
            evalFunction: (test: string) => false,
        };

        this.on_patt_change = this.on_patt_change.bind(this);
        this.on_test_change = this.on_test_change.bind(this);
    }
    on_patt_change(pattStr: string) {
        this.setState({pattStr})
        const evalFunction = convertRegexToNFAFunction(pattStr);
        this.setState({evalFunction}, this.updateSuccessValue);

    }

    on_test_change(testStr: string) {
        this.setState({testStr}, this.updateSuccessValue);

    }
    
    updateSuccessValue() {
        this.setState({success: this.state.evalFunction(this.state.testStr)})
    }
    onKeyDown(e: any) {
        if (e.keyCode === 13)
            {
            // prevent default behavior
            e.preventDefault();
            console.log(this.state.evalFunction);
            const { pattStr, testStr, success } = this.state;
            this.state.addToList({
                pattStr, testStr, success
            })
        }
    }

    render() {
        return (
        <div id="holder_outer" onKeyDown={(e) => this.onKeyDown(e)}>
            <Intro />
            <div className="holder">
                <FancyTextarea placeholder="Enter regex here..." onchange={(e) => this.on_patt_change(e)} />
                <FancyTextarea placeholder="Enter test string here..." onchange={(e) => this.on_test_change(e)} />
            </div>
            <div className="holder">
                
                    <Display success={this.state.success}pattStr={this.state.pattStr} testStr={this.state.testStr} 
                    setAddToList={(addToList: (props: OutputRowProps) => void) => {
                        this.setState({addToList});
                    }}
                    />
    
            </div>
        </div>
        )
    }
}

export default GUI;
