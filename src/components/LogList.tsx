'use client';

import { memo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Flex, Text, Box, Button, Container } from '@chakra-ui/react';

const fetchLogs = async () => {
  const res = await fetch('/api/logs');
  if (!res.ok) {
    throw new Error('Failed to fetch logs');
  }
  return res.json();
}

type Response = {
  action: string,
  text: string,
  user: string
}

type Log = {
  id: string,
  roomId: string,
  body: {
    context: string,
    message: {
      content: {
        source: string,
        text: string,
      }
    },
    response: Response
  }
}

const NEWLINE_PLACEHOLDER = '__NEWLINE_PLACEHOLDER__'
const NEWLINE_TAG = '<em class="newline">\\n</em>'
const formatContext = (text = '') => {

  let chunks = text.trim().replaceAll('\n', NEWLINE_PLACEHOLDER).split(NEWLINE_PLACEHOLDER);
  chunks = chunks.map(chunk => {
    if (/^#\s/.test(chunk)) {
      return `<h2>${chunk}${NEWLINE_TAG}</h2>`
    }

    chunk = chunk
      .replaceAll(/^([\w\_]+\:)/gi, '<em>$1</em>')
      .replace(/(\[[\w]{5}\]\s)([\w\_]+\:\s)/gi, '$1<em>$2</em>');
    return `<p>${chunk}${NEWLINE_TAG}</p>`
  })

  return chunks.join(``)
}

const ResponseItem: React.FC<Response> = ({ action, text, user }) => {
  return (
    <Box>
      <h1>Response</h1>
      <div>
        <h2>ACTION</h2>
        <p>{action}</p>
      </div>
      <div>
        <h2>TEXT</h2>
        <pre>{text}</pre>
      </div>
    </Box>
  )
}

const LogItem: React.FC<Log> = memo(({ body }) => {

  const html = formatContext(body.context);
  return (
    <Box
      my={4}
      border="1px solid"
      borderLeft="10px solid" 
      borderColor="colorPalette.700"
      px={4}
      py={2}>

      <Box 
        lineHeight={1.5}
        css={{
          '& h1': { my: 4, fontSize: '2xl', fontWeight: 'bold', color:"colorPalette.500" },
          '& * + h1': { mt: 4 },
          '& * + h2': { mt: 4 },
          '& h2': { fontSize: 'lg', fontWeight: 'bold', color:"colorPalette.700" },
          '& p': { py: 1, fontSize: 'sm', color: "gray.400" },
          '& pre': { py: 1, fontSize: 'sm', maxW:'full', whiteSpace: "pre-wrap", color: "gray.400" },
          '& p + p': { borderTop: '1px solid {colors.gray.900}' },
          '& .newline': { color: "colorPalette.muted", fontSize: 'xx-small', mx: 2 },
          '& em': { color: "colorPalette.700", fontWeight: 'bold', }
        }}
      >
        <ResponseItem {...body.response} />
        <h1>Context</h1>
        <Box dangerouslySetInnerHTML={{ __html: html }}></Box>
      </Box>
    </Box>
  )
})

LogItem.displayName = 'LogItem';

const LogList = () => {
  const { data: logs, refetch } = useQuery<Log[]>({
    queryKey: ['logs'],
    queryFn: fetchLogs,
  });


  return (
    <Container colorPalette="pink" p="4">
      <Flex justifyContent="space-between" alignItems="center" textTransform="uppercase">
        <Text fontSize="4xl" my={4} color="colorPalette.solid">Logs</Text>
        <Button onClick={() => refetch()}>refetch</Button>
      </Flex>
      <Box>
        {logs?.map((log) => (
          <Box key={log.id}>
            <LogItem  {...log} />
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default LogList;
