import {
  Box,
  Center,
  Heading,
  HStack,
  IconButton,
  Input,
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
import { useState, useEffect } from 'react';
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
  
  const messages = currentConversation?.messages || [];

  useEffect(() => {
    if (!currentConversation) {
      createNewConversation(false);
    }
  }, [currentConversation, createNewConversation]);

  const handleInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (messages.length === 0) {
    return (
      <Center flex='1'>
        <VStack gap='6' px={{ base: '4', md: '6' }}>
          <Heading size={{ base: 'xl', md: '2xl', lg: '3xl' }} textAlign='center'>
            كيف يمكنني مساعدتك؟
          </Heading>
          <Center w='full'>
            <InputGroup
              w={{ base: 'full', md: '90%', lg: '768px' }}
              maxW='768px'
              startElement={
                <FileUploadRoot>
                  <FileUploadTrigger asChild>
                    <UploadIcon fontSize='2xl' color='fg' />
                  </FileUploadTrigger>
                  <FileUploadList />
                </FileUploadRoot>
              }
              endElement={
                <IconButton
                  fontSize='2xl'
                  size='sm'
                  borderRadius='full'
                  disabled={inputValue.trim() === '' || isLoading}
                  onClick={handleSendMessage}
                >
                  <EnterIcon fontSize='2xl' />
                </IconButton>
              }
            >
              <Input
                placeholder='أرسل رسالة إلى ChatGPT'
                variant='subtle'
                size='lg'
                borderRadius='3xl'
                value={inputValue}
                onChange={handleInputValue}
                onKeyPress={handleKeyPress}
              />
            </InputGroup>
          </Center>

          <Stack 
            direction={{ base: 'column', sm: 'row' }} 
            gap='2' 
            wrap='wrap'
            justify='center'
            align='center'
            w='full'
            px={{ base: '4', md: '0' }}
          >
            <PromptButton
              icon={<IllustrationIcon color='green.500' fontSize='lg' />}
              description='إنشاء صورة'
            />
            <PromptButton
              icon={<CodeIcon color='blue.500' fontSize='lg' />}
              description='برمجة'
            />
            <PromptButton
              icon={<ChartIcon color='cyan.400' fontSize='lg' />}
              description='تحليل بيانات'
            />
            <PromptButton
              icon={<BirthdayIcon color='cyan.400' fontSize='lg' />}
              description='مفاجأة'
            />
            <PromptButton description='المزيد' />
          </Stack>
        </VStack>
      </Center>
    );
  }

  return (
    <Stack flex='1' gap='0' h='full'>
      <Box flex='1' overflowY='auto' px={{ base: '2', md: '4' }} py='4'>
        <Stack gap='4' maxW={{ base: '100%', md: '768px' }} mx='auto'>
          {messages.map((message, index) => (
            <Box
              key={index}
              p={{ base: '3', md: '4' }}
              borderRadius='lg'
              bg={message.role === 'user' ? 'blue.500' : 'gray.700'}
              color='white'
              alignSelf={message.role === 'user' ? 'flex-start' : 'flex-end'}
              maxW={{ base: '90%', md: '80%' }}
              ml={message.role === 'user' ? '0' : 'auto'}
              mr={message.role === 'user' ? 'auto' : '0'}
            >
              <Text whiteSpace='pre-wrap' fontSize={{ base: 'sm', md: 'md' }}>
                {message.content}
              </Text>
            </Box>
          ))}
          {isLoading && (
            <Box
              p='4'
              borderRadius='lg'
              bg='gray.700'
              color='white'
              alignSelf='flex-end'
              maxW='80%'
              ml='auto'
              mr='0'
            >
              <Text>جاري الكتابة...</Text>
            </Box>
          )}
        </Stack>
      </Box>

      <Box p={{ base: '2', md: '4' }} borderTop='1px' borderColor='gray.700'>
        <Center w='full'>
          <InputGroup
            w={{ base: 'full', md: '90%', lg: '768px' }}
            maxW='768px'
            startElement={
              <FileUploadRoot>
                <FileUploadTrigger asChild>
                  <UploadIcon fontSize='2xl' color='fg' />
                </FileUploadTrigger>
                <FileUploadList />
              </FileUploadRoot>
            }
            endElement={
              <IconButton
                fontSize='2xl'
                size='sm'
                borderRadius='full'
                disabled={inputValue.trim() === '' || isLoading}
                onClick={handleSendMessage}
              >
                <EnterIcon fontSize='2xl' />
              </IconButton>
            }
          >
            <Input
              placeholder='أرسل رسالة إلى ChatGPT'
              variant='subtle'
              size='lg'
              borderRadius='3xl'
              value={inputValue}
              onChange={handleInputValue}
              onKeyPress={handleKeyPress}
            />
          </InputGroup>
        </Center>
      </Box>
    </Stack>
  );
}
