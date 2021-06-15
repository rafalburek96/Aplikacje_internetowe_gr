import React, {Component} from 'react';
import {AlertFailure, AlertSuccess} from "../Misc/Alert";

export class AdminBooksEdit extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            loaded: false,
            book: null
        }
    }

    componentDidMount() {
        fetch('http://localhost:3000/admin/get/book/' + this.props.match.params.isbn, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        }).then(r=>r.json())
            .then(r=>{
                if(r.status === 'success') {
                    this.setState({book: r.data[0], loaded: true});
                    this.isbn = r.data[0].isbn;
                    this.title = r.data[0].title;
                    this.category = r.data[0].category;
                    this.author_id = r.data[0].author_id;
                    this.year = r.data[0].year;
                    this.language = r.data[0].language;
                    this.pages_number = r.data[0].pages_number;
                    this.publisher = r.data[0].publisher;
                    this.description = r.data[0].description;
                } else {
                    if(r.reason)
                        AlertFailure(r.reason);
                    else {
                        console.log("Book fetch error: " + JSON.stringify(r));
                        AlertFailure("Przepraszamy, nie udało się pobrać danych o książce");
                    }
                    this.setState({loaded: true});
                }
            });
    }

    isbn='';
    title='';
    author_id='';
    year='';
    language='';
    pages_number='';
    category='';
    publisher='';
    description='';


    onIsbnChange = (event) => {
        this.isbn = event.target.value;
    };
    onTitleChange = (event) => {
        this.title = event.target.value;
    };
    onAuthor_idChange = (event) => {
        this.author_id = event.target.value;
    };
    onYearChange = (event) => {
        this.year = event.target.value;
    };
    onLanguageChange = (event) => {
        this.language = event.target.value;
    };
    onPages_numberChange = (event) => {
        this.pages_number = event.target.value;
    };
    onCategoryChange = (event) => {
        this.category = event.target.value;
    };
    onPublisherChange = (event) => {
        this.publisher = event.target.value;
    };
    onDescriptionChange = (event) => {
        this.description = event.target.value;
    };

    onSubmit = (event) => {
        event.preventDefault();
        const data = { isbn: this.isbn, title: this.title, author_id: this.author_id, year: this.year, language: this.language, pages_number: this.pages_number, category: this.category, publisher: this.publisher, description: this.description };
        if(this.validateForm(data))
            this.postData(data);
    };

    validateForm(data)
    {
        if(!data.isbn)
        {
            AlertFailure("Podaj isbn książki");
            return false;
        }
        if(!data.title)
        {
            AlertFailure("Podaj tytuł książki");
            return false;
        }
        if(!data.author_id)
        {
            AlertFailure("Podaj id autora");
            return false;
        }
        if(!data.year)
        {
            AlertFailure("Podaj rok wydania");
            return false;
        }
        if(!data.language)
        {
            AlertFailure("Podaj język");
            return false;
        }
        if(!data.pages_number)
        {
            AlertFailure("Podaj ilość stron");
            return false;
        }
        if(!data.category)
        {
            AlertFailure("Podaj kategorię");
            return false;
        }
        if(!data.publisher)
        {
            AlertFailure("Podaj wydawcę");
            return false;
        }
        if(!data.description)
        {
            AlertFailure("Podaj opis");
            return false;
        }
        return true;
    }

    postData(data)
    {
        fetch('http://localhost:3000/admin/update/book/' + this.props.match.params.isbn, {
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
                this.props.history.push('/admin/books');
                AlertSuccess("Zaaktualizowano książkę pomyślnie");
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
                        <p style={{textAlign: 'center'}}>Wczytuję dane o książkach...</p>
                    </div>
                </React.Fragment>
            );
        }
        if(!this.state.book)
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
                    <h1>Edycja książki</h1>
                    <form onSubmit={this.onSubmit}>
                        <table className={"table_horizontal_style"}>
                            <tbody>
                            <tr>
                                <td>isbn</td>
                                <td><input type="text" name={"isbn"} onChange={this.onIsbnChange} defaultValue={this.state.book.isbn}/></td>
                            </tr>
                            <tr>
                                <td>tytuł</td>
                                <td><input type="text" name={"title"} onChange={this.onTitleChange} defaultValue={this.state.book.title}/></td>
                            </tr>
                            <tr>
                                <td>id autora</td>
                                <td><input type="text" name={"author_id"} onChange={this.onAuthor_idChange} defaultValue={this.state.book.author_id}/></td>
                            </tr>
                            <tr>
                                <td>rok</td>
                                <td><input type="text" name={"year"} onChange={this.onYearChange} defaultValue={this.state.book.year}/></td>
                            </tr>
                            <tr>
                                <td>język</td>
                                <td><input type="text" name={"language"} onChange={this.onLanguageChange} defaultValue={this.state.book.language}/></td>
                            </tr>
                            <tr>
                                <td>liczba stron</td>
                                <td><input type="text" name={"pages_number"} onChange={this.onPages_numberChange} defaultValue={this.state.book.pages_number}/></td>
                            </tr>
                            <tr>
                                <td>kategoria</td>
                                <td><input type="text" name={"category"} onChange={this.onCategoryChange} defaultValue={this.state.book.category}/></td>
                            </tr>
                            <tr>
                                <td>wydawca</td>
                                <td><input type="text" name={"publisher"} onChange={this.onPublisherChange} defaultValue={this.state.book.publisher}/></td>
                            </tr>
                            <tr>
                                <td>język</td>
                                <td><input type="text" name={"description"} onChange={this.onDescriptionChange} defaultValue={this.state.book.description}/></td>
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


AdminBooksEdit.propTypes = {};