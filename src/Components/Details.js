import react from "react";
import '../Styles/Details.css'
import queryString from 'query-string';
import axios from 'axios';
import Modal from 'react-modal';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';


const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        border: '1px solid brown'
    },
};


class Details extends react.Component{
    
    constructor(){
        super();
        this.state = {
            restaurant : {},
            resId: undefined,
            galleryModalIsOpen: false,
            menuItemsModalIsOpen: false,
            formModalIsOpen: false,
            menuItems: [],
            subTotal: 0,
            userName: undefined,
            userEmail: undefined,
            userAddress: undefined,
            userContact: undefined,
            isLoggedIn:false,
        }
    }

    componentDidMount(){

        const qs = queryString.parse(this.props.location.search);
        const {resID} = qs;

        axios({
            url:`http://localhost:8989/restaurantById/${resID}`,
            method:"GET",
            headers: {'content-Type':'application/json'}
        }) 
            .then(res=>{
                this.setState({restaurant:res.data.Details,resId:resID})
                console.log(this.state.restaurants)
             }) 
            .catch(err => console.log(err));   
    }

    handleModal = (state, value) => {
        const { resId } = this.state;
        if (state == "menuItemsModalIsOpen" && value == true) {
            axios({
                url: `http://localhost:8989/menu/${resId}`,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
                .then(res => {
                    this.setState({ menuItems: res.data.Items })
                })
                .catch(err => console.log(err))
        }
        this.setState({ [state]: value });
    }

    addItems = (index, operationType) => {
        let total = 0;
        const items = [...this.state.menuItems];
        const item = items[index];

        if (operationType == 'add') {
            item.qty += 1;
        }
        else {
            item.qty -= 1;
        }
        items[index] = item;
        items.map((item) => {
            total += item.qty * item.price;
        })
        this.setState({ menuItems: items, subTotal: total });
    }

    handleFormDataChange = (event, state) => {
        this.setState({ [state]: event.target.value });
    }

    isDate(val) {
        // Cross realm comptatible
        return Object.prototype.toString.call(val) === '[object Date]'
    }

    isObj = (val) => {
        return typeof val === 'object'
    }

    stringifyValue = (val) => {
        if (this.isObj(val) && !this.isDate(val)) {
            return JSON.stringify(val)
        } else {
            return val
        }
    }

    buildForm = ({ action, params }) => {
        const form = document.createElement('form')
        form.setAttribute('method', 'post')
        form.setAttribute('action', action)

        Object.keys(params).forEach(key => {
            const input = document.createElement('input')
            input.setAttribute('type', 'hidden')
            input.setAttribute('name', key)
            input.setAttribute('value', this.stringifyValue(params[key]))
            form.appendChild(input)
        })
        return form
    }

    post = (details) => {
        const form = this.buildForm(details)
        document.body.appendChild(form)
        form.submit()
        form.remove()
    }

    getData = (data) => {
        return fetch(`http://localhost:8989/payment`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(response => response.json()).catch(err => console.log(err))
    }

    handlePayment = () => {
            const { subTotal, userEmail } = this.state;
            if (!userEmail) {
                alert('Please fill this field and then Proceed...');
            }
            else {
                // Payment API Call 
                const paymentObj = {
                    amount: subTotal,
                    email: userEmail
                };

                this.getData(paymentObj).then(response => {
                    var information = {
                        action: "https://securegw-stage.paytm.in/order/process",
                        params: response
                    }
                    this.post(information)
                })
            }
        
    }

    handleLogin = () =>{
            this.handleModal('menuItemsModalIsOpen', false);
            this.handleModal('formModalIsOpen', true);  
    }

    render(){
        const { restaurant, galleryModalIsOpen, menuItemsModalIsOpen,formModalIsOpen, menuItems, subTotal,isLoggedIn } = this.state;
        return(
           <div className="container">
                <div>
                    <img src={`../${restaurant.image}`} alt="No Image, Sorry for the Inconvinience" width="100%" height="350px" />
                    <button className="btn btn-light btn-lg button" onClick={() => this.handleModal('galleryModalIsOpen', true)}>Click to see Image Gallery</button>
                </div>
                <div className="heading">{restaurant.name}</div>
                <button className="btn btn-danger btn-lg btn-order" onClick={() => this.handleModal('menuItemsModalIsOpen', true)}>Place Online Order</button>

                <div className="tabs">
                    <div className="tab">
                        <input type="radio" id="tab-1" name="tab-group-1" checked />
                        <label class="c" for="tab-1">Overview</label>

                        <div className="content">
                            <div className="about">About this place</div>
                            <div className="head">Cuisine</div>
                            <div className="value">{restaurant && restaurant.cuisine && restaurant.cuisine.map(cuisine => `${cuisine.name}, `)}</div>
                            <div className="head">Average Cost</div>
                            <div className="value">&#8377; {restaurant.min_price} for two people(approx)</div>
                        </div>
                    </div>

                    <div className="tab">
                        <input type="radio" id="tab-2" name="tab-group-1" />
                        <label class="c" for="tab-2">Contact</label>
                        <div className="content">
                            <div className="head">Phone Number</div>
                            <div className="value">{restaurant.contact_number}</div>
                            <div className="head">{restaurant.name}</div>
                            <div className="value">{`${restaurant.locality}, ${restaurant.city}`}</div>
                        </div>
                    </div>
                </div>
                <Modal isOpen={galleryModalIsOpen} style={customStyles} >
                    <div>
                        <div className="far fa-times-circle" style={{ float: 'right', marginBottom: '10px' }} onClick={() => this.handleModal('galleryModalIsOpen', false)}></div>
                        <Carousel
                            showThumbs={false}>
                            {restaurant && restaurant.thumb && restaurant.thumb.map((item) => {
                                return <div>
                                    <img src={`../${item}`}  height="400px" />
                                </div>
                            })}
                        </Carousel>
                    </div>
                </Modal>
                <Modal isOpen={menuItemsModalIsOpen} style={customStyles} >
                    <div style={{ marginTop:"0px"}}>
                        <div class="far fa-times-circle" style={{ float: 'right', marginBottom: '10px' }} onClick={() => this.handleModal('menuItemsModalIsOpen', false)}></div>
                        <div className="restaurant-name"><h3 style={{color:"navy"}}>{restaurant.name}</h3></div>
                        <div className="item-subtotal"> <h5 style={{color:"navy"}}>subtotal : {subTotal} </h5></div>
                        {
                            sessionStorage.getItem('User') ? <button className="btn btn-danger" onClick={
                                this.handleLogin
                            }>Pay Now</button> :
                            null
                        }
                        
                        {menuItems.map((item, index) => {
                                return <div style={{ width: '44rem', marginTop: '10px', marginBottom: '10px', borderBottom: '2px solid #dbd8d8' }}>
                                            <div className="card" style={{ width: '43rem', margin: 'auto', marginBottom:'10px' }}>
                                                <div className="row" style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
                                                    <div className="col-xs-9 col-sm-9 col-md-9 col-lg-9 " style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
                                                        <span className="card-body">
                                                            <h5 className="item-name">{item.name}</h5>
                                                            <h5 className="item-price">&#8377;{item.price}</h5>
                                                            <p className="item-descp">{item.description}</p>
                                                        </span>
                                                    </div>
                                                    <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                                                        <img className="card-img-center title-img" src={`../${item.image}`} style={{
                                                            height: '85px',
                                                            width: '85px',
                                                            borderRadius: '20px',
                                                            marginTop: '12px',
                                                            marginLeft: '3px'
                                                        }} />
                                                        {item.qty == 0 ? <div>
                                                            <button className="btn btn-light add-button" onClick={() => this.addItems(index, 'add')}>Add</button>
                                                        </div> :
                                                            <div className="add-number">
                                                                <button className="btn btn-light" onClick={() => this.addItems(index, 'subtract')}>-</button>
                                                                <span class="qty">{item.qty}</span>
                                                                <button className="btn btn-light" onClick={() => this.addItems(index, 'add')}>+</button>
                                                            </div>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                            })}
                        
                    </div>
                </Modal>
                <div>
                <Modal isOpen={formModalIsOpen} style={customStyles}>
                    <div>
                        
                                <div class="far fa-times-circle" style={{ float: 'right', marginBottom: '10px' }}
                                    onClick={() => this.handleModal('formModalIsOpen', false)}></div>
                                <h2>{restaurant.name}</h2>
                                <div>
                                    <label>Name : </label>
                                    <input class="form-control" style={{ width: '400px' }}
                                        type="text" placeholder="Enter your Name" onChange={(event) => this.handleFormDataChange(event, 'userName')} />
                                </div>
                                <div>
                                    <label>Email : </label>
                                    <input class="form-control" style={{ width: '400px' }}
                                        type="text" placeholder="Enter your Email" onChange={(event) => this.handleFormDataChange(event, 'userEmail')} />
                                </div>
                                <div>
                                    <label>Address: </label>
                                    <input class="form-control" style={{ width: '400px' }}
                                        type="text" placeholder="Enter your Address" onChange={(event) => this.handleFormDataChange(event, 'userAddress')} />
                                </div>
                                <div>
                                    <label>Contact Number : </label>
                                    <input class="form-control" style={{ width: '400px' }}
                                        type="tel" placeholder="Enter your Contact Details" onChange={(event) => this.handleFormDataChange(event, 'userContact')} />
                                </div>
                                <button class="btn btn-success"
                                    style={{ float: 'right', marginTop: '20px' }} onClick={this.handlePayment}>Proceed
                                </button>
                    </div>
                </Modal>
                </div>
           </div>

        )
    }
}

export default Details;