import { Button } from '@/components/ui/button';
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from '@/components/ui/menu';
import { Circle, HStack, Stack, Text } from '@chakra-ui/react';
import {
  ChatGPTMenuIcon,
  ChatGPTPlusIcon,
  CheckIcon,
  MenuIcon,
} from './icons/other-icons';

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
      <div>{element}</div>
    </HStack>
  );
}

export const ChatGPTMenu = () => {
  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <Button
          variant='ghost'
          fontSize={{ base: 'xs', sm: 'sm', md: 'md', lg: 'lg' }}
          fontWeight='bold'
          color='fg.muted'
          size={{ base: 'sm', md: 'md' }}
          maxW={{ base: '180px', sm: '200px', md: 'none' }}
          overflow='hidden'
          textOverflow='ellipsis'
          whiteSpace='nowrap'
        >
          <Text as='span' display={{ base: 'none', sm: 'inline' }}>
            Askly-AI ميزات
          </Text>
          <Text as='span' display={{ base: 'inline', sm: 'none' }}>
            ميزات
          </Text>
          <MenuIcon />
        </Button>
      </MenuTrigger>
      <MenuContent 
        minW={{ base: '260px', sm: '280px', md: '320px' }} 
        maxW={{ base: '90vw', md: 'none' }}
        borderRadius='2xl'
      >
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
            title='Askly-AI ميزات'
            icon={<ChatGPTMenuIcon />}
            description='رائع للمهام اليومية'
            element={<CheckIcon fontSize='lg' />}
          />
        </MenuItem>
      </MenuContent>
    </MenuRoot>
  );
};