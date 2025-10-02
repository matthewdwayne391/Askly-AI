import { Box, Flex } from '@chakra-ui/react';
import { BottomSection } from './bottom-section';
import { MiddleSection } from './middle-section';
import { Sidebar } from './sidebar';
import { SidebarProvider, useSidebarContext } from './sidebar-context';
import { ConversationsProvider } from './conversations-context';
import { ModelProvider } from './model-context';
import { TopSection } from './top-section';

function AppContent() {
  const { sideBarVisible } = useSidebarContext();

  return (
    <Flex 
      minH='100vh' 
      direction={{ base: 'column', lg: 'row' }}
      position='relative'
    >
      <Sidebar />

      <Box 
        flex='1' 
        w={{ base: 'full', lg: 'auto' }}
        minH={{ base: '100vh', lg: 'auto' }}
        display='flex'
        flexDirection='column'
        marginRight={{ base: '0', lg: sideBarVisible ? '260px' : '0' }}
        transition='margin-right 0.3s ease-in-out'
      >
        <TopSection />
        <MiddleSection />
        <BottomSection />
      </Box>
    </Flex>
  );
}

function App() {
  return (
    <SidebarProvider>
      <ModelProvider>
        <ConversationsProvider>
          <AppContent />
        </ConversationsProvider>
      </ModelProvider>
    </SidebarProvider>
  );
}

export default App;
