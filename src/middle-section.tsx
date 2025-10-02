import {
  Box,
  Heading,
  IconButton,
  Textarea,
  Span,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import {
  FileUploadList,
  FileUploadRoot,
  FileUploadTrigger,
} from './components/ui/file-button';
import { InputGroup } from './components/ui/input-group';
import {
  BirthdayIcon,
  ChartIcon,
  CodeIcon,
  EnterIcon,
  IllustrationIcon,
  UploadIcon,
} from './icons/other-icons';
import { useState, useEffect, useRef } from 'react';
import { Button } from './components/ui/button';
import { sendChatToGemini, askGemini, type Message } from './lib/gemini';
import { useConversations } from './conversations-context';

interface PromptButtonProps {
  icon?: React.ReactElement;
  description: string;
}

function PromptButton(props: PromptButtonProps) {
  const { icon, description } = props;
  return (
    <Button variant='outline' borderRadius='full'>
      {icon}
      <Span color='fg.subtle'>{description}</Span>
    </Button>
  );
}

export function MiddleSection() {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { currentConversation, updateCurrentConversation, createNewConversation } = useConversations();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const messages = currentConversation?.messages || [];

  useEffect(() => {
    if (!currentConversation) {
      createNewConversation(false);
    }
  }, [currentConversation, createNewConversation]);

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
    if (inputValue.trim() === '' || !currentConversation) return;

    const userMessage: Message = {
      role: 'user',
      content: inputValue,
    };

    const updatedMessages = [...messages, userMessage];
    updateCurrentConversation(updatedMessages);
    setInputValue('');
    setIsLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      let response: string;
      
      if (messages.length === 0) {
        response = await askGemini(inputValue);
      } else {
        response = await sendChatToGemini(updatedMessages);
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

  if (messages.length === 0) {
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
                placeholder='أرسل رسالة إلى ChatGPT'
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
            wrap='wrap'
            justify='center'
            align='center'
            w='full'
            maxW='3xl'
            mx='auto'
          >
            <PromptButton
              icon={<IllustrationIcon color='green.500' fontSize={{ base: 'md', md: 'lg' }} />}
              description='إنشاء صورة'
            />
            <PromptButton
              icon={<CodeIcon color='blue.500' fontSize={{ base: 'md', md: 'lg' }} />}
              description='برمجة'
            />
            <PromptButton
              icon={<ChartIcon color='cyan.400' fontSize={{ base: 'md', md: 'lg' }} />}
              description='تحليل بيانات'
            />
            <PromptButton
              icon={<BirthdayIcon color='cyan.400' fontSize={{ base: 'md', md: 'lg' }} />}
              description='مفاجأة'
            />
            <PromptButton description='المزيد' />
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
              p={{ base: '3', sm: '4', md: '5' }}
              borderRadius={{ base: 'lg', md: 'xl' }}
              bg={message.role === 'user' ? 'blue.500' : 'gray.700'}
              color='white'
              alignSelf={message.role === 'user' ? 'flex-start' : 'flex-end'}
              maxW={{ base: '95%', sm: '85%', md: '80%' }}
              ml={message.role === 'user' ? '0' : 'auto'}
              mr={message.role === 'user' ? 'auto' : '0'}
              wordBreak='break-word'
              position='relative'
            >
              <Text 
                whiteSpace='pre-wrap' 
                fontSize={{ base: 'sm', md: 'md' }}
                lineHeight={{ base: '1.5', md: '1.6' }}
              >
                {message.content}
              </Text>
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
              placeholder='أرسل رسالة إلى ChatGPT'
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
