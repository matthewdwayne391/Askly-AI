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
        <Flex 
          minH='100vh' 
          direction={{ base: 'column', lg: 'row' }}
          overflow='hidden'
          position='relative'
        >
          <Sidebar />

          <Box 
            flex='1' 
            w={{ base: 'full', lg: 'auto' }}
            minH={{ base: '100vh', lg: 'auto' }}
            display='flex'
            flexDirection='column'
          >
            <TopSection />
            <MiddleSection />
            <BottomSection />
          </Box>
        </Flex>
      </ConversationsProvider>
    </SidebarProvider>
  );
}

export default App;
