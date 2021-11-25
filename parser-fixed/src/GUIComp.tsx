//GUI .tsx
// author Justin Lee november 24 2021

import React, { SyntheticEvent } from 'react';
import FancyTextarea from './FancyTextarea';
import { OutputRowProps } from './OutputRow';
import Display from './Display';

interface GUIProps {

}

interface GUIState {
    pattStr: string;
    testStr: string;
    success: boolean;
    addToList: (props: OutputRowProps) => void; 
}
class GUI extends React.Component<GUIProps, GUIState> {
    constructor(props: any) {
        super(props);
        this.state = {
            pattStr: "",
            testStr: "",
            addToList: (props: OutputRowProps) => 0,
            success: false,
        };

        this.on_patt_change = this.on_patt_change.bind(this);
        this.on_test_change = this.on_test_change.bind(this);
    }
    on_patt_change(pattStr: string) {
        this.setState({pattStr})
    }

    on_test_change(testStr: string) {
        this.setState({testStr});
    }
    
    onKeyDown(e: any) {
        if (e.keyCode == 13)
            {
            // prevent default behavior
            e.preventDefault();

            const { pattStr, testStr, success } = this.state;
            this.state.addToList({
                pattStr, testStr, success
            })
        }
    }

    render() {
        return (
        <div id="holder_outer" onKeyDown={(e) => this.onKeyDown(e)}>
            <div className="holder">
                <FancyTextarea placeholder="Enter regex here..." onchange={(e) => this.on_patt_change(e)} />
                <FancyTextarea placeholder="Enter test string here..." onchange={(e) => this.on_test_change(e)} />
            </div>
            <div className="holder">
                <table>
                    <Display pattStr={this.state.pattStr} testStr={this.state.testStr} 
                    setAddToList={((addToList: (props: OutputRowProps) => void) => {
                        this.setState({addToList});
                    }).bind(this)}
                    />
                </table>
            </div>
        </div>
        )
    }
}

export default GUI;
