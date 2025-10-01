import { Flex, IconButton } from '@chakra-ui/react';
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
    <Flex justify='space-between' align='center' p='2'>
      {!sideBarVisible && (
        <Flex>
          <Tooltip
            content='فتح الشريط الجانبي'
            positioning={{ placement: 'right' }}
            showArrow
          >
            <IconButton variant='ghost' onClick={toggleSidebar}>
              <SidebarIcon fontSize='2xl' color='fg.muted' />
            </IconButton>
          </Tooltip>

          <Tooltip content='محادثة جديدة' showArrow>
            <IconButton variant='ghost' onClick={handleNewChat}>
              <NewChatIcon fontSize='2xl' color='fg.muted' />
            </IconButton>
          </Tooltip>
          <ChatGPTMenu />
        </Flex>
      )}
      {sideBarVisible && <ChatGPTMenu />}

      <Avatar
        name='مستخدم'
        size='sm'
        colorPalette='teal'
        variant='solid'
        mr='3'
      />
    </Flex>
  );
}
