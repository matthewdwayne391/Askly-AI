import { Button } from '@/components/ui/button';
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
} from '@/components/ui/menu';
import { Box, Circle, HStack, Stack, Text } from '@chakra-ui/react';
import {
  ChatGPTMenuIcon,
  ChatGPTPlusIcon,
  CheckIcon,
  MenuIcon,
  TemporaryChatIcon,
} from './icons/other-icons';
import { Switch } from './components/ui/switch';
import { useConversations } from './conversations-context';
import { useMemo } from 'react';

interface MenuItemDetailProps {
  icon: React.ReactElement;
  title: string;
  description?: string;
  element: React.ReactElement;
}

function MenuItemDetail(props: MenuItemDetailProps) {
  const { icon, title, description, element, ...rest } = props;
  return (
    <HStack w='100%' {...rest}>
      <Circle size='8' bg='bg.muted'>
        {icon}
      </Circle>
      <Stack gap='0' flex='1'>
        <Text>{title}</Text>
        <Text fontSize='xs' color='fg.muted'>
          {description}
        </Text>
      </Stack>
      <Box>{element}</Box>
    </HStack>
  );
}

export const ChatGPTMenu = () => {
  const { createNewConversation, currentConversation, clearTemporaryConversations } = useConversations();

  const isTemporaryMode = useMemo(() => {
    return currentConversation?.isTemporary || false;
  }, [currentConversation]);

  const handleTemporaryToggle = (checked: boolean) => {
    if (checked) {
      createNewConversation(true);
    } else {
      clearTemporaryConversations();
      createNewConversation(false);
    }
  };

  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <Button
          variant='ghost'
          fontSize='lg'
          fontWeight='bold'
          color='fg.muted'
        >
          شات جي بي تي <MenuIcon />
        </Button>
      </MenuTrigger>
      <MenuContent minW='320px' borderRadius='2xl'>
        <MenuItem value='chatgpt-plus' py='2'>
          <MenuItemDetail
            title='شات جي بي تي بلس'
            icon={<ChatGPTPlusIcon />}
            description='النموذج الأذكى والمزيد'
            element={
              <Button variant='outline' size='xs' borderRadius='full'>
                ترقية
              </Button>
            }
          />
        </MenuItem>

        <MenuItem value='chatgpt' py='2'>
          <MenuItemDetail
            title='شات جي بي تي'
            icon={<ChatGPTMenuIcon />}
            description='رائع للمهام اليومية'
            element={<CheckIcon fontSize='lg' />}
          />
        </MenuItem>

        <MenuSeparator />
        <MenuItem value='temporary-chat' py='2'>
          <MenuItemDetail
            title='محادثة مؤقتة'
            icon={<TemporaryChatIcon />}
            element={
              <Switch 
                size='sm' 
                checked={isTemporaryMode}
                onCheckedChange={(e) => handleTemporaryToggle(e.checked)}
              />
            }
          />
        </MenuItem>
      </MenuContent>
    </MenuRoot>
  );
};
