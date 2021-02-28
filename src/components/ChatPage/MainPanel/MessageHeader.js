import React from 'react'
// import {Row,Container,Col} from 'react-bootstrap'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import {FaLock} from 'react-icons/fa'
import {MdFavorite} from 'react-icons/md'
import {InputGroup,FormControl,Image} from 'react-bootstrap'
import {AiOutlineSearch} from 'react-icons/ai'
import {Accordion,Card,Button} from 'react-bootstrap'
function MessageHeader() {
    return (
        <div style={{
            width:'100%',
            height:'170px',
            border:'.2rem solid #ececec',
            borderRadius: '4px',
            padding:'1rem',
            marginBottom:'1rem'
        }}>
           <Container>
            <Row>
                <Col><h2><FaLock/>ChatRoom Name <MdFavorite/></h2></Col>
                    <Col>  <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon1">
                    <AiOutlineSearch/>
                    </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                    placeholder="Search Messages"
                    aria-label="Search"
                    aria-describedby="basic-addon1"
                    />
                </InputGroup></Col>
            </Row>
            <div style={{display:'flex',justifyContent:'flex-end'}}>
                <p>
                        <Image src="" />{" "} user name
                </p>
            </div>
            <Row>
                <Col>
                    <Accordion>
                    <Card>
                        <Card.Header style={{padding:'0 1rem'}}>
                        <Accordion.Toggle as={Button} variant="link" eventKey="1">
                            Click me!
                        </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="1">
                        <Card.Body>Hello! I'm the body</Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    </Accordion>
                </Col>
                <Col>   
                    <Accordion>
                    <Card>
                        <Card.Header style={{padding:'0 1rem'}}>
                        <Accordion.Toggle as={Button} variant="link" eventKey="1">
                            Click me!
                        </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="1">
                        <Card.Body>Hello! I'm the body</Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    </Accordion>
                </Col>
            </Row>
            </Container>
        </div>
    )
}

export default MessageHeader
