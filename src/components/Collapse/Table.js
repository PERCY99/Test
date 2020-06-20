import React from 'react'
import { Table } from 'antd';
import { Resizable } from 'react-resizable';
//import App from './Modal'
import Test from './Test';
import { Modal } from 'antd';
//import Axios from 'axios';



const ResizeableTitle = props => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={e => {
            e.stopPropagation();
          }}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

class Demo extends React.Component {
constructor(props) {
  super(props)

  
 this.state = {
    columns: [
      {
        title: 'Date',
        dataIndex: 'date',
        width: 200,
        sorter: (a, b) => a.amount - b.amount,

      },
      {
        title: 'Title',
        dataIndex: 'name',
        width: 200,
      },
      {
        title: 'Amount',
        dataIndex: 'amount',
        width: 200,
        sorter: (a, b) => a.amount - b.amount,
      },
      {
        title: 'Mode of Payment',
        dataIndex: 'type',
        width: 200,
      },
      {
        title: 'Remarks',
        dataIndex: 'note',
        width: 350,
      },
      {
        title: 'Action',
        key: 'action',
      render: (record) => (
          <span>    
                <a href = "#" onClick = {this.showModal}>View</a>
                <Modal
          visible={this.state.visible}
          title="Payment Details"
           onOk={this.handleOk}
           onCancel={this.handleCancel}
           footer={[null
              // <Button key="back" onClick={this.handleCancel}>
              //   Return
              // </Button>,
              // <Button key="submit" type="primary" loading={this.state.loading} onClick={this.handleOk}>
              //   Submit
              // </Button>,
           ]}
        >
          <Test />          
        </Modal>
          </span>
                   ),
      },
    ],
    loading: false,
    visible: false,
  }
}

showModal = () => {
  this.setState({
    visible: true,
  });
};

handleOk = () => {
  this.setState({ loading: true });
  
  // Axios.post()
  // .then( this,this.setState({ loading: false , visible : false })),
  console.log('close');
  
  setTimeout(() => {
    this.setState({ loading: false, visible: false });
  }, 3000);

};

handleCancel = () => {
  
  console.log('close'); 
  this.setState({ visible: false });

};

  components = {
    header: {
      cell: ResizeableTitle,
    },
  };

  data = [
    {
      key: 0,
      date: '2018-02-11',
      name : 'Newspaper',
      amount: 120,
      type: 'income',
      note: 'transfer',
    },
    {
      key: 1,
      date: '2018-03-11',
      name : 'Coffee',
      amount: 243,
      type: 'income',
      note: 'Upi',
    },
    {
      key: 2,
      date: '2018-04-11',
      name : 'Wifi',
      amount: 98,
      type: 'income',
      note: 'transfer',
    },
  ];

  handleResize = index => (e, { size }) => {
    this.setState(({ columns }) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return { columns: nextColumns };
    });
  };

  render() {
    const columns = this.state.columns.map((col, index) => ({
      ...col,
      onHeaderCell: column => ({
        width: column.width,
        onResize: this.handleResize(index),
      }),
    }));
    
    return <Table bordered components={this.components} columns={columns} dataSource={this.data} />;
  }
}

export default Demo