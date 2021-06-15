import React, {Component} from 'react';
import {AlertFailure, AlertSuccess} from "../Misc/Alert";

export class AdminLanguagesEdit extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            loaded: false,
            language: null
        }
    }

    componentDidMount() {
        fetch('http://localhost:3000/admin/get/language/' + this.props.match.params.language, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        }).then(r=>r.json())
            .then(r=>{
                if(r.status === 'success') {
                    this.setState({language: r.data[0], loaded: true});
                    this.language = r.data[0].language;
                } else {
                    if(r.reason)
                        AlertFailure(r.reason);
                    else {
                        console.log("Language fetch error: " + JSON.stringify(r));
                        AlertFailure("Przeprszamy, nie udało się pobrać danych o języku");
                    }
                    this.setState({loaded: true});
                }
            });
    }

    language='';
    onNameChange = (event) => {
        this.language = event.target.value;
    };

    onSubmit = (event) => {
        event.preventDefault();
        const data = { language: this.language };
        if(this.validateForm(data))
            this.postData(data);
    };

    validateForm(data)
    {
        if(!data.language)
        {
            AlertFailure("Podaj nazwę języka");
            return false;
        }
        return true;
    }

    postData(data)
    {
        fetch('http://localhost:3000/admin/update/language/' + this.props.match.params.language, {
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
                this.props.history.push('/admin/languages');
                AlertSuccess("Zaaktualizowano język pomyślnie");
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
                        <p style={{textAlign: 'center'}}>Wczytuję dane o językach...</p>
                    </div>
                </React.Fragment>
            );
        }
        if(!this.state.language)
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
                    <h1>Edycja języka</h1>
                    <form onSubmit={this.onSubmit}>
                        <table className={"table_horizontal_style"}>
                            <tbody>
                            <tr>
                                <td>Nazwa języka</td>
                                <td><input type="text" name={"language"} onChange={this.onNameChange} defaultValue={this.state.language.language}/></td>
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


AdminLanguagesEdit.propTypes = {};