import React from 'react'

import {
    Form,
    Input,
    Button,
    Upload,
    DatePicker,
  } from 'antd';
  import {  InboxOutlined } from '@ant-design/icons';
  import 'antd/dist/antd.css';
  const { RangePicker } = DatePicker;

  const rangeConfig = {
    rules: [
      {
        type: 'array',
        required: true,
        message: 'Please select time!',
      },
    ],
  };

  const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 14,
    },
  };
  
  const normFile = e => {
    console.log('Upload event:', e);
  
    if (Array.isArray(e)) {
      return e;
    }
  
    return e && e.fileList;
  };
  
  const Basic = () => {
    const onFinish = fieldsValue => {
        const rangeTimeValue = fieldsValue['range-time-picker'];
        const values = {

            ...fieldsValue,
            'range-time-picker': [
                rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss'),
                rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss'),
              ],
        }
        console.log('Received values of form: ', values);        
      }
      
    return (
      <Form
        name="validate_other"
        {...formItemLayout}
        onFinish={onFinish}
      >
        
        <Form.Item label="Upload Image">
          <Form.Item name="dragger" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
            <Upload.Dragger name="files" action="/upload.do" accept = ".jpeg">
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
            </Upload.Dragger>
          </Form.Item>
        </Form.Item>

        <Form.Item 
          label="Title"
          name = "title"
          rules={[{ required: true, message: 'Please input the Title!'}]} >
          <Input />
        </Form.Item >      
        
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

        <Form.Item name="range-time-picker" label="Start Time and End Time" {...rangeConfig}>
        <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
      </Form.Item>

      <Form.Item 
      label = "Coupon Code"
      name = "coupon_code"
      rules= {[
        {
            required: true,
            message: 'please enter Coupon Code!'
        }
      ]}>
          <Input placeholder = "Enter the coupon code"/>
        </Form.Item > 
  
        <Form.Item
        style ={{'alignItems': 'right'}}
          wrapperCol={{
            span: 12,
            offset: 6,
          }}
        >
          <Button  type="primary" htmlType="submit" >
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  };
  
export default Basic