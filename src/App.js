import React, { useRef, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Form, Button, Container, Row, Col, Spinner, Alert } from 'react-bootstrap'
import Axios, { CancelToken } from 'axios'; 

function App() { 
    const [encode, setEncode] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [cancel, setCancel] = useState()
    const [show, setShow] = useState(false);
    const handleChange = event => setEncode(event.target.value)  
    const cancelFileUpload = useRef(null);

    const handleOnSubmit = (e)=> {
        setIsLoading(true)
        Axios.post("https://localhost:7248/api/encode", 
        {
            encodeText: encode
        }, 
        {
          cancelToken: new CancelToken(
            cancel => (cancelFileUpload.current = cancel)
          )
        })
        .then((response)=>{
           setEncode(response.data)
        })
        .catch((e)=>{
            if (e.code === 'ERR_CANCELED') {
                setShow(true)
                setCancel(e.message )
            }
            console.log(e);
        }).finally(()=>{
            setIsLoading(false)
        })   
        e.preventDefault()
    }

    const onCancel = () => {  
        if(cancelFileUpload.current) {
            cancelFileUpload.current('canceled')
        }
    }
    function AlertDismissibleExample() { 
        if (show) {
          return (
            <Alert variant="danger" onClose={() => setShow(false)} dismissible>
              <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
              <p>{cancel}</p>
            </Alert>
          );
        } 
      }

    return (
        <>   
            <Container className="d-flex align-items-center justify-content-center vh-100">
                <Row>
                    <AlertDismissibleExample/>
                    <Col>
                    <h2 className="text-center mb-4">Encoding Test</h2>
                    <Form onSubmit={handleOnSubmit}> 
                        <Form.Group className="mb-3" controlId="encodeText">
                        <Form.Label>Encode Test</Form.Label>
                            <Form.Control 
                                name="encode" 
                                type="text" 
                                disabled={isLoading}
                                placeholder="Enter text to Encode" 
                                onChange={handleChange}  
                                value={encode ? encode : ''} 
                            />
                        </Form.Group>  
                        <Button variant="primary" type="submit">
                            {isLoading ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="grow"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                    Loading...
                                </>
                            ) : (
                                "Submit"
                            )}
                        </Button>
                        <Button variant="danger"disabled={!isLoading} onClick={onCancel}>
                            Cancel
                        </Button>
                    </Form> 
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default App