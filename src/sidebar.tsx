
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
import { useState, useEffect, useRef } from 'react';

function formatDate(date: Date): string {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  const getTimeString = (d: Date) => {
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    const minutesStr = minutes.toString().padStart(2, '0');
    return `${hours12}:${minutesStr} ${ampm}`;
  };
  
  if (diffInHours < 24) {
    return getTimeString(date);
  } else if (diffInHours < 48) {
    return `أمس ${getTimeString(date)}`;
  } else if (diffInHours < 168) {
    return `${Math.floor(diffInHours / 24)}d ${getTimeString(date)}`;
  } else {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day} ${getTimeString(date)}`;
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
  const conversationsListRef = useRef<HTMLDivElement>(null);

  // التمرير التلقائي للأسفل عند تغيير المحادثات أو المحادثة الحالية
  useEffect(() => {
    if (conversationsListRef.current && currentConversation) {
      const activeElement = conversationsListRef.current.querySelector(`[data-conversation-id="${currentConversation.id}"]`);
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [currentConversation, conversations]);

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
    <>
      {/* Overlay للهواتف */}
      {sideBarVisible && (
        <Box
          position='fixed'
          top='0'
          left='0'
          w='full'
          h='full'
          bg='blackAlpha.600'
          zIndex='999'
          display={{ base: 'block', lg: 'none' }}
          onClick={toggleSidebar}
        />
      )}
      
      <Box
        bg='bg.muted'
        w={{
          base: sideBarVisible ? '280px' : '0',
          lg: sideBarVisible ? '260px' : '0'
        }}
        maxW={{ base: '85vw', lg: 'none' }}
        position='fixed'
        top='0'
        right='0'
        h='100vh'
        zIndex={{ base: '1000', lg: '1000' }}
        overflow='hidden'
        transition='all 0.3s ease-in-out'
        borderLeft={{ base: sideBarVisible ? '1px solid' : 'none', lg: '1px solid' }}
        borderColor='border'
        transform={{ 
          base: sideBarVisible ? 'translateX(0)' : 'translateX(100%)', 
          lg: 'none' 
        }}
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

          <Stack px='2' gap='0' flex='1' overflowY='auto' ref={conversationsListRef}>
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
              <NewChatIcon fontSize='lg' color='fg.muted' />
              <Text fontSize='sm' fontWeight='md'>
                محادثة جديدة
              </Text>
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
                    data-conversation-id={conv.id}
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
                        
                        <DialogContent
                          maxW={{ base: '90vw', md: '400px' }}
                          w={{ base: '90vw', md: 'auto' }}
                          mx={{ base: '4', md: 'auto' }}
                          borderRadius={{ base: 'xl', md: '2xl' }}
                        >
                          <DialogHeader pb='2'>
                            <DialogTitle 
                              fontSize={{ base: 'lg', md: 'xl' }}
                              textAlign='center'
                            >
                              تأكيد الحذف
                            </DialogTitle>
                          </DialogHeader>
                          
                          <DialogBody py='4'>
                            <Text 
                              fontSize={{ base: 'sm', md: 'md' }}
                              textAlign='center'
                              lineHeight='1.6'
                            >
                              هل أنت متأكد من أنك تريد حذف هذه المحادثة؟ لا يمكن التراجع عن هذا الإجراء.
                            </Text>
                          </DialogBody>
                          
                          <DialogFooter 
                            pt='2'
                            gap={{ base: '3', md: '4' }}
                            flexDirection={{ base: 'column', sm: 'row' }}
                            w='full'
                          >
                            <DialogActionTrigger asChild>
                              <Button 
                                variant='outline' 
                                onClick={handleDeleteCancel}
                                size={{ base: 'md', md: 'sm' }}
                                w={{ base: 'full', sm: 'auto' }}
                                order={{ base: '2', sm: '1' }}
                              >
                                إلغاء
                              </Button>
                            </DialogActionTrigger>
                            <DialogActionTrigger asChild>
                              <Button 
                                colorPalette='red' 
                                onClick={handleDeleteConfirm}
                                size={{ base: 'md', md: 'sm' }}
                                w={{ base: 'full', sm: 'auto' }}
                                order={{ base: '1', sm: '2' }}
                              >
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
    </>
  );
}
