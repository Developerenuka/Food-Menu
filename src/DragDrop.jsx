import React, { Component } from "react";
import { Card, Container } from "react-bootstrap";
import { FaTrash, FaArrowsAlt, FaEdit } from "react-icons/fa";
class DragDrop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu_data: this.props.menu_data,
      dropData: {},
      flag: false,
      
    };
    this.myRef= []
  }

  onDragStart = (ev, id, index) => {
    let data = {
      id: id,
      index: index,
    };
    ev.dataTransfer.setData("data", JSON.stringify(data));
    this.setState({ flag: true });
    this.myRef[index].classList.add('beginDrag')
  };

  onDragOver = (ev) => {
    ev.preventDefault();
  };

  onDrop = (ev, index) => {
    let dropData = JSON.parse(ev.dataTransfer.getData("data"));
    let dropIndex = index;
    this.setState({
      ...this.state,
      dropData,
      dropIndex,
    });
    let menu_data = this.state.menu_data;
    if (dropData.index > dropIndex) {
      menu_data.splice(dropIndex, 0, dropData.id);
      menu_data.splice(dropData.index + 1, 1);
    } else {
      menu_data.splice(dropIndex + 1, 0, dropData.id);
      menu_data.splice(dropData.index, 1);
    }
    this.setState({
      ...this.state,
      menu_data,
      flag: false,
    });
    this.myRef[dropData.index].classList.remove('beginDrag')
    this.myRef[dropData.index].classList.remove('readyDrop')
  };

  render() {
    return (
      <div className="container-drag">
        <div className="wraper-inner">
          {this.state.menu_data.map((data, index) => {
            return (
              <Container key={index} className="wip" ref={el => this.myRef[index] = el}>
                <Card
                  className="data_card"
                  onDragStart={(e) => this.onDragStart(e, data, index)}
                  onDragOver={(e) => this.onDragOver(e)}
                  onDrop={(e) => {
                    this.onDrop(e, index);
                  }}
                >
                  <span>
                    <FaEdit onClick={(e) => this.props.handleEdit(e, data)} />
                    <FaTrash
                      className="deleteIcon"
                      onClick={(e) =>
                        this.props.handleDelete(e, "cuisine", index)
                      }
                    />
                  </span>
                  <Card.Body>
                    <Card.Title>
                      <h1>{data.cuisine.toUpperCase()}</h1>
                    </Card.Title>
                    {data.items.map((item, key) => (
                      <Card className="inner_data_card" key={key}>
                        <Card.Body>
                          <Card.Text>
                            {item}
                            <FaTrash
                              className="deleteIcon"
                              onClick={(e) =>
                                this.props.handleDelete(e, "item", key, index)
                              }
                            />
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    ))}
                  </Card.Body>
                </Card>
              </Container>
            );
          })}
        </div>
      </div>
    );
  }
}

export default DragDrop;
