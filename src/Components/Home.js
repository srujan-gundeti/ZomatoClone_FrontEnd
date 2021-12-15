import react from "react";
import Wallpaper from "./Wallpaper";
import QuickSearch from "./QuickSearch";
import axios from 'axios';

class Home extends react.Component{
    constructor(){
        super();
        this.state = {
            locations : [],
            mealtypes : []
        }
    }
    componentDidMount(){
        sessionStorage.clear();
        axios({
            url:"http://localhost:8989/location",
            method:"GET",
            headers: {'content-Type':'application/json'}
        })
            .then(res=>{
                this.setState({locations:res.data.location})
             }) 
            .catch(err => console.log(err));
        
        axios({
            url:"http://localhost:8989/mealtypes",
            method:"GET",
            headers: {'content-Type':'application/json'}
        })
            .then(res=>{
                this.setState({mealtypes:res.data.qsData})
            }) 
            .catch(err => console.log(err));
    

    }

    render(){
        const {locations,mealtypes} = this.state;
        return(
            <div>
                    <Wallpaper locationsData={locations}/>   
                    <QuickSearch mealtypesData={mealtypes}/>
            </div>
        )
    }
}

export default Home;