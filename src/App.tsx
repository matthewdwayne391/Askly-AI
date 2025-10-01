import { Box, Flex, Stack } from '@chakra-ui/react';
import { BottomSection } from './bottom-section';
import { MiddleSection } from './middle-section';
import { Sidebar } from './sidebar';
import { SidebarProvider } from './sidebar-context';
import { ConversationsProvider } from './conversations-context';
import { TopSection } from './top-section';

function App() {
  return (
    <SidebarProvider>
      <ConversationsProvider>
        <Flex minH='100dvh' direction={{ base: 'column', lg: 'row' }}>
          <Sidebar />

          <Box flex='1' w={{ base: 'full', lg: 'auto' }}>
            <Stack h='full'>
              <TopSection />
              <MiddleSection />
              <BottomSection />
            </Stack>
          </Box>
        </Flex>
      </ConversationsProvider>
    </SidebarProvider>
  );
}

export default App;
