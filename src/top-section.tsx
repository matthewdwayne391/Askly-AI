import { Box, Flex, IconButton } from '@chakra-ui/react';
import { ChatGPTMenu } from './ChatGPTMenu';
import { Avatar } from './components/ui/avatar';
import { Tooltip } from './components/ui/tooltip';
import { NewChatIcon, SidebarIcon } from './icons/sidebar-icons';
import { useSidebarContext } from './sidebar-context';
import { useConversations } from './conversations-context';
import { useModel } from './model-context';
import { NativeSelectRoot, NativeSelectField } from './components/ui/native-select';

export function TopSection() {
  const { sideBarVisible, toggleSidebar } = useSidebarContext();
  const { createNewConversation } = useConversations();
  const { selectedModel, setSelectedModel } = useModel();

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

        <NativeSelectRoot size={{ base: 'sm', md: 'md' }} width={{ base: '140px', md: '180px' }}>
          <NativeSelectField
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            fontSize={{ base: 'xs', md: 'sm' }}
          >
            <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
            <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash Exp</option>
          </NativeSelectField>
        </NativeSelectRoot>
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
