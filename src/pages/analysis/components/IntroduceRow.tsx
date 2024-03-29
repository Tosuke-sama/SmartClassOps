import { InfoCircleOutlined } from '@ant-design/icons';
import { Area, Column } from '@ant-design/plots';
import { Col, Progress, Row, Tooltip } from 'antd';
import numeral from 'numeral';
import type { DataItem } from '../data.d';
import useStyles from '../style.style';
import { ChartCard, Field } from './Charts';
import Trend from './Trend';
const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: {
    marginBottom: 24,
  },
};
const IntroduceRow = ({
  loading,
  visitData,
}: {
  loading: boolean;
  visitData: DataItem[];
}) => {
  const { styles } = useStyles();
  return (
    <Row gutter={24}>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          title="总可用教室数额"
          action={
            <Tooltip title="说明">
              <InfoCircleOutlined />
            </Tooltip>
          }
          loading={loading}
          total={() => `${numeral(1256).format('0,0')} 间`}
          footer={
            <Field
              label="总教室数"
              value={`${numeral(1321).format('0,0')} 间`}
            />
          }
          contentHeight={46}
        >
          <Area
            xField="x"
            yField="y"
            shapeField="smooth"
            height={46}
            axis={false}
            style={{
              fill: 'linear-gradient(-90deg, white 0%, #975FE4 100%)',
              fillOpacity: 0.6,
              width: '100%',
            }}
            padding={-20}
            data={visitData}
          />
        </ChartCard>
      </Col>

      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loading}
          title="使用中教室"
          action={
            <Tooltip title="指标说明">
              <InfoCircleOutlined />
            </Tooltip>
          }
          total={numeral(884).format('0,0')}
          footer={
            <Field label="日平均使用量" value={numeral(690).format('0,0')} />
          }
          contentHeight={46}
        >
          <Trend
            flag="up"
            style={{
              marginRight: 16,
            }}
          >
            周同比
            <span className={styles.trendText}>12%</span>
          </Trend>
          <Trend flag="down">
            日同比
            <span className={styles.trendText}>11%</span>
          </Trend>
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loading}
          title="已预定教室"
          action={
            <Tooltip title="指标说明">
              <InfoCircleOutlined />
            </Tooltip>
          }
          total={numeral(660).format('0,0')}
          footer={<Field label="预定率" value="60%" />}
          contentHeight={46}
        >
          <Column
            xField="x"
            yField="y"
            padding={-20}
            axis={false}
            height={46}
            data={visitData}
            scale={{ x: { paddingInner: 0.4 } }}
          />
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          loading={loading}
          bordered={false}
          title="综合使用率"
          action={
            <Tooltip title="指标说明">
              <InfoCircleOutlined />
            </Tooltip>
          }
          total="78%"
          footer={
            <div
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              <Trend
                flag="up"
                style={{
                  marginRight: 16,
                }}
              >
                周同比
                <span className={styles.trendText}>12%</span>
              </Trend>
              <Trend flag="down">
                日同比
                <span className={styles.trendText}>11%</span>
              </Trend>
            </div>
          }
          contentHeight={46}
        >
          <Progress
            percent={78}
            strokeColor={{ from: '#108ee9', to: '#87d068' }}
            status="active"
          />
        </ChartCard>
      </Col>
    </Row>
  );
};
export default IntroduceRow;
