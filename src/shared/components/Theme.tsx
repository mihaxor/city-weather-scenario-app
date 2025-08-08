import {Button, Col, Row, Stack} from 'react-bootstrap';
import {MoonStarsFill, SunFill} from 'react-bootstrap-icons';
import {useTheme} from '@/shared/hooks/useTheme';

const Theme = () =>{
    const {theme, setTheme, reverseTheme} = useTheme();

    return (
        <Row className='mb-3'>
            <Col>
                <Stack direction={'horizontal'} gap={2}>
                    <Button variant={reverseTheme(theme)} onClick={() => {
                        setTheme(reverseTheme(theme))
                    }}>
                        {theme === 'dark' ?
                            <SunFill /> :
                            <MoonStarsFill />
                        }
                    </Button>
                </Stack>
            </Col>
        </Row>
    )
}

export default Theme;