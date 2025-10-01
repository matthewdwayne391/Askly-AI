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
    <Flex justify='space-between' align='center' p={{ base: '2', md: '3' }} flexWrap='wrap' gap='2'>
      <Flex align='center' gap='1'>
        {!sideBarVisible && (
          <>
            <Tooltip
              content='فتح الشريط الجانبي'
              positioning={{ placement: 'right' }}
              showArrow
            >
              <IconButton variant='ghost' onClick={toggleSidebar} size={{ base: 'sm', md: 'md' }}>
                <SidebarIcon fontSize={{ base: 'xl', md: '2xl' }} color='fg.muted' />
              </IconButton>
            </Tooltip>

            <Tooltip content='محادثة جديدة' showArrow>
              <IconButton variant='ghost' onClick={handleNewChat} size={{ base: 'sm', md: 'md' }}>
                <NewChatIcon fontSize={{ base: 'xl', md: '2xl' }} color='fg.muted' />
              </IconButton>
            </Tooltip>
          </>
        )}
        <Box display={{ base: sideBarVisible ? 'none' : 'block', md: 'block' }}>
          <ChatGPTMenu />
        </Box>
      </Flex>

      <Avatar
        name='مستخدم'
        size={{ base: 'xs', md: 'sm' }}
        colorPalette='teal'
        variant='solid'
      />
    </Flex>
  );
}
