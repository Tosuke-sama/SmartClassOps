/**
 * @Description
 */
import { PageContainer, StatisticCard } from '@ant-design/pro-components';
// import { useModel } from '@umijs/max';
import { EllipsisOutlined, RightOutlined } from '@ant-design/icons';
import { Space, theme } from 'antd';
import styles from './index.less';
const { Statistic } = StatisticCard;
const RoomState: React.FC = () => {
  // const { name } = useModel('global');
  const { token } = theme.useToken();
  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <StatisticCard
          title={
            <Space>
              <span>部门一</span>
              <RightOutlined style={{ color: token.colorTextHeading }} />
            </Space>
          }
          extra={<EllipsisOutlined />}
          statistic={{
            value: 1102893,
            prefix: '¥',
            description: (
              <Space>
                <Statistic title="实际完成度" value="82.3%" />
                <Statistic title="当前目标" value="¥6000" />
              </Space>
            ),
          }}
          chart={
            <>
              <img
                src="https://gw.alipayobjects.com/zos/alicdn/BA_R9SIAV/charts.svg"
                alt="chart"
                width="100%"
              />
            </>
          }
          style={{ width: 268 }}
        />
      </div>
    </PageContainer>
  );
};

export default RoomState;
