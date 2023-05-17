import React from 'react'
import { Button, Container, Header, Icon, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

export default function ServerError() {
    return (
        <Container style={{marginTop:'80px'}}>
            <Segment placeholder>
                <Header icon>
                    <Icon name='search' />
                    Seems like we are having a temporary server error, please try again later
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
