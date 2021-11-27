//author justin lee
import React from 'react';

interface OutputRowProps {
    pattStr: string;
    testStr: string;
    success: boolean;
}

interface OutputRowState { }
class OutputRow extends React.Component<OutputRowProps, OutputRowState> {
    render() {
        const {pattStr, testStr} = this.props;
        return (
            <tr className="output_row">
                <td>{pattStr ? `/${pattStr}/` : "(empty)"}</td>
                <td>{testStr ? `"${testStr}"` : "(empty)"}</td>
                <td className={"success_"+this.props.success}>{this.props.success ? "Accept" : "Reject"}</td>
            </tr>
        )
    }
}

export default OutputRow;

export type {
    OutputRowProps
}