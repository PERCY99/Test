import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { Form, Input, Button,Col, Row } from 'antd';

// const layout = {
//   labelCol: {
//     span: 12,
//   }

//   wrapperCol: {
//     span: 10,
//   },
// };

const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,   
  },
};

const onFinish = (values) => {
  console.log('Success:', values);
};

const CustomizedForm = ({ onChange, fields },props) => (


  <Form
    name="global_state"
    layout="vertical"
    fields={fields}
    onFinish={onFinish}
    initialValues={{
      remember: true,
    }}
    onFieldsChange={(changedFields, allFields) => {
      onChange(allFields);
    }}
  >
    <Form.Item
      name="Title"
      label="Title"
      rules={[
        {
          required: true,
          message: 'Title is required!',
        },
      ]}
    >
      <Input  readOnly/>
    </Form.Item>
    <Form.Item
        label="Amount"
        name="Amount"
        rules={[
          {
            required: true,
            message: 'Input your Amount!',
          },
        ]}
      >
        <Input  readOnly />
      </Form.Item>
      <Form.Item
        label="Mode Of Payment"
        name="payment"
        rules={[
          {
            required: true,
            message: 'Input your Payment Mode!',
          },
        ]}
      >
        <Input readOnly />
      </Form.Item>
      
      <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="description"
                  label="Description"
                  rules={[
                    {
                      required: true,
                      message: 'please enter description!',
                    },
                  ]}
                  
                >
                  <Input.TextArea rows={4} placeholder="please enter description" />
                </Form.Item>
              </Col>
            </Row>

      <Form.Item {...tailLayout}>
        <Button key="submit" type="primary" htmlType="submit" >
          Submit
        </Button>
      </Form.Item>
  </Form>
);

const Test = () => {
  const [fields, setFields] = useState([
    {
      name: ['Title'],
      value: 'Ant Design',
    },
    {
      name: ['Amount'],
      value: '320',
    },
    {
      name: ['payment'],
      value: 'UPI',
    },
    {
        name : ['description'],
        value: 'This is the food expense'
    },
  ]);

  return (
    <div>
      <CustomizedForm
        fields={fields}
        onChange={(newFields) => {
            setFields(newFields)
        }}
      />
    </div>
  );
};

export default Test