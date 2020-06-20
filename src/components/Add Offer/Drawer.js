import React from "react";
import { Drawer, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Basic from './Basic'

class DrawerForm extends React.Component {
  state = { visible: false };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    return (
      <>
        <Button type="primary" onClick={this.showDrawer}>
          <PlusOutlined /> Add Offer
        </Button>
        <Drawer
          title="Create a Offer"
          width={720}
          onClose={this.onClose}
          visible={this.state.visible}
          bodyStyle={{ paddingBottom: 80 }}
        //   footer={
        //     <div
        //       style={{
        //         textAlign: 'right',
        //       }}
        //     >
        //       <Button onClick={this.onClose} style={{ marginRight: 8 }}>
        //         Cancel
        //       </Button>
        //       <Button onClick={this.onClose} type="primary">
        //         Submit
        //       </Button>
        //     </div>
        //   }
        >
         <Basic />
        </Drawer>
      </>
    );
  }
}

export default DrawerForm