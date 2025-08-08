import {createRoot} from 'react-dom/client';
import {Provider} from 'react-redux';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router';
import Store from '@/app/ReduxConfig';
import App from '@/App';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles.css';
import CityAdd from '@/shared/components/CityAdd';
import CitySearch from '@/shared/components/CitySearch';

createRoot(document.getElementById('root')!).render(
    <Provider store={Store}>
        <BrowserRouter>
            <Routes>
                <Route path='/' Component={App}>
                    <Route path='/' Component={CitySearch} />
                    <Route path='/city' Component={CityAdd} />
                </Route>

                <Route path='*' element={<Navigate to='/' />} />
            </Routes>
        </BrowserRouter>
    </Provider>);
