import Guide from '@/components/Guide';
import Soundrecord from '@/components/Soundrecord';
import { trim } from '@/utils/format';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import styles from './index.less';

const HomePage: React.FC = () => {
  const { name } = useModel('global');
  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <Guide name={trim(name)} />
        空闲教室、使用中教室、已预订教室、拥挤度、利用率、等等
      </div>
      <Soundrecord />
    </PageContainer>
  );
};

export default HomePage;
