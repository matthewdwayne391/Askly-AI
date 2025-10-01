import { Box, Center } from '@chakra-ui/react';

export function BottomSection() {
  return (
    <Box 
      py={{ base: '2', md: '3' }} 
      px={{ base: '3', md: '4' }}
      borderTop='1px solid'
      borderColor='border'
      bg='bg'
    >
      <Center 
        fontSize={{ base: '2xs', sm: 'xs', md: 'sm' }} 
        color='fg.muted' 
        textAlign='center'
        maxW='md'
        mx='auto'
        lineHeight='1.4'
      >
        ChatGPT قد يرتكب أخطاء. تحقق من المعلومات المهمة.
      </Center>
    </Box>
  );
}
