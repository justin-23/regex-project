import React from 'react';

interface OutputRowProps {
    pattStr: string;
    testStr: string;
    success: boolean;
}

interface OutputRowState { }
class OutputRow extends React.Component<OutputRowProps, OutputRowState> {
    render() {
        return (
            <tr className="output_row">
                <td>/{this.props.pattStr}/</td>
                <td>"{this.props.testStr}"</td>
                <td>{this.props.success ? "Accept" : "Reject"}</td>
            </tr>
        )
    }
}

export default OutputRow;

export type {
    OutputRowProps
}