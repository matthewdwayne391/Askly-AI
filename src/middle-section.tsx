import {
  Box,
  Heading,
  IconButton,
  Textarea,
  Span,
  Stack,
  Text,
  VStack,
  HStack,
} from '@chakra-ui/react';
import {
  FileUploadList,
  FileUploadRoot,
  FileUploadTrigger,
} from './components/ui/file-button';
import { InputGroup } from './components/ui/input-group';
import {
  BulbIcon,
  CodeIcon,
  EnterIcon,
  UploadIcon,
  SearchIcon,
  SummarizeIcon,
  WriteIcon,
} from './icons/other-icons';
import { useState, useEffect, useRef } from 'react';
import { Button } from './components/ui/button';
import { sendChatToGemini, askGemini, type Message } from './lib/gemini';
import { useConversations } from './conversations-context';
import { useModel } from './model-context';
import { ClipboardRoot, ClipboardIconButton } from './components/ui/clipboard';
import { LuPencil, LuCheck, LuX } from 'react-icons/lu';

interface PromptButtonProps {
  icon?: React.ReactElement;
  description: string;
  onClick?: () => void;
}

function PromptButton({
  icon,
  description,
  onClick,
}: PromptButtonProps) {
  return (
    <Button
      variant='outline'
      size={{ base: 'sm', md: 'md' }}
      px={{ base: '3', md: '4' }}
      borderRadius='xl'
      gap='2'
      color='fg.muted'
      _hover={{ bg: 'bg.muted' }}
      borderColor='border'
      flexShrink={0}
      fontSize={{ base: 'xs', md: 'sm' }}
      onClick={onClick}
    >
      {icon}
      <Span>{description}</Span>
    </Button>
  );
}

