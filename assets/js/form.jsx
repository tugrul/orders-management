
import React from 'react';

class Form extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            users: [], 
            products: [],
            selectedUser: '',
            selectedProduct: '',
            quantity: ''
        };

        this.handleUserChange = this.handleUserChange.bind(this);
        this.handleProductChange = this.handleProductChange.bind(this);
        this.handleQuantityChange = this.handleQuantityChange.bind(this);
        this.createOrder = this.createOrder.bind(this);
    }
    
    loadUsers() {
        return fetch('/user/list').then(response => response.json());
    }
    
    loadProducts() {
        return fetch('/product/list').then(response => response.json());
    }
    
    componentDidMount() {
        
        Promise.all([this.loadUsers(), this.loadProducts()]).then((([users, products]) => {

            this.setState({users, products});

        }).bind(this));
        
    }
    
    renderOptions(items) {
        items = items.map(item => <option value={item.id} key={item.id}>{item.name}</option>);
        items.unshift(<option value="" key="0">[Choose Item]</option>);
        return items;
    }
    
    handleUserChange(event) {
        this.setState({selectedUser: event.target.value});
    }
    
    handleProductChange(event) {
        this.setState({selectedProduct: event.target.value});
    }
    
    handleQuantityChange(event) {
        this.setState({quantity: event.target.value});
    }

    createOrder(event) {
        event.preventDefault();
        
        var state = this.state;

        var formData = new FormData();
        formData.set('user-id', state.selectedUser);
        formData.set('product-id', state.selectedProduct);
        formData.set('quantity', state.quantity);
        
        fetch('/order/create', {
            method: 'POST',
            body: formData
        }).then(response => response.json()).then(result => {
            if (result.success) {
                this.setState({
                    selectedUser: '', 
                    selectedProduct: '', 
                    quantity: ''});
            }
        });   
    }
    
    render() {
        return <div className="panel panel-default">
                <div className="panel-body">
                    <h2>Add new order</h2>
                    <div className="row">    
                        <div className="col-md-6"><form className="form-horizontal" onSubmit={ this.createOrder }>
            <div className="form-group">
                <label htmlFor="select-user" className="col-sm-2 control-label">User</label>
                <div className="col-sm-10">
                    <select value={this.state.selectedUser} required="required" onChange={this.handleUserChange}
                    className="form-control" id="select-user">{ this.renderOptions(this.state.users) }</select>
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="select-product" className="col-sm-2 control-label">Product</label>
                <div className="col-sm-10">
                    <select value={this.state.selectedProduct} required="required" onChange={this.handleProductChange}
                    className="form-control" id="select-product">{ this.renderOptions(this.state.products) }</select>
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="input-quantity" className="col-sm-2 control-label">Quantity</label>
                <div className="col-sm-10">
                    <input value={this.state.quantity} required="required" onChange={this.handleQuantityChange}
                    className="form-control" type="number" id="input-quantity" min="1" />
                </div>
            </div>
            <div className="form-group">
                <div className="col-sm-offset-2 col-sm-10">
                    <button type="submit" className="btn btn-primary">add</button>
                </div>
            </div>
        </form>
                    </div>
                </div>
                
        </div></div>;
    }
};

export default Form;