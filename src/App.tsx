import {Container} from 'react-bootstrap';
import {Outlet} from 'react-router';
import {useTheme} from '@/shared/hooks/useTheme';
import Theme from '@/shared/components/Theme';

const App = () => {
    const {theme} = useTheme();

    return (
        <Container fluid>
            <Theme />
            <Outlet context={theme} />
        </Container>
    )
};

export default App;
