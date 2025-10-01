import { Box, Center } from '@chakra-ui/react';

export function BottomSection() {
  return (
    <Box pb='2' px={{ base: '2', md: '0' }}>
      <Center fontSize={{ base: '2xs', md: 'xs' }} color='fg.muted' textAlign='center'>
        ChatGPT قد يرتكب أخطاء. تحقق من المعلومات المهمة.
      </Center>
    </Box>
  );
}
