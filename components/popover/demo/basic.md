---
order: 0
title:
  zh-CN: 气泡
  en-US: Popover
---


````jsx
/* eslint global-require: 0 */
import { Popover, NavBar, Icon } from 'antd-mobile';

const Item = Popover.Item;

class App extends React.Component {
  state = {
    visible: true,
    selected: '',
  };
  onSelect = (opt) => {
    // console.log(opt.props.value);
    this.setState({
      visible: false,
      selected: opt.props.value,
    });
  };
  handleVisibleChange = (visible) => {
    this.setState({
      visible,
    });
  };
  render() {
    let offsetX = -10; // just for pc demo
    if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) {
      offsetX = -26;
    }
    return (<div>
      <NavBar iconName={false}
        mode="light"
        rightContent={
          <Popover mask
            overlayClassName="fortest"
            overlayStyle={{ color: 'currentColor' }}
            visible={this.state.visible}
            overlay={[
              (<Item key="4" value="scan" icon={<Icon type={require('./scan.svg')} size="xs" />} data-seed="logId">扫一扫</Item>),
              (<Item key="5" value="special" icon={<Icon type={require('./qrcode.svg')} size="xs" />} style={{ whiteSpace: 'nowrap' }}>我的二维码</Item>),
              (<Item key="6" value="button ct" icon={<Icon type={require('./help.svg')} size="xs" />}>
                <span style={{ marginRight: 5 }}>帮助</span>
              </Item>),
            ]}
            align={{
              overflow: { adjustY: 0, adjustX: 0 },
              offset: [offsetX, 15],
            }}
            onVisibleChange={this.handleVisibleChange}
            onSelect={this.onSelect}
          >
            <div style={{
              height: '100%',
              padding: '0 15px',
              marginRight: '-15px',
              display: 'flex',
              alignItems: 'center',
            }}
            >
              <Icon type="ellipsis" />
            </div>
          </Popover>
        }
      >
        NavBar
      </NavBar>
    </div>);
  }
}

ReactDOM.render(<App />, mountNode);
````