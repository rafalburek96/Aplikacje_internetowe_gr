import React, {Component, Fragment} from 'react';
import {AlertFailure, AlertSuccess} from "../Misc/Alert";
import {NavLink} from "react-router-dom";


export class AdminBooks extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            loaded: false,
            books: null,
            allowAccess: false
        }
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

    componentDidMount() {
        fetch('http://localhost:3000/books', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        }).then(r=>r.json())
            .then(r=>{
                if(r.status === 'success') {
                    var id = 0;
                    let books = r.data.map((book) => {
                        id += 1;
                        return (
                            <tr key={id}>
                                <td>{book.isbn}</td>
                                <td>{book.title}</td>
                                <td>{book.author_id}</td>
                                <td>{book.year}</td>
                                <td>{book.language}</td>
                                <td>{book.pages_number}</td>
                                <td>{book.category}</td>
                                <td>{book.publisher}</td>
                                <td>{book.description}</td>

                                <td><NavLink to={"/admin/books/edit/" + book.isbn}><button>Edytuj</button></NavLink></td>
                                <td><button onClick={this.deleteBook.bind(this, book.isbn)}>Usuń</button></td>
                            </tr>
                        );
                    });
                    this.setState({books: books, allowAccess: true, loaded: true});
                    document.getElementById("defaultTab").click();
                } else {
                    if(r.reason)
                        AlertFailure(r.reason);
                    else {
                        console.log("Book fetch error: " + JSON.stringify(r));
                        AlertFailure("Przeprszamy, nie udało się pobrać danych o książce");
                    }
                }
                this.setState({loaded: true});
            });
    }

    deleteBook(isbn)
    {
        if(!window.confirm('Czy napewno chcesz usunąc tę książkę?'))
            return;
        fetch('http://localhost:3000/admin/delete/book/' + isbn, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        }).then(r=>r.json()).then(r=>{
            if(r.status === 'failed') {
                AlertFailure(r.reason);
            } else {
                this.componentDidMount();
                AlertSuccess("Usunięto książkę pomyślnie");
            }
        });
    }

    openTabLink(evt, name)
    {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++)
        {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++)
        {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        document.getElementById(name).style.display = "block";
        evt.currentTarget.className += " active";
    }

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

    onSubmit = (event) => {
        event.preventDefault();
        const data = { isbn: this.isbn, title: this.title, author_id: this.author_id, year: this.year, language: this.language, pages_number: this.pages_number, category: this.category, publisher: this.publisher, description: this.description };
        if(this.validateForm(data))
            this.postData(data);
    };

    postData(data)
    {
        fetch('http://localhost:3000/admin/add/book', {
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
                this.componentDidMount();
                AlertSuccess("Utworzono książkę pomyślnie");
            }
        });
    }

    render() {
        if(!this.state.loaded)
        {
            return (
                <Fragment>
                    <p style={{margin: '15px', textAlign: 'center'}}>Wczytuję dane o książkach...</p>
                </Fragment>
            );
        }
        if(this.state.allowAccess)
        {
            return (
                <Fragment>
                    <div>
                        <div className="tab">
                            <button className="tablinks" onClick={(evt) => this.openTabLink(evt, 'AllBooks')} id="defaultTab">Lista książek</button>
                            <button className="tablinks" onClick={(evt) => this.openTabLink(evt, 'AddBook')}>Dodaj książkę</button>
                        </div>

                        <div id="AllBooks" className="tabcontent">
                            <table className="table_style">
                                <thead>
                                <tr>
                                    <td>isbn</td>
                                    <td>tytuł</td>
                                    <td>id autora</td>
                                    <td>rok</td>
                                    <td>język</td>
                                    <td>ilość stron</td>
                                    <td>kategoria</td>
                                    <td>wydawca</td>
                                    <td>opis</td>

                                    <td style={{width: '45px'}}>Edytuj</td>
                                    <td style={{width: '35px'}}>Usuń</td>
                                </tr>
                                </thead>
                                <tbody>
                                {this.state.books}
                                </tbody>
                            </table>
                        </div>

                        <div id="AddBook" className="tabcontent">
                            <form onSubmit={this.onSubmit}>
                                <table className={"table_horizontal_style"}>
                                    <tbody>
                                    <tr>
                                        <td>isbn</td>
                                        <td><input type="text" name={"isbn"} onChange={this.onIsbnChange}/></td>
                                    </tr>
                                    <tr>
                                        <td>tytuł</td>
                                        <td><input type="text" name={"title"} onChange={this.onTitleChange}/></td>
                                    </tr>
                                    <tr>
                                        <td>id autora</td>
                                        <td><input type="text" name={"author_id"} onChange={this.onAuthor_idChange}/></td>
                                    </tr>
                                    <tr>
                                        <td>rok</td>
                                        <td><input type="text" name={"year"} onChange={this.onYearChange}/></td>
                                    </tr>
                                    <tr>
                                        <td>język</td>
                                        <td><input type="text" name={"language"} onChange={this.onLanguageChange}/></td>
                                    </tr>
                                    <tr>
                                        <td>ilośc stron</td>
                                        <td><input type="text" name={"pages_number"} onChange={this.onPages_numberChange}/></td>
                                    </tr>
                                    <tr>
                                        <td>kategoria</td>
                                        <td><input type="text" name={"category"} onChange={this.onCategoryChange}/></td>
                                    </tr>
                                    <tr>
                                        <td>wydawca</td>
                                        <td><input type="text" name={"publisher"} onChange={this.onPublisherChange}/></td>
                                    </tr>
                                    <tr>
                                        <td>opis</td>
                                        <td><input type="text" name={"description"} onChange={this.onDescriptionChange}/></td>
                                    </tr>
                                    </tbody>
                                </table>
                                <div style={{textAlign: 'center'}}>
                                    <input type={"submit"} value={"Wyślij"} style={{margin: '10px', width: '100px', height: '30px'}}/>
                                </div>
                            </form>
                        </div>

                    </div>
                </Fragment>
            );
        } else {
            return (
                <Fragment>
                    <p style={{margin: '15px', textAlign: 'center'}}>Odmowa dostępu</p>
                </Fragment>
            );
        }

    }
}

AdminBooks.propTypes = {};