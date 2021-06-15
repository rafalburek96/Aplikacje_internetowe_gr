import React, {Component} from 'react';
import {AlertFailure, AlertSuccess} from "../Misc/Alert";

export class AdminCategoriesEdit extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            loaded: false,
            category: null
        }
    }

    componentDidMount() {
        fetch('http://localhost:3000/admin/get/category/' + this.props.match.params.name, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        }).then(r=>r.json())
            .then(r=>{
                if(r.status === 'success') {
                    this.setState({category: r.data[0], loaded: true});
                    this.name = r.data[0].name;
                } else {
                    if(r.reason)
                        AlertFailure(r.reason);
                    else {
                        console.log("Category fetch error: " + JSON.stringify(r));
                        AlertFailure("Przeprszamy, nie udało się pobrać danych o kategorii");
                    }
                    this.setState({loaded: true});
                }
            });
    }

    name='';
    onNameChange = (event) => {
        this.name = event.target.value;
    };

    onSubmit = (event) => {
        event.preventDefault();
        const data = { name: this.name };
        if(this.validateForm(data))
            this.postData(data);
    };

    validateForm(data)
    {
        if(!data.name)
        {
            AlertFailure("Podaj nazwę kategorii");
            return false;
        }
        return true;
    }

    postData(data)
    {
        fetch('http://localhost:3000/admin/update/category/' + this.props.match.params.name, {
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
                this.props.history.push('/admin/categories');
                AlertSuccess("Zaaktualizowano kategorię pomyślnie");
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
                        <p style={{textAlign: 'center'}}>Wczytuję dane o kategoriach...</p>
                    </div>
                </React.Fragment>
            );
        }
        if(!this.state.category)
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
                    <h1>Edycja kategorii</h1>
                    <form onSubmit={this.onSubmit}>
                        <table className={"table_horizontal_style"}>
                            <tbody>
                            <tr>
                                <td>Nazwa kategorii</td>
                                <td><input type="text" name={"name"} onChange={this.onNameChange} defaultValue={this.state.category.name}/></td>
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


AdminCategoriesEdit.propTypes = {};