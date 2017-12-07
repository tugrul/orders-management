

import React from 'react';

class Search extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
            orders: [],
            range: '1',
            term: ''
        };
        
        this.handleRangeChange = this.handleRangeChange.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
        this.searchOrder = this.searchOrder.bind(this);
    }
    
    loadOrders() {
        var formData = new FormData();
        formData.set('term', this.state.term);
        formData.set('range', this.state.range);
        
        var options = {
            method: 'POST',
            body: formData
        };

        return fetch('/order/search', options)
                .then(response => response.json())
                .then(orders => {
                    this.setState({orders});
                });
    }
    
    componentDidMount() {
        this.loadOrders();
    }
    
    searchOrder(event) {
        event.preventDefault();
        this.loadOrders();
    }
    
    
    
    handleRangeChange(event) {
        this.setState({range: event.target.value});
    }
    
    handleTermChange(event) {
        this.setState({term: event.target.value});
    }
    
    
    renderSearchForm() {
        return <div className="panel panel-default">
            <div className="panel-body"><form className="form-inline" onSubmit={this.searchOrder}>
            <div className="form-group">
                <label htmlFor="search-range">Range</label>
                <select id="search-range" className="form-control" onChange={this.handleRangeChange}>
                    <option value="1">All Time</option>
                    <option value="2">Last 7 Days</option>
                    <option value="3">Today</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="search-term">Term</label>
                <input type="text" id="search-term" className="form-control" onChange={this.handleTermChange} />
            </div>
            <button type="submit" className="btn btn-default">Search</button>
        </form>
        </div></div>;
    }
    
    render() {
        return <div>
            {this.renderSearchForm()}
            <SearchResult orders={this.state.orders} />
        </div>;
    }
    
};

class SearchResult extends React.Component {
    
    renderBody() {
        return this.props.orders.map(order => 
        <SearchResultRow key={order.id} order={order} />);
    }

    render() {
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
            <tbody>{this.renderBody()}</tbody>
        </table>;
    }
    
};

class SearchResultRow extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            edit: false,
            order: props.order,
            users: [],
            products: []
        };

        this.deleteOrder = this.deleteOrder.bind(this);
        this.editOrder = this.editOrder.bind(this);
        this.saveOrder = this.saveOrder.bind(this);
        this.cancelEdit = this.cancelEdit.bind(this);
        this.handleUserChange = this.handleUserChange.bind(this);
        this.handleProductChange = this.handleProductChange.bind(this);
        this.handleQuantityChange = this.handleQuantityChange.bind(this);
    }

    updateOrder() {

        fetch('/order/get/' + this.state.order.id)
                .then(response => response.json())
                .then(order => {
                    this.setState({order});
                });
        
    }

    

    
    getOrder() {
        return fetch('/order/get/' + this.state.order.id).then(response => response.json());
    }
    
    loadUsers() {
        return fetch('/user/list').then(response => response.json());
    }
    
    loadProducts() {
        return fetch('/product/list').then(response => response.json());
    }
    
    
    
    editOrder() {
        
        Promise.all([this.loadUsers(), this.loadProducts()]).then(([users, products]) => {
            this.setState({users, products, edit: true});
        });

    }
    
    deleteOrder() {
        fetch('/order/delete/' + this.state.order.id, {method: 'POST'})
                .then(response => response.json())
                .then(response => {
                    if (response.success) {
                        this.setState({order: null});
                    }
                });
    }
    
    saveOrder() {
        var order = this.state.order;
        
        var formData = new FormData();
        
        formData.set('user-id', order.user.id);
        formData.set('product-id', order.product.id);
        formData.set('quantity', order.quantity);
        
        fetch('/order/save/' + order.id, {
            method: 'POST',
            body: formData
        }).then(response => response.json())
                .then(response => {
                    if (response.success) {
                        this.setState({edit:false, order: response.order});
                    }
                });
    }

    cancelEdit() {
        
        this.getOrder().then(order => {
            this.setState({edit:false, order});
        });
        
    }

    handleUserChange(event) {
        const target = event.target;
        const option = target.options[target.selectedIndex]; 
        const id = target.value;
        const name = option.textContent;
        
        this.setState(prevState => {
            prevState.order.user = {id, name};
            return {order: prevState.order};
        });
    }

    handleProductChange(event) {
        const target = event.target;
        const option = target.options[target.selectedIndex]; 
        
        const id = target.value;
        const name = option.textContent;
        const price = option.dataset.price;
        
        this.setState(prevState => {
            var order = prevState.order;
            order.total = price * order.quantity;
            
            if (id == 2 && order.quantity > 2) {
                order.total *= 0.80;
            }
            
            order.total = order.total.toFixed(2);
            
            order.product = {id, name, price};
            return {order};
        });
    }

    handleQuantityChange(event) {
        var quantity = event.target.value;
        
        this.setState(prevState => {
            var order = prevState.order;
            
            order.quantity = quantity;
            order.total = order.product.price * order.quantity;

            if (order.product.id == 2 && order.quantity > 2) {
                order.total *= 0.80;
            }

            order.total = order.total.toFixed(2);

            return {order};
        });
    }

    render() {
        var order = this.state.order;
        
        if (!order) {
            return null;
        }
        
        if (this.state.edit) {
            return <tr>
                <td><select value={order.user.id} onChange={this.handleUserChange}
                    className="form-control">{this.state.users.map(item => <option value={item.id} key={item.id}>{item.name}</option>)}</select></td>
                <td><select value={order.product.id} onChange={this.handleProductChange}
                    className="form-control">{this.state.products.map(item => <option value={item.id} key={item.id} data-price={item.price}>{item.name}</option>)}</select></td> 
                <td>{order.product.price}</td>
                <td><input value={order.quantity} required="required" onChange={this.handleQuantityChange}
                    className="form-control" type="number" id="input-quantity" min="1" /></td>
                <td>{order.total}</td>
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
            <td>{order.product.price}</td>
            <td>{order.quantity}</td>
            <td>{order.total}</td>
            <td>{order.date}</td>
            <td className="actions">
                <a href="#edit" onClick={this.editOrder}>Edit</a>
                <a href="#delete" onClick={this.deleteOrder}>Delete</a>
            </td>
        </tr>;
    }
}

export default Search;