import react from 'react';
import '../Styles/Filter.css';
import queryString from 'query-string';
import axios from 'axios';
import ReactPaginate from 'react-paginate';

class Filter extends react.Component{    
    constructor(){
        super();
        this.state = {
            restaurants : [],
            locations : [],
            mealtypeID : undefined,
            locationID : undefined,
            cuisineID : [],
            lcost: undefined,
            hcost : undefined,
            sort : 1,
            page : 1,
            pageCount : Number
        }
    }

    componentDidMount(){
        const qs = queryString.parse(this.props.location.search);
        const {mealtypes,location} = qs;

        const filterObj = {
            mealtypes : Number(mealtypes),
            location : Number(location)
        };
        axios({
            url:'http://localhost:8989/filter',
            method:'POST',
            headers: {'content-Type':'application/json'},
            data : filterObj
        }) 
            .then(res=>{
                this.setState({restaurants:res.data.filter_data, mealtypeID : mealtypes, locationID : location, pageCount : res.data.pages})
             }) 
            .catch(err => console.log(err)); 

        axios({
            url:'http://localhost:8989/location',
            method:'GET',
            headers: {'content-Type':'application/json'}
        })
            .then(res=>{
                this.setState({locations:res.data.location})
            }) 
            .catch(err => console.log(err));
    }
   
    handleSortchange = (sort) => {
        const {mealtypeID,locationID,cuisineID,lcost,hcost,page} = this.state;
        const filterObj = {
            mealtypes : mealtypeID,
            location : locationID,
            cuisine : cuisineID,
            lcost,
            hcost,
            page,
            sort:sort
        };
        console.log(filterObj);
        axios({
            url:'http://localhost:8989/filter',
            method:'POST',
            headers: {'content-Type':'application/json'},
            data : filterObj
        }) 
            .then(res=>{
                this.setState({restaurants:res.data.filter_data, sort, pageCount : res.data.pages})
             }) 
            .catch(err => console.log(err));   

    } 

    handleCostchange = (lcost,hcost) => {
        const {mealtypeID,locationID,cuisineID,sort,page} = this.state;
        const filterObj = {
            mealtypes : mealtypeID,
            location : locationID,
            cuisine : cuisineID,
            lcost,
            hcost,
            page,
            sort
        };

        axios({
            url:'http://localhost:8989/filter',
            method:'POST',
            headers: {'content-Type':'application/json'},
            data : filterObj
        }) 
            .then(res=>{
                this.setState({restaurants:res.data.filter_data, lcost, hcost, pageCount : res.data.pages})
                console.log(this.state.restaurants)
             }) 
            .catch(err => console.log(err));   

    }

    handlefilterDropDown = (event)=>{
        const location = event.target.value;
        const {mealtypeID,lcost,hcost,cuisineID,sort,page} = this.state;
        const filterObj = {
            mealtypes : mealtypeID,
            location : location,
            cuisine : cuisineID,
            lcost,
            hcost,
            page,
            sort
        };

        axios({
            url:'http://localhost:8989/filter',
            method:'POST',
            headers: {'content-Type':'application/json'},
            data : filterObj
        }) 
            .then(res=>{
                this.setState({restaurants:res.data.filter_data, locationID:location, pageCount : res.data.pages})
                console.log(this.state.restaurants)
             }) 
            .catch(err => console.log(err));
    }

    handleNavigateRestaurants = (resID) =>{
        this.props.history.push(`/Details?resID=${resID}`)
    }

    handleCuisine =(cuisineid)=>{
        const {mealtypeID,locationID,lcost,hcost,sort,page,cuisineID} = this.state;
       
        if(cuisineID.indexOf(cuisineid)===-1){
            cuisineID.push(cuisineid);
        }
        else{
            let index= cuisineID.indexOf(cuisineid);
            cuisineID.splice(index,1)
        }
        
        const filterObj = {
            mealtypes : mealtypeID,
            location : locationID,
            cuisine : cuisineID.length > 0?cuisineID:undefined,
            lcost,
            hcost,
            page,
            sort
        };

        axios({
            url:'http://localhost:8989/filter',
            method:'POST',
            headers: {'content-Type':'application/json'},
            data : filterObj
        }) 
            .then(res=>{
                this.setState({restaurants:res.data.filter_data, pageCount : res.data.pages})
                
             }) 
            .catch(err => console.log(err));
    }

    handlePageClick =(data)=>{
        const pageNo = (data.selected+1);
        const {mealtypeID,lcost,hcost,cuisineID,sort,locationID} = this.state;
        const filterObj = {
            mealtypes : mealtypeID,
            location : locationID,
            cuisine : cuisineID,
            lcost,
            hcost,
            page:pageNo,
            sort
        };

        axios({
            url:'http://localhost:8989/filter',
            method:'POST',
            headers: {'content-Type':'application/json'},
            data : filterObj
        }) 
            .then(res=>{
                this.setState({restaurants:res.data.filter_data})
             }) 
            .catch(err => console.log(err));
    }

    render(){
        const {restaurants,locations,pageCount} = this.state;
        return(
            <div>
                    
                    <div className="container">
                        <div className="heading-filter">Breakfast Places in Mumbai</div>
                        <div className="row">
                            <div className="col-lg-3 col-md-3 col-sm-12">
                                <div className="filter-section">
                                    <div>
                                        <span className="filter-heading">Filters/Sort</span>
                                        <span className="fa fa-chevron-down icon" data-bs-toggle="collapse" data-bs-target="#filter"></span>
                                    </div>
                                    <div id="filter" className="show">
                                        <div className="filter-headers">Select Location</div>
                                        <select className="location-dd" onChange={this.handlefilterDropDown}>
                                            <option>Select</option>
                                            {locations.map(item => {
                                                return <option value={item.location_id}>{`${item.Street_name}, ${item.city}`}</option>
                                            })}
                                        </select>
                                        <div className="filter-headers">Cuisine</div>
                                        <div>
                                            <input type="checkbox" name="North Indian" value="1" id="1" onChange={()=>this.handleCuisine(1)}/>
                                            <label className="input-headers">North Indian</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" name="South Indian" value="2" id="2" onChange={()=>this.handleCuisine(2)}/>
                                            <label className="input-headers">South Indian</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" name="Chineese" value="3" id="3" onChange={()=>this.handleCuisine(3)}/>
                                            <label className="input-headers">Chineese</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" name="Fast Food" value="4" id="4" onChange={()=>this.handleCuisine(4)}/>
                                            <label className="input-headers">Fast Food</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" name="Street Food" value="5" id="5" onChange={()=>this.handleCuisine(5)}/>
                                            <label className="input-headers">Street Food</label>
                                        </div>
                                        <div className="filter-headers">Cost for Two</div>
                                        <div>
                                            <input type="radio" name="cost" onChange={() => this.handleCostchange(1,500)}/>
                                            <label className="input-headers">Less than &#8377; 500</label>
                                        </div>
                                        <div>
                                            <input type="radio" name="cost" onChange={() => this.handleCostchange(500,1000)}/>
                                            <label className="input-headers">&#8377; 500 to &#8377; 1000</label>
                                        </div>
                                        <div>
                                            <input type="radio" name="cost" onChange={() => this.handleCostchange(1000,1500)}/>
                                            <label className="input-headers">&#8377; 1000 to &#8377; 1500</label>
                                        </div>
                                        <div>
                                            <input type="radio" name="cost" onChange={() => this.handleCostchange(1500,2000)}/>
                                            <label className="input-headers">&#8377; 1500 to &#8377; 2000</label>
                                        </div>
                                        <div>
                                            <input type="radio" name="cost"onChange={() => this.handleCostchange(2000,50000)}/>
                                            <label className="input-headers">&#8377; 2000 +</label>
                                        </div>
                                        <div className="filter-headers">Sort</div>
                                        <div>
                                            <input type="radio" name="sort" onChange={() =>this.handleSortchange(1)}/>
                                            <label className="input-headers">Price low to high</label>
                                        </div>
                                        <div>
                                            <input type="radio" name="sort" onChange={() =>this.handleSortchange(-1)}/>
                                            <label className="input-headers">Price high to low</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-9 col-md-9 col-sm-12">
                                {restaurants && restaurants.length> 0 ? restaurants.map((itemRestaurant) =>{
                                    return <div className="item" onClick={() =>this.handleNavigateRestaurants(itemRestaurant._id)}>
                                                <div className="item-left">
                                                    <img src="Images/breakfast.jpg" className="item-img" />
                                                </div>
                                                <div className="item-right">
                                                    <div className="item-heading">{itemRestaurant.name}</div>
                                                    <div>{itemRestaurant.city}</div>
                                                    <div>{itemRestaurant.locality}</div>
                                                </div>
                                                <hr style={{margin: "2% 6%"}} />
                                                <div className="item-bottom-left">
                                                    <div>CUISINES</div>
                                                    <div>COST FOR TWO</div>
                                                </div>
                                                <div className="item-bottom-right">
                                                    <div>{itemRestaurant.cuisine.map(cuisine =>`${ cuisine.name}, `)}</div>
                                                    <div> &#8377;{itemRestaurant.min_price} </div>
                                                </div>
                                            </div>
                                }) : <div className="no-result-div">No Result Find </div> }
                            
                                {(restaurants.length>0 && pageCount>1) ?
                                    <ReactPaginate 
                                     previousLabel={"pre"}
                                     nextLabel={'next'}
                                     breakLabel={'...'}
                                     pageCount= {pageCount}
                                     onPageChange={this.handlePageClick}
                                     containerClassName={'pagination justify-content-center'}
                                     pageClassName={'page-item'}
                                     pageLinkClassName={'page-link'}
                                     previousClassName={'page-item'}
                                     previousLinkClassName={'page-link'}
                                     nextClassName={'page-item'}
                                     nextLinkClassName={'page-link'}
                                     breakClassName={'page-item'}
                                     breakLinkClassName={'page-link'}
                                     activeClassName={'active'}/>: null }
                            </div>
                        </div>
                    </div>
            </div>
        )
            
    }
}

export default Filter;