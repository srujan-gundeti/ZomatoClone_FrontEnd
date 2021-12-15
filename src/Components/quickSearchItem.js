import react from 'react';
import '../Styles/Home.css'; 
import {withRouter} from 'react-router-dom';

class quickSearchItem extends react.Component{
    handleNavigate = (mealtypeId) =>{
        const locationId = sessionStorage.getItem('locationId');
        if(locationId){
            this.props.history.push(`/filter?mealtypes=${mealtypeId}&location=${locationId}`);
        }else{
            this.props.history.push(`/filter?mealtypes=${mealtypeId}`);
        }
        
    }

    render(){
        const { QuickSearchItemData } = this.props;
        return(
                <div className="col-md-4 col-sm-12 qs-box" onClick={() => this.handleNavigate(QuickSearchItemData.meal_type)}>
                    <div className="qs-img">
                            <img src={`./${QuickSearchItemData.image}`} width="100%" height="100%"/>
                    </div>
                    <div className="qs-info">
                        <div className="qs-heading">{QuickSearchItemData.name}</div>
                        <div className="qs-subtext">{QuickSearchItemData.content}</div>
                    </div>
                </div>

        )
    }
}

export default withRouter(quickSearchItem);