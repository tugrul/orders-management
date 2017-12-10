

import React from 'react';
import ReactDOM from 'react-dom';

import MessageList from './message-list.jsx';

import CreateOrderForm from './form/order/create.jsx';
import SearchOrderForm from './form/order/search.jsx';
import SearchResult from './search-result.jsx';


class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [],
            products: [],
            orders: []
        };
        
        this.addMessage = this.addMessage.bind(this);
        this.loadOrders = this.loadOrders.bind(this);
        this.refreshSearchResult = this.refreshSearchResult.bind(this);
    }
    
    refreshSearchResult() {
        if (this.searchOrderForm) {
            return this.searchOrderForm.loadOrders();
        } else {
            console.log('searchOrderForm not exists');
        }
    }
    
    addMessage(text, type) {
        if (this.messageList) {
            this.messageList.addMessage(text, type);
        } else {
            console.log('type: %s, message: %s', type, text);
        }
    }

    loadOrders(term, range) {
        var formData = new FormData();
        formData.set('term', term);
        formData.set('range', range);
        
        var options = {
            method: 'POST',
            body: formData
        };

        return fetch('/order/search', options)
                .then(response => response.json())
                .then(response => {
                    if (!response.success) {
                        this.addMessage(response.message, 'error');
                        return response;
                    }

                    if (response.message) {
                        this.addMessage(response.message, 'info');
                    }

                    this.setState({orders: response.orders});
                    
                    return response;
                });
    }
    
    loadUsers() {
        return fetch('/user/list').then(response => response.json());
    }
    
    loadProducts() {
        return fetch('/product/list').then(response => response.json());
    }
    
    componentDidMount() {
        
        this.refreshSearchResult();
        
        Promise.all([this.loadUsers(), this.loadProducts()]).then(([users, products]) => {

            if (!users.success) {
                users = [];
                this.addMessage('User list could not load', 'warning');
            } else {
                users = users.items;
            }

            if (!products.success) {
                products = [];
                this.addMessage('Product list could not load', 'warning');
            } else {
                products = products.items;
            }

            this.setState({users, products});

        });
        
    }

    render() {
        return <div className="container">
            <MessageList ref={(messageList) => {this.messageList = messageList;}} />
            <CreateOrderForm 
                addMessage={this.addMessage} 
                products={this.state.products} 
                users={this.state.users}
                refreshSearchResult={this.refreshSearchResult} />
            <SearchOrderForm 
                ref={(searchOrderForm) => {this.searchOrderForm = searchOrderForm;}}
                addMessage={this.addMessage} 
                loadOrders={this.loadOrders}
                products={this.state.products} 
                users={this.state.users} range={this.state.range} term={this.state.term} />
            <SearchResult 
                addMessage={this.addMessage} 
                orders={this.state.orders}
                products={this.state.products} 
                users={this.state.users}
                refreshSearchResult={this.refreshSearchResult} />
        </div>;
    }
};

ReactDOM.render(<App/>, document.getElementById('app'));