export function MiddleSection() {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingMessageIndex, setEditingMessageIndex] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const { currentConversation, updateCurrentConversation, createNewConversation } = useConversations();
  const { selectedModel } = useModel();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const messages = currentConversation?.messages || [];

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue]);

  const handleInputValue = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    let conversationToUse = currentConversation;
    if (!conversationToUse) {
      createNewConversation(false);
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content: inputValue,
    };

    const updatedMessages = [...conversationToUse.messages, userMessage];
    updateCurrentConversation(updatedMessages);
    setInputValue('');
    setIsLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      let response: string;

      if (messages.length === 0) {
        response = await askGemini(inputValue, selectedModel);
      } else {
        response = await sendChatToGemini(updatedMessages, selectedModel);
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
      };
      updateCurrentConversation([...updatedMessages, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'عذراً، حدث خطأ أثناء الاتصال بـ Gemini API. تأكد من إضافة VITE_GOOGLE_API_KEY.',
      };
      updateCurrentConversation([...updatedMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEditMessage = (index: number) => {
    setEditingMessageIndex(index);
    setEditedContent(messages[index].content);
  };

  const handleSaveEdit = async (index: number) => {
    if (editedContent.trim() === '') return;

    const updatedMessages = messages.slice(0, index + 1);
    updatedMessages[index] = {
      ...updatedMessages[index],
      content: editedContent,
    };

    updateCurrentConversation(updatedMessages);
    setEditingMessageIndex(null);
    setIsLoading(true);

    try {
      let response: string;

      if (updatedMessages.length === 1) {
        response = await askGemini(editedContent, selectedModel);
      } else {
        response = await sendChatToGemini(updatedMessages, selectedModel);
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
      };
      updateCurrentConversation([...updatedMessages, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'عذراً، حدث خطأ أثناء الاتصال بـ Gemini API. تأكد من إضافة VITE_GOOGLE_API_KEY.',
      };
      updateCurrentConversation([...updatedMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingMessageIndex(null);
    setEditedContent('');
  };

  if (!currentConversation || messages.length === 0) {
    return (
      <Box 
        flex='1' 
        display='flex' 
        alignItems='center' 
        justifyContent='center'
        px={{ base: '4', md: '6', lg: '8' }}
        py={{ base: '6', md: '8' }}
        minH='0'
      >
        <VStack 
          gap={{ base: '4', md: '6' }} 
          w='full' 
          maxW='4xl' 
          mx='auto'
        >
          <Heading 
            size={{ base: 'lg', sm: 'xl', md: '2xl', lg: '3xl' }} 
            textAlign='center'
            px={{ base: '2', md: '0' }}
            lineHeight={{ base: '1.3', md: '1.2' }}
          >
            كيف يمكنني مساعدتك؟
          </Heading>

          <Box w='full' maxW='1200px' mx='auto'>
            <InputGroup
              w='full'
              startElement={
                <FileUploadRoot>
                  <FileUploadTrigger asChild>
                    <UploadIcon fontSize={{ base: 'xl', md: '2xl' }} color='fg' />
                  </FileUploadTrigger>
                  <FileUploadList />
                </FileUploadRoot>
              }
              endElement={
                <IconButton
                  size={{ base: 'sm', md: 'md' }}
                  borderRadius='full'
                  disabled={inputValue.trim() === '' || isLoading}
                  onClick={handleSendMessage}
                >
                  <EnterIcon fontSize={{ base: 'lg', md: 'xl' }} />
                </IconButton>
              }
            >
              <Textarea
                ref={textareaRef}
                placeholder='أرسل رسالة إلى Askly-AI'
                variant='subtle'
                size={{ base: 'md', md: 'lg' }}
                borderRadius='3xl'
                value={inputValue}
                onChange={handleInputValue}
                onKeyDown={handleKeyPress}
                fontSize={{ base: 'sm', md: 'md' }}
                py={{ base: '3', md: '4' }}
                resize='none'
                overflow='hidden'
                minH='auto'
                rows={1}
              />
            </InputGroup>
          </Box>

          <Stack 
            direction={{ base: 'column', sm: 'row' }} 
            gap={{ base: '2', md: '3' }}
            justify='center'
            w='full'
            flexWrap='wrap'
          >
            <PromptButton
              icon={<SearchIcon />}
              description='أسئلة سريعة'
              onClick={() => setInputValue('اشرح لي مفهوم ')}
            />
            <PromptButton 
              icon={<SummarizeIcon />} 
              description='تلخيص نصوص'
              onClick={() => setInputValue('لخص هذا النص: ')}
            />
            <PromptButton 
              icon={<WriteIcon />} 
              description='ترجمة فورية'
              onClick={() => setInputValue('ترجم إلى الإنجليزية: ')}
            />
            <PromptButton
              icon={<BulbIcon />}
              description='نصائح يومية'
              onClick={() => setInputValue('أعطني نصيحة يومية عن ')}
            />
            <PromptButton 
              icon={<CodeIcon />} 
              description='حل واجب أو تمرين'
              onClick={() => setInputValue('ساعدني في حل هذا التمرين: ')}
            />
          </Stack>
        </VStack>
      </Box>
    );
  }

  return (
    <Box flex='1' display='flex' flexDirection='column' h='full' overflow='hidden'>
      <Box 
        flex='1' 
        overflowY='auto' 
        px={{ base: '3', md: '4', lg: '6' }} 
        py={{ base: '3', md: '4' }}
        bg='bg.subtle'
      >
        <Stack 
          gap={{ base: '3', md: '4' }} 
          maxW={{ base: '100%', md: '768px', lg: '900px' }} 
          mx='auto'
          pb={{ base: '4', md: '6' }}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              className='group'
              p={{ base: '3', sm: '4', md: '5' }}
              borderRadius={{ base: 'xl', md: '2xl' }}
              bg={message.role === 'user' ? 'blue.500' : 'gray.700'}
              color='white'
              alignSelf={message.role === 'user' ? 'flex-start' : 'flex-end'}
              maxW={{ base: '95%', sm: '85%', md: '80%' }}
              ml={message.role === 'user' ? '0' : 'auto'}
              mr={message.role === 'user' ? 'auto' : '0'}
              wordBreak='break-word'
              position='relative'
              boxShadow='sm'
              _hover={{ boxShadow: 'md' }}
              transition='box-shadow 0.2s'
            >
              {editingMessageIndex === index && message.role === 'user' ? (
                <VStack gap={2} align='stretch'>
                  <Textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    fontSize={{ base: 'sm', md: 'md' }}
                    bg='whiteAlpha.200'
                    color='white'
                    borderColor='whiteAlpha.400'
                    minH='100px'
                  />
                  <HStack justify='flex-end' gap={2}>
                    <IconButton
                      size='sm'
                      colorScheme='green'
                      onClick={() => handleSaveEdit(index)}
                    >
                      <LuCheck />
                    </IconButton>
                    <IconButton
                      size='sm'
                      colorScheme='red'
                      onClick={handleCancelEdit}
                    >
                      <LuX />
                    </IconButton>
                  </HStack>
                </VStack>
              ) : (
                <VStack align='stretch' gap={2}>
                  <Text 
                    whiteSpace='pre-wrap' 
                    fontSize={{ base: 'sm', md: 'md' }}
                    lineHeight={{ base: '1.5', md: '1.6' }}
                    userSelect='text'
                    cursor='text'
                  >
                    {message.content}
                  </Text>
                  <HStack 
                    justify={message.role === 'user' ? 'flex-start' : 'flex-end'}
                    gap={1}
                    opacity={0}
                    _groupHover={{ opacity: 1 }}
                    transition='opacity 0.2s'
                  >
                    {message.role === 'assistant' && (
                      <ClipboardRoot value={message.content}>
                        <ClipboardIconButton size='xs' variant='ghost' colorScheme='whiteAlpha' />
                      </ClipboardRoot>
                    )}
                    {message.role === 'user' && (
                      <>
                        <ClipboardRoot value={message.content}>
                          <ClipboardIconButton size='xs' variant='ghost' colorScheme='whiteAlpha' />
                        </ClipboardRoot>
                        {index === messages.length - 2 && (
                          <IconButton
                            size='xs'
                            variant='ghost'
                            colorScheme='whiteAlpha'
                            onClick={() => handleEditMessage(index)}
                          >
                            <LuPencil />
                          </IconButton>
                        )}
                      </>
                    )}
                  </HStack>
                </VStack>
              )}
            </Box>
          ))}
          {isLoading && (
            <Box
              p={{ base: '3', md: '4' }}
              borderRadius='lg'
              bg='gray.700'
              color='white'
              alignSelf='flex-end'
              maxW={{ base: '95%', md: '80%' }}
              ml='auto'
              mr='0'
            >
              <Text fontSize={{ base: 'sm', md: 'md' }}>جاري الكتابة...</Text>
            </Box>
          )}
        </Stack>
      </Box>

      <Box 
        p={{ base: '3', md: '4' }} 
        borderTop='1px' 
        borderColor='border'
        bg='bg'
        position='sticky'
        bottom='0'
      >
        <Box w='full' maxW='768px' mx='auto'>
          <InputGroup
            w='full'
            startElement={
              <FileUploadRoot>
                <FileUploadTrigger asChild>
                  <UploadIcon fontSize={{ base: 'xl', md: '2xl' }} color='fg' />
                </FileUploadTrigger>
                <FileUploadList />
              </FileUploadRoot>
            }
            endElement={
              <IconButton
                size={{ base: 'sm', md: 'md' }}
                borderRadius='full'
                disabled={inputValue.trim() === '' || isLoading}
                onClick={handleSendMessage}
              >
                <EnterIcon fontSize={{ base: 'lg', md: 'xl' }} />
              </IconButton>
            }
          >
            <Textarea
              placeholder='أرسل رسالة إلى Askly-AI'
              variant='subtle'
              size={{ base: 'md', md: 'lg' }}
              borderRadius='3xl'
              value={inputValue}
              onChange={handleInputValue}
              onKeyDown={handleKeyPress}
              fontSize={{ base: 'sm', md: 'md' }}
              py={{ base: '3', md: '4' }}
              resize='none'
              overflow='hidden'
              minH='auto'
              rows={1}
            />
          </InputGroup>
        </Box>
      </Box>
    </Box>
  );
}