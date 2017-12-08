
import React from 'react';

class SearchOrderForm extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
            range: '1',
            term: ''
        };
        
        this.handleRangeChange = this.handleRangeChange.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
        this.loadOrders = this.loadOrders.bind(this);
    }
    
    loadOrders() {
        return this.props.loadOrders(this.state.term, this.state.range);
    }

    handleRangeChange(event) {
        this.setState({range: event.target.value});
    }
    
    handleTermChange(event) {
        this.setState({term: event.target.value});
    }

    
    render() {
        return <div className="panel panel-default">
            <div className="panel-body"><form className="form-inline" onSubmit={event => { event.preventDefault(); this.loadOrders(); }}>
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
    
};

export default SearchOrderForm;

