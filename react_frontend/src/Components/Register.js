import React, {Component, Fragment} from 'react';
import {AlertFailure, AlertSuccess} from "../Misc/Alert";


export class Register extends Component
{
    email = '';
    password = '';

    postData()
    {
        const data = {
            email: this.email,
            password: this.password
        };
        fetch('http://localhost:3000/users/register', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data)
        }).then(r=>r.json()).then(r=>{
            console.log(r);
            if(r.status === 'failed') {
                AlertFailure(r.reason);
            } else {
                this.props.history.push('/login');
                AlertSuccess("Utworzono konto pomyślnie")
            }
        });
    }

    validateForm()
    {
        if(this.email === '')
        {
            AlertFailure("Podaj e-mail");
            return false;
        }
        if(this.password === '')
        {
            AlertFailure("Podaj hasło");
            return false;
        }
        return true;
    }

    onSubmit = (event) => {
        event.preventDefault();
        if(this.validateForm())
            this.postData();
    };

    onEmailChange = (event) => {
        this.email = event.target.value;
    };
    onPasswordChange = (event) => {
        this.password = event.target.value;
    };


    render() {
        return (
            <Fragment>
            <div>
                <h2>Zarejestruj się</h2>
                <form onSubmit={this.onSubmit}>
                    <table className={"table_horizontal_style"}>
                        <tbody>
                            <tr>
                                <td>E-mail</td>
                                <td><input type="text" name={"email"} onChange={this.onEmailChange}/></td>
                            </tr>
                            <tr>
                                <td>Hasło</td>
                                <td><input type="password" name={"password"} onChange={this.onPasswordChange}/></td>
                            </tr>
                        </tbody>
                    </table>
                    <div style={{textAlign: 'center'}}>
                        <input type={"submit"} value={"Wyślij"} style={{margin: '10px', width: '100px', height: '30px'}}/>
                    </div>
                </form>
            </div>
            </Fragment>
        );
    }
}

Register.propTypes = {};