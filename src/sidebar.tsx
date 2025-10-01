import {
  AbsoluteCenter,
  Box,
  Circle,
  Flex,
  HStack,
  IconButton,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Tooltip } from './components/ui/tooltip';
import {
  DialogRoot,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogActionTrigger,
} from './components/ui/dialog';
import { Button } from './components/ui/button';
import {
  NewChatIcon,
  SidebarIcon,
  SmallGPTIcon,
  UpgradeIcon,
} from './icons/sidebar-icons';
import { useSidebarContext } from './sidebar-context';
import { useConversations } from './conversations-context';
import { FiTrash2, FiClock } from 'react-icons/fi';
import { useState } from 'react';

function formatDate(date: Date): string {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 24) {
    return 'اليوم';
  } else if (diffInHours < 48) {
    return 'أمس';
  } else if (diffInHours < 168) {
    return `منذ ${Math.floor(diffInHours / 24)} أيام`;
  } else {
    return date.toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' });
  }
}

export function Sidebar() {
  const { sideBarVisible, toggleSidebar } = useSidebarContext();
  const {
    conversations,
    currentConversation,
    createNewConversation,
    deleteConversation,
    setCurrentConversation,
  } = useConversations();
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);

  const handleNewChat = () => {
    createNewConversation(false);
  };

  const handleNewTemporaryChat = () => {
    createNewConversation(true);
  };

  const handleDeleteConfirm = () => {
    if (conversationToDelete) {
      deleteConversation(conversationToDelete);
      setConversationToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setConversationToDelete(null);
  };

  return (
    <Box
      bg='bg.muted'
      w={{
        base: sideBarVisible ? 'full' : '0',
        lg: sideBarVisible ? '260px' : '0'
      }}
      position={{ base: sideBarVisible ? 'fixed' : 'relative', lg: 'relative' }}
      top={{ base: '0', lg: 'auto' }}
      left={{ base: '0', lg: 'auto' }}
      h={{ base: sideBarVisible ? '100vh' : 'auto', lg: 'auto' }}
      zIndex={{ base: '1000', lg: 'auto' }}
      overflow='hidden'
      transition='width 0.3s'
    >
      <Stack h='full' px='3' py='2'>
        <Flex justify='space-between'>
          <Tooltip
            content='إغلاق الشريط الجانبي'
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
        </Flex>

        <Stack px='2' gap='0' flex='1' overflowY='auto'>
          <HStack
            position='relative'
            className='group'
            _hover={{
              layerStyle: 'fill.muted',
              textDecor: 'none',
            }}
            px='1'
            h='10'
            borderRadius='lg'
            w='100%'
            whiteSpace='nowrap'
            cursor='pointer'
            onClick={handleNewChat}
          >
            <Circle size='6' bg='bg' borderWidth='1px'>
              <SmallGPTIcon fontSize='md' />
            </Circle>
            <Text fontSize='sm' fontWeight='md'>
              محادثة جديدة
            </Text>
            <AbsoluteCenter
              axis='vertical'
              right='2'
              display='none'
              _groupHover={{ display: 'initial' }}
            >
              <Tooltip
                content='محادثة جديدة'
                positioning={{ placement: 'right' }}
                showArrow
              >
                <NewChatIcon
                  fontSize='md'
                  color='fg.subtle'
                  _hover={{ color: 'fg.muted' }}
                />
              </Tooltip>
            </AbsoluteCenter>
          </HStack>

          <HStack
            _hover={{
              layerStyle: 'fill.muted',
              textDecor: 'none',
            }}
            px='1'
            h='10'
            borderRadius='lg'
            w='100%'
            whiteSpace='nowrap'
            cursor='pointer'
            onClick={handleNewTemporaryChat}
          >
            <FiClock fontSize='18px' />
            <Text fontSize='sm' fontWeight='md'>
              محادثة مؤقتة
            </Text>
          </HStack>

          {conversations.length > 0 && (
            <Box mt='4'>
              <Text fontSize='xs' fontWeight='bold' color='fg.subtle' px='2' mb='2'>
                المحادثات السابقة
              </Text>
              {conversations.map((conv) => (
                <HStack
                  key={conv.id}
                  position='relative'
                  className='group'
                  _hover={{
                    layerStyle: 'fill.muted',
                  }}
                  px='2'
                  py='2'
                  borderRadius='lg'
                  w='100%'
                  cursor='pointer'
                  onClick={() => setCurrentConversation(conv.id)}
                  bg={currentConversation?.id === conv.id ? 'bg' : 'transparent'}
                  borderWidth={currentConversation?.id === conv.id ? '1px' : '0'}
                >
                  <Stack gap='0' flex='1' overflow='hidden'>
                    <Text fontSize='sm' fontWeight='md' truncate>
                      {conv.title}
                      {conv.isTemporary && (
                        <Text as='span' fontSize='xs' color='orange.500' ml='1'>
                          (مؤقتة)
                        </Text>
                      )}
                    </Text>
                    <Text fontSize='xs' color='fg.subtle'>
                      {formatDate(conv.createdAt)}
                    </Text>
                  </Stack>
                  <AbsoluteCenter
                    axis='vertical'
                    right='2'
                    display='none'
                    _groupHover={{ display: 'initial' }}
                  >
                    <DialogRoot open={conversationToDelete === conv.id}>
                      <DialogTrigger asChild>
                        <Tooltip content='حذف المحادثة' showArrow>
                          <IconButton
                            variant='ghost'
                            size='xs'
                            onClick={(e) => {
                              e.stopPropagation();
                              setConversationToDelete(conv.id);
                            }}
                          >
                            <FiTrash2 fontSize='14px' color='red.500' />
                          </IconButton>
                        </Tooltip>
                      </DialogTrigger>
                      
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>تأكيد الحذف</DialogTitle>
                        </DialogHeader>
                        
                        <DialogBody>
                          <Text>هل أنت متأكد من أنك تريد حذف هذه المحادثة؟ لا يمكن التراجع عن هذا الإجراء.</Text>
                        </DialogBody>
                        
                        <DialogFooter>
                          <DialogActionTrigger asChild>
                            <Button variant='outline' onClick={handleDeleteCancel}>
                              إلغاء
                            </Button>
                          </DialogActionTrigger>
                          <DialogActionTrigger asChild>
                            <Button colorPalette='red' onClick={handleDeleteConfirm}>
                              حذف
                            </Button>
                          </DialogActionTrigger>
                        </DialogFooter>
                      </DialogContent>
                    </DialogRoot>
                  </AbsoluteCenter>
                </HStack>
              ))}
            </Box>
          )}
        </Stack>

        <Link
          href='#'
          _hover={{ textDecor: 'none', layerStyle: 'fill.muted' }}
          borderRadius='lg'
          px='1'
          py='2'
        >
          <HStack whiteSpace='nowrap'>
            <Circle size='8' fontSize='lg' borderWidth='1px'>
              <UpgradeIcon />
            </Circle>
            <Stack gap='0' fontWeight='medium'>
              <Text fontSize='sm'>ترقية الباقة</Text>
              <Text fontSize='xs' color='fg.subtle'>
                المزيد من الوصول لأفضل النماذج
              </Text>
            </Stack>
          </HStack>
        </Link>
      </Stack>
    </Box>
  );
}
