import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import NText from '@/src/shared/ui/NText';
import PageLayout from '@/src/shared/ui/PageLayout';

export default function NoticeCreatePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const handleSubmit = () => {
    console.log({
      title,
      content,
      isPublic,
    });
  };

  return (
    <PageLayout
      title="공지작성"
    //   right={
    //     <Pressable onPress={handleSubmit}>
    //       <NText
    //         variant="b14"
    //         style={styles.submit}
    //       >
    //         등록
    //       </NText>
    //     </Pressable>
    //   }
    >
      <View style={styles.container}>
        <TextInput
          placeholder="제목을 입력해주세요"
          value={title}
          onChangeText={setTitle}
          style={styles.titleInput}
        />

        <TextInput
          placeholder="공지 내용을 입력해주세요"
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
          style={styles.contentInput}
        />

        <View style={styles.settingContainer}>
          <NText variant="m16">
            공개 설정
          </NText>

          <View style={styles.segment}>
            <Pressable
              style={[
                styles.segmentButton,
                isPublic && styles.selected,
              ]}
              onPress={() => setIsPublic(true)}
            >
              <NText variant="r14">
                공개
              </NText>
            </Pressable>

            <Pressable
              style={[
                styles.segmentButton,
                !isPublic && styles.selected,
              ]}
              onPress={() => setIsPublic(false)}
            >
              <NText variant="r14">
                비공개
              </NText>
            </Pressable>
          </View>
        </View>
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
  },

  titleInput: {
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
  },

  contentInput: {
    flex: 1,
    minHeight: 240,

    backgroundColor: '#fff',
    borderRadius: 12,

    padding: 16,
  },

  settingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  segment: {
    flexDirection: 'row',
    backgroundColor: '#F1F1F1',
    borderRadius: 8,
    padding: 2,
  },

  segmentButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },

  selected: {
    backgroundColor: '#FFFFFF',
  },

  submit: {
    color: '#5B57FF',
  },
});