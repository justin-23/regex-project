import React from 'react';

interface TextareaProps {
    contents: string;
    placeholder: string;
}

interface TextareaState {
    contents: string;
}

class FancyTextarea extends React.Component<TextareaProps, TextareaState> {

    constructor(props: any) {
        super(props);
        const contents: string = props.contents;
        this.state = {contents}
    }
    onchange (e: any) {
        const contents = e.target.value;
        this.setState({contents},() => {
            console.log("New text entered: " + this.state.contents)
        });
    }
    
    render () {
        return (
            <div className = "textarea_outer">
                <textarea value={this.state.contents} placeholder={this.props.placeholder} onChange={(e) => this.onchange(e)}></textarea>
            </div>
        )
    }
}


export default FancyTextarea;