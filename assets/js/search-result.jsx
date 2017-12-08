

import React from 'react';

class SearchResult extends React.Component {
    
    render() {
        if (this.props.orders.length === 0) {
            return null;
        }

        return <table className="table table-bordered order-list">
            <thead>
                <tr>
                    <th>User</th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>{this.props.orders.map(order => 
                <SearchResultRow 
                    key={order.id} 
                    order={order} 
                    products={this.props.products} 
                    users={this.props.users} 
                    addMessage={this.props.addMessage} 
                    refreshSearchResult={this.props.refreshSearchResult} />)}</tbody>
        </table>;
    }
    
};

class SearchResultRow extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            edit: false
        };

        this.editOrder = this.editOrder.bind(this);
        this.cancelEdit = this.cancelEdit.bind(this);

        this.handleUserChange = this.handleUserChange.bind(this);
        this.handleProductChange = this.handleProductChange.bind(this);
        this.handleQuantityChange = this.handleQuantityChange.bind(this);
        
        this.removeOrder = this.removeOrder.bind(this);
        this.saveOrder = this.saveOrder.bind(this);
        
    }

    removeOrder() {
        fetch('/order/delete/' + this.props.order.id, {method: 'POST'})
            .then(response => response.json())
            .then(response => {
                var messageType = 'error';

                if (response.success) {
                    messageType = 'success';
                    this.props.refreshSearchResult();
                }

                this.props.addMessage(response.message, messageType);
            });        
    }
    
    saveOrder() {
        
        var formData = new FormData();
        
        formData.set('user-id', this.state.user);
        formData.set('product-id', this.state.product);
        formData.set('quantity', this.state.quantity);
        
        return fetch('/order/save/' + this.props.order.id, {
            method: 'POST',
            body: formData
        }).then(response => response.json())
        .then(response => {
            var messageType = 'error';
            
            if (response.success) {
                messageType = 'success';
                
                this.props.refreshSearchResult().then(() => {
                    this.setState({edit: false});
                });
            }

            this.props.addMessage(response.message, messageType);
        });
    }

    editOrder() {
        const order = this.props.order;

        this.setState({
            edit: true,
            user: order.user.id,
            product: order.product.id,
            price: parseFloat(order.product.price),
            total: order.total,
            quantity: order.quantity
        });
    }

    cancelEdit() {
        this.setState({
            edit:false, user: null, 
            product: null, price: null, 
            total: null, quantity: null
        });
    }

    handleUserChange(event) {
        this.setState({user: event.target.value});
    }

    handleProductChange(event) {
        const target = event.target;
        const option = target.options[target.selectedIndex]; 
        
        const product = target.value;
        const price = parseFloat(option.dataset.price);
        
        this.setState(prevState => {
            var total = price * prevState.quantity;
            
            if (product == 2 && prevState.quantity > 2) {
                total *= 0.80;
            }
            
            total = total.toFixed(2);

            return {product, price, total};
        });
    }

    handleQuantityChange(event) {
        const quantity = event.target.value;
        
        this.setState(prevState => {
            var total = prevState.price * quantity;

            if (prevState.product == 2 && quantity > 2) {
                total *= 0.80;
            }

            total = total.toFixed(2);

            return {quantity, total};
        });
    }

    render() {
        const order = this.props.order;

        if (this.state.edit) {
            return <tr>
                <td><select value={this.state.user} onChange={this.handleUserChange}
                    className="form-control">{this.props.users.map(item => <option value={item.id} key={item.id}>{item.name}</option>)}</select></td>
                <td><select value={this.state.product} onChange={this.handleProductChange}
                    className="form-control">{this.props.products.map(item => <option value={item.id} key={item.id} data-price={item.price}>{item.name}</option>)}</select></td> 
                <td>{this.state.price.toFixed(2)} EUR</td>
                <td><div className="input-group"><input value={this.state.quantity} required="required" onChange={this.handleQuantityChange}
                className="form-control" type="number" id="input-quantity" min="1" /><span className="input-group-addon">EUR</span></div></td>
                <td>{this.state.total} EUR</td>
                <td>{order.date}</td>
                <td className="actions">
                    <a href="#save" onClick={this.saveOrder}>Save</a>
                    <a href="#cancel" onClick={this.cancelEdit}>Cancel</a>
                </td>
            </tr>;
        }

        return <tr>
            <td>{order.user.name}</td>
            <td>{order.product.name}</td>
            <td>{order.product.price} EUR</td>
            <td>{order.quantity}</td>
            <td>{order.total} EUR</td>
            <td>{order.date}</td>
            <td className="actions">
                <a href="#edit" onClick={this.editOrder}>Edit</a>
                <a href="#delete" onClick={this.removeOrder}>Delete</a>
            </td>
        </tr>;
    }
}

export default SearchResult;