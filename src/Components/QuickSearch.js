import react from 'react';
import '../Styles/Home.css';
import QuickSearchItem from './quickSearchItem';

class QuickSearch extends react.Component{
    render(){
        const {mealtypesData} = this.props;
        return (
            <div>
                    <div className="container">
                        <div className="quicksearch">Quick Search</div>
                        <div>Discover restaurants by meals</div>
                        <div className="row g-0">
                        { mealtypesData.map(item =>{
                            return <QuickSearchItem QuickSearchItemData ={item}/>
                            })
                        }
                        </div>
                    </div>
            </div>
        )
    }
}

export default QuickSearch;