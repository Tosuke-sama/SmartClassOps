/**
 * @Description
 */
import { GridContent, PageContainer } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { Suspense } from 'react';
import IntroduceRow from './components/IntroduceRow';
import PageLoading from './components/PageLoading';
import { fakeChartData } from './service';
// import { theme } from 'antd';
import styles from './index.less';

const RoomState: React.FC = () => {
  // const { name } = useModel('global');
  const { loading, data } = useRequest(fakeChartData);
  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <GridContent>
          <>
            <Suspense fallback={<PageLoading />}>
              <IntroduceRow
                loading={loading}
                visitData={data?.visitData || []}
              />
            </Suspense>
          </>
        </GridContent>
      </div>
    </PageContainer>
  );
};

export default RoomState;
