import react from 'react';
import GoogleLogin from 'react-google-login';
import '../Styles/Header.css';
import Modal from 'react-modal';
import axios from 'axios';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        border: '1px solid brown',
    },
};


class Header extends react.Component{
    constructor(){
        super();
        this.state={
            loginModalIsOpen: false,
            isLoggedIn : false,
            LoggedInUser : undefined,
            formModalIsOpen : false,
            first_name : undefined,
            last_name : undefined,
            password : undefined,
            email : undefined,
            credentialsModal: false,
            isUserAuthenticated:false
        }
    }

    responseGoogle = (response) => {
        this.setState({isLoggedIn: true, LoggedInUser: response.profileObj.name, loginModalIsOpen:false});
        sessionStorage.setItem('User',response.profileObj.name);
    }
    
    handleModal = (state,value) => {
        this.setState({[state] : value})
    }
    
    handleLogout = () =>{
        this.setState({isLoggedIn:false,LoggedInUser:undefined})
        sessionStorage.clear();
    }

    handleSignUpDataChange = (event,state)=>{
        this.setState({ [state]: event.target.value });
    }

    handleSignUp = () =>{
        const{first_name,last_name,email,password}=this.state;
        if(!(first_name && last_name && email && password)){
            alert('Please provide all the data');
        }
        else{
            const UserObj ={
                email,
                password,
                first_name,
                last_name
            }

            axios({
                url:'http://localhost:8989/signup',
                method:'POST',
                headers: {'content-Type':'application/json'},
                data : UserObj
            }) 
                .then(res=>{
                    this.setState({formModalIsOpen:false,isLoggedIn:true,LoggedInUser:UserObj.first_name})
                 }) 
                .catch(err => console.log(err)); 

        }
    }

    handleLoginChange = (event,state) =>{
        this.setState({[state]:event.target.value});
    }

    handleLogin =() =>{
        const{first_name,email,password}=this.state;
        if(!(first_name && email && password)){
            alert('Please provide all the data');
        }
        else{
            const UserObj ={
                email,
                password,
                first_name
            }

            axios({
                url:'http://localhost:8989/login',
                method:'POST',
                headers: {'content-Type':'application/json'},
                data : UserObj
            }) 
                .then(res=>{
                    if(res.data.isAuthenticated==true){
                        this.setState({credentialsModal:false,isLoggedIn:true,LoggedInUser:UserObj.first_name})
                        sessionStorage.setItem('User',UserObj.first_name);
                    }
                    else{
                        this.setState({credentialsModal:true,isUserAuthenticated:true})
                    }
                 }) 
                .catch(err => console.log(err)); 
                
        }
    }


    render(){
        const{loginModalIsOpen,isLoggedIn,LoggedInUser,formModalIsOpen,credentialsModal,isUserAuthenticated}=this.state;

        return(
            <div>
                <div className="Mainheader">
                        <div className="header-logo">
                            <b>e!</b>
                        </div>
                        {!isLoggedIn ?
                        <div className="login-signup">
                            <button className='btn bg-transparent login' onClick={()=>this.handleModal('loginModalIsOpen',true)}>Login</button>
                            <button className='btn bg-transparent signup'onClick={()=>this.handleModal('formModalIsOpen',true)}>Create an account</button>
                        </div> : 
                        <div className="login-signup">
                            <button className='btn bg-transparent login'>{LoggedInUser}</button>
                            <button className='btn bg-transparent signup' onClick={this.handleLogout}>Logout</button>
                        </div> }
                </div>
                <Modal isOpen={loginModalIsOpen} style={customStyles} >
                    <div>   
                    <div className="far fa-times-circle" style={{ float: 'right', marginBottom: '10px' }} onClick={()=>this.handleModal('loginModalIsOpen', false)}></div>
                            <h3>Login</h3>
                            <div className="google-btn">
                                    <GoogleLogin
                                        clientId="568168470185-hrrc0muk5501da2sok3svjoq0c2narqk.apps.googleusercontent.com"
                                        buttonText="Continue with Google"
                                        onSuccess={this.responseGoogle}
                                        onFailure={this.responseGoogle}
                                        cookiePolicy={'single_host_origin'}
                                    /> 
                            </div>
                            <div className="credentials-btn">
                                <button type="button" class="btn btn-primary btn-lg" 
                                onClick={()=>{this.handleModal('loginModalIsOpen', false);
                                              this.handleModal('credentialsModal',true);  }}>Continue with credentials</button>
                            </div>

                            <hr style={{width:"100%", marginTop:"55%", border:"1px slod black"}}/>
                            <div>
                                <div className='account-label'>Don't have an account?</div>
                                <div className='account-btn'>
                                    <button type="button" class="btn btn-link" onClick={()=>{
                                        this.handleModal('loginModalIsOpen',false);
                                        this.handleModal('formModalIsOpen',true);
                                    }}>SignUp</button>
                                </div>
                            </div>
                            
                    </div>
                </Modal>
                <Modal isOpen={formModalIsOpen} style={customStyles}>
                    <div>
                        <div class="far fa-times-circle" style={{ float: 'right', marginBottom: '10px' }}
                            onClick={() => this.handleModal('formModalIsOpen', false)}>
                        </div>
                        <h2>Create an account</h2>
                        <div>
                            <label>First Name : </label>
                            <input class="form-control" style={{ width: '400px' }}
                                type="text" placeholder="Enter your First Name" onChange={(event) => this.handleSignUpDataChange(event, 'first_name')} />
                        </div>
                        <div>
                            <label>Last Name : </label>
                            <input class="form-control" style={{ width: '400px' }}
                                type="text" placeholder="Enter your Last Name" onChange={(event) => this.handleSignUpDataChange(event, 'last_name')} />
                        </div>
                        <div>
                            <label>Email: </label>
                            <input class="form-control" style={{ width: '400px' }}
                                type="text" placeholder="Enter your Email Address" onChange={(event) => this.handleSignUpDataChange(event, 'email')} />
                        </div>
                        <div>
                            <label>Password : </label>
                            <input class="form-control" style={{ width: '400px' }}
                                type="password" placeholder="Enter your Password" onChange={(event) => this.handleSignUpDataChange(event, 'password')} />
                        </div>
                        <button class="btn btn-success form_signUp_button" onClick={this.handleSignUp}>SignUp</button>
                    </div>
                </Modal>
                <Modal isOpen={credentialsModal} style={customStyles}>
                    <div>   
                            <div class="far fa-times-circle" style={{ float: 'right', marginBottom: '10px' }}
                                 onClick={() => this.handleModal('credentialsModal', false)}>
                            </div>
                            {!isUserAuthenticated?<h2>Enter your credentials</h2>
                                :<h6 style={{color:'red'}}>Please Enter Correct email and password</h6>}
                            <div>
                                <label>First Name : </label>
                                <input class="form-control" style={{ width: '400px' }}
                                    type="text" placeholder="Enter your First Name" onChange={(event) => this.handleSignUpDataChange(event, 'first_name')} />
                            </div>
                            <div>
                                <label>Email: </label>
                                <input class="form-control" style={{ width: '400px' }}
                                    type="text" placeholder="Enter your Email Address" onChange={(event) => this.handleLoginChange(event, 'email')} />
                            </div>
                            <div>
                                <label>Password : </label>
                                <input class="form-control" style={{ width: '400px' }}
                                    type="password" placeholder="Enter your Password" onChange={(event) => this.handleLoginChange(event, 'password')} />
                            </div>
                            <button class="btn btn-success form_signUp_button" onClick={this.handleLogin}>Login</button>
                    </div>
                </Modal>
            </div>

        )
    }

}

export default Header;