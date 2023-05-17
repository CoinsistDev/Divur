import React from 'react';
import { Button, Container, Header, Icon, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <Container style={{marginTop:'80px'}}>
            <Segment placeholder>
                <Header icon>
                    <Icon name='search' />
                    Oops - we've searched everywhere and could not find this.
                </Header>
                <Segment.Inline>
                    <Button as={Link} to='/' primary>
                        Back to home page
                    </Button>
                </Segment.Inline>
            </Segment>
        </Container>
    )
}
