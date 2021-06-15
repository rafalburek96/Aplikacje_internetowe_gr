import React, {Component} from 'react';
import {AlertFailure, AlertSuccess} from "../Misc/Alert";

export class MyAccount extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            loaded: false,
            data: null
        }
    }

    componentDidMount() {
        fetch('http://localhost:3000/users/my_account', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        }).then(r=>r.json())
            .then(r=>{
                if(r.status === 'success') {
                    this.name = r.data.name;
                    this.email = r.data.email;
                    this.name = r.data.name;
                    this.surname = r.data.surname;
                    this.birthdate = r.data.birthdate;
                    this.pesel = r.data.pesel;
                    this.city = r.data.city;
                    this.street = r.data.street;
                    this.number = r.data.number;
                    this.phone = r.data.phone;
                    this.setState({data: r.data, loaded: true});
                } else {
                    if(r.reason)
                        AlertFailure(r.reason);
                    else {
                        console.log("MyAccount fetch error: " + JSON.stringify(r));
                        AlertFailure("Przeprszamy, nie udało się pobrać danych o koncie");
                    }
                    this.setState({loaded: true});
                }
            });
    }

    email='';
    onEmailChange = (event) => {
        this.email = event.target.value;
    };
    password='';
    onPasswordChange = (event) => {
        this.password = event.target.value;
    };
    repeatedPassword='';
    onRepeatedPasswordChange = (event) => {
        this.repeatedPassword = event.target.value;
    };
    name='';
    onNameChange = (event) => {
        this.name = event.target.value;
    };
    surname='';
    onSurnameChange = (event) => {
        this.surname = event.target.value;
    };
    birthdate='';
    onBirthdateChange = (event) => {
        this.birthdate = event.target.value;
    };
    pesel='';
    onPeselChange = (event) => {
        this.pesel = event.target.value;
    };
    city='';
    onCityChange = (event) => {
        this.city = event.target.value;
    };
    street='';
    onStreetChange = (event) => {
        this.street = event.target.value;
    };
    number='';
    onNumberChange = (event) => {
        this.number = event.target.value;
    };
    phone='';
    onPhoneChange = (event) => {
        this.phone = event.target.value;
    };


    onSubmit = (event) => {
        event.preventDefault();
        const data = {
            email: this.email,
            password: this.password,
            repeatedPassword: this.repeatedPassword,
            name: this.name,
            surname: this.surname,
            birthdate: this.birthdate,
            pesel: this.pesel,
            city: this.city,
            street: this.street,
            number: this.number,
            phone: this.phone
        };
        if(this.validateForm(data))
            this.postData(data);
    };

    validateForm(data)
    {
        if(data.password !== data.repeatedPassword)
        {
            AlertFailure("Wpisane hasła nie są identyczne");
            return false;
        }
        delete data.repeatedPassword;
        return true;
    }

    postData(data)
    {
        fetch('http://localhost:3000/users/update', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data)
        }).then(r=>r.json()).then(r=>{
            if(r.status === 'failed') {
                AlertFailure(r.reason);
            } else {
                if(r.details)
                    AlertSuccess(r.details);
                else
                    AlertSuccess("Zaaktualizowano dane pomyślnie");
                this.clearPasswords();
            }
        });
    }

    clearPasswords()
    {
        document.getElementById('pass').value = '';
        document.getElementById('repeatedPassword').value = '';
        this.password = this.repeatedPassword = '';
    }

    render()
    {
        if(!this.state.loaded)
        {
            return (
                <React.Fragment>
                    <div>
                        <p style={{textAlign: 'center'}}>Wczytuję dane o koncie...</p>
                    </div>
                </React.Fragment>
            );
        }
        if(!this.state.data)
        {
            return (
                <React.Fragment>
                    <div>
                        <p style={{textAlign: 'center'}}>Nie udało się pobrać danych</p>
                    </div>
                </React.Fragment>
            );
        }
        return (
            <React.Fragment>
                <div>
                    <h1>Edycja konta</h1>
                    <form onSubmit={this.onSubmit}>
                        <table className={"table_horizontal_style"}>
                            <tbody>
                            <tr>
                                <td>E-mail</td>
                                <td><input type="text" name={"email"} onChange={this.onEmailChange} defaultValue={this.state.data.email}/></td>
                            </tr>
                            <tr>
                                <td>Hasło</td>
                                <td><input type="password" id="pass" name={"password"} onChange={this.onPasswordChange}/></td>
                            </tr>
                            <tr>
                                <td>Powtórz hasło</td>
                                <td><input type="password" id="repeatedPassword" name={"repeatedPassword"} onChange={this.onRepeatedPasswordChange}/></td>
                            </tr>
                            <tr>
                                <td>Imię</td>
                                <td><input type="text" name={"name"} onChange={this.onNameChange} defaultValue={this.state.data.name}/></td>
                            </tr>
                            <tr>
                                <td>Nazwisko</td>
                                <td><input type="text" name={"surname"} onChange={this.onSurnameChange} defaultValue={this.state.data.surname}/></td>
                            </tr>
                            <tr>
                                <td>Data urodzenia</td>
                                <td><input type="text" name={"birthdate"} onChange={this.onBirthdateChange} defaultValue={this.state.data.birthdate}/></td>
                            </tr>
                            <tr>
                                <td>Pesel</td>
                                <td><input type="text" name={"pesel"} onChange={this.onPeselChange} defaultValue={this.state.data.pesel}/></td>
                            </tr>
                            <tr>
                                <td>Miasto</td>
                                <td><input type="text" name={"city"} onChange={this.onCityChange} defaultValue={this.state.data.city}/></td>
                            </tr>
                            <tr>
                                <td>Ulica</td>
                                <td><input type="text" name={"street"} onChange={this.onStreetChange} defaultValue={this.state.data.street}/></td>
                            </tr>
                            <tr>
                                <td>Numer</td>
                                <td><input type="text" name={"number"} onChange={this.onNumberChange} defaultValue={this.state.data.number}/></td>
                            </tr>
                            <tr>
                                <td>Numer telefonu</td>
                                <td><input type="text" name={"phone"} onChange={this.onPhoneChange} defaultValue={this.state.data.phone}/></td>
                            </tr>
                            </tbody>
                        </table>
                        <div style={{textAlign: 'center'}}>
                            <input type={"submit"} value={"Zaaktualizuj"} style={{margin: '10px', width: '120px', height: '30px'}}/>
                        </div>
                    </form>
                </div>
            </React.Fragment>
        );
    }
}


MyAccount.propTypes = {};