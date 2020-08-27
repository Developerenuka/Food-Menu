import React, { Component } from 'react';
import { Button, Modal, Form, Card, Container } from 'react-bootstrap';
import { FaPlusCircle, FaTrash } from 'react-icons/fa';
import DragDrop from './DragDrop';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showHide: false,
      addEdit: true,
      id: '',
      cuisine: '',
      items: [''],
      menu_data: localStorage.getItem('menu_data') !== null ? JSON.parse(localStorage.getItem('menu_data')) : []
    }
  }

  handleModalShowHide() {
    this.setState({ showHide: !this.state.showHide, id: '', cuisine: '', items: [''], addEdit: true })
  }
  addRemoveItems(flag, index) {
    let items = [...this.state.items]
    if (flag === 'add') {
      items.push('');
    } else {
      items.splice(index, 1)
    }
    this.setState({ items })
  }
  handleChange(e, index) {
    const { items } = this.state;
    const { name, value } = e.target;
    if (name === 'item') {
      items[index] = value
      this.setState({ items });
    }
    this.setState({ [name]: value });
  }
  handleSubmit(flag) {
    const { id, cuisine, items, menu_data } = this.state;
    let item_data = items.filter(str => str.length !== 0)
    if (flag === 'add') {
      let params = {
        cuisine,
        items: item_data,
        id: menu_data.length
      }
      menu_data.push(params)
    } else {
      let index = menu_data.findIndex(data => data.id === id)
      let params = {
        cuisine,
        items: item_data,
        id: id
      }
      menu_data[index] = params;
    }

    localStorage.setItem('menu_data', JSON.stringify(menu_data));
    this.setState({
      showHide: false, menu_data: menu_data
    })
  }

  handleEdit = (e, data) => {
    this.setState({ showHide: true, cuisine: data.cuisine, items: data.items, id: data.id, addEdit: false })
  }

  handleDelete = (e, name, index, parent_index) => {
    const { menu_data } = this.state;
    if (name === 'cuisine') {
      menu_data.splice(index, 1);
      localStorage.setItem('menu_data', JSON.stringify(menu_data));
    } else {
      menu_data[parent_index].items.splice(index, 1);
      localStorage.setItem('menu_data', JSON.stringify(menu_data));
    }
    this.setState({ menu_data: menu_data })
  }
  render() {
    const { cuisine, items, menu_data, addEdit } = this.state;

    return (
      <div className="app_page">
        <div className='text-center mt-3'>
          <img src='menu_icon.png' className='ml-5' style={{ height: '80px', width: '80px' }} alt='' />
          <Button variant="secondary" className='float-right mr-3' onClick={() => this.handleModalShowHide()}>
            Add Menu
          </Button>
        </div>
        {menu_data.length === 0 ?
          <Container>
            <Card className='no_data_card'>
              <Card.Img variant="top" src="no_menu.jpeg" />
              <Card.Body>
                <Card.Text>
                  There is no menu section data is present, please add menu of your choice
                <Button variant="secondary" onClick={() => this.handleModalShowHide()}>
                    Add Menu
                </Button>
                </Card.Text>
              </Card.Body>
            </Card>
          </Container>
          :
          <DragDrop menu_data={menu_data} handleDelete={this.handleDelete} handleEdit={this.handleEdit} />
        }
        <Modal show={this.state.showHide} centered>
          <Modal.Header closeButton onClick={() => this.handleModalShowHide()}>
            <Modal.Title>{addEdit ? 'Add Menu Items' : 'Edit Menu Items'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Cuisine</Form.Label>
                <Form.Control type="text" placeholder="Enter Cuisine" name='cuisine' value={cuisine} onChange={(e) => this.handleChange(e)} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Items</Form.Label>
                {items.map((item, index) =>
                  <div key={index} className='item_wrap'>
                    <Form.Control type="text" placeholder={`Item ${index + 1}`} name='item' value={item} onChange={(e) => this.handleChange(e, index)} />
                    {items.length !== 1 && <FaTrash className='deleteIcon' onClick={() => this.addRemoveItems('remove', index)} />}
                  </div>
                )}
                <FaPlusCircle className='plusIcon' onClick={() => this.addRemoveItems('add')} />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.handleModalShowHide()}>
              Close
            </Button>
            {addEdit ?
              <Button variant="primary" onClick={() => this.handleSubmit('add')}>
                Add
              </Button>
              :
              <Button variant="primary" onClick={() => this.handleSubmit('edit')}>
                Edit
              </Button>
            }
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default App;