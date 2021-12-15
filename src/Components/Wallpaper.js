import react from 'react';
import '../Styles/Home.css';
import axios from 'axios';
import {withRouter} from 'react-router-dom'

class Wallpaper extends react.Component{

    constructor(){
        super();
        this.state={
            resList:[],
            inputText: undefined,
            suggestions:[]
        }
    }

    handleLocationChange = (event) =>{
        const locationId = event.target.value;
        sessionStorage.setItem('locationId',locationId);
        
        axios({
            url: `http://localhost:8989/restaurants/${locationId}`,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => {
                this.setState({ resList: res.data.restaurantsList })
            })
            .catch(err => console.log(err))
    }

    handleInputChange = (event) =>{
        const{resList}=this.state;
        const inputText = event.target.value;
        let suggestions =[];
        suggestions = resList.filter(item => item.name.toLowerCase().includes(inputText.toLowerCase()))
        this.setState({inputText,suggestions});
    }

    selectingRestaurant = (resObj)=>{
        this.props.history.push(`/Details?resID=${resObj._id}`)
    }

    showSuggestions = () => {
        const { suggestions, inputText } = this.state;

        if (suggestions.length == 0 && inputText == undefined) {
            return null;
        }
        if (suggestions.length > 0 && inputText == '') {
            return null;
        }
        if (suggestions.length == 0 && inputText) {
            return <ul class="a">
                <li class="b">No Search Results Found</li>
            </ul>
        }
        return (
            <ul class="a">
                { suggestions.map((item, index) => (<li class="b" key={index} onClick={() => this.selectingRestaurant(item)}>{`${item.name} -   ${item.locality},${item.city}`}</li>)) }
            </ul>
        );

    }

    render(){
        const {locationsData} = this.props;
        return(
            <div>
                 <div>
                        <img src="Images/homepageimg.png" width="100%" height="453px"/>
                    </div>
                    <div className="alignment">
                        <div className="logo">
                        <b>e!</b>
                        </div>
                        <div className="heading_home">Find the best Restaurants, Cafes and Bars</div>
                        <div className="inputrow">
                            <select className="location" onChange={this.handleLocationChange}> 
                                <option>select the location</option>
                                {locationsData.map(item => {
                                    return <option value={item.location_id}>{`${item.Street_name}, ${item.city}`}</option>
                                })}

                            </select>
                            <div style={{display: "inline-block"}}>
                                <span className="fas fa-search search-icon"></span>
                                    <input id="query" className="search" type="text" placeholder="Search by restaurants and foods name"
                                        onChange={this.handleInputChange}/>
                                        {this.showSuggestions()}

                            </div>
                        </div>
                    </div>
            </div>
        )
    }
}

export default withRouter(Wallpaper);