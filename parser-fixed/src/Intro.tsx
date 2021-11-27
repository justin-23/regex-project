import React from 'react';

class Intro extends React.Component {
    render() {
        return (
            <div id="intro">
                String matcher by Justin Lee and Ben Chong
                <br /><br />
                Supports standard ops '(', ')', '*', '|'
                <br />
                      and additional ops '+' and '?'
                <br /><br />

                Press Enter to keep a result
            </div>
        )
    }
}

export default Intro;