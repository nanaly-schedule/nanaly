import { View } from 'react-native';
import NoticeCard, { Notice } from './NoticeCard';
import NoticeHeader from './NoticeHeader';

const MOCK_NOTICES: Notice[] = [
    {
    id: 1,
    title: '[필독] 이번 주말 야간 근무자 유의사항',
    content: '매장 청소 및 재고 확인 체크리스트를 반드시 확인해 주세요.',
    createdAt: '2024-06-01T10:00:00Z',
  },
  {
    id: 2,
    title: '매장 청소 체크리스트 업데이트 안내',
    content: '새로운 청소 구역이 추가되었습니다.',
    createdAt: '2024-06-02T10:00:00Z',
  },
  {
    id: 3,
    title: '3월 급여 정산 관련 공지',
    content: '급여 정산일이 공휴일인 관계로 하루 일찍 지급될 예정입니다.',
    createdAt: '2024-06-03T10:00:00Z',
  },
];

type NoticeWidgetProps = {
  onPressHeader?: () => void;
};


export default function NoticeWidget({ onPressHeader }: NoticeWidgetProps ) {
    return (
        <View>
            <NoticeHeader onPress={onPressHeader} />
            {MOCK_NOTICES.map((notice)=>(
                <NoticeCard
                    key={notice.id}
                    notice={notice}
                />
            ))}
        </View>
    )}
