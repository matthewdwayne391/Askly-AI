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
import { useState } from 'react';
import { Button } from './components/ui/button';
import { sendMessageToGemini, type Message } from './lib/gemini';

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    const userMessage: Message = {
      role: 'user',
      content: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await sendMessageToGemini(inputValue);
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'عذراً، حدث خطأ أثناء الاتصال بـ Gemini API. تأكد من إضافة VITE_GOOGLE_API_KEY.',
      };
      setMessages((prev) => [...prev, errorMessage]);
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
        <VStack gap='6'>
          <Heading size='3xl'>What can I help with?</Heading>
          <Center>
            <InputGroup
              minW='768px'
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
                placeholder='Message ChatGPT'
                variant='subtle'
                size='lg'
                borderRadius='3xl'
                value={inputValue}
                onChange={handleInputValue}
                onKeyPress={handleKeyPress}
              />
            </InputGroup>
          </Center>

          <HStack gap='2'>
            <PromptButton
              icon={<IllustrationIcon color='green.500' fontSize='lg' />}
              description='Create image'
            />
            <PromptButton
              icon={<CodeIcon color='blue.500' fontSize='lg' />}
              description='Code'
            />
            <PromptButton
              icon={<ChartIcon color='cyan.400' fontSize='lg' />}
              description='Analyze data'
            />
            <PromptButton
              icon={<BirthdayIcon color='cyan.400' fontSize='lg' />}
              description='Surprise'
            />
            <PromptButton description='More' />
          </HStack>
        </VStack>
      </Center>
    );
  }

  return (
    <Stack flex='1' gap='0' h='full'>
      <Box flex='1' overflowY='auto' px='4' py='4'>
        <Stack gap='4' maxW='768px' mx='auto'>
          {messages.map((message, index) => (
            <Box
              key={index}
              p='4'
              borderRadius='lg'
              bg={message.role === 'user' ? 'blue.500' : 'gray.700'}
              color='white'
              alignSelf={message.role === 'user' ? 'flex-end' : 'flex-start'}
              maxW='80%'
            >
              <Text whiteSpace='pre-wrap'>{message.content}</Text>
            </Box>
          ))}
          {isLoading && (
            <Box
              p='4'
              borderRadius='lg'
              bg='gray.700'
              color='white'
              alignSelf='flex-start'
              maxW='80%'
            >
              <Text>جاري الكتابة...</Text>
            </Box>
          )}
        </Stack>
      </Box>

      <Box p='4' borderTop='1px' borderColor='gray.700'>
        <Center>
          <InputGroup
            minW='768px'
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
              placeholder='Message ChatGPT'
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
