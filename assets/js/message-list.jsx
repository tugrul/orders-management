
import React from 'react';

class MessageList extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
            messages: []
        };
        
        this.addMessage = this.addMessage.bind(this);
    }

    addMessage(text, type) {
        this.setState(prevState => ({
            messages: prevState.messages.concat({text, type})
        }));
    }

    removeMessage(index) {
        this.setState(prevState => ({
            messages: prevState.messages.filter((message, target) => target !== index)
        }));
    }
    
    render() {
        const messages = this.state.messages;
        
        if (messages.length === 0) {
            return null;
        }

        return <div className="message-list">{messages.map((message, index) => <Alert key={index} message={message} remove={this.removeMessage.bind(this, index)} />)}</div>;
    }
}

class Alert extends React.Component {
    render() {
        return <div className={'alert alert-' + this.props.message.type + ' alert-dismissible'} role="alert">
            <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={this.props.remove}><span aria-hidden="true">&times;</span></button>
            {this.props.message.text}
        </div>;
    }
}

export default MessageList;