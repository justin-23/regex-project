import React from 'react';

interface TextareaProps {
    placeholder: string;
    onchange: (str: string) => void;
}

interface TextareaState { }

class FancyTextarea extends React.Component<TextareaProps, TextareaState> {

    onchange (e: any) {
        const contents = e.target.value;
        
        this.props.onchange(contents);
    }

 
    
    render () {
        return (
            <div className = "textarea_outer">
                <textarea     data-gramm="false" placeholder={this.props.placeholder}  onChange={(e) => this.onchange(e)}></textarea>
            </div>
        )
    }
}


export default FancyTextarea;