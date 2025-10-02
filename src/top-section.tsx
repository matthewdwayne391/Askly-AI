import { Box, Flex, IconButton } from '@chakra-ui/react';
import { ChatGPTMenu } from './ChatGPTMenu';
import { Avatar } from './components/ui/avatar';
import { Tooltip } from './components/ui/tooltip';
import { NewChatIcon, SidebarIcon } from './icons/sidebar-icons';
import { useSidebarContext } from './sidebar-context';
import { useConversations } from './conversations-context';

export function TopSection() {
  const { sideBarVisible, toggleSidebar } = useSidebarContext();
  const { createNewConversation } = useConversations();

  const handleNewChat = () => {
    createNewConversation(false);
  };

  return (
    <Flex 
      justify='space-between' 
      align='center' 
      p={{ base: '3', md: '4' }} 
      borderBottom='1px solid'
      borderColor='border'
      bg='bg'
      position='sticky'
      top='0'
      zIndex='10'
      minH={{ base: '60px', md: '70px' }}
    >
      <Flex align='center' gap={{ base: '1', md: '2' }} flex='1' minW='0'>
        {!sideBarVisible && (
          <>
            <Tooltip
              content='فتح الشريط الجانبي'
              positioning={{ placement: 'bottom' }}
              showArrow
            >
              <IconButton 
                variant='ghost' 
                onClick={toggleSidebar} 
                size={{ base: 'sm', md: 'md' }}
                minW={{ base: '40px', md: '44px' }}
                h={{ base: '40px', md: '44px' }}
              >
                <SidebarIcon fontSize={{ base: 'lg', md: 'xl' }} color='fg.muted' />
              </IconButton>
            </Tooltip>

            <Tooltip content='محادثة جديدة' showArrow>
              <IconButton 
                variant='ghost' 
                onClick={handleNewChat} 
                size={{ base: 'sm', md: 'md' }}
                minW={{ base: '40px', md: '44px' }}
                h={{ base: '40px', md: '44px' }}
              >
                <NewChatIcon fontSize={{ base: 'lg', md: 'xl' }} color='fg.muted' />
              </IconButton>
            </Tooltip>
          </>
        )}
        
        <Box 
          display={{ base: sideBarVisible ? 'none' : 'block', lg: 'block' }}
          overflow='hidden'
          flex='1'
          minW='0'
        >
          <ChatGPTMenu />
        </Box>
      </Flex>

      <Avatar
        name='مستخدم'
        size={{ base: 'sm', md: 'md' }}
        colorPalette='teal'
        variant='solid'
        flexShrink='0'
      />
    </Flex>
  );
}
