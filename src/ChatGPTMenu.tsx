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

// Assuming these icons are defined elsewhere and imported correctly
// For demonstration purposes, let's define placeholder icons if they are not provided
const CreateImageIcon = (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-4-9h8v2h-8v-2z" fill="currentColor"/></svg>;
const BrainstormIcon = (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-4-9h8v2h-8v-2z" fill="currentColor"/></svg>;
const AnalyzeDataIcon = (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-4-9h8v2h-8v-2z" fill="currentColor"/></svg>;
const ShareIcon = (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-4-9h8v2h-8v-2z" fill="currentColor"/></svg>;
const MoreIcon = (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-4-9h8v2h-8v-2z" fill="currentColor"/></svg>;


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
        minW={{ base: '90vw', sm: '280px', md: '200px' }}
        maxW={{ base: '90vw', md: '320px' }}
        borderRadius='xl'
        border='1px solid'
        borderColor='border'
        bg='bg'
        shadow='lg'
        mx={{ base: '2', md: 'auto' }}
        p={{ base: '2', md: '1' }}
      >
        <MenuItem 
          value='create-image' 
          gap={{ base: '4', md: '3' }} 
          cursor='pointer'
          py={{ base: '3', md: '2' }}
          px={{ base: '4', md: '3' }}
          borderRadius={{ base: 'lg', md: 'md' }}
          fontSize={{ base: 'base', md: 'sm' }}
          _hover={{
            bg: 'bg.muted',
            transform: { base: 'scale(1.02)', md: 'none' }
          }}
          transition='all 0.2s ease'
        >
          <CreateImageIcon fontSize={{ base: '20px', md: '16px' }} />
          <Text fontSize={{ base: 'base', md: 'sm' }} fontWeight='medium'>إنشاء صورة</Text>
        </MenuItem>

        <MenuItem 
          value='brainstorm' 
          gap={{ base: '4', md: '3' }} 
          cursor='pointer'
          py={{ base: '3', md: '2' }}
          px={{ base: '4', md: '3' }}
          borderRadius={{ base: 'lg', md: 'md' }}
          fontSize={{ base: 'base', md: 'sm' }}
          _hover={{
            bg: 'bg.muted',
            transform: { base: 'scale(1.02)', md: 'none' }
          }}
          transition='all 0.2s ease'
        >
          <BrainstormIcon fontSize={{ base: '20px', md: '16px' }} />
          <Text fontSize={{ base: 'base', md: 'sm' }} fontWeight='medium'>يبدعش</Text>
        </MenuItem>

        <MenuItem 
          value='analyze-data' 
          gap={{ base: '4', md: '3' }} 
          cursor='pointer'
          py={{ base: '3', md: '2' }}
          px={{ base: '4', md: '3' }}
          borderRadius={{ base: 'lg', md: 'md' }}
          fontSize={{ base: 'base', md: 'sm' }}
          _hover={{
            bg: 'bg.muted',
            transform: { base: 'scale(1.02)', md: 'none' }
          }}
          transition='all 0.2s ease'
        >
          <AnalyzeDataIcon fontSize={{ base: '20px', md: '16px' }} />
          <Text fontSize={{ base: 'base', md: 'sm' }} fontWeight='medium'>تحليل بيانات</Text>
        </MenuItem>

        <MenuItem 
          value='share' 
          gap={{ base: '4', md: '3' }} 
          cursor='pointer'
          py={{ base: '3', md: '2' }}
          px={{ base: '4', md: '3' }}
          borderRadius={{ base: 'lg', md: 'md' }}
          fontSize={{ base: 'base', md: 'sm' }}
          _hover={{
            bg: 'bg.muted',
            transform: { base: 'scale(1.02)', md: 'none' }
          }}
          transition='all 0.2s ease'
        >
          <ShareIcon fontSize={{ base: '20px', md: '16px' }} />
          <Text fontSize={{ base: 'base', md: 'sm' }} fontWeight='medium'>مشاركة</Text>
        </MenuItem>

        <MenuItem 
          value='more' 
          gap={{ base: '4', md: '3' }} 
          cursor='pointer'
          py={{ base: '3', md: '2' }}
          px={{ base: '4', md: '3' }}
          borderRadius={{ base: 'lg', md: 'md' }}
          fontSize={{ base: 'base', md: 'sm' }}
          _hover={{
            bg: 'bg.muted',
            transform: { base: 'scale(1.02)', md: 'none' }
          }}
          transition='all 0.2s ease'
        >
          <MoreIcon fontSize={{ base: '20px', md: '16px' }} />
          <Text fontSize={{ base: 'base', md: 'sm' }} fontWeight='medium'>المزيد</Text>
        </MenuItem>
      </MenuContent>
    </MenuRoot>
  );
};