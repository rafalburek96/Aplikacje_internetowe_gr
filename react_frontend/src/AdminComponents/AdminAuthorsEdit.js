import React, {Component} from 'react';
import {AlertFailure, AlertSuccess} from "../Misc/Alert";

export class AdminAuthorsEdit extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            loaded: false,
            author: null
        }
    }

    componentDidMount() {
        fetch('http://localhost:3000/admin/get/author/' + this.props.match.params.id, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        }).then(r=>r.json())
            .then(r=>{
                if(r.status === 'success') {
                    this.setState({author: r.data[0], loaded: true});
                    this.name = r.data[0].name;
                    this.surname = r.data[0].surname;
                    this.nationality = r.data[0].nationality;
                    this.birth_date = r.data[0].birth_date;
                } else {
                    if(r.reason)
                        AlertFailure(r.reason);
                    else {
                        console.log("Author fetch error: " + JSON.stringify(r));
                        AlertFailure("Przeprszamy, nie udało się pobrać danych o autorze");
                    }
                    this.setState({loaded: true});
                }
            });
    }

    name='';
    surname='';
    nationality='';
    birth_date='';


    onSurnameChange = (event) => {
        this.surname = event.target.value;
    };
    onNameChange = (event) => {
        this.name = event.target.value;
    };
    onNationalityChange = (event) => {
        this.nationality = event.target.value;
    };
    onBirthDateChange = (event) => {
        this.birth_date = event.target.value;
    };

    onSubmit = (event) => {
        event.preventDefault();
        const data = { name: this.name, surname: this.surname, nationality: this.nationality, birth_date: this.birth_date };
        if(this.validateForm(data))
            this.postData(data);
    };

    validateForm(data)
    {
        if(!data.name)
        {
            AlertFailure("Podaj imię autora");
            return false;
        }
        if(!data.surname)
        {
            AlertFailure("Podaj nazwisko autora");
            return false;
        }
        if(!data.birth_date)
        {
            AlertFailure("Podaj datę urodzenia autora");
            return false;
        }
        if(!data.nationality)
        {
            AlertFailure("Podaj narodowość autora");
            return false;
        }
        return true;
    }

    postData(data)
    {
        fetch('http://localhost:3000/admin/update/author/' + this.props.match.params.id, {
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
                this.props.history.push('/admin/authors');
                AlertSuccess("Zaaktualizowano autora pomyślnie");
            }
        });
    }

    render()
    {
        if(!this.state.loaded)
        {
            return (
                <React.Fragment>
                    <div>
                        <p style={{textAlign: 'center'}}>Wczytuję dane o autorze...</p>
                    </div>
                </React.Fragment>
            );
        }
        if(!this.state.author)
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
                    <h1>Edycja autora</h1>
                    <form onSubmit={this.onSubmit}>
                        <table className={"table_horizontal_style"}>
                            <tbody>
                            <tr>
                                <td>Imię</td>
                                <td><input type="text" name={"name"} onChange={this.onNameChange} defaultValue={this.state.author.name}/></td>
                            </tr>
                            <tr>
                                <td>Nazwisko</td>
                                <td><input type="text" name={"surname"} onChange={this.onSurnameChange} defaultValue={this.state.author.surname}/></td>
                            </tr>
                            <tr>
                                <td>Narodowość</td>
                                <td><input type="text" name={"nationality"} onChange={this.onNationalityChange} defaultValue={this.state.author.nationality}/></td>
                            </tr>
                            <tr>
                                <td>Data urodzenia (YYYY-MM-DD)</td>
                                <td><input type="text" name={"date_birth"} onChange={this.onBirthDateChange} defaultValue={this.state.author.birth_date}/></td>
                            </tr>
                            </tbody>
                        </table>
                        <div style={{textAlign: 'center'}}>
                            <input type={"submit"} value={"Wyślij"} style={{margin: '10px', width: '100px', height: '30px'}}/>
                        </div>
                    </form>
                </div>
            </React.Fragment>
        );
    }
}


AdminAuthorsEdit.propTypes = {};