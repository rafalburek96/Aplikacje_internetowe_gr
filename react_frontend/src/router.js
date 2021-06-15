import React from 'react';
import {Route, Switch} from 'react-router-dom';

import {Home} from './Components/Home';
import {Register} from './Components/Register';
import {Login} from './Components/Login';
import {Layout} from "./Components/Layout";
import {Search} from "./Components/Search";
import {Book} from "./Components/Book";
import {MyAccount} from "./Components/MyAccount";
import AdminLayout from "./AdminComponents/AdminLayout";
import {AdminLogin} from "./AdminComponents/AdminLogin";
import {AdminAuthors} from "./AdminComponents/AdminAuthors";
import {AdminAuthorsEdit} from "./AdminComponents/AdminAuthorsEdit";
import {AdminCategories} from "./AdminComponents/AdminCategories";
import {AdminCategoriesEdit} from "./AdminComponents/AdminCategoriesEdit";
import {AdminPublishers} from "./AdminComponents/AdminPublishers";
import {AdminPublishersEdit} from "./AdminComponents/AdminPublishersEdit";
import {AdminLanguages} from "./AdminComponents/AdminLanguages";
import {AdminLanguagesEdit} from "./AdminComponents/AdminLanguagesEdit";
import {AdminBooks} from "./AdminComponents/AdminBooks";
import {AdminBooksEdit} from "./AdminComponents/AdminBooksEdit";
import {AdminBooksOrders} from "./AdminComponents/AdminBooksOrders";

export default (
    <React.Fragment>
        <Route exact path="/" component={Search}/>
        <Route exact path="/register" component={Register}/>
        <Route exact path="/login" component={Login}/>
        <Route exact path="/admin/login" component={AdminLogin}/>
        <Route exact path="/admin/authors" component={AdminAuthors}/>
        <Route exact path="/admin/authors/edit/:id" component={AdminAuthorsEdit}/>
        <Route exact path="/admin/categories" component={AdminCategories}/>
        <Route exact path="/admin/categories/edit/:name" component={AdminCategoriesEdit}/>
        <Route exact path="/admin/publishers" component={AdminPublishers}/>
        <Route exact path="/admin/publishers/edit/:name" component={AdminPublishersEdit}/>
        <Route exact path="/admin/languages" component={AdminLanguages}/>
        <Route exact path="/admin/languages/edit/:language" component={AdminLanguagesEdit}/>
        <Route exact path="/admin/books" component={AdminBooks}/>
        <Route exact path="/admin/books/edit/:isbn" component={AdminBooksEdit}/>
        <Route exact path="/admin/orders" component={AdminBooksOrders}/>

        <Route exact path="/search" component={Search}/>
        <Route exact path="/book/:id" component={Book}/>
        <Route exact path="/my_account" component={MyAccount}/>
    </React.Fragment>
);


export const PageLayout = (
    <React.Fragment>
        <Switch>
            <Route path="/admin" component={AdminLayout}/>
            <Route path="/" component={Layout}/>
        </Switch>
    </React.Fragment>
);
